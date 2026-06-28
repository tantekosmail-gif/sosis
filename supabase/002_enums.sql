--------------------------------------------------
-- USER ROLE
--------------------------------------------------

create type user_role as enum
(
    'owner',
    'admin',
    'analyst',
    'viewer'
);

--------------------------------------------------
-- TOPIC STATUS
--------------------------------------------------

create type topic_status as enum
(
    'draft',
    'active',
    'archived'
);

--------------------------------------------------
-- PLATFORM
--------------------------------------------------

create type social_platform as enum
(
    'facebook',
    'instagram',
    'youtube',
    'tiktok',
    'twitter',
    'news',
    'blog',
    'forum'
);

--------------------------------------------------
-- KEYWORD TYPE
--------------------------------------------------

create type keyword_type as enum
(
    'include',
    'exclude',
    'hashtag',
    'mention',
    'entity'
);

--------------------------------------------------
-- SENTIMENT
--------------------------------------------------

create type sentiment_type as enum
(
    'positive',
    'neutral',
    'negative'
);