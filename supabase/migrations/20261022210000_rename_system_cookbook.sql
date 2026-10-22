-- The system cookbook can be renamed after all: the app finds it by its is_system flag, never by
-- its title, so the name is only decoration. What must never happen is it disappearing or losing
-- the flag, because it is where recipes land when no cookbook is chosen. So: update is allowed
-- again, delete stays blocked, and a trigger keeps the flag itself from being changed.

drop policy "Owners change their own cookbooks, not the system one" on cookbooks;

create policy "Owners change their cookbooks"
  on cookbooks for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create function keep_system_cookbook_flag() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_system is distinct from old.is_system then
    raise exception 'The system cookbook flag cannot be changed';
  end if;
  return new;
end;
$$;

create trigger cookbooks_keep_system_flag
  before update on cookbooks
  for each row execute function keep_system_cookbook_flag();

update cookbooks set title = 'Últimos chups'
where is_system and title = 'Mis últimas incorporaciones';
