import React from "react";

const ControlArea = ({ state }: any) => (
  <React.Fragment>
    {/* Scores floated to the left */}
    <div style={{ float: "left", width: "130px" }}>Your Score: </div>
    <div>{state.scores.player}</div>
    <div style={{ float: "left", width: "130px" }}>Opponents Score: </div>
    <div>{state.scores.opponent}</div>
    <br />
    <hr style={{ width: "75%", textAlign: "center" }} />
    <br />

    {/* Conditional rendering for Game State Messages */}
    {state.gameState === "awaitingOpponent" && (
      <div
        style={{ color: "#ff0000", fontWeight: "bold", textAlign: "center" }}
      >
        Waiting for Opponent to join
      </div>
    )}

    {state.gameState === "deadEnd" && (
      <div
        style={{ color: "#ff0000", fontWeight: "bold", textAlign: "center" }}
      >
        You have no moves left.
        <br />
        <br />
        Waiting for Opponent to finish.
      </div>
    )}

    {state.gameState === "cleared" && (
      <div
        style={{ color: "#ff0000", fontWeight: "bold", textAlign: "center" }}
      >
        Congratulations!
        <br />
        <br />
        You've cleared the board!
        <br />
        <br />
        Waiting for Opponent to finish.
      </div>
    )}

    {state.gameState === "gameOver" && (
      <div
        style={{ color: "#ff0000", fontWeight: "bold", textAlign: "center" }}
      >
        GAMEOVER!
        <br />
        <br />
        {state.gameOutcome}
      </div>
    )}
  </React.Fragment>
);

export default ControlArea;
