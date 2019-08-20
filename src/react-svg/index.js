import React, { Component } from "react";
import data from "./data";
import "./index.css";

const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

class SvgDemo extends Component {
  componentDidMount() {
    this.renderSvg(data);
  }


  renderSvg = data => {
    const svg = Snap("#svgId");
    // svg.paper.path("M10 200 C10 110,180 110,180 20").attr({
    //   stroke: "#000",
    //   strokeWidth: 5,
    //   fill: "white",
    //   "fill-opacity": 0
    // })
    for (let node of data) {
      const { id, x, y, type, label = "", next, success, fail } = node;
      svg.paper.circle(x, y, 3);

      // 连线
      if (next) {
        const { x: subX, y: subY } = data.find(item => item.id === next);
        svg.paper.path(`M${x} ${y}L${subX} ${subY}`).attr({
          stroke: "black",
          strokeWidth: 1,
        });
      }
      if (success) {
        const { x: subX, y: subY } = data.find(item => item.id === success);
        svg.paper.text(Math.abs(x-subX)/2+x, y-3, "T");
        svg.paper.path(`M${x} ${y}L${subX} ${subY}`).attr({
          stroke: "black",
          strokeWidth: 1,
        });
      }
      if (fail) {
        const { x: subX, y: subY } = data.find(item => item.id === fail);
        svg.paper.text(x + 3, Math.abs(y - subY) / 2 + y, "F");
        svg.paper.path(`M${x} ${y}L${subX} ${subY}`).attr({
          stroke: "black",
          strokeWidth: 1,
        });
      }
      if (type === "switch") {
        // 画菱形
        const c = this.paintRhombus(svg, x, y);
        let t;
        c.hover(
          function(e) {
            this.addClass("cursor-pointer");
            t = this.paper.text(x - 5, y - 10, id + label);
          },
          function() {
            t.remove();
          }
        );
      } else if (["end", "start"].includes(type)) {
        // 画圆角矩形
        const c = this.paintRoundRect(svg, x, y);
        let t;
        c.hover(
          function(e) {
            t = this.paper.text(x - 5, y - 10, id + label);
          },
          function() {
            t.remove();
          }
        );
      }
      // 画title
      // svg.paper.text(x-5, y-10, id + label);
      this.drawArrow(svg, 120, 100, 120, 150, 35, 7)
    }
  };

  drawArrow(svg, fromX, fromY, toX, toY, theta, headlen=7) {
    const angle = (Math.atan2(fromX - toX, fromY - toY) * 180) / Math.PI;
    const angle1 = ((angle + theta) * Math.PI) / 180;
    const angle2 = ((angle - theta) * Math.PI) / 180;
    const [topX, topY] = [
      headlen * Math.cos(angle1),
      headlen * Math.sin(angle1)
    ];
    const [bottomX, bottomY] = [
      headlen * Math.cos(angle2),
      headlen * Math.sin(angle2)
    ];
    console.log(topX)
    svg.paper.polyline([fromX, fromY, toX, toY]).attr({
      stroke: "black"
    })
    svg.paper.polyline([topX+toX, topY+toY, toX, toY, bottomX+toX, bottomY+toY, topX+toX, topY+toY]).attr({
      stroke: "black"
    })
  }

  /**
   * 绘制 圆角矩形
   * @param svg
   * @param x
   * @param y
   */
  paintRoundRect(svg, x, y) {
    return svg.paper.rect(x - 20, y - 10, 40, 20, 6, 6).attr({
      fill: "white",
      stroke: "black",
      "fill-opacity": 0,
    });
  }

  /**
   * 绘制 矩形
   * @param svg
   * @param x
   * @param y
   */
  paintRect(svg, x, y) {
    const reactWidth = 40;
    const reactHeight = 20;
    return svg.paper.rect(x - reactWidth / 2, y - reactHeight / 2, reactWidth, reactHeight, 0, 0).attr({
      fill: "white",
      stroke: "black",
      "fill-opacity": 0,
    });
  }

  /**
   * 绘制 菱形
   * @param svg
   * @param x
   * @param y
   */
  paintRhombus(svg, x, y) {
    return svg.paper.polyline([x - 20, y, x, y - 10, x + 20, y, x, y + 10, x - 20, y]).attr({
      fill: "white",
      stroke: "black",
      "fill-opacity": 0,
    });
  }

  paintRhomboid(svg, x, y) {
    svg.paper.polyline([x - 20, y, x, y - 10, x + 20, y, x, y + 10, x - 20, y]).attr({
      fill: "white",
      stroke: "black",
      "fill-opacity": 0,
    });
  }

  render() {
    return (
      <div
        style={{
          width: 1000,
          height: 800,
          border: "1px solid #dfdfdf",
          margin: "20px 0 0 50px",
        }}>
        <svg id="svgId" width={1000} height={800} />
      </div>
    );
  }
}

export default SvgDemo;
