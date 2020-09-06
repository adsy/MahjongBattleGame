import React, { CSSProperties, ReactElement } from "react";

// App imports.
import tile101 from "../../img/tile101.png";
import tile102 from "../../img/tile102.png";
import tile103 from "../../img/tile103.png";
import tile104 from "../../img/tile104.png";
import tile105 from "../../img/tile105.png";
import tile106 from "../../img/tile106.png";
import tile107 from "../../img/tile107.png";
import tile108 from "../../img/tile108.png";
import tile109 from "../../img/tile109.png";
import tile110 from "../../img/tile110.png";
import tile111 from "../../img/tile111.png";
import tile112 from "../../img/tile112.png";
import tile113 from "../../img/tile113.png";
import tile114 from "../../img/tile114.png";
import tile115 from "../../img/tile115.png";
import tile116 from "../../img/tile116.png";
import tile117 from "../../img/tile117.png";
import tile118 from "../../img/tile118.png";
import tile119 from "../../img/tile119.png";
import tile120 from "../../img/tile120.png";
import tile121 from "../../img/tile121.png";
import tile122 from "../../img/tile122.png";
import tile123 from "../../img/tile123.png";
import tile124 from "../../img/tile124.png";
import tile125 from "../../img/tile125.png";
import tile126 from "../../img/tile126.png";
import tile127 from "../../img/tile127.png";
import tile128 from "../../img/tile128.png";
import tile129 from "../../img/tile129.png";
import tile130 from "../../img/tile130.png";
import tile131 from "../../img/tile131.png";
import tile132 from "../../img/tile132.png";
import tile133 from "../../img/tile133.png";
import tile134 from "../../img/tile134.png";
import tile135 from "../../img/tile135.png";
import tile136 from "../../img/tile136.png";
import tile137 from "../../img/tile137.png";
import tile138 from "../../img/tile138.png";
import tile139 from "../../img/tile139.png";
import tile140 from "../../img/tile140.png";
import tile141 from "../../img/tile141.png";
import tile142 from "../../img/tile142.png";
import { render } from "react-dom";

const Playerboard = ({ state }: any) => {
  const tileWidth: number = 72;
  const tileHeight: number = 88;
  const tileShadowWidth: number = 11;
  const tileShadowHeight: number = 11;

  const xAdjust: number = 10;
  const yAdjust: number = 36;

  const tiles: ReactElement[] = [];

  let xOffset: number = 0;
  let yOffset: number = 0;

  for (let l: number = 0; l < state.layout.length; l++) {
    xOffset = xOffset + tileShadowWidth;
    yOffset = yOffset + tileShadowHeight;
    const layer: number[][] = state.layout[l];

    for (let r: number = 0; r < layer.length; r++) {
      const row: number[] = layer[r];
      for (let c: number = row.length; c >= 0; c--) {
        let tileVal: number = row[c];
        if (tileVal > 0) {
          const xLoc: number =
            c * tileWidth - c * tileShadowWidth + xOffset + xAdjust;
          const yloc: number =
            r * tileHeight - c * tileShadowHeight + yOffset + yAdjust;
        }
      }
    }
  }
};

export default Playerboard;
