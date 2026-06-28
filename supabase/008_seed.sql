insert into workspaces (id, name, description)
values
(
  gen_random_uuid(),
  'Demo Indonesia Indicator',
  'Workspace demo social intelligence'
);

insert into topics (id, workspace_id, name, description, status)
select
gen_random_uuid(),
w.id,
'Tim Urai Kemacetan',
'Monitoring kemacetan dan rekayasa lalu lintas Jakarta',
'active'
from workspaces w
limit 1;


insert into documents
(
  id,
  topic_id,
  platform,
  title,
  content,
  author_name,
  engagement,
  likes,
  comments,
  shares,
  published_at
)
values
-- FACEBOOK
(gen_random_uuid(), (select id from topics limit 1),
'facebook',
'Macet parah di Sudirman pagi ini',
'Kemacetan luar biasa terjadi di area Sudirman karena proyek jalan',
'Kompas',
12000, 8000, 2000, 2000,
now() - interval '1 day'),

(gen_random_uuid(), (select id from topics limit 1),
'facebook',
'Dishub turun tangan atur lalu lintas',
'Petugas Dishub terlihat mengatur kemacetan di Jakarta',
'Detik',
18000, 12000, 3000, 3000,
now() - interval '2 day'),

-- INSTAGRAM
(gen_random_uuid(), (select id from topics limit 1),
'instagram',
'Jakarta macet lagi 😭',
'Story warga tentang kemacetan parah',
'user123',
6000, 4000, 1500, 500,
now() - interval '1 day'),

-- TIKTOK
(gen_random_uuid(), (select id from topics limit 1),
'tiktok',
'Kemacetan viral di TikTok',
'Video macet total di jalan Gatot Subroto',
'creator_jkt',
22000, 15000, 5000, 2000,
now() - interval '3 day'),

-- YOUTUBE
(gen_random_uuid(), (select id from topics limit 1),
'youtube',
'Kemacetan Jakarta 2 jam total stuck',
'Vlog perjalanan terkena macet',
'Travel ID',
30000, 20000, 7000, 3000,
now() - interval '4 day');


insert into document_sentiments (document_id, sentiment, score)
select id,
case
  when platform = 'facebook' then 'negative'
  when platform = 'instagram' then 'neutral'
  else 'positive'
end,
0.8
from documents;


insert into document_entities (document_id, entity, entity_type)
select id, 'Jakarta', 'LOCATION' from documents;

insert into document_entities (document_id, entity, entity_type)
select id, 'Dishub', 'ORGANIZATION' from documents;



insert into document_keywords (document_id, keyword)
select id, 'macet' from documents;

insert into document_keywords (document_id, keyword)
select id, 'kemacetan' from documents;

insert into document_keywords (document_id, keyword)
select id, 'dishub' from documents;


insert into dashboard_cache (topic_id, metric, value)
select topic_id, 'exposure_total', count(*)
from documents
group by topic_id;



insert into dashboard_cache (topic_id, metric, value)
select topic_id, 'engagement_total', sum(engagement)
from documents
group by topic_id;

