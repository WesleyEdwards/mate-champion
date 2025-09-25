# Technical Details

## Requirements

### Frontend
- Users can play the game in the browser
- Authentication, letting players create accounts
- Game State & Stats displayed
- Caching, including saving created levels locally until users create an account
- Several different pages (Home, Profile, Playing, Editing, etc.)

### Backend
- Secure Authentication
- Data Storage
- Outgoing emails (for Auth)
- Unit Tests for reliability

### Game Engine
- Run core game mechanics on frontend
- Collision detection
- Asset/Text rendering
- Manage level state (entities, camera, score, etc)
- Update Frontend UI to reflect state

### Level Editor
- Allow creation and editing of levels
- Provide undo/redo via a command stack
- Update the UI live as changes are made
- Seamless ability to preview/test changes
- Allow users to control visibility of levels (public/private)

### Hosting
- Ensure the web app is accessible
- Server & Database securely hosted


## Architecture

### Frontend
- Framework: [React](https://react.dev/) ([TypeScript](https://www.typescriptlang.org/))
- UI Library: [Joy UI](https://mui.com/joy-ui/getting-started/)
- Routing: [React Router DOM](https://reactrouter.com/en/main)
- Authentication: JWTs

### Backend
- Framework: [Simply Served](https://www.npmjs.com/package/simply-served) (Node.js)
- Email Service: [Mailjet](https://www.mailjet.com/)
- Database: [MongoDB](https://www.mongodb.com/)
- Data Validation: [Zod](https://zod.dev/)
- Testing: [Jest](https://jestjs.io/)

### Game Engine
- Step driven Game engine
- Use elements of Entity Component System (ECS)
- JS Mixins for Class Composition
- Uses callback functions to update UI

### Level Editor
- Update Level state based on User I/O
- Undo & Redo Command Stack
- Debounced Saving to DB (or locally if not authenticated)

### Hosting
- Frontend: [Firebase Hosting](https://firebase.google.com/products/hosting)
- Backend: [Firebase Functions](https://firebase.google.com/products/functions) (Serverless)
- Database: [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud Hosting)


## TODO
- Self hosting
- Sounds effects
- Pure ECS
- Enhanced Level design
- More level content, more variation
- More thought-out customization options for the Level Editor
- Multiplayer option

## Lessons learned
- Scope creep can be fun!
- In some way, OTPs are just easier than passwords
- Not cleaning up event listeners leads to pain
- Researching level design and game architecture prior to starting would've been beneficial
- A functional game engine would be so awesome. But not practical
