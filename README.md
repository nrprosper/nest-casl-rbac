<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Mini Blog API with Role-Based Access Control (RBAC)

This API combines NestJS, Passport, and CASL to provide secure and flexible access control.

## Environment Configuration

Create a `.env` file based on the `.env.example`:

```bash
APP_PORT=3000

JWT_SECRET=your_jwt_secret_key_here
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_db_username
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=your_db_name
```

## Project setup

```bash
$ pnpm install
```

## Database Setup

### Running Migrations

```bash
# Generate a new migration
$ pnpm run migration:generate db/migrations/MigrationName

# Run pending migrations
$ pnpm run migration:run

# Revert the last migration
$ pnpm run migration:revert
```

## Seeding Data

The project includes seed data for permissions, roles, and users:

```bash
# Seed the database with initial data
$ pnpm run seed
```

### Default Seeded Users

After running the seed command, the following users will be available:

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| admin@example.com | admin123 | super_admin | Full system access |
| moderator@example.com | moderator123 | moderator | Content management |
| author@example.com | author123 | author | Content creation |
| user@example.com | user123 | user | Basic access |

### Roles and Permissions

The application implements a Role-Based Access Control (RBAC) system with the following roles and their permissions:

#### Super Admin (`super_admin`)
- Has full access to all system resources (super user)
- Can manage all users, roles, permissions, and blogs

#### Admin (`admin`)
- User Management: Create, read, update, and delete users
- Role Management: Create, read, update, and delete roles
- Permission Management: Read permissions
- Blog Management: Full access to all blogs

#### Moderator (`moderator`)
- User Management: Read users
- Role Management: Read roles
- Blog Management: Full access to all blogs (create, read, update, delete any blog)

#### Author (`author`)
- Blog Management: 
  - Create new blogs
  - Read blogs
  - Update own blogs
  - Delete own blogs

#### User (`user`)
- Blog Management: Read blogs

Each role is assigned specific permissions that define what actions they can perform on different subjects (users, roles, permissions, blogs). The permissions are based on CRUD operations (Create, Read, Update, Delete) and are enforced through the CASL authorization library.

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

