---
title: Bad Code Clicker
author: Moulik Bhatia (bhatiam3@myumanitoba.ca)
date: March 30 2026
---

# Overview

Bad Code Clicker is a simple clicker game created for
COMP 2452. The player clicks on an item to generate Bad Code and can
purchase upgrades to increase their terrible coding power. They can now also purchase buildings
that emulate an autoclicker

# Markov Chain and Data Model

To generate the Markov chain model, run:

```
npm run train
```

This reads from: `src/training/data.csv`

and creates: `src/training/model.json`

### How It Works

The training script looks at sequences of letters (a to j) in the CSV file and figures out how often one letter follows another.

It uses two arrays:

A 2D array (numerator) to count how many times each transition happens (like a → b)
A 1D array (denominator) to count total transitions from each letter

Then it converts those counts into probabilities.

Output Format

The output file (model.json) looks like this:

```
{
"a": { "b": 0.6, "c": 0.4 },
"b": { "c": 1.0 }
}
```

The app loads this file when it starts and uses it to decide what the next item should be (used in robobuy).

# Running the project

This project is implemented using TypeScript and built with Vite. To run enter the following command

```

npx vite

```

# Test Harness , Suite and coverage

The test harness for this project is implemented using Vitest. To run enter the following command

```

npx vitest

```

To check the testing coverage

```

npx vitest --coverage

```

# Design documentation

The design artifacts for Phase 3 can be found here:

- **Domain model:** `domain.md`
- **Flows of interaction:** `flows.md`
- **REPL Database:** `create-tables.sql`
- **UI Assessment:** `ui-assessment.md`
