# Mate Champion🧉

What started as an exploratory look into simple game mechanics morphed into a large, multi-faceted web project.

Yes, this is a game. A pretty standard platformer. But Mate Champion also includes a flexible level-editor where users can create, test, share, and view levels they and others have created, while ensuring privacy and security.

## Level Editor

👉[Create your own level](http://localhost:3000/levels?view=mine)!

The Mate Champion level editor is available to everyone, you don't even need to create an account to try it out.

The level editor allows users to create, move, and customize entities, including the following:

- Floor (Resize)
- Platforms (Resize & Change Color)
- Enemies (Change Speed, Jump behavior & Turn behavior)
- Ammo (Move)

## Game Design

Mate Champion follows the Entity-Component-System (ECS) Architecture, which has proved to provide needed flexibility and cleanliness.

TypeScript offers great tooling, Mixins and Classes, which have proven to be powerful.

## Server

Mate Champion uses a [simply-served](https://www.npmjs.com/package/simply-served), which is a Node framework built to speed up server development.

## Security

Users are invited to create accounts when they achieve a high score or create a level. Previously, Mate Champion used Passwords as the sole method of authentication, but switched to Email OTPs, because why not?

## Database

Users, Levels, High-scores and other data are stored in a Mongo database, hosted by Atlas
