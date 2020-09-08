import React from "react";
import { createSocketComm } from "./socketComm";

interface ISelectedTile {
  layer: number;
  row: number;
  column: number;
  type: number;
}

interface IScores {
  player: number;
  opponent: number;
}

export function createState(inParentComponent: React.Component) {
  return {
    layout: [] as number[][][],
    selectedTiles: [] as ISelectedTile[],
    scores: { player: 0, opponent: 0 } as IScores,
    gameState: "awaitingOpponent" as string,
    gameOutcome: "" as string,
    pid: "" as string,
    socketComm: createSocketComm(inParentComponent) as Function,
    timeSinceLastMatch: 0 as number,

    handleMessage_connected: function (inPID: string) {
      this.setState({ pid: inPID });
    }.bind(inParentComponent),

    handleMessage_start: function (inLayout: number[][][]) {
      this.setState({
        timeSinceLastMatch: new Date().getTime(),
        layout: inLayout,
        gameState: "playing",
      });
    }.bind(inParentComponent),

    handleMessage_update: function (inPID: string, inScore: number) {
      if (inPID !== this.state.pid) {
        const scores: IScores = { ...this.state.scores };
        scores.opponent = inScore;
        this.setState({ scores: scores });
      }
    }.bind(inParentComponent),

    handleMessage_gameOver: function (inPID: string) {
      if (inPID === this.state.pid) {
        this.setState({
          gameState: "gameOver",
          gameOutcome: "*** YOU WON! ***",
        });
      } else {
        this.setState({
          gameState: "gameOver",
          gameOutcome: "*** YOU LOST! ***",
        });
      }
    }.bind(inParentComponent),

    tileClick: function (inLayer: number, inRow: number, inColumn: number) {
      if (this.state.gameState !== "playing") {
        return;
      }
      if (!this.state.canTileBeSelected(inLayer, inRow, inColumn)) {
        return;
      }
    },

    canTileBeSelected: function (
      inLayer: number,
      inRow: number,
      inColumn: number
    ): boolean {
      return (
        (inLayer == 4 ||
          this.state.layout[inLayer + 1][inRow][inColumn] <= 0) &&
        (inColumn === 0 ||
          inColumn === 14 ||
          this.state.layout[inLayer][inRow][inColumn - 1] <= 0 ||
          this.state.layout[inLayer][inRow][inColumn + 1] <= 0)
      );
    }.bind(inParentComponent),
  };
}
