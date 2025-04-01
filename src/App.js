import React, { useState, useEffect } from "react";

const GRID_SIZE = 25; // Adjustable Maze Size
const CELL_SIZE = 30; // Dynamic Cell Size
const EXIT_POSITION = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 };

const generateMaze = () => {
  let maze = Array(GRID_SIZE)
    .fill()
    .map(() => Array(GRID_SIZE).fill(0)); // Remove boundary walls

  for (let i = 1; i < GRID_SIZE - 1; i++) {
    for (let j = 1; j < GRID_SIZE - 1; j++) {
      maze[i][j] = Math.random() > 0.3 ? 0 : 1; // 30% walls
    }
  }
  maze[0][0] = 0; // Start position
  maze[EXIT_POSITION.x][EXIT_POSITION.y] = 0; // Exit position

  let startX = 0,
    startY = 0;
  while (maze[startX][startY] === 1) {
    startX = Math.floor(Math.random() * GRID_SIZE);
    startY = Math.floor(Math.random() * GRID_SIZE);
  }

  return { maze, startX, startY };
};

const MazeGame = () => {
  const [mazeData, setMazeData] = useState(generateMaze);
  const [player, setPlayer] = useState({ x: mazeData.startX, y: mazeData.startY });
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      let newX = player.x;
      let newY = player.y;

      if (e.key === "ArrowUp" && newX > 0 && mazeData.maze[newX - 1][newY] === 0) newX--;
      if (e.key === "ArrowDown" && newX < GRID_SIZE - 1 && mazeData.maze[newX + 1][newY] === 0) newX++;
      if (e.key === "ArrowLeft" && newY > 0 && mazeData.maze[newX][newY - 1] === 0) newY--;
      if (e.key === "ArrowRight" && newY < GRID_SIZE - 1 && mazeData.maze[newX][newY + 1] === 0) newY++;

      if (newX !== player.x || newY !== player.y) {
        setPlayer({ x: newX, y: newY });
      }

      if (newX === EXIT_POSITION.x && newY === EXIT_POSITION.y) {
        setGameOver(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, player]);

  return (
    <div className="maze-container">
      <h2>Maze Runner</h2>
      <p className="timer">Time: {time}s</p>
      {gameOver && <h3>You Escaped in {time} seconds!</h3>}
      <div className="maze" style={{ display: "grid" }}>
        {mazeData.maze.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div
                key={j}
                className={`cell ${cell === 1 ? "wall" : "path"} ${
                  player.x === i && player.y === j ? "player" : ""
                } ${i === EXIT_POSITION.x && j === EXIT_POSITION.y ? "exit" : ""}`}
                style={{ width: CELL_SIZE, height: CELL_SIZE, transition: "all 0.2s ease" }}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <style>
        {`
          .maze-container {
            text-align: center;
            font-family: Arial, sans-serif;
            outline: none;
          }
          .timer {
            font-size: 20px;
            color: red;
            font-weight: bold;
          }
          .maze {
            display: grid;
            justify-content: center;
          }
          .row {
            display: flex;
          }
          .cell {
            width: ${CELL_SIZE}px;
            height: ${CELL_SIZE}px;
          }
          .wall {
            background: linear-gradient(to bottom right, black, grey);
          }
          .path {
            background-color: white;
          }
          .player {
            background-color: rgba(0, 0, 255, 0.6);
            transition: transform 0.2s ease;
            transform: scale(1.1);
            position: absolute;
            width: ${CELL_SIZE}px;
            height: ${CELL_SIZE}px;
          }
          .exit {
            background-color: red;
          }
        `}
      </style>
    </div>
  );
};

export default MazeGame;