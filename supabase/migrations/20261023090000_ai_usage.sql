-- Cuántas veces al día usa cada cocinera la IA.
--
-- La tabla no tiene políticas a propósito: nadie la toca desde el cliente, ni para leer ni para
-- escribir. Solo la Edge Function, con la clave de servicio, que es la única forma de que el
-- límite sea un límite y no una sugerencia que se puede reescribir desde el navegador.

create table ai_usage (
  owner_id uuid not null references auth.users on delete cascade,
  day date not null default current_date,
  used integer not null default 0,
  primary key (owner_id, day)
);

alter table ai_usage enable row level security;

-- Suma uno y dice si todavía cabe. En una sola sentencia, para que dos peticiones a la vez no
-- cuenten como una.
create function claim_ai_use(p_owner uuid, p_limit integer) returns boolean
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
  returning used into spent;

  return spent <= p_limit;
end;
$$;

revoke execute on function claim_ai_use(uuid, integer) from public, anon, authenticated;
