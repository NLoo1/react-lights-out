import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";
import { render } from "@testing-library/react";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=5, ncols=5, chanceLightStartsOn=0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /**
   * Creates a playing board based on ncols and nrows. Lights are randomly lit depending on a randomizer.
   * @returns Object the playing board.
   */
  function createBoard() {
    let initialBoard = [];
    for (let i = 0; i < nrows; i++) {
      initialBoard.push([]);
      for (let b = 0; b < ncols; b++) {
        const isLit = Math.random() < chanceLightStartsOn;
        initialBoard[i].push(isLit);
      }
    }
    return initialBoard;
  }


  /**
   * Checks if user has won game.
   * @returns True if all the cells are off.
   */
  function hasWon() {

    // Filter through the initial board. For each row, check each cell.
    // If ANY cell is t, return false. Else, return true

    for (let row of board) {
      for (let cell of row) {
        if (cell) return false;
      }
    }
    return true;
  }


  /**
   * Flips adjacent cells to select cell to on/off.
   * @param {String} coord Get key of cell to modify it and adjacent cells
   * @returns {Object} New modified board 
   */
  function flipCellsAroundMe(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard

      const newBoard = oldBoard.map(row => [...row]);


      // Flip the cell and adjacent cells
      flipCell(y, x, newBoard);
      flipCell(y + 1, x, newBoard);
      flipCell(y - 1, x, newBoard);
      flipCell(y, x + 1, newBoard);
      flipCell(y, x - 1, newBoard);

      return newBoard
    });
  }

  // if the game is won, just show a winning msg & render nothing else

  if (hasWon()) {
    return <div>You win!</div>;
  }


  return (
    <table className="Board">
      <tbody>
        {board.map((row, y) => (
          <tr key={y}>
            {row.map((isLit, x) => (
              <Cell
                key={`${y}-${x}`}
                isLit={isLit}
                flipCellsAroundMe={() => flipCellsAroundMe(`${y}-${x}`)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  }


export default Board;
