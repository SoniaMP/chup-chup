-- The system cookbook ("Mis últimas incorporaciones") is the app's, not the user's: it is where
-- recipes land when no other cookbook is chosen, so renaming or deleting it would leave recipes
-- with nowhere to go. The single "for all" policy becomes four, so update and delete can refuse
-- it in the database instead of trusting the client to hide a button.

drop policy "Owners read and write their cookbooks" on cookbooks;

create policy "Owners read their cookbooks"
  on cookbooks for select to authenticated
  using (owner_id = auth.uid());

create policy "Owners create their cookbooks"
  on cookbooks for insert to authenticated
  with check (owner_id = auth.uid());

create policy "Owners change their own cookbooks, not the system one"
  on cookbooks for update to authenticated
  using (owner_id = auth.uid() and not is_system)
  with check (owner_id = auth.uid() and not is_system);

create policy "Owners delete their own cookbooks, not the system one"
  on cookbooks for delete to authenticated
  using (owner_id = auth.uid() and not is_system);
