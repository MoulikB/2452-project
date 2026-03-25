-- =========================
-- ACCOUNT
create table if not exists account  (
    username varchar(255) primary key,
    password varchar(64) not null,  -- SHA-256 hash (hex) this is for hashing using PBKDF2
    salt varchar(32) not null       -- 16 bytes salt (hex)
);

-- =========================
-- PLAYER
create table if not exists player (
    username varchar(255) primary key,
    badCode integer not null default 0,
    clickPower integer not null default 1,
    productionPerSecond integer not null default 0,

    foreign key (username)
        references account(username)
        on delete cascade
);

-- =========================
-- UPGRADE TYPES
create table if not exists upgrade_type (
    name varchar(255) primary key,
    baseCost integer not null,
    clickPowerIncrease integer not null
);

-- =========================
-- PLAYER UPGRADES
create table if not exists player_upgrade (
    username varchar(255) not null,
    upgrade_name varchar(255) not null,
    quantity integer not null default 0,

    foreign key (username)
        references player(username)
        on delete cascade,

    foreign key (upgrade_name)
        references upgrade_type(name)
        on delete cascade,

    primary key (username, upgrade_name)
);

-- =========================
-- BUILDING TYPES
create table if not exists building_type (
    name varchar(255) primary key,
    baseCost integer not null,
    productionPerSecond integer not null
);

-- =========================
-- PLAYER BUILDINGS
create table if not exists player_building (
    id serial primary key,
    player_name varchar(255) not null,
    building_name varchar(255) not null,
    quantity integer not null default 0,

    foreign key (player_name)
        references player(username)
        on delete cascade,

    foreign key (building_name)
        references building_type(name),

    unique (player_name, building_name)
);

-- =========================
-- UPGRADE TYPES
insert into upgrade_type (name, baseCost, clickPowerIncrease) values
('Vibe Coding Intern', 20, 1),
('AI-facilitated chatbot', 50, 2),
('50 if-else statement', 100, 3),
('Implement backend in JavaScript', 500, 5),
('Implement frontend in Brainrot python', 1000, 10),
('Buying more claude tokens', 5000, 20),
('Calling all variables var', 100000, 100)
on conflict (name) do nothing;

-- =========================
-- BUILDING TYPES
insert into building_type (name, baseCost, productionPerSecond) values
('Data Centre', 100, 5),
('Memory Leak', 500, 15 ),
('Using magic numbers', 1000, 50 ),
('Remove comments', 2000, 100 ),
('Reusing code', 5000, 200 ),
('No error catching', 10000, 400 ),
('Skipping Classes', 20000, 1000 )
on conflict (name) do nothing;