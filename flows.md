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
    click[[Player clicks item]]
    update[Displayed BadCode increases based on current upgrades]
    end([Player continues playing])

    view --> click --> update --> end
```

## Purchase Upgrades

The player may choose to purchase an upgrade to increase their clicking
power. If they do not have enough Bad Code, an error message is shown.

```mermaid
flowchart TD
    view[[Player views available upgrades]]
    select[[Player selects an upgrade]]
    enough{Enough BadCode available?}
    success[Upgrade is purchased and clicking power increases]
    fail[Message shown: not enough BadCode]
    end([Return to game])

    view --> select --> enough
    enough -->|Yes| success --> end
    enough -->|No| fail --> end
```
