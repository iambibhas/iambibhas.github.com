---
layout: post
title: "Free Basics by Facebook is a Nightmare on the Internet"
description: ""
category:
tags: []
permalink: /blog/free-basics-by-facebook-is-a-nightmare-on-the-internet/
---
Unless you've been living under a rock for last few weeks, I'm sure you've seen at least one of these ads around you -

<blockquote class="imgur-embed-pub" lang="en" data-id="a/rJkMW"><a href="//imgur.com/a/rJkMW">Free Basics ads on different media</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>

Because you're here, I'm assuming that you're interested in knowing more about this "Free Basics" everyone is talking about. For those who have heard of "Internet.org" before, Free Basics is just a re-branded Internet.org with couple of changes here and there. For those who haven't heard of any of this before, here goes -

Free Basics is a program by Facebook where they make a deal with the Telecom Operators like Reliance etc to provide the said Telco's millions of customers free(as in without paying for it) access to a handful of websites from the Internet. These websites are handpicked by Facebook itself. (If you want your website to show up to these millions of people, you have to *apply* for it and it has to get approved by Facebook). These websites may include news, health-care, education, public service related websites. Those too are chosen by Facebook. Facebook is not charging these websites anything to apply or get approved. Facebook isn't charging anything to the customers. It definitely looks like a generous charity and a good thing, right?

![Wrong](https://i.imgur.com/Zy3GDqQm.jpg)

### Like everything else, the devil is in the details.

Please remember that Facebook's target market isn't you or me who have 24/7 WiFi access at home or office and who have been using Internet for 10 years. No, their target market are the people from Indian/African villages, most of whom probably never heard about Internet, maybe even computers. To some them, the concept that people living in another village or a big city can talk to them instantly over something like an Instant Messaging service, is a distant dream. If you go to one such village today and try to explain "Internet" to them and say that "Internet" actually originated in the Dwapara Yug by Indra Devta, they might actually believe you. Because they have no way to validate that information.

What Facebook is trying to do is create a small network of curated websites, let's call it "Facebooknet" while you're reading this article, and give that to people with absolutely no connectivity to the Internet. This looks like as incredible generous feat that will connect billions of our countrymen with us. But think about this for a moment.

Facebook's intention is to keep people Inside Facebook. [A survey done in Indonesia and Nigeria](http://qz.com/333313/milliions-of-facebook-users-have-no-idea-theyre-using-the-internet/) showed that people who were given access to Facebook stayed inside Facebook and had no idea that they were actually using Internet! To them Facebook and Internet had a very different meaning! This is what Facebook wants in India.

I talked to a friend who is currently using Free Basics on a Reliance SIM. When you use Free Basics, you never leave Facebook's domain. Any website that is available to Free Basics, is read by Facebook and then shown to you on the Free Basics domain itself. Your original request never even touch the website you're trying to reach. This is what Facebook wants. For you to never leave Facebook.

### What's wrong with a curated web?

When you say "news providing website", you are thinking about the news sites that you trust and know that provide almost impartial news. But what if the sites you trust don't apply for the Free Basics program? What if that other site that you know provides misinformation, does apply for Free Basics and gets access to it? Exactly the same with all the other category. If anyone ever wanted to control information for Billions of people, they'd choose Free Basics. That's the potential use of Free Basics.

Also, the problem with a curated web is that the curator chooses the flow of information. Want news about the ongoing trouble in Telengana or Sikkim? Well, you can't, if the Free Basics chosen news website doesn't cover it. Sounds good?

### Under the hood

Now if you'd let me get a bit technical, here is the [Participation Guideline of Free Basics](https://developers.facebook.com/docs/internet-org/participation-guidelines) for companies that want to make their websites available on Facebooknet. According to it,

> Your site(s) may be proxied to make your content available through Free Basics.

This is what this means -

![Free Basics Proxy](https://i.imgur.com/DKJLcD3h.png)

It means that *all* your requests go through Facebook's proxy server. Facebook says that, it is so that the requests and responses are optimized for mobile access. But that also means that Facebook reads **everything** and can tamper with **everything**.

### Whoa! So Facebook will read and modify my Facebooknet traffic live?

Yep.

> In order for your content to be proxied as described above, your URLs may be re-written and embedded content (like javascript and content originating from another domain) removed. In addition, secure content is not supported and may not load.

So Facebook is saying outright that they *will* modify the content of those sites and any content using Javascript etc will be blocked. **Embedded Content** also includes videos. So they wont be available either. And the most important part is that *secure content is not supported*. Bye Bye privacy and security.

Here is [BB-8](https://en.wikipedia.org/wiki/BB-8) showing his concern on the topic -

![BB-8](https://i.imgur.com/SEIa2qb.jpg)

### Can I check this with someone else?

> Any data (e.g., proxy requests) or reporting we provide is deemed Facebook confidential information and cannot be used by you for any advertising purposes or shared with third parties.

Nope. Even if you have any problem with what's being done, you can't complain or share it publicly.

### But developers get to build their apps on Facebooknet..

> Developer participation on the Free Basics Platform, including the information submitted with your application, is otherwise governed by our standard legal terms.

Here is the "[Standard legal terms](www.facebook.com/legal/terms)", which also mentions this -

> For content that is covered by intellectual property rights, like photos and videos (IP content), you specifically give us the following permission, subject to your privacy and application settings: you grant us a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use any IP content that you post on or in connection with Facebook (IP License).

### Thinking about HTTPS?

> We encrypt information for Free Basics wherever possible. When people use the Free Basics Android app, their traffic is encrypted end-to-end unless you specify that your service should be HTTP only. For the Free Basics website in a mobile browser, we use a “dual certificate” model to encrypt traffic between a person's device and our servers in both directions. If your server supports HTTPS, we will also encrypt traffic between our servers and yours. Even if your service doesn't yet support HTTPS, where possible we will encrypt that information between our servers and people's devices unless you ask us to not use dual certificate HTTPS. **When people use the Free Basics mobile website, information is temporarily decrypted on our secure servers to ensure proper functionality of the services and to avoid unexpected charges to people.**

Facebook will decrypt all the HTTPS traffic on their own server before re-encrypting it again to send it to the destination server.

### Thinking about your private data transmitted via the Facebook's server?

Facebook published [a post](https://info.internet.org/en/2015/11/19/internet-org-myths-and-facts/) trying to break all the "myths" people have about Internet.org. This is a part right out of it -

> **MYTH**: Facebook gets access to all usage data of sites that are on Free Basics

> **FACT**: Facebook takes user privacy and security extremely seriously. Free Basics receives and stores data on navigation information – the domain or name of the Third-Party Service accessed through Free Basics, and the amount of data (e.g. megabytes) used when you access or use that service – because it needs to determine what traffic can be delivered free of data charges. **Facebook does not store any personal navigation information from within the service __beyond 90 days__**. We don't share any personally identifiable information with our content partners and there is no requirement for those partners to send Facebook such information about their users.

So you can be sure that Facebook will store *at least* 3 months worth of private data for all the traffic. You have to take Facebook's words on if they are storing it beyond that time limit. Also, Facebook's servers are in USA. So anytime Facebook takes any of your data and it passes the USA border, the USA govt will have a copy of all your data.

### But the intended users dont care about all these technical stuff..

Fair point. But try to understand that for those people who have no clue about Internet, Facebooknet is trying to be the definition of Internet. And history has shown that when you provide selective free content to people, over the time they will prefer using the free content over the paid content. Sure people can buy full Internet access. But if they can get the bare minimum for free, why do that? And there is the trap Facebook has so cleverly created.

Facebook has published a survey that says that **4 out of 5 Indians support Free Basics**. Here are the surveys -

<blockquote class="imgur-embed-pub" lang="en" data-id="a/hBmvJ"><a href="//imgur.com/hBmvJ">View post on imgur.com</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>

Oh WOW! So if you dont support Free Basics, there is a chance that the 4 people around you already do! Awesome, Right?! But wait a second, look at the really tiny footer text on those images -

> Source: Survey of **3,094** Indian ...

![Imgur](https://i.imgur.com/QdXhq4Ll.jpg?1)

So a survey done on 0.0002503% of Indian population told Facebook that 4 out of 5 Indians support Free Basics?

![Imgur](https://i.imgur.com/ks6wBOOl.jpg)

Moving on from here. I have too many memes I can use here, but even *that* will still not suffice.

Only in last few weeks, Facebook has spent over Rs 1,000,000,000(close to $15,400,000) on advertisements for Free Basics in India. Using language like "If you want Digital Equality for India, support Free Basics" or "What the activists wont tell you about Free Basics" or even "To get Free Internet for Digital Equality, give a missed call", they have created a situation where anyone who doesn't support this will start appearing as anti-poor or not-so-well-wisher of a better and connected India.

If you've been thinking that Facebook is here to do charity, let me burst that bubble. If you really want better life for the poor, you dont spend Rs 100 Crore on advertising how your methods are not doing the opposite. If Zuckerberg really wanted better life for people, he could buy basic *full Internet* access for at least 35,714,285 people using that money for a whole month. (Aircel provides 110MB 2G for a month for Rs 28)

Facebook is saying everywhere that they are not taking money from anyone. But is that even possible that they are not making any profit? Why would Facebook be *so* desperate to get this program running in India and countries in Africa if there were no benefit out of it? Facebook has become *so* desperate that they are now showing "Free Basics" ad on YouTube before the videos that asks people not to support Free Basics.

### But why is Facebook so desperate?

Facebook's primary business is data collection and information control. Facebook is not about connecting people. Facebook wants everyone using the Internet to have a Facebook profile and have their activities monitored. Want proof?

 - Facebook has a real name and real date of birth policy. You have to use your real name and DOB. They dont let you change your name and DOB more than 3-5 times. Once you touch that limit, you can never change them back. And they often lock people out of their account in suspicion that they are not real people. The only way to get their account unlocked is to mail Facebook a copy of your Government provided ID card(!).
 - Most people use Facebook from smartphones nowadays. And the Android/iPhone app of Facebook requires access to your -
   - all contacts
   - camera and microphone
   - location
   - SMS
   - calendar
   - call records
   - photos/videos
   - device ID
   - anything else you can think of
 - Facebook bought WhatsApp, the most used messaging app on smartphones (to know what you talk about)
 - Facebook bought Instagram, the most used "social" image sharing app (to know what you're interested in)
 - Facebook can automatically tag people on their uploaded photos, meaning that they run facial recognition on *any* photo uploaded on Facebook (to know who you are with and where you've been)

Now that we've established that Facebook's main target in life is to collect people's data. Imagine how much they'd want to get a billion more off-the-grid people signed up for their website. Countries like India and those in Africa are few countries like that. Almost 70% of Indians have no access to Internet yet. This is like free money lying around, for Facebook. They just need to convince that govt that they are here for the better life of people and voila! They've got themselves a billion more customers overnight. Do you still wonder why Zuckerberg himself is writing on an Indian newspaper defending Free Basics' purpose?

Facebook wants people to keep using Facebook. Social networking sites don't live forever. Remember MySpace? Or Orkut? Facebook doesn't want to be yet another Orkut. So they are doing everything in their might to become irreplaceable. Which they will be for a billion Indians if Free Basics gets through. This is the ticket to Facebook's survival for next 10 years.

### So they're here for business. Who isn't? What's wrong with them making some money when the poor get access?

If implemented, Free Basics is going to shape the Internet for the next billion people in India. And we want them to get the same open Internet we had access to, not just a 0.0000000000001% of it. And it's not like Facebooknet is the only option to get those people online. Aircel is [already running a program](http://economictimes.indiatimes.com/tech/internet/aircel-to-offer-free-basic-internet-across-india-in-a-year/articleshow/49380597.cms?from=mdr) where they'll give free access to the entire Internet to their customers at 64kbps speed. It's completely free for the first 3 months and then after that if they recharge for at least Rs 150 per month for talktime, the basic Internet will stay free for them.

Mozilla has been [running a program](http://www.telecomtv.com/articles/smartphones/grameenphone-offers-free-mobile-data-for-new-firefox-os-users-in-bangladesh-11732/) in Bangladesh where people get 3 months of basic Internet for free when they buy a $60(Rs 4000) Mozilla handset.

Remember that it *does not* take more infrastructure to provide full Internet access compared to a Facebooknet. Rather something like Facebooknet requires more infrastructure and funding as it has to filter through all the data people are using on it.

So why provide the same spectrum to provide Facebooknet to the billion people when it can be used to provide full Internet access to them? Shouldn't govt be asking this question to the telecom operators?

### Ok.. Can you explain what's wrong with Facebook choosing the websites?

Facebook wants to shape Internet's future in India. If Free Basics gets through, a billion Indians will know that "Social Networking" means "Facebook". Because Facebook is and will be the only social network on Free Basics. Similarly, you'll only be able to use Facebook messenger for instant messaging. Similarly, Facebook's partner ecommerce website will be the only ecommerce website those billion people will get to know. What's wrong with that? Well, Facebook is collecting all the data. Facebook will know "who wipes your nose when you sneeze". Facebook will know your habits, your thinking patterns and behavioral patterns. International ecommerce websites like Target [has already shown](http://www.businessinsider.com/the-incredible-story-of-how-target-exposed-a-teen-girls-pregnancy-2012-2?IR=T) what can be done with patterns like that (TL;DR, they predicted a teen's pregnancy from her shopping patterns and informed her parents before she did).

Your daily browsing patterns reveal more about you than you think. From health issues to social issues, Internet usage patterns can reveal everything. This is why data collection/mining is so attractive among companies like Facebook, Twitter or Google.

Facebook having the ability to reject applications also mean that if your friend wants to get his new ecommerce startup listed in Free Basics, they can't, if Free Basics' current partner ecommerce website don't want that. Also, Facebook is not charging anything to the websites from listing themselves in Free Basics, but they have Never said that they will Never charge them. So at that point, only the websites who can afford the access to Free Basics, will be available to the Free Basics users. If your friend can't afford that, then tough luck.

### I think I get it now. How is Facebook handling these doubts about Free Basics?

Not very well evidently. The other day Zuckerberg himself [wrote a piece](http://blogs.timesofindia.indiatimes.com/toi-edit-page/free-basics-protects-net-neutrality/) on Times of India explaining why he is right, and Free Basics is awesome and all the people who are against it in India (which includes people from different backgrounds like entrepreneurs, IIT/IISc professors, even Inventor of WWW himself) are wrong. He asks in that piece -

> Who could possibly be against this?

Well sir, ["more than a few of us"](https://www.linkedin.com/pulse/facebook-responds-free-basics-challenge-duel-umm-i-accept-murthy). Including the latest addition - [Egypt](http://www.theguardian.com/technology/2015/dec/30/facebook-disappointed-shutdown-free-internet-service-egypt).

### If Facebook changes the terms of Free Basics to be Net Neutral, would that be desirable?

A Net Neutral version of Free Basics would mean -

 - no application procedure for websites
 - hence, access to the whole Internet

Well, then why will we need Facebook in the equation? Any Telecom Operator can do it themselves. Aircel just proved it. This is also why Facebook is interested in twisting the definition of Net Neutrality by creating guilt traps. They are telling everyone that by sticking to the original definition of Net Neutrality, we're denying Internet access to billions of poor Indians. Who wouldn't feel guilty after hearing this?

### So, isn't what Facebook is offering needed to bring the next billion online?

Well, not really. This is a tweet from Ravi Shankar Prasad, Communications and Information Technology Minister of India -

<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">No. of Internet users in India increased by 100 million in 2015 to touch 400 million. <a href="https://twitter.com/_DigitalIndia">@_DigitalIndia</a> <a href="https://twitter.com/hashtag/FlashBack2015?src=hash">#FlashBack2015</a> <a href="https://t.co/FLHMhpwEjf">pic.twitter.com/FLHMhpwEjf</a></p>&mdash; Ravi Shankar Prasad (@rsprasad) <a href="https://twitter.com/rsprasad/status/682130503688794112">December 30, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

That's 100 million people coming online in a single year without the help of any system like Free Basics. Compare that to the previous 100 million that took 3 years. The progress is fantastic!

### I'm still not convinced..

Sure, the volunteers behind [SaveTheInternet](http://www.savetheinternet.in/) are happy to answer any question you have. Please visit their website. Talk to them over Twitter or mail. Then make an informed decision.

Here are some YouTube videos that explains the currents issues in very simple words. Please watch them if possible -

 - [Abish Mathew : Save The Internet](https://www.youtube.com/watch?v=JSxB1mD7SdE)
 - [AIB : Save The Internet 3](https://www.youtube.com/watch?v=AAQWsTFF0BM)

And here is the Father of WWW, the Internet as you mostly know, Tim Berners-Lee, telling you to ["Just say No" to Internet.org](http://www.theguardian.com/technology/2015/may/29/tim-berners-lee-urges-britain-to-fight-snoopers-charter) (now renamed to Free Basics).

Free Basics is pure evil. A nightmare for an Internet user. Please be informed and then ask yourself, do you really want the next billion of Indian Internet users to have this for themselves and their children?
