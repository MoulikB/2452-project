create table if not exists player(
name varchar(255) not null unique ,
badCode integer not null,
clickPower integer not null ,
AIBotCount integer not null , 
InternUpgrade integer not null
);

create table if not exists upgrades(
name varchar(255) not null unique ,
cost integer not null,
clickPowerIncrease integer not null ,
count integer not null , 
playerName varchar(255) not null unique , 
foreign key (playerName) references player(name)
);
