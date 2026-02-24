---
title: Flows of interaction for Bad Code Clicker
author: Moulik Bhatia (bhatiam3@myumanitoba.ca)
date: January 12 2026
---

# Flows of interaction

This document describes how a person interacts with the Bad Code Clicker
application. Each flow represents a task that the user can perform while
using the game.

---

## Click on the item

This is the most basic task in the game. The player clicks on the main item and sees the total amount of Bad Code increase. Any previously
purchased upgrades affect the amount gained per click.

```mermaid
flowchart TD
    view[[Player sees clickable item and current BadCode count]]
    clickItem([Player clicks BadCode])
    process{Process click input based on upgrades}
    endClick[[BadCode total updated and continue playing]]

    view --> clickItem
    clickItem -- click input --> process
    process -- updated BadCode --> endClick

```

## Purchase Upgrades

The player may choose to purchase an upgrade to increase their clicking
power. If they do not have enough Bad Code, an error message is shown.

```mermaid
flowchart TD
    view[[Player views available upgrades]]
    select([Player selects upgrade])
    process{Process upgrade purchase}
    success[Click power increased]
    fail[Not enough BadCode message shown]
    endUpgrade[[Return to game]]

    view --> select
    select -- selected upgrade and current BadCode --> process
    process -- purchase successful --> success
    process -- insufficient BadCode --> fail
    success --> endUpgrade
    fail --> endUpgrade

```

## Purchase Building

The player may choose to purchase an building which enables an auto clicker which gives you your current click power power 'x' times per 10 seconds.
It emulates you clicking the create bad code button.
If they do not have enough Bad Code, an error message is shown.

```mermaid
flowchart TD
    view[[Player views available buildings]]
    select([Player selects building])
    process{Process building purchase}
    success[ProductionPerSecond amount increased]
    fail[Not enough BadCode message shown]
    endUpgrade[[Return to game]]

    view --> select
    select -- selected upgrade and current BadCode --> process
    process -- purchase successful --> success
    process -- insufficient BadCode --> fail
    success --> endUpgrade
    fail --> endUpgrade
```

## Passive Production
How the passive production works in the current game flow
```mermaid
flowchart TD
    timer[[Game timer triggers every X seconds]]
    calculate{Calculate total passive income}
    update[Increase BadCode total]
    notify[Update view display]
    loop[[Continue game loop]]

    timer --> calculate
    calculate --> update
    update --> notify
    notify --> loop
```