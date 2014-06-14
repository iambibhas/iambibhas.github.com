---
layout: post
title: "PostgreSQL SWAG: JSON data type and working with Twitter data"
description: ""
category:
tags: []
permalink: /blog/postgresql-swag-json-data-type-and-working-with-twitter-data/
---
When working on side projects that deal with 3rd party data, how much time do you spend on figuring out the database schema? Not an insignificant amount. You don't use a DBMS you say? Good luck parsing the data files and querying them.

I'm not going to start a DBMS comparison. I've spent a lot of time fiddling with structred data and PostgreSQL has been really kind to me. It's stable, *really* feaure rich and it can literally do *anything*. You want to setup a cluster? Replication? Crunch geo spatial data? parse Gigabytes of CSV files? And want to do all of these really fast? Then PostgreSQL is for you, it can do all that and more out of the box. Just today a friend told me that PostgreSQL parsed and imported his 4.3GB CSV file in under 10 minutes. I'm happy with that performance.

We at KLP work with huge amount of data on daily basis and PostgreSQL has been helping us really well on our job. We've recently migrated all the databases to PostgreSQL 9.3 because of the native support for PostGIS and some more interesting features, I've written about some of them below. :)

You've probably heard about PostgreSQL's [JSON data type](http://www.postgresql.org/docs/9.3/static/functions-json.html) recently. This has made it possible to work with both structured and schema-less data. For example, I'll talk about Twitter data here. As you know, Twitter provides their data from API in JSON format. And till now, if I ever had to work with Twitter data, I had to write a quick db schema, create a table, then parse the incoming JSON, insert it in the said table and then work with it. Now the provess is a bit faster. ;)

First, I'll create couple of small tables -

    CREATE TABLE tweet
    (
        tid character varying NOT NULL,
        data json,
        CONSTRAINT tid_pkey PRIMARY KEY (tid)
    )

    CREATE TABLE word
    (
        id bigserial NOT NULL,
        text character varying(100),
        CONSTRAINT id_pkey PRIMARY KEY (id)
    )


`tid` field will store the id of the tweet and `data` field will store the json body of the tweet. The table `word` is to store the list of words I need to search for on Twitter and gather the sample data.

Here is a sample script I used to quickly gather about 24k tweets. It's not at all perfect and you should not use it to gather data. It doesn't even use the `since_id` param for the search API endpoint.

    import twitter
    import json
    import psycopg2

    api = twitter.Twitter(auth=twitter.OAuth('', '', '', ''))

    conn = psycopg2.connect("dbname=tweets user=bibhas password=forgotit")
    cur = conn.cursor()

    cur.execute('SELECT text from word')
    terms = cur.fetchall()
    if terms:
        for t in terms:
            tweets = api.search.tweets(q=t, lang='en', count=100)
            for s in tweets['statuses']:
                cur.execute("SELECT * FROM tweet WHERE tid='%s'", (s['id'], ))

                # ignore the duplicate and RT-like tweets
                if cur.fetchone() is not None or s['text'].find('RT @') >= 0:
                    continue

                cur.execute("INSERT INTO tweet (tid, data) VALUES (%s, %s)", (s['id'], json.dumps(s), ))
            conn.commit()

    cur.close()
    conn.close()

I ran this script as a cron job for few hours and I had the required data. Now if I query the table, this is what it looks like -

![JSON data in PostgreSQL](/uploads/tweets-json.jpg)

So, no schema specific to the tweet's JSON structure and we got the data in the database. Now let's try to query the data and see what happens.

Let's try to fetch all the tweet texts(I'll use `explain analyze` on all the queries for showing the performace) -

    tweets=# explain analyze select tid, data->>'text' from tweet;
                                                     QUERY PLAN
    -------------------------------------------------------------------------------------------------------------
     Seq Scan on tweet  (cost=0.00..4254.06 rows=20325 width=51) (actual time=0.169..458.198 rows=20335 loops=1)
     Total runtime: 459.121 ms

For reference, `->` returns a JSON object and `->>` returns text. Check the JSON data type reference url above for more details. Now, let's try a `WHERE` clause on a JSON property -

    tweets=# explain analyze select tid, data#>>'{user,screen_name}', data->>'text' from tweet where data->>'text' like '%world cup%';
                                                   QUERY PLAN
    --------------------------------------------------------------------------------------------------------
     Seq Scan on tweet  (cost=0.00..4384.70 rows=2 width=51) (actual time=10.700..481.758 rows=510 loops=1)
       Filter: ((data ->> 'text'::text) ~~ '%world cup%'::text)
       Rows Removed by Filter: 20202
     Total runtime: 481.825 ms
    (4 rows)

and if I try case insensitive matching -

    tweets=# explain analyze select tid, data#>>'{user,screen_name}', data->>'text' from tweet where UPPER(data->>'text') like UPPER('%world cup%');
                                                   QUERY PLAN
    --------------------------------------------------------------------------------------------------------
     Seq Scan on tweet  (cost=0.00..4436.49 rows=2 width=51) (actual time=7.983..642.647 rows=3563 loops=1)
       Filter: (upper((data ->> 'text'::text)) ~~ '%WORLD CUP%'::text)
       Rows Removed by Filter: 17149
     Total runtime: 642.887 ms
    (4 rows)

Now let's try to find all the useful tweets, those that have been favorited more than, let's say 5 times -

    tweets=# explain analyze select tid, data#>>'{user,screen_name}', data->>'favorite_count' from tweet where CAST(data->>'favorite_count' AS integer) > 5;
                                                   QUERY PLAN
    ---------------------------------------------------------------------------------------------------------
     Seq Scan on tweet  (cost=0.00..5202.05 rows=7939 width=51) (actual time=2.727..557.297 rows=27 loops=1)
       Filter: (((data ->> 'favorite_count'::text))::integer > 5)
       Rows Removed by Filter: 23787
     Total runtime: 557.338 ms
    (4 rows)

 `data->>'favorite_count'` returns the count as `text` and we `CAST()` it as integer and use it for comparing.

 Now let's try to fetch the geo enabled tweets that has the text 'home' in it (:P) -

     tweets=# explain analyze select tid, data#>>'{user,screen_name}', data->>'text', data->>'geo' from tweet where data->>'geo' <> '' and UPPER(data->>'text') like UPPER('%home%');
                                                   QUERY PLAN
    ---------------------------------------------------------------------------------------------------------
     Seq Scan on tweet  (cost=0.00..5302.47 rows=192 width=51) (actual time=28.156..549.844 rows=8 loops=1)
       Filter: (((data ->> 'geo'::text) <> ''::text) AND (upper((data ->> 'text'::text)) ~~ '%HOME%'::text))
       Rows Removed by Filter: 24172
     Total runtime: 549.886 ms
    (4 rows)

Here the `geo` field will return GeoJSON like `{"type": "Point", "coordinates": [43.6482035, -79.3886928]}`. If you want to extract the lat, long directly, you can do this -

    tweets=# explain analyze select tid, data#>>'{user,screen_name}', data->>'text', data->'geo'->'coordinates'->0 as lat, data->'geo'->'coordinates'->1 as lon from tweet where data->>'geo' <> '' and UPPER(data->>'text') like UPPER('%home%');
                                                   QUERY PLAN
    ---------------------------------------------------------------------------------------------------------
     Seq Scan on tweet  (cost=0.00..5304.87 rows=192 width=51) (actual time=1.220..537.186 rows=8 loops=1)
       Filter: (((data ->> 'geo'::text) <> ''::text) AND (upper((data ->> 'text'::text)) ~~ '%HOME%'::text))
       Rows Removed by Filter: 24172
     Total runtime: 537.205 ms
    (4 rows)

These are numbers I can work with.

One of the major reasons to work with PostgreSQL is [PostGIS](http://postgis.net/). *Really* fast geo data parsing and querying is everyone who works with geo data, craves. So let's try to find all the tweets which were created within 5km of my location, e.g. `13.004616, 77.620176` -

    explain ANALYZE
    SELECT tmp_table.tid,
       tmp_table.screen_name,
       tmp_table.text
    FROM
      (SELECT tid,
        data->'user'->>'screen_name' AS screen_name,
        data->>'text' AS text,
        CAST(data#>>'{geo,coordinates,0}' AS double PRECISION) AS lat,
        CAST(data#>>'{geo,coordinates,1}' AS double PRECISION) AS lon
       FROM tweet
       WHERE data->>'geo' <> '') AS tmp_table
    WHERE ST_Distance(
        ST_MakePoint(tmp_table.lon, tmp_table.lat)::geography,
        ST_MakePoint(77.620176, 13.004616)::geography
    ) < 5000;

that yields this -

                                                    QUERY PLAN
    ---------------------------------------------------------------------------------
     Seq Scan on tweet  (cost=0.00..12667.35 rows=8631 width=51) (actual time=311.740..617.514 rows=2 loops=1)
       Filter: (((data ->> 'geo'::text) <> ''::text) AND (_st_distance((st_makepoint(((data #>> '{geo,coordinates,1}'::text[]))::double precision, ((data #>> '{geo,coordinates,0}'::text[]))::double precision))::geography, '0101000020E6100000E770ADF6B0675340A11342075D022A40'::geography, 0::double precision, true) < 5000::double precision))
       Rows Removed by Filter: 26013
     Total runtime: 617.561 ms
    (4 rows)

That's fairly fast for me.

Just for reference, [ST_Distance](http://postgis.net/docs/ST_Distance.html) and [ST_MakePoint](http://postgis.net/docs/ST_MakePoint.html) docs are pretty handy.

All the above queries just showed that we can query a fairly sized db using JSON data type without much time different between complex queries. My cron job for collecting tweets is still running. I'm waiting for it to touch 1 million records. Once it does, will test on it and update this post.

I'll probably write another post on PostGIS and maybe Foursquare data. That would be fun. If you have any ideas, let me know.
