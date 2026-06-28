create table trends
(
    id uuid primary key default gen_random_uuid(),

    topic_id uuid references topics(id) on delete cascade,

    keyword text,

    platform social_platform,

    score numeric default 0,

    spike_level text, -- low | medium | high | critical

    mention_count int default 0,

    sentiment_shift numeric default 0,

    detected_at timestamptz default now()
);