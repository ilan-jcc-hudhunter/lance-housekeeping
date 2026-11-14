# Lance Housekeeping: Swipe to Clean

A frontend prototype of a redesigned **My Work** screen for Lance's housekeeping app. Housekeepers update rooms with one swipe instead of taps and buttons.

> **Testing tip:** type `reset` in the search bar and press **Enter** to reset every room to not started, with no completed or flagged rooms.

## Run it

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173. It's built for phones, so on a computer use your browser's mobile view.

## Why

Housekeepers update dozens of rooms a shift, often one-handed with a cart in tow. The old screen took several taps per room, and the buttons were easy to miss. A swipe is faster, works one-handed, and is hard to trigger by accident.

## What changed

- **Swipe left** to start a room (the timer runs), then swipe left again to finish it. These swipes show **green**.
- **Swipe right** to flag a room you can't clean: Do Not Disturb, Guest Present, Maintenance Issue, or Other with a note. These swipes show **yellow**.
- **One room at a time.** You can't start a second room while one is in progress.
- **Priority.** Each room is High, Medium, or Low based on when the next guest checks in and how dirty the room is. The list is sorted by priority, and you can filter by it.
- **Filters.** High, Medium, Low, Checkout, Refresh. Tap a filter again to clear it.
- **Room details.** Tap any room to see its priority, guest arrival, room type, status, and activity history. Housekeepers can add a note or photos.
- **Done today.** Finished rooms move to a collapsible list, and the screen stays at the top so you can keep working.
- **Quiet feedback.** A small pill such as "103 done" appears for 1.5 seconds.
- **Accessible.** Short swipes snap back, double swipes can't submit twice, and arrow keys work in place of swipes.

## Scope

This is a frontend-only prototype. There's no backend, database, or login. Rooms are sample data held in memory, so refreshing the page resets the board.

Built with React, TypeScript, and Vite.
