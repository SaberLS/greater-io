# Greater IO

A web-based application for solving mathematical tasks with a real-time PvP
competition mode.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)

---

## Overview

**Greater IO** is an interactive educational web application designed to enhance
mathematical skills through competitive gameplay. The system combines the
advantages of gamification with immediate feedback, promoting engagement and
regular practice. Users can participate in real-time PvP matches, solve tasks,
and track their performance through a ranking system.

The project demonstrates the practical use of web technologies to create a
dynamic learning environment that is both educational and motivating.

---

## Features

- **User Authentication:** Secure login with JWT tokens.
- **Lobby System:** Create or join game lobbies with unique identifiers.
- **Real-Time PvP Gameplay:** Players compete in solving math tasks
  simultaneously.
- **Responsive UI:** Works on modern browsers (Chrome, Firefox, Edge).

  ### Work in progress

- **Task Generation:** Automated creation of mathematical problems for each game
  session.
- **Immediate Feedback:** Instant correctness evaluation and score updates.
- **Leaderboard:** Rankings generated based on accuracy and response time.
- **Scalable Architecture:** Designed to handle multiple concurrent users
  efficiently.

---

## Architecture

The system follows a **client–server architecture**:

- **Frontend:** React-based web application providing the UI and real-time
  updates.
- **Backend:** Node.js server handling authentication, lobby management, game
  logic, and real-time communication.
- **Database:** MongoDB (planned, not yet implemented) – intended for storing
  user data, game history, and statistics.

Communication is handled through:

- **REST API:** For transactional and administrative operations (login, fetching
  user data).
- **WebSocket (Socket.IO):** For real-time game state synchronization and PvP
  interactions.

The architecture ensures separation of concerns, making the system maintainable,
scalable, and modular.

---

## Technologies

- **Frontend:** React, CSS Modules, WebSockets
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (planned, not implemented yet)
- **Authentication:** JWT tokens
- **Real-Time Communication:** Socket.IO
- **Testing:** Unit and integration tests for both server and client

---

## Requirements

Before running the project, make sure your environment meets the following
requirements:

- **Node.js:** v24.11.1 (LTS)
- **Package Manager:** pnpm v10.29.1
- **Frontend TypeScript Target:** ES2022
- **Backend Build Target:** Node 20

> **Note:** Although Node 24 is being used locally, the backend is compiled to
> Node 20 syntax to ensure compatibility with environments supporting Node 20+.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/SaberLS/greater-io.git
cd greater-io
```

2. [**Ensure you meet the requirements listed above**](#requirements).

3. Install dependencies for server and client:

```bash
pnpm install
```

Configure environment variables (optional for now, as DB is not yet
implemented):

```env
# client/.env
VITE_SERVER_URL=<server_url>
```

```env
# server/.env
PORT=<server_port>
NODE_ENV=<development | production>
NODE_OPTIONS=--experimental-vm-modules
JWT_SECRET=<jwt_secret>
CLIENT=<client_url>
TOKEN_EXPIRE_TIME=<token_expire_time eg. 1h>
```

---

## Usage

```bash
pnpm dev
```

Open your browser and navigate to http://localhost:5173 to start using the
application.

> **Note:** Persistent storage and user statistics are not yet implemented.
> Currently, all data is kept in-memory.

### Tests

```bash
pnpm test
```
