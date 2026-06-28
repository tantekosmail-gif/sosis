create view vw_dashboard as

select

topic_id,

count(*) total_exposure,

sum(engagement) total_engagement,

sum(views) total_reach,

sum(likes) total_like,

sum(comments) total_comment,

sum(shares) total_share

from documents

group by topic_id;




create view vw_platform_distribution as

select

topic_id,

platform,

count(*) total

from documents

group by

topic_id,

platform;



create view vw_timeline as

select

topic_id,

date(published_at) as date,

count(*) exposure

from documents

group by

topic_id,

date(published_at)

order by date;




create view vw_sentiment as

select

d.topic_id,

s.sentiment,

count(*) total

from document_sentiments s

join documents d

on d.id=s.document_id

group by

d.topic_id,

s.sentiment;



create view vw_top_posts as

select

topic_id,

platform,

author_name,

title,

content,

engagement,

likes,

comments,

shares,

url,

published_at

from documents

order by engagement desc;



create view vw_wordcloud as

select

d.topic_id,

k.keyword,

count(*) total

from document_keywords k

join documents d

on d.id=k.document_id

group by

d.topic_id,

k.keyword

order by total desc;




create view vw_top_entities as

select

d.topic_id,

e.entity,

e.entity_type,

count(*) total

from document_entities e

join documents d

on d.id=e.document_id

group by

d.topic_id,

e.entity,

e.entity_type

order by total desc;