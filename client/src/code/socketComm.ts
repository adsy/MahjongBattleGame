import React from "react";

export function createSocketComm(inParentComponent: React.Component) {
  const connection: WebSocket = new WebSocket("ws://localhost:8080");

  connection.onopen = () => {
    console.log("Connection opened to server");
  };

  connection.onerror = (error) => {
    console.log(`Websocket Error: ${error}`);
  };

  connection.onmessage = function (inMessage: any) {
    console.log(`WS receieved: ${inMessage.data}`);
    const msgParts: string[] = inMessage.data.split("_");
    const message: string = msgParts[0];

    switch (message) {
      case "connected": // connected_<pid>
        this.state.handleMessage_connected(msgParts[1]);
        break;

      case "start": // start_<shuffledLayout>
        this.state.handleMessage_start(JSON.parse(msgParts[1]));
        break;

      case "update": // update_<pid>_<score>
        this.state.handleMessage_update(msgParts[1], parseInt(msgParts[2]));
        break;

      case "gameOver": // gameOver_<winnerPID>
        this.state.handleMessage_gameOver(msgParts[1]);
        break;
    }
  }.bind(inParentComponent); /* End message handler. */

  this.send = function (inMessage: string) {
    console.log(`WS sending: ${inmessage}`);
    connection.send(inMessage);
  };

  return this;
}
