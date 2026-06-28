create table dashboard_cache
(
    id uuid primary key default gen_random_uuid(),

    topic_id uuid references topics(id) on delete cascade,

    metric text not null,

    value numeric default 0,

    metadata jsonb,

    period_start timestamptz,

    period_end timestamptz,

    created_at timestamptz default now(),

    updated_at timestamptz default now()
);


create table ai_summaries
(
    id uuid primary key default gen_random_uuid(),

    topic_id uuid references topics(id) on delete cascade,

    summary text,

    recommendation text,

    key_insights jsonb,

    period_start timestamptz,

    period_end timestamptz,

    created_at timestamptz default now()
);


create table saved_reports
(
    id uuid primary key default gen_random_uuid(),

    topic_id uuid references topics(id) on delete cascade,

    title text,

    file_url text,

    created_by uuid,

    created_at timestamptz default now()
);


create table api_logs
(
    id uuid primary key default gen_random_uuid(),

    topic_id uuid references topics(id),

    endpoint text,

    request jsonb,

    response jsonb,

    status_code int,

    execution_time int,

    created_at timestamptz default now()
);

create table metrics_daily
(
    id uuid primary key default gen_random_uuid(),

    topic_id uuid references topics(id),

    date date,

    exposure int default 0,

    positive int default 0,

    neutral int default 0,

    negative int default 0,

    facebook int default 0,

    instagram int default 0,

    tiktok int default 0,

    youtube int default 0,

    news int default 0
);