---
title: Bad Code Clicker
author: Moulik Bhatia (bhatiam3@myumanitoba.ca)
date: February 7 2026
---

# Domain model

The domain model for the BadCode clicker game. You click to generate more and more bad code. You have a player class which keeps account of current stats and info and an abstract Upgrade class on which all upgrades are built. The amount of upgrades you own also modifies the "clicking power". Each click is modified by the upgrades : the total click power accumulated from upgrades.

```mermaid
classDiagram

class Player {
    -clickPower: number
    -badCode: number
    -AIBotUpgrade : AIFacilitatedChatBot
    -InternUpgrade: VibeCodingIntern
    +increment() : void
    +spend(amount): void
    +purchaseInternUpgrade(): void
    +purchaseBotUpgrade(): void
    +purchase(upgrade): void
    -apply(upgrade): void
    +increaseClickPower(amount): void
}

note for Player "Class invariants:
<ul>
<li>clickPower >= 1</li>
<li>badCode >= 0</li>
</ul>"

class Upgrade {
    <<abstract>>
    -count: number
    -cost : number
    -clickPowerIncrease: number
    +increaseCount(): void
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

Player --* Upgrade : composed of

```
