---
layout: post
title: "PostgreSQL SWAG Part 2: Indexing JSON data type and Full text search"
description: ""
category:
tags: []
permalink: /blog/postgresql-swag-part-2-indexing-json-data-type-and-full-text-search/
---
In my [last post](/blog/postgresql-swag-json-data-type-and-working-with-twitter-data/) I demonstrated the use of JSON data type of PostgreSQL. But I skipped a crucial part, Indexes.

All my queries in last post ran on a table with about 24k rows with the JSON tweet data. That import script of mine is still running and I've closed 100k records. I'll run the same queries again, but this time I'll create indexes for the appropriate columns before querying.

Also, I'll explain briefly how you can use the full text search feature of PostgreSQL instead of using `LIKE` like I used in last blog post.

Let's first try to fetch all the tweets that have both the word "world" and "cup" in it -

    tweets=# create index "idx_text" on tweet using gin(to_tsvector('english', data->>'text'));
    CREATE INDEX
    tweets=# analyze tweet;
    ANALYZE
    tweets=# explain analyze select tid, data->>'text' from tweet where to_tsvector('english', data->>'text') @@ to_tsquery('world & cup');
                                                          QUERY PLAN
    -----------------------------------------------------------------------------------------------------------------------
     Bitmap Heap Scan on tweet  (cost=61.03..8490.10 rows=3229 width=51) (actual time=4.146..358.203 rows=17037 loops=1)
       Recheck Cond: (to_tsvector('english'::regconfig, (data ->> 'text'::text)) @@ to_tsquery('world & cup'::text))
       ->  Bitmap Index Scan on idx_text  (cost=0.00..60.23 rows=3229 width=0) (actual time=3.325..3.325 rows=17037 loops=1)
             Index Cond: (to_tsvector('english'::regconfig, (data ->> 'text'::text)) @@ to_tsquery('world & cup'::text))
     Total runtime: 358.887 ms
    (5 rows)

    tweets=# explain analyze select tid, data->>'text' from tweet where to_tsvector('english', data->>'text') @@ to_tsquery('python & ruby');
                                                          QUERY PLAN
    -----------------------------------------------------------------------------------------------------------------------
     Bitmap Heap Scan on tweet  (cost=28.13..91.09 rows=16 width=51) (actual time=2.969..12.769 rows=114 loops=1)
       Recheck Cond: (to_tsvector('english'::regconfig, (data ->> 'text'::text)) @@ to_tsquery('python & ruby'::text))
       ->  Bitmap Index Scan on idx_text  (cost=0.00..28.12 rows=16 width=0) (actual time=2.822..2.822 rows=114 loops=1)
             Index Cond: (to_tsvector('english'::regconfig, (data ->> 'text'::text)) @@ to_tsquery('python & ruby'::text))
     Total runtime: 12.841 ms
    (5 rows)

The phenomenal time difference is dependant on the number of results -

    tweets=# select count(tid) from tweet where to_tsvector('english', data->>'text') @@ to_tsquery('python & ruby');
     count
    -------
       114
    (1 row)

    tweets=# select count(tid) from tweet where to_tsvector('english', data->>'text') @@ to_tsquery('world & cup');
     count
    -------
     17037
    (1 row)

Just remember that these queries are running on almost 4 times the records compared to the last post.

I think that `gin(to_tsvector('english', data->>'text'))` and `where to_tsvector('english', data->>'text') @@ to_tsquery('world & cup')` needs some explanation.

`GIN`(Generalized Inverted Index) and `GiST`(Generalized Search Tree) indexes are [two types of indexes](http://www.postgresql.org/docs/current/static/textsearch-indexes.html) on PostgreSQL that can be used to speed up the text search proxess. There are merits and demerits of both. As a rule of thumb, `GIN` indexes are best for static data because lookups are faster. Hence we're using that.

It's important to note that if you create index for `to_tsvector('english', data->>'text')` then while searching you much use the same `to_tsvector` method. If you use `to_tsvector(data->>'text')`, the index might not be used.

The `to_tsvector()` function takes a text and breaks it up into tokens, then consults few dictionaries that recognizes those tokens and provides a more normalized `lexems` to represent the token. The stop words are also detected and ignored as they appear too frequently to be useful while searching. E.g. -

    tweets=# select to_tsvector('english', 'Fifa world cup is ongoing');
                 to_tsvector
    -------------------------------------
     'cup':3 'fifa':1 'ongo':5 'world':2
    (1 row)

`to_tsquery()` creates a `tsquery` value from querytext, which must consist of single tokens separated by the Boolean operators `&` (AND), `|` (OR) and `!` (NOT).

    tweets=# select to_tsquery('english', 'Fifa & world | cup');
            to_tsquery
    --------------------------
     'fifa' & 'world' | 'cup'
    (1 row)

[PostgreSQL doc](http://www.postgresql.org/docs/9.3/static/textsearch-controls.html#TEXTSEARCH-PARSING-DOCUMENTS) has more details.

Then the `tsvector` is searched with the `tsquery` [using `@@`](http://www.postgresql.org/docs/9.3/static/functions-textsearch.html).

Now let's try searching for tweets with more than 5 favorites, both with and without indexes, so that we can compare -

    tweets=# explain analyze select tid, data#>>'{user,screen_name}', data->>'favorite_count' from tweet where CAST(data->>'favorite_count' AS integer) > 5;
                                                     QUERY PLAN
    -------------------------------------------------------------------------------------------------------------
     Seq Scan on tweet  (cost=0.00..21121.93 rows=32322 width=51) (actual time=1.901..2103.874 rows=100 loops=1)
       Filter: (((data ->> 'favorite_count'::text))::integer > 5)
       Rows Removed by Filter: 96865
     Total runtime: 2103.918 ms
    (4 rows)

    tweets=# create index "idx_fav_count" on tweet using btree(CAST(data->>'favorite_count' AS integer));
    CREATE INDEX
    tweets=# analyze tweet;
    ANALYZE
    tweets=# explain analyze select tid, data#>>'{user,screen_name}', data->>'favorite_count' from tweet where CAST(data->>'favorite_count' AS integer) > 5;
                                                             QUERY PLAN
    -----------------------------------------------------------------------------------------------------------------------------
     Index Scan using idx_fav_count on tweet  (cost=0.30..157.46 rows=133 width=51) (actual time=0.266..16.045 rows=100 loops=1)
       Index Cond: (((data ->> 'favorite_count'::text))::integer > 5)
     Total runtime: 16.104 ms
    (3 rows)

As you see, creating the index took down the time from 2 seconds to about 16ms!

Let's find the tweets that has the word `home` in them and also has geo location (remember, we created index for `data->>'text'` earlier) -

    tweets=# explain analyze select tid, data#>>'{user,screen_name}', data->>'text', data->>'geo' from tweet where data->>'geo' <> '' and to_tsvector('english', data->>'text') @@ to_tsquery('home');
                                                           QUERY PLAN
    -------------------------------------------------------------------------------------------------------------------------
     Bitmap Heap Scan on tweet  (cost=126.35..4321.85 rows=1328 width=51) (actual time=2.095..46.272 rows=27 loops=1)
       Recheck Cond: (to_tsvector('english'::regconfig, (data ->> 'text'::text)) @@ to_tsquery('home'::text))
       Filter: ((data ->> 'geo'::text) <> ''::text)
       Rows Removed by Filter: 1322
       ->  Bitmap Index Scan on idx_text  (cost=0.00..126.02 rows=1335 width=0) (actual time=1.006..1.006 rows=1349 loops=1)
             Index Cond: (to_tsvector('english'::regconfig, (data ->> 'text'::text)) @@ to_tsquery('home'::text))
     Total runtime: 46.313 ms
    (7 rows)

From ~550ms to 46ms, that too on 4 times the records!

This just shows how indexing can make your life much easier if you use it correctly. :)
