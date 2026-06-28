create index idx_documents_topic
on documents(topic_id);

create index idx_documents_platform
on documents(platform);

create index idx_documents_publish
on documents(published_at);

create index idx_documents_author
on documents(author_name);

create index idx_documents_engagement
on documents(engagement desc);

create index idx_sentiment_document
on document_sentiments(document_id);

create index idx_sentiment_type
on document_sentiments(sentiment);


create index idx_entity_document
on document_entities(document_id);

create index idx_entity_name
on document_entities(entity);


create index idx_keyword_document
on document_keywords(document_id);

create index idx_keyword_name
on document_keywords(keyword);

create index idx_dashboard_topic
on dashboard_cache(topic_id);

create index idx_dashboard_metric
on dashboard_cache(metric);


