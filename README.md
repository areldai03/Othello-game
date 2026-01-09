# GhostXO 👻

### A strategic twist on classic Tic-Tac-Toe with memory and vanishing moves.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

![Game Screenshot](/public/screenshot.png)

## 🎮 Play Now

[**👉 Play GhostXO on GitHub Pages**](https://areldai03.github.io/Othello-game/)

---

## ✨ Features

### 👻 Ghost Mode (The Twist)

The core mechanic that changes everything. In **Ghost Mode**, the number of pieces you can have on the board is limited to the grid size (e.g., 4 pieces on a 4x4 grid).

- **FIFO Mechanic:** Once you exceed the limit, your **oldest piece vanishes**.
- **Strategy:** You must plan not just where to place your next piece, but which of your existing pieces will disappear.
- **Visual Cues:** Pieces about to vanish become translucent, adding tension to every move.

### 🎨 Modern & Responsive Design

- Clean, minimalist aesthetic with a playful ghost mascot.
- Smooth animations for placing and vanishing pieces.
- Fully responsive layout optimized for both desktop and mobile devices.

### 📏 Dynamic Grid Sizes

Choose your battlefield:

- **4x4:** Fast-paced, high-stakes tactical skirmishes.
- **5x5:** A balanced experience requiring foresight.
- **6x6:** Complex strategy on a larger field.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **CI/CD:** GitHub Actions (Automated deployment to GitHub Pages)
- **Environment:** Docker Support

---

## 🚀 Getting Started

Clone the repository and start the development server:

```bash
# Clone the repository
git clone https://github.com/areldai03/Othello-game.git

# Navigate to the project directory
cd Othello-game

# Start the development server
docker compose up -d
```

## 📝 Rules of Engagement

1. **Objective:** Align your pieces (horizontal, vertical, or diagonal) to win.
2. **Setup:**
   - Player 1: **Ghost** (starts first)
   - Player 2: **Normal**
3. **The Ghost Rule:**
   - If playing in Ghost Mode on a grid of size _N_:
   - When you place your _(N+1)th_ piece, your _1st_ piece disappears.
   - Example: On a 4x4 grid, placing your 5th piece removes your 1st piece.

---

Created with 💜 by [areldai03](https://github.com/areldai03) and Mr. gem
