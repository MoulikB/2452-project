classDiagram

class Player {
    -string name
    -int clickPower
    -int passiveRate
}

note for Player "Class invariants:
<ul>
<li>name is not null or empty</li>
<li>clickPower >= 1</li>
<li>passiveRate >= 0</li>
</ul>"

class BadCode {
    -int count
}

note for BadCode "Class invariants:
<ul>
<li>count >= 0</li>
</ul>"

class Upgrade {
    -string name
    -int count
    -int modifier
}

note for Upgrade "Class invariants:
<ul>
<li>name is not null or empty</li>
<li>count >= 0</li>
<li>modifier > 1</li>
</ul>"



Player "1" --> "1" BadCode : owns
Player "1" --> "0..*" Upgrade : purchases
Upgrade --> BadCode : modifes amount of
```