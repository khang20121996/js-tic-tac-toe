import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
  getCellElementAtIdx,
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
  getCellListElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

// console.log(checkGameStatus(["X", "O", "X", "X", "O", "X", "", "X", "O"]));
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toggleTurn() {
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
  //   update turn on DOM element
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }
}

function updateGameStatus(newStatus) {
  gameStatus = newStatus;
  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) {
    gameStatusElement.textContent = newStatus;
  }
}

function showReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) {
    replayButton.classList.add("show");
  }
}

function hightlightWinCells(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error("Invalid win positions");
  }

  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    cell.classList.add("win");
  }
}

function handleCellClick(cell, index) {
  const isClicked =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  if (isClicked || gameStatus !== GAME_STATUS.PLAYING) return;

  // set selected cell
  cell.classList.add(currentTurn);

  // update cell values
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

  // toggle turn
  toggleTurn();

  // check game status
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      // update game status
      updateGameStatus(game.status);
      // show replay button
      showReplayButton();
      break;
    }

    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      // update game status
      updateGameStatus(game.status);
      // show replay button
      showReplayButton();
      // hightlight win cells
      hightlightWinCells(game.winPositions);
      break;
    }

    default:
      // playing
      break;
  }

  console.log("cell", cell, index);
}

function initCellElementList() {
  // const cellElementList = getCellElementList();
  // cellElementList.forEach((cell, index) => {
  //   cell.addEventListener("click", () => handleCellClick(cell, index));
  // });

  // set index for li element
  const liListElement = getCellElementList();
  liListElement.forEach((cell, index) => {
    cell.dataset.idx = index;
  });

  //   delegation for ul element
  const ulElementList = getCellListElement();
  if (ulElementList) {
    ulElementList.addEventListener("click", (event) => {
      if (event.target.tagName !== "LI") return;

      handleCellClick(event.target, Number.parseInt(event.target.dataset.idx));
    });
  }
}

function initReplayButton() {
  const replayButtonElement = getReplayButtonElement();

  // attach event for replay button
  if (replayButtonElement) {
    replayButtonElement.addEventListener("click", () => {
      currentTurn = TURN.CROSS;
      gameStatus = GAME_STATUS.PLAYING;
      // reset game status
      const gameStatusElement = getGameStatusElement();
      gameStatusElement.textContent = GAME_STATUS.PLAYING;

      // reset current turn
      const currentTurnElement = getCurrentTurnElement();
      currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
      currentTurnElement.classList.add(TURN.CROSS);

      // hidden replay button
      replayButtonElement.classList.remove("show");

      // remove class
      const cellElementList = getCellElementList();
      for (const cellElement of cellElementList) {
        cellElement.classList.remove(TURN.CIRCLE, TURN.CROSS, "win");
      }
      cellValues = cellValues.map((x) => "");
    });
  }
}
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
  // bind click event for all li element
  initCellElementList();

  // bind click event for replay button
  initReplayButton();
})();
