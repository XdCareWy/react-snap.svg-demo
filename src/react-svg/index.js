import React, { Component } from "react";
import data from "./data";
const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

class SvgDemo extends Component {
  componentDidMount() {
    this.renderSvg();
  }

  renderSvg = () => {
    const svg = Snap("#svgId");
    for (let node of data) {
      const { x, y, type, label="" } = node;
      svg.paper.circle(x, y, 5);
      svg.paper.text(x, y, type + label);
    }
  };

  render() {
    return (
      <div
        style={{
          width: 600,
          height: 300,
          border: "1px solid #dfdfdf",
          margin: "20px 0 0 50px"
        }}
      >
        <svg id="svgId" width={600} height={300} />
      </div>
    );
  }
}

export default SvgDemo;
