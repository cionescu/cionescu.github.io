---
publishDate: 2020-10-31T00:00:00Z
title: How to Create the Initial Postgresql Database?
excerpt: "You just installed PostgreSQL and attempt to run psql and get the following error: FATAL:  database 'user' does not exist. Here's how to fix it"
tags:
  - postgresql
category: Today I Learned
---

## How to Install PostgreSQL

You can use **brew** to install PostgreSQL:

```bash
  $ brew install postgresql
```

## Start the process

You can use brew services to manage your processes like this:

```bash
  $ brew services start postgresql
```

## Create the initial database

If you try starting the PostgreSQL console (using `psql`) and get the following error:

```bash
  psql: error: could not connect to server: FATAL:  database "user" does not exist
```

then you need to create the initial database using:

```bash
  $ createdb
```
