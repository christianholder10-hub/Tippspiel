-- profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Jeder kann Profile lesen"
  on profiles for select using (true);
create policy "Nutzer kann eigenes Profil anlegen"
  on profiles for insert with check (auth.uid() = id);
create policy "Nutzer kann eigenes Profil bearbeiten"
  on profiles for update using (auth.uid() = id);

-- tips
create table if not exists tips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  matchday_id int not null,
  game_id int not null,
  pick text check (pick in ('A', 'B')) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, matchday_id, game_id)
);
alter table tips enable row level security;
create policy "Nutzer verwaltet eigene Tipps"
  on tips for all using (auth.uid() = user_id);

-- results
create table if not exists results (
  matchday_id int not null,
  game_id int not null,
  winner text check (winner in ('A', 'B')) not null,
  score_home int not null,
  score_away int not null,
  primary key (matchday_id, game_id)
);
alter table results enable row level security;
create policy "Ergebnisse sind öffentlich lesbar"
  on results for select using (true);

-- points
create table if not exists points (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  matchday_id int not null,
  game_id int not null,
  points_earned float not null,
  created_at timestamptz default now()
);
alter table points enable row level security;
create policy "Punkte sind öffentlich lesbar"
  on points for select using (true);
create policy "Nur Service-Role darf Punkte eintragen"
  on points for insert with check (false);

-- updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger tips_updated_at
  before update on tips
  for each row execute function update_updated_at();
