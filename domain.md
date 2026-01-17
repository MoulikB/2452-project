---
title: Bad Code Clicker
author: Moulik Bhatia (bhatiam3@myumanitoba.ca)
date: Januray 12 2026
---

# Domain model

```mermaid
classDiagram
class Player {
    -name: string
    -clickPower: int
    -BadCodeCount: int
}

note for Player "Class invariants:
<ul>
<li>name is not null or empty</li>
<li>clickPower >= 1</li>
<li>BadCodeCount >= 0</li>
</ul>
"

class Upgrade {
    <<interface>>
    -getCount(): int
    -multiplierAmount(): float
    -purchase():void
}

note for Upgrade "
<ul> Class Invariants :
<li>multiplierAmount > 1</li>
<li>getCount() >= 0</li>
</ul>
"

class VibeCodingIntern {
    -count: int
    -multiplier:float
    -purchase():void
}

note for VibeCodingIntern "Class invariants:
<ul>
<li> count >= 0 </li>
<li> multiplier > 1 </li>
</ul>"

class AIFacilitatedChatBot {
    -count: int
    -multiplier:float
    -purchase():void
}

note for AIFacilitatedChatBot "Class invariants:
<ul>
<li>count >= 0</li>
<li>multiplier > 1</li>
</ul>"

Upgrade <|.. "inherits" AIFacilitatedChatBot
Upgrade <|.. "inherits" VibeCodingIntern


Player o-- Upgrade : purchases and owns
```
