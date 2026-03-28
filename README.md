# Baden_Hackathon_Tomapo_Backend

# Tomapo Backend

Express.js REST API for the Tomapo food safety app — Lieferketten-Transparenz, Anomalie-Erkennung und Community-Meldungen.

---

## Tech Stack

| Layer | Technologie |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Datenbank | MongoDB + Mongoose |
| Auth | JWT (Access 5h / Refresh 30d) |
| ML Microservice | Python FastAPI (Port 8000, Ollama) |
| Frontend | Swift (iOS) |

---

## Voraussetzungen

- Node.js 18+
- MongoDB (lokal oder Atlas)
- (Optional) Python FastAPI ML-Service auf Port 8000

---

## Setup

```bash
# 1. Dependencies installieren
npm install

# 2. .env Datei erstellen
cp .env.example .env
# Werte in .env anpassen (siehe unten)

# 3. Datenbank befüllen
npm run seed:wipe

# 4. Server starten
npm run dev
```

---

## Umgebungsvariablen

```env
PORT=3000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/tomapo

JWT_ACCESS_SECRET=min_32_zeichen_zufaelliger_string
JWT_REFRESH_SECRET=min_32_zeichen_zufaelliger_string

# Tomapo Intelligence ML Microservice
INTELLIGENCE_URL=http://localhost:8000
```

---

## NPM Scripts

| Script | Beschreibung |
|---|---|
| `npm run dev` | Server mit Nodemon starten (Hot Reload) |
| `npm start` | Server produktiv starten |
| `npm run seed` | Seed-Daten einspielen (nur leere DB) |
| `npm run seed:wipe` | DB leeren und neu befüllen |

---

## API Übersicht

Base URL: `http://localhost:3000/api/v1`

Alle geschützten Endpoints benötigen den Header:
```
Authorization: Bearer <accessToken>
```

| Modul | Basis-Route | Beschreibung |
|---|---|---|
| Auth | `/auth` | Register, Login, Refresh, Logout |
| Traces | `/traces` | Lieferketten-Traces nach Barcode |
| Alerts | `/alerts` | Produkt-Alerts & Rückrufe |
| Products | `/products` | OpenFoodFacts Cache |
| Scan History | `/scan-history` | User Scan-Verlauf |
| Users | `/users` | User-Profilverwaltung |
| User Messages | `/user-messages` | Community-Meldungen |
| Retailers | `/retailers` | Retailer-Profilverwaltung |
| Intelligence | `/intelligence` | ML Anomalie-Erkennung & AI-Chat |

---

## Projektstruktur

```
src/
  config/
    db.js                   # MongoDB Verbindung
  middlewares/
    auth.middleware.js       # JWT protect / authorize
    error.middleware.js      # Globaler Error Handler
  modules/
    auth/
    alert/
    intelligence/
    product/
    retailer/
    scanHistory/
    trace/
    user/
    userMessages/
  seeds/
    seed.js                  # Einstiegspunkt
    User.seed.js
    retailers.seed.js
    trace.seed.js
    elTonyMate.trace.seed.js
    alerts.seed.js
    userMessages.seed.js
    scanHistory.seed.js
    constants.seed.js        # Gemeinsame Konstanten (Barcodes etc.)
  utils/
    appError.util.js
    asyncHandler.util.js
    response.util.js
    token.util.js
  app.js
  server.js
```

---

## Seed-Daten

Nach `npm run seed:wipe` sind folgende Testdaten vorhanden:

**Test-Credentials**
```
User:     max.mueller@example.ch  /  Test1234!
Retailer: info@migros.ch          /  Retailer1234!
```

**Produkte / Traces**

| Produkt | Barcode | Batch |
|---|---|---|
| Coca-Cola Original 500ml | `5449000000996` | `CC-CH-2026-0312` |
| Ovomaltine Pulver 500g | `7610305001002` | `OVO-2026-0301` |
| Migros Vollmilch 1L | `7610815001032` | `MILCH-2026-0320` |
| Lindt Excellence 85% | `3046920028836` | `LINDT-85-2026-0201` |
| El Tony Mate 330ml | `7640150491001` | `L250634716:41` |

---

## Intelligence Modul

Der `/intelligence` Endpoint verbindet sich mit dem Python FastAPI ML-Service:

```
POST /api/v1/intelligence/analyze/:barcode   # Trace analysieren
POST /api/v1/intelligence/chat/:barcode      # AI-Chat (Streaming)
GET  /api/v1/intelligence/health             # ML-Service Health
```

Wenn der ML-Service nicht erreichbar ist, gibt `/analyze` `intelligence: null` zurück — die Trace wird trotzdem ausgeliefert (Graceful Degradation).

---

## Authentifizierung

Das System unterscheidet zwei Rollen:

- **user** — Endnutzer (Swift App)
- **retailer** — Detailhändler (Web-Frontend)

Beide erhalten beim Login ein Access Token (5h) und ein Refresh Token (30d). Über `POST /auth/refresh` kann das Access Token erneuert werden.