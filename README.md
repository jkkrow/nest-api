<div align="center">
  <a href="https://watchtree.net">
    <img src="https://raw.githubusercontent.com/jkkrow/watchtree-next-client/main/public/readme.png" alt="WatchTree - A Video Streaming Platform for Enthusiastic Creators">
  </a>
  <h1 align="center">WatchTree</h1>
  <p align="center">
    A Video Streaming Platform for Enthusiastic Creators.
  </p>
  <a href="https://watchtree.net">
    <strong>Explore the website »</strong>
  </a>
  <br />
  <a href="https://github.com/jkkrow/watchtree-next-client">Client</a>
  ·
  <a href="https://github.com/jkkrow/watchtree-nest-api">Server</a>
</div>

# WatchTree - API

WatchTree is a video streaming platform that provides video-on-demand (VOD) services. This document describes the features of the REST API, which is built with NestJS and serves as the backend of WatchTree.

## About

This project was born out of my passion for full-stack web development, and my desire to bring my envisioned idea to life, transforming it from a mere concept into a tangible reality, by using the knowledge that I've learned. Initially built using the MERN stack (React, Express, NodeJS, MongoDB), I decided to take it to the next level by rebuilding it with different tech stacks, incorporating advanced techniques, cleaner code, and improved structure that adhere to best practices.

At its core, this website is a video streaming platform that offers a unique user experience through its tree-structured video format. This format allows users to actively engage with the content by selecting their desired path as they watch, effectively personalizing their viewing experience. Content creators can leverage this interactive format to produce captivating stories that unfold in multiple directions, offering viewers a truly immersive experience.

With the goal of making video streaming more dynamic and engaging, this platform encourages active viewer participation and fosters deeper connections between creators and their audience. By showcasing the potential of the tree-structured video format, this project aims to inspire creative and innovative content that pushes the boundaries of traditional video streaming.

Whether you're a developer interested in the technical aspects, a content creator seeking new ways to tell stories, or a viewer looking for an interactive experience, this project can offer a fresh perspective on the world of video streaming.

## Key Features

WatchTree provides following core features:
1. **Video Streaming:** Allows users to stream on-demand videos (VOD) in various resolutions which can adapt to user's network environment.
2. **Video Uploading + Processing:** Allow users to upload videos, which are processed in a serverless backend to convert them into streamable formats (CMAF). This enables the platform to support a wide range of video formats.
3. **Authentication and Authorization:** Provides a fully functioning authentication and authorization system that uses JSON Web Tokens (JWT) with refresh token and access token lifecycles. The refresh token rotation technique is also implemented for better security.
4. **Searching:** With the Full-Text Search integration, it allows users to search videos by title, categories, description, or creator name.
5. **Pagination:** Supports pagination in both offset based and cursor based when fetching plural resources.
6. **Scalability:** Deployed in serverless using AWS Lambda + API Gateway. This serverless approach allows the platform to scale to accommodate increasing numbers of users and video content.
7. **Webhooks:** Uses webhooks for various functionalities such as event notification or sending & bouncing email.

## Development and Testing Features

WatchTree API has following development and testing features:
1. **Domain Driven Development + CQRS:** WatchTree adopts Domain Driven Development (DDD) with CQRS pattern to make a highly scalable application. This makes the code more maintanable, and allows the API to scale flexibly as the functionality and route increases. Also, it is possible to separate database by its purpose (Query and Command).
2. **Automated Testing and Deployment:** WatchTree has an automated unit testing and CI/CD workflow that enables the API to be deployed to AWS Lambda using the serverless framework. This ensures that the platform is always up-to-date with the latest features and bug fixes.
3. **Environment Separation:** WatchTree is split into three different environments - development, production, and testing - to ensure that each environment is independent of the others.
4. **Seeding:** The platform also supports seeding, which enable developers to set up the database with test data for a better testing and development workflow.


## Technologies Used

WatchTree is built using the following tech stacks:
- Typescript
- NodeJS
- Express
- NestJS
- Postgres
- TypeORM
- Redis
- PayPal
- Postmark
- AWS S3
- AWS MediaConvert
- AWS CloudFront
- AWS Lambda
- and more.

## Getting Started

To get started locally, you need to have the following software installed:
- pnpm
- NodeJS
- PostgreSQL
- Redis
- (optional) Docker

#### Install dependencies
```bash
pnpm install
```

#### Configure Environment Variables
Before running the server, you need to setup environment variables. Create a `.env` file and write required environment variables. You can find the list of environment variables in [this file](src/config/schemas/config.schema.ts).

#### Configure Database
After configuring environment variables, to setup your Postgres database, run the following command:
```base
pnpm migration:up
```

If you want to populate some dummy data for testing, you can run the following command:
```bash
pnpm seed:run
```

#### Configure Redis
You also need to have a Redis instance to run the server. If you have a Redis Docker container, you can simply run the following command:
```base
pnpm redis:run:local
```

#### Start Server
```bash
pnpm dev
```

#### Start Server with Serverless Framework
```bash
pnpm serverless
```

#### Testing
WatchTree API uses Jest library for testing. To execute a unit test, run the following command:
```bash
pnpm test:watch
```

## Swagger API Documentation

WatchTree's API is documented using Swagger. The Swagger UI allows users to explore and test the API endpoints. You can view the Swagger documentation for WatchTree's REST API at [https://api.watchtree.net/api](https://api.watchtree.net/api).
