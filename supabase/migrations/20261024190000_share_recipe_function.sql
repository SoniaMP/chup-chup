-- Compartir y renovar en un solo sitio, para que los treinta días no los decida el móvil.
--
-- `security invoker`: la función corre con los permisos de quien llama, así que las políticas de
-- `recipe_shares` siguen mandando y nadie puede compartir una receta que no es suya.

create function share_recipe(recipe uuid)
returns recipe_shares
language sql
security invoker
set search_path = public
as $$
  insert into recipe_shares (recipe_id)
  values (recipe)
  on conflict (recipe_id) do update set expires_at = now() + interval '30 days'
  returning *;
$$;
