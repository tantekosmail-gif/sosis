create or replace function update_updated_at_column()

returns trigger

language plpgsql

as $$

begin

new.updated_at=now();

return new;

end;

$$;


create trigger trg_users

before update

on users

for each row

execute function update_updated_at_column();



create trigger trg_workspace

before update

on workspaces

for each row

execute function update_updated_at_column();


create trigger trg_topics

before update

on topics

for each row

execute function update_updated_at_column();


create trigger trg_documents

before update

on documents

for each row

execute function update_updated_at_column();


create trigger trg_dashboard_cache

before update

on dashboard_cache

for each row

execute function update_updated_at_column();