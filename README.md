# Finance Manager

![C#](https://img.shields.io/badge/Language-C%23-blue)
![.NET](https://img.shields.io/badge/.NET-10.0-purple)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
[![Finance Manager CI](https://github.com/bakunp/FinanceManager/actions/workflows/dotnet.yml/badge.svg?branch=master)](https://github.com/bakunp/FinanceManager/actions/workflows/dotnet.yml)

My personal savings management app. It started as a C# console project and grew into a full web app with a REST API and a React frontend over time.

Live here 👉 **[finance.wilcza.ovh](https://finance.wilcza.ovh)**

## What does it do?

The main idea — you get paid, enter the amount, and the app automatically distributes it across your savings goals based on priorities (e.g. a critical goal gets proportionally more than a low-priority one). You can also manually deposit into a specific goal.

On top of that:
- Create and manage goals with priorities and deadlines
- Automatic priority boost when a deadline is approaching
- Track fixed expenses (rent, subscriptions, etc.)
- Transaction history for each goal
- Google login

## How it's built

```
FinanceManager.Core          # domain models, calculation logic
FinanceManager.Data          # EF Core + SQLite
FinanceManager.Application   # services (GoalManager, FundManager, etc.)
FinanceManager.API           # REST API in ASP.NET Core
FinanceManager.UI            # frontend in React + Vite
FinanceManager.Tests         # tests (xUnit + Moq)
```

Layered architecture — Core doesn't know about the API, Application doesn't know about the UI, everything communicates through interfaces and DI.

## Tests

51 tests, all passing. CI runs build + tests on every push to master.


## Running it

**Docker (easiest):**
```bash
docker-compose up -d
```

**Locally:**
```bash
# backend
dotnet run --project FinanceManager.API

# frontend
cd FinanceManager.UI && npm install && npm run dev
```

## Tech stack

**Backend:** C#, .NET 10, ASP.NET Core, Entity Framework Core, SQLite  
**Frontend:** React, Vite, TypeScript  
**Auth:** Google OAuth 2.0, JWT  
**Infra:** Docker, Nginx, GitHub Actions  
**Tests:** xUnit, Moq, EF InMemory

## About the project

I wrote the backend myself — from the domain models, through the automatic fund distribution logic, to the REST API with JWT auth.

The frontend (and readme :D ) was mostly built with the help of vibe-coding — I focused more on the backend and architecture side of things.

Code review of the repo was done with the help of Claude.
