-- Del cupo diario solo descuentan los aciertos.
--
-- Antes se apuntaba el uso antes de llamar al modelo y ahí se quedaba: si la IA fallaba, o ni
-- siquiera había saldo, la cocinera perdía una receta de su cupo por un problema que no era suyo.
-- Ahora el intento se apunta igual —primero, para que nadie pueda llamar mil veces a la vez— pero
-- se devuelve cuando no sale nada en limpio.

-- Y si ya no cabía, no se cuenta: el número dice la verdad en vez de crecer con cada reintento.
create or replace function claim_ai_use(p_owner uuid, p_limit integer) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  spent integer;
begin
  insert into public.ai_usage (owner_id, day, used)
  values (p_owner, current_date, 1)
  on conflict (owner_id, day) do update set used = public.ai_usage.used + 1
  where public.ai_usage.used < p_limit
  returning used into spent;

  return spent is not null;
end;
$$;

create function release_ai_use(p_owner uuid) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.ai_usage
  set used = greatest(used - 1, 0)
  where owner_id = p_owner and day = current_date;
end;
$$;

revoke execute on function release_ai_use(uuid) from public, anon, authenticated;
