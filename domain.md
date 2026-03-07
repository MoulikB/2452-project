---
title: Bad Code Clicker
author: Moulik Bhatia (bhatiam3@myumanitoba.ca)
date: March 7 2026
---

# Domain model

The domain model for the BadCode clicker game. You click to generate more and more bad code. You have a player class which keeps account of current stats and info and an abstract Upgrade class on which all upgrades are built. The amount of upgrades you own also modifies the "clicking power". Each click is modified by the upgrades : the total click power accumulated from upgrades.

```mermaid
classDiagram

class Account {
    -~username: string
    -password: string
    -player : Player
    +authenticate(password): boolean
}

note for Account "Class invariants:
<ul>
<li>username is not empty</li>
<li>password is not empty</li>
</ul>"

class Player {
    -badCode: number
    -clickPower: number
    -productionPerSecond: number
    +increment(): void
    +spend(amount): void
    +purchaseUpgrade(upgrade): void
    +purchaseBuilding(building): void
    +increaseClickPower(amount): void
    +increaseProductionPerSecond(amount): void
}

note for Player "Class invariants:
<ul>
<li>badCode >= 0</li>
<li>clickPower >= 1</li>
<li>productionPerSecond >= 0</li>
</ul>"

class Upgrade {
    <<abstract>>
    -~name: string
    -count: number
    -cost : number
    -clickPowerIncrease: number
    +increaseCount(): void
}

note for Upgrade "Class invariants:
<ul>
<li>name is not empty</li>
<li>count >= 0</li>
<li>clickPowerIncrease >= 1</li>
<li>cost >= 1</li>
</ul>"

class VibeCodingIntern

class AIFacilitatedChatBot

note for VibeCodingIntern "Concrete upgrade that increases click power."
note for AIFacilitatedChatBot "Concrete upgrade that increases click power."





Player "1" --* "*" Upgrade : composed of concrete implementations of abstract class that increase click power and help in generating more clicks per second

class Building {
    <<abstract>>
    -~name: string
    -count: number
    -cost : number
    -productionPerSecond: number
    +increaseCount(): void
}

note for Building "Class invariants:
<ul>
<li>name is not empty</li>
<li>count >= 0</li>
<li>productionPerSecond >= 1</li>
<li>cost >= 1</li>
</ul>"

class DataCentre

class MemoryLeak

Account "1" -- "1" Player : owns game state

note for DataCentre "Concrete building that produces Bad Code per second."
note for MemoryLeak "Concrete building that produces Bad Code faster."

Upgrade <|-- VibeCodingIntern
Upgrade <|-- AIFacilitatedChatBot

Building <|-- DataCentre
Building <|-- MemoryLeak

Player "1" --* "*" Building : composed of concrete implementations of building class that generates bad code per second
```
