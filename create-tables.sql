create table if not exists player (
    id serial primary key,
    name varchar(255) not null unique,
    badCode integer not null default 0,
    clickPower integer not null default 1
);

create table if not exists upgrade_type (
    id serial primary key,
    name varchar(255) not null unique,
    baseCost integer not null,
    clickPowerIncrease integer not null
);

create table if not exists player_upgrade (
    id serial primary key,
    player_id integer not null,
    upgrade_type_id integer not null,
    level integer not null default 0,
    foreign key (player_id) references player(id) on delete cascade,
    foreign key (upgrade_type_id) references upgrade_type(id),
    unique (player_id, upgrade_type_id)
);