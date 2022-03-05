# QuizzDuell

This project is intended to be a QuizDuell clone:

- At the beginning of a game round the players choose in alternating order the category to which questions are asked.
- Questions are generated from six categories and relate to topics from computer science.

## Functionalities

### Backend

- Login and registration of new users (JWT).
- REST-Api for creating, fetching, updating and deleting entities used in game.
- Websockets for game status updates and messaging between friends.
- Migration of questions from external Api.

### Frontend

- Games in progress are displayed in a list.
- Rounds in pending and completed games are displayed in different colors depending on the number of correct answers.
- Random opponents can be challenged via the "Matchmaking" button.
- Players can change their icon displayed next to their username.
- Friends are displayed in a list and can be searched and added.
- Players can challenge their friends.
- Player statistics like games played, ranking, best category, win ratio are displayed in a dashboard.
- Player statistics can be displayed:
  - win ratio as a pie chart.
  - top ten leaderboard as a bar chart.

## Used technologies

- Docker
- React
- Typescript
- Node.JS
- TypeORM
- Express.js
- Socket.io

## Getting Started

Follow the instructions to set up the system.

### Prerequisites

- Docker and Node.JS must be installed.

### Installation with Docker

Create environment file:

- `cp ./packages/backend/.env.example ./packages/backend/.env`

Install npm packages:

- `docker-compose run backend npm install`

- `cd packages/frontend/`
- `npm i`

Start containers:

- `docker-compose up` / `docker-compose up -d`

Sync database schema:

- `docker-compose exec backend npm run typeorm schema:sync`

Exec migration:

- `docker-compose exec backend npm run typeorm:migration`

Insert fixtures:

- `docker-compose exec backend npm run fixtures`

### How to play a game

- Register a new user or login with an existing account
- Press the "Matchmaking" button to play against a random active player or search for an existing player and challenge them directly

## Credits
- This pproject was created in cooperation with Abdelaziz Akkad, Stephan Harijan, and Rami Souai
- This project is based on the finance-tracker project (https://code.fbi.h-da.de/fbi1483/fwe-ss-20-finance-tracker) by Daniel Schulz, Daniel Wohlfarth, Thomas Sauer.
- The questions are based on: `https://quizapi.io/`

## License

The project is licensed under GPL v.3 (gpl-3.0).
