<p align="center">
  <a href="http://localhost:3000">
    <h1 align="center">LittleLives Appointment App</h1>
  </a>
</p>

<p align="center">
  <a aria-label="Github Project" href="https://github.com/satriad1st/littlelives-appointment-app"><img alt="" src="https://img.shields.io/badge/github%20project-121013?style=for-the-badge&logo=github&logoColor=white"></a>
  <a aria-label="App Appointment" href="https://docs.google.com/document/d/1Gjci6ywaRgPT5BWQcmzeevDzp9DjgY23k_Gn_T784uU/edit?tab=t.0"><img alt="" src="https://img.shields.io/badge/Assignment-2CA5E0?style=for-the-badge&logo=docs&logoColor=white"></a>
  <a aria-label="API Documentation" href="http://localhost:3000/api/docs"><img alt="" src="https://img.shields.io/badge/API Documentation-85EA2D?style=for-the-badge&logo=Swagger&logoColor=282828"></a>
  
</p>

## Table of Content

- [Table of Content](#table-of-content)
- [Project Overview](#project-overview)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Environment Variables](#environment-variables)
  - [Seeder DOCUMENTATION](#seeder-documentation)
    - [Ports](#ports)
- [Development](#development)
  - [Use Docker](#use-docker)
  - [Without Docker (Barebones)](#without-docker-barebones)
  - [Documentation](#documentation)
- [Deployment](#deployment)
  - [Runing on your server](#runing-on-your-server)

## Project Overview

This project is built using **TypeScript** and **Express.js** as the backend framework.  
It is designed as a fullstack application, where the backend API can also serve or host a frontend application developed with **Next.js**.

### 📝 Key Design Decisions:

- **Database:**  
  Chosen **MongoDB** for its flexibility, scalability, and schema-less nature, making it easier to adapt to structural changes in the future.

- **Caching with Redis:**  
  Redis has been implemented to cache frequently accessed data, improving response time and reducing unnecessary database queries.  
  Currently, caching is implemented in appointment management and slot configuration retrieval.

- **Authentication & Authorization:**  
  The system uses **JWT** authentication.  
  Only authorized admin users can access and modify critical configurations such as time slots or slot configuration.

- **Appointment Validation:**  
  Appointments are thoroughly validated to ensure:
  - No overlapping schedules
  - No appointments booked outside of allowed slot timeframes
  - The system returns only available time slots dynamically calculated based on the current bookings and configuration.

- **Dockerized Deployment:**  
  The application is fully Dockerized for smooth deployment across environments.

- **Backend Scheduler & Worker Support:**  
  A scheduler and worker system is prepared to handle background jobs, e.g., auto-cancelling appointments if they pass their reserved time slot, or for other automated backend processes.

- **WebSocket Ready:**  
  WebSocket configurations have been pre-set, enabling future real-time features to be integrated seamlessly.

- **Seeder Implementation:**  
  Data seeding has been prepared to initialize database collections conveniently.

- **Enhanced Security:**  
  Security best practices implemented using **CORS**, **mongo-sanitize**, and **helmet** middleware.

- **Frontend (Next.js):**  
  The frontend is built using **Next.js** and is structured with **Tailwind CSS** for styling.  
  It is also configured with **Progressive Web App (PWA)** support, enabling offline capabilities in the future (currently scaffolded and ready for enhancements).

- **Logging & Monitoring:**  
  Application errors are configured to send real-time alerts via a **Discord webhook**, allowing developers to monitor issues proactively.

- **Health Check Endpoints:**  
  Health check endpoints have been implemented to monitor the status of **MongoDB**, **Redis**, and the application server itself, helping ensure operational reliability.

---

This comprehensive setup provides flexibility, scalability, and extensibility while maintaining clean code organization and robust architecture.

## Database Schema
This project uses MongoDB as the primary database.
Below is a brief explanation of each major schema used:

[DB Schema](docs/database.md)

## Getting Started

### Requirements

Please check [docker-compose](docker-compose.yml) for dependent service

- Docker (Optional)
- Node 20+
- Mongo DB 7
- Redis 6.2

> please make sure to run all required service if you want to run wihout docker

### Environment Variables

Copy and rename [.env.example](.env.example) to .env

```sh
cp .env.example .env
```

#### Ports

`APP` running on port `3000`, and API `Webhook` running on port `3000` with `/api/v1` prefix

```sh
#Webapp
WEBAPP_PORT=3000

```

## Seeder DOCUMENTATION
Please run seeder first before using this backend application we need to seed admin data here : 

[Seeder](docs/seeder.md)

### Use Docker

I already set `docker compose` to run development server and all required services

```sh
docker compose watch
```

### Without Docker (Barebones)

Or, run it without docker,
make sure you already intall all the [requirements](#requirements)

Install dependencies : 
```sh
npm install
```

Run application :
```sh
npm run dev
```

if you only need to run web service only (on development)

```sh
npm run dev:web
```

### Documentation

> You can not open documentation when your ENV `APP_ENV` set to `production`

http://localhost:3000/api/docs

For API documentation we use Swagger Docs, you can found the guide how to use it here [Swagger Guide](https://swagger.io/docs/specification/2-0/basic-structure)


## Deployment

### Runing on your server

Build Image

```sh
docker build \
  -f "Dockerfile" \
  -t "littlelives-appointment:latest" \
  --target="production" \
  .
```

Run container using image

```sh
docker run -it --rm \
  --name "littlelives-appointment" \
  -p 3000:3000 \
  -p 3001:3001 \
  --env-file ./.env \
  littlelives-appointment:latest
```

Alternatively, you can run it without docker

Clean install

```sh
npm ci
```

Build application

```sh
 npm run build
```

Starting application

```sh
 npm run start
```
