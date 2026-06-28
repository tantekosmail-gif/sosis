create table documents
(
    id uuid primary key default gen_random_uuid(),

    topic_id uuid not null references topics(id) on delete cascade,

    platform social_platform not null,

    external_id text,

    url text,

    title text,

    content text,

    language varchar(10) default 'id',

    author_name text,

    author_username text,

    author_avatar text,

    author_verified boolean default false,

    published_at timestamptz,

    crawled_at timestamptz default now(),

    thumbnail text,

    image text,

    video text,

    likes integer default 0,

    comments integer default 0,

    shares integer default 0,

    views integer default 0,

    engagement integer default 0,

    raw_json jsonb,

    created_at timestamptz default now(),

    updated_at timestamptz default now()
);