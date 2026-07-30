# Memory Card Game

## Business Requirements

- An MVP of a memory card game with futuristic cyberpunk style 
- The web app should only have 2 pages, a presentation, with rankings and the actual game page
- The game should follow the overall structure of the current version
- For the card ui and visual use the design.md for colors but for the images search for an open source cyberpunk cute figures that fits the card design
- Add effects when the user gets a combination right
- Calculate the points based on the speed and number of errors. 
- No more functionality: no archive, no search/filter. Keep it simple.
- The priority is a slick, professional, gorgeous UI/UX with very simple features
- For storing ranking data look for a public nosql database like firebase


## Technical Details

- Implemented as a modern NextJS app, client rendered
- The NextJS app should be created in a subdirectory `frontend`
- Persist users score somewhere in the internet
- No user management for the MVP
- Use popular libraries
- As simple as possible but with an elegant UI

## Color Scheme

- use the DESIGN.MD from the root folder

## Strategy

1. Write plan with success criteria for each phase to be checked off. Include project scaffolding, including .gitignore, and rigorous unit testing.
2. Execute the plan ensuring all critiera are met
3. Carry out extensive integration testing with Playwright or similar, fixing defects
4. Only complete when the MVP is finished and tested, with the server running and ready for the user

## Coding standards

1. Use latest versions of libraries and idiomatic approaches as of today
2. Keep it simple - NEVER over-engineer, ALWAYS simplify, NO unnecessary defensive programming. No extra features - focus on simplicity.
3. Be concise. Keep README minimal. IMPORTANT: no emojis ever

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
