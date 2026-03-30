---
title: An assessment of my bad code clicker's UI
author: Moulik Bhatia (bhatiam3@myumanitoba.ca)
date: March 25 2026
---

# Phase 1

Here's my entire UI for phase 1:

![Phase 1 screenshot.](phase-1.png)!

## Phase 1 visibility

My initial implementation of this UI was minimally visible because:

- :+1: The system does clearly show what state the user is in ( whether the game has started or not)

- :-1: Available actions (like upgrades) are visible but not clearly distinguished from unavailable ones.

## Phase 1 feedback

- :+1: Every time we processed a click , we would provide instant feedback in the form of increasing bad code.
  The user would know that the processing is over

- :+1: Every time user would try to do an illegal action or move, the system would provide
  them feedback of an error to prevent them from going forward with it

* :-1: Error messages are shown but they do not tell the user how to fix the issue.

## Phase 1 consistency

My initial implementation of this UI looked terrible, but had good consistency:

- :+1: Similar actions like purchasing upgrades and buildings follow the same flow (click → update stats).
- :-1: Some UI elements (like buttons vs labels) do not use icons or visual consistency.

* :+1: All buttons in the app had appropriate labels with verbs.

# Phase 2

Here are the major new parts of my interface for phase 2:

![The log in and sign up screen.](phase2-login.png)

Here's the main UI as I submitted it for phase 2:

![Phase 2 screenshot.](phase2.png)

## Changes from phase 1

- The main change I made from phase 1 to phase 2 was implementing a brand new UI and a login system.

## Phase 2 visibility

- :-1: It wouuld not highlight what actions were currently unavailable at the current point.
  It would still show all disabled actions

## Phase 2 feedback

- :-1: The system does not indicate when it is processing an action (no loading or progress indicator).
- :-1: Game does not provide clear feedback for when upgrades or buildings are purchased.
  The stats associated show an increase but no clear notifications.

## Phase 2 consistency

My initial implementation of this UI looked terrible, but had good consistency:

- :+1: All similar actions have a similar state of flow.
- :+1: My input fields have clear labels and ask for input there
- :+1: All buttons have verbs and labels attached to them describing what they do.

## How I might change my UI

- I would want to make unavailable actions translucent so that the user can know they are blocked out.
- I would add a notification for when upgrades are purchased and show a success/fail notification for them.
