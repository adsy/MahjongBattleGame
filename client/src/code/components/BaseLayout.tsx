import React, { Component } from "react";

import ControlArea from "./ControlArea";
import PlayerBoard from "./Playerboard";
// import { createState } from "../state";

class BaseLayout extends Component {
  // state = createState(this);

  render() {
    return (
      <div className="appContainer">
        <div className="PlayerBoard">
          <PlayerBoard />
        </div>
        <div className="controlArea">
          <ControlArea />
        </div>
      </div>
    );
  }
}

export default BaseLayout;
