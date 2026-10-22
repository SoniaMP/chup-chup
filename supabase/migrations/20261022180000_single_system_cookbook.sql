-- Each owner has exactly one system cookbook: the one recipes land in when no other is chosen.
-- A partial unique index is what keeps a race between two devices from creating two of them.
create unique index cookbooks_owner_system_idx on cookbooks (owner_id) where is_system;
