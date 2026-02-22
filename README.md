# 💰 Finance Manager

![C#](https://img.shields.io/badge/Language-C%23-blue)
![.NET](https://img.shields.io/badge/.NET-10.0-purple)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)
[![Finance Manager CI](https://github.com/bakunp/FinanceManager/actions/workflows/dotnet.yml/badge.svg?branch=master)](https://github.com/bakunp/FinanceManager/actions/workflows/dotnet.yml)

Aplikacja webowa do zarządzania finansami osobistymi — cele oszczędnościowe, automatyczna dystrybucja funduszy i stałe wydatki.

🌐 **[finance.wilcza.ovh](https://finance.wilcza.ovh)**

---

## ✨ Funkcjonalności

- 🎯 **Cele oszczędnościowe** — tworzenie, edycja, usuwanie celów z priorytetami i terminami
- 💸 **Dystrybucja funduszy** — automatyczny podział środków wg priorytetów lub ręczne przypisanie do celu
- 📊 **Stałe wydatki** — śledzenie cyklicznych zobowiązań finansowych
- 📜 **Historia transakcji** — pełny podgląd wpłat na każdy cel
- 🔐 **Autoryzacja** — logowanie przez Google OAuth + JWT

## 🏗️ Architektura

```
FinanceManager.Core          # Modele domenowe, logika kalkulacji
FinanceManager.Data          # Entity Framework Core + SQLite
FinanceManager.Application   # Warstwa serwisów (managery)
FinanceManager.API           # REST API (ASP.NET Core)
FinanceManager.UI            # Frontend (React + Vite)
FinanceManager.Tests         # Testy jednostkowe (xUnit + Moq)
```

Projekt oparty o **czystą architekturę** z podziałem na warstwy i Dependency Injection.

## 🧪 Testy

Projekt posiada testy jednostkowe pokrywające warstwę Core i Application:

```bash
dotnet test
```

```
Test summary: total: 51, failed: 0, skipped: 0 ✅
```

CI uruchamia build + testy automatycznie na każdym pushu.

## 🚀 Uruchomienie

### Docker (produkcja)
```bash
docker-compose up -d
```

### Lokalnie (dev)
```bash
# Backend
dotnet run --project FinanceManager.API

# Frontend
cd FinanceManager.UI && npm install && npm run dev
```

## 🛠️ Tech Stack

| Warstwa | Technologie |
|---------|------------|
| Backend | C#, .NET 10, ASP.NET Core, Entity Framework Core, SQLite |
| Frontend | React, Vite, TypeScript |
| Auth | Google OAuth 2.0, JWT |
| Infra | Docker, Nginx, GitHub Actions CI |
| Testy | xUnit, Moq, InMemory DB |

## 📝 Informacje o projekcie

- **Backend** — napisany w całości samodzielnie
- **Frontend** — stworzony w większości z pomocą vibe-codingu
- **Code review** — przeprowadzone z pomocą Claude (AI)
