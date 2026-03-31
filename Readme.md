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

# Dependencies

This project uses Papa Parse for parsing the training data csv file.
We also run on vite-plugin-fs for its extended support and async support.

To install it on your system run :

```
npm install papaparse
npm install vite-plugin-fs

```

# Create Data Model

To create the data model from training data for our markov chain run

```
npm run train

```

This can be used to create one manually!
Otherwise main can create one.

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
- **REPL Database:** 'create-tables.sql'
- **UI Assessment:** 'ui-assessment.md'
