---
title: Bad Code Clicker
author: Moulik Bhatia (bhatiam3@myumanitoba.ca)
date: Januray 12 2026
---

# Domain model

The domain model for the BadCode clicker game. You click to generate more and more bad code. You have a player class which keeps account of current stats and info and an upgrade interface on which all the upgrades are built upon. Each click is modified by the upgrades : the multipliers you own. The amount of upgrades you own also modifies the "clicking power".

```mermaid
classDiagram
class Player {
    -name: string
    -clickPower: number
    -BadCodeCount: number
}

note for Player "Class invariants:
<ul>
<li>name is not null or empty</li>
<li>clickPower >= 1</li>
<li>BadCodeCount >= 0</li>
</ul>
"

class Upgrade {
    <<abstract>>
    -count: number
    -multiplier: number
    +purchase(): void
}


note for Upgrade "
<ul> Class Invariants :
<li>multiplier > 1</li>
<li>count >= 0</li>
</ul>
"

class VibeCodingIntern {
    -count: number
    -multiplier:number
    -purchase():void
}

note for VibeCodingIntern "Class invariants:
<ul>
<li> count >= 0 </li>
<li> multiplier > 1 </li>
</ul>"

class AIFacilitatedChatBot {
    -count: number
    -multiplier:number
    -purchase():void
}

note for AIFacilitatedChatBot "Class invariants:
<ul>
<li>count >= 0</li>
<li>multiplier > 1</li>
</ul>"

Upgrade <|-- VibeCodingIntern
Upgrade <|-- AIFacilitatedChatBot



Player *-- Upgrade

```
