const puzzleContainer = document.querySelector(".puzzle-container");
const tiles = Array.from(puzzleContainer.children);
const shuffleButton = document.getElementById("shuffle-btn");

// Find the index of the empty tile in the tiles array
let emptyTileIndex = tiles.findIndex((tile) =>
  tile.classList.contains("empty")
);

// Directions for tile movement (up, down, left, right)
const directions = {
  up: -4,
  down: 4,
  left: -1,
  right: 1,
};

const getValidMoves = (index) => {
  const row = Math.floor(index / 4);
  const col = index % 4;
  const validMoves = [];

  if (row > 0) validMoves.push("up"); // can move up in not in the first row
  if (row < 3) validMoves.push("down"); // can move down if not in the last row
  if (col > 0) validMoves.push("left"); // can move left if not in the first column
  if (col < 3) validMoves.push("right"); // can move right if not in the last column

  return validMoves;
};

// Swap the empty tile with another
const swapTiles = (tileIndex) => {
  const emptyTile = tiles[emptyTileIndex];
  const clickedTile = tiles[tileIndex];

  // Check for invalid tile indices
  if (!emptyTile || !clickedTile) {
    console.error(
      `Invalid tile indices: emptyTileIndex = ${emptyTileIndex}, tileIndex = ${tileIndex}`
    );
    return; // Exit early if the tiles are invalid
  }

  // Swap the content
  const temp = emptyTile.innerHTML;
  emptyTile.innerHTML = clickedTile.innerHTML;
  clickedTile.innerHTML = temp;

  // Update the class to reflect empty tile position
  emptyTile.classList.remove("empty");
  clickedTile.classList.add("empty");

  // Update the empty tile index
  emptyTileIndex = tileIndex;
};

// Handle tile clicks
const handleTileClick = (event) => {
  const clickedTile = event.target;

  if (
    !clickedTile.classList.contains("tile") ||
    clickedTile.classList.contains("empty")
  )
    return;

  const clickedTileIndex = tiles.indexOf(clickedTile);
  const validMoves = getValidMoves(emptyTileIndex);

  if (
    validMoves.some(
      (direction) => directions[direction] + emptyTileIndex === clickedTileIndex
    )
  ) {
    swapTiles(clickedTileIndex);
    checkWin();
  }
};

// Shuffle the puzzle
const shufflePuzzle = () => {
  const shuffleTimes = 100;
  let currentTileIndex = emptyTileIndex;

  for (let i = 0; i < shuffleTimes; i++) {
    const validMoves = getValidMoves(currentTileIndex);
    const randomDirection =
      validMoves[Math.floor(Math.random() * validMoves.length)];
    currentTileIndex += directions[randomDirection];
    const newTileIndex = currentTileIndex + directions[randomDirection];

    // check if the new index is within bounds and is a valid move
    if (newTileIndex >= 0 && newTileIndex < tiles.length) {
      currentTileIndex = newTileIndex;
      swapTiles(currentTileIndex);
    }
    swapTiles(currentTileIndex);
  }
};

// Check if the puzzle is solved
const checkWin = () => {
  const isSolved = tiles.every((tile, index) => {
    if (tile.classList.contains("empty")) return true;
    return parseInt(tile.innerHTML, 10) === index + 1;
  });

  if (isSolved) {
    alert("You solved the puzzle!");
  }
};

// Set up event listeners
tiles.forEach((tile) => tile.addEventListener("click", handleTileClick));
shuffleButton.addEventListener("click", shufflePuzzle);
