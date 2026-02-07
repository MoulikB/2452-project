---
title: Bad Code Clicker
author: Moulik Bhatia (bhatiam3@myumanitoba.ca)
date: Januray 12 2026
---

# Domain model

The domain model for the BadCode clicker game. You click to generate more and more bad code. You have a player class which keeps account of current stats and info and an abstract Upgrade class on which all upgrades are built. Each click is modified by the upgrades : the multipliers you own. The amount of upgrades you own also modifies the "clicking power".

```mermaid
classDiagram

class Player {
    -clickPower: number
    -BadCodeCount: number
    +increment() : void
    +spend(amount): void
    +increaseClickPower(amount): void
}

note for Player "Class invariants:
<ul>
<li>clickPower >= 1</li>
<li>BadCodeCount >= 0</li>
</ul>"

class Upgrade {
    <<abstract>>
    -count: number
    -clickPowerIncrease : number
    +purchase(Player) : void
    +apply(Player) : void
 }

note for Upgrade "Class invariants:
<ul>
<li>count >= 0</li>
<li>clickPowerIncrease >= 1</li>
<li>cost >= 1</li>
</ul>"

class VibeCodingIntern

class AIFacilitatedChatBot

note for VibeCodingIntern "Concrete class which inherits from abstract class upgrade"

note for AIFacilitatedChatBot "Concrete class which inherits from abstract class upgrade"
Upgrade <|-- VibeCodingIntern
Upgrade <|-- AIFacilitatedChatBot

Player *-- Upgrade : owns
```
