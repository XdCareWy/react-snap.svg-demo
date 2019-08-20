import React, { Component, Fragment } from "react";
import "./index.css";
import { TYPE, data } from "./data1";

const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

const reactWidth = 40;
const reactHeight = 20;
const reactBorderRadius = 6;

class IndexSvg extends Component {
  componentDidMount() {
    this.renderSvg(data);
  }

  renderSvg = data => {
    const svg = Snap("#svgId");
    const rectTextE = this.paintRectText(svg, 50, 30, "开始");
    // 鼠标放上去展示小手
    rectTextE.addClass("cursor-pointer");
    // 添加click事件
    rectTextE.click(function() {
      console.log("in");
    });
  };

  paintRoundRect(svg, x, y) {
    return svg.paper.rect(x - 20, y - 10, reactWidth, reactHeight, reactBorderRadius, reactBorderRadius).attr({
      fill: "white",
      stroke: "black",
      "fill-opacity": 0,
    });
  }

  paintRectText(svg, x, y, text) {
    const textE = this.paintText(svg, x, y, text);
    const rectE = this.paintRect(svg, x, y);
    return svg.paper.g(rectE, textE);
  }

  paintText(svg, x, y, text) {
    return svg.paper.text(x - reactWidth / 2 + 4, y - reactHeight / 2 + 15, text);
  }

  paintRect(svg, x, y) {
    return svg.paper.rect(x - reactWidth / 2, y - reactHeight / 2, reactWidth, reactHeight, 0, 0).attr({
      id: "rect111",
      fill: "white",
      stroke: "black",
      "fill-opacity": 0,
    });
  }

  paintRhombus(svg, x, y) {
    return svg.paper.polyline([x - 20, y, x, y - 10, x + 20, y, x, y + 10, x - 20, y]).attr({
      fill: "white",
      stroke: "black",
      "fill-opacity": 0,
    });
  }

  render() {
    return (
      <Fragment>
        <div
          style={{
            width: 1000,
            height: 200,
            border: "1px solid #dfdfdf",
            margin: "20px 0 0 50px",
          }}>
          <svg id="svgId" width={1000} height={200} />
        </div>
        <div
          style={{
            width: "94px",
            height: "58px",
            left: "240px",
            top: "336px",
            transform: "rotate(0deg)",
          }}
          className="joint-free-transform joint-theme-modern">
          <div draggable="false" className="resize nw" data-position="top-left" />
          <div draggable="false" className="resize n" data-position="top" />
          <div draggable="false" className="resize ne" data-position="top-right" />
          <div draggable="false" className="resize e" data-position="right" />
          <div draggable="false" className="resize se" data-position="bottom-right" />
          <div draggable="false" className="resize s" data-position="bottom" />
          <div draggable="false" className="resize sw" data-position="bottom-left" />
          <div draggable="false" className="resize w" data-position="left" />
        </div>
        <div
          style={{
            width: "90px",
            height: "54px",
            left: "243px",
            top: "339px",
          }}
          className="join-halo">
          <div>
            <div className="remove nw" />
            <div className=" remove1 nw1" />
            <div className=" remove2 nw2" />
            <div className=" remove3 nw3" />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default IndexSvg;
