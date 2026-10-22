-- Chup Chup: empties all the data without touching the schema or the account.
--
-- How to run it: Supabase dashboard -> SQL Editor -> New query -> paste -> Run.
-- It runs in one transaction: either everything goes or nothing does.
--
-- What it deletes: every recipe, every cookbook, every collection and every recipe photo,
-- for every user of this project.
-- What it keeps on purpose: the schema, and your account. To delete the account too, use
-- Authentication -> Users in the dashboard; deleting a user also deletes their recipes.
--
-- Rows in cookbook_recipes go on their own: they hang off recipes and cookbooks with
-- "on delete cascade", so deleting those two is enough.

begin;

delete from storage.objects where bucket_id = 'recipe-photos';
delete from recipes;
delete from cookbooks;
delete from collections;

commit;

-- Should print 0 everywhere.
select 'recipes' as table_name, count(*) as rows from recipes
union all select 'cookbooks', count(*) from cookbooks
union all select 'cookbook_recipes', count(*) from cookbook_recipes
union all select 'collections', count(*) from collections
union all select 'photos', count(*) from storage.objects where bucket_id = 'recipe-photos';
