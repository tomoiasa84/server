# xFriends Apollo Server

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
npm install knex -g
npm install nodemon -g
npm install
```
### Installing

Setting up db connection in knex_migrations/knexfile.js for migrations.

```
development: {
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : your_password,
      database : 'xfriend'
    }
```
Same configuration for db/pgAdaptor.js.

To create data base:

```
knex migrate:latest
```
To populate database:(not yet available)

```
knex seed:run
```

To run server:
```
nodemon index.js

```
