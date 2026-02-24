create table if not exists player (
    name varchar(255) primary key,
    badCode integer not null default 0,
    clickPower integer not null default 1,
    productionPerSecond integer not null default 0
);

create table if not exists upgrade_type (
    name varchar(255) primary key,
    baseCost integer not null,
    clickPowerIncrease integer not null
);

create table if not exists player_upgrade (
    id serial primary key,
    player_name varchar(255) not null,
    upgrade_name varchar(255) not null,
    quantity integer not null default 0,

    foreign key (player_name) references player(name) on delete cascade,
    foreign key (upgrade_name) references upgrade_type(name),

    unique (player_name, upgrade_name)
);

create table if not exists building_type (
    name varchar(255) primary key,
    baseCost integer not null,
    productionPerSecond integer not null
);

create table if not exists player_building (
    id serial primary key,
    player_name varchar(255) not null,
    building_name varchar(255) not null,
    quantity integer not null default 0,

    foreign key (player_name) references player(name) on delete cascade,
    foreign key (building_name) references building_type(name),

    unique (player_name, building_name)
);
