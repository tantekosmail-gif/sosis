create table users
(
    id uuid primary key default gen_random_uuid(),

    auth_user_id uuid,

    full_name text not null,

    email text unique,

    role user_role default 'viewer',

    avatar text,

    created_at timestamptz default now(),

    updated_at timestamptz default now()
);

create table workspaces
(
    id uuid primary key default gen_random_uuid(),

    name text not null,

    description text,

    logo text,

    created_by uuid references users(id),

    created_at timestamptz default now(),

    updated_at timestamptz default now()
);

create table topics
(
    id uuid primary key default gen_random_uuid(),

    workspace_id uuid references workspaces(id) on delete cascade,

    name text not null,

    description text,

    language varchar(10) default 'id',

    status topic_status default 'active',

    analyze_id text,

    created_by uuid references users(id),

    created_at timestamptz default now(),

    updated_at timestamptz default now()
);

create table topic_keywords
(
    id uuid primary key default gen_random_uuid(),

    topic_id uuid references topics(id) on delete cascade,

    keyword text not null,

    type keyword_type default 'include',

    created_at timestamptz default now()
);

create table topic_platforms
(
    id uuid primary key default gen_random_uuid(),

    topic_id uuid references topics(id) on delete cascade,

    platform social_platform
);