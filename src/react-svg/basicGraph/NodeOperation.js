export function NodeOperation(svg, x, y, r) {
  const circleE = svg.circle(x, y, r).attr({
    fill: "rgb(244,244,244)",
    "stroke-width": 1,
    "stroke-dasharray": 0,
    stroke: "gray",
  });
  const operationObj = ["+", "-", "E", "P", "R", "J", "L"];
  const deg = (2 * Math.PI) / operationObj.length;
  const oo = [];
  for (let i = 0; i < operationObj.length; i++) {
    const tmp = operationObj[i];
    const tmpE = paintCircleText(svg, x + Math.cos(deg * i) * r, y - Math.sin(deg * i) * r, 12, tmp);
    oo.push(tmpE);
  }
  const g = svg.g(circleE, ...oo);
  g.attr({
    class: "hide",
    id: "operationId",
  });
  return g;
}

function paintCircleText(svg, x, y, r, text, id = "") {
  const textSvg = svg.text(x, y, text).attr({
    class: "text-center",
  });
  const roundSvg = svg.circle(x, y, r).attr({
    fill: "rgb(215,216,217)",
    "stroke-width": 1,
    "stroke-dasharray": 0,
    stroke: "gray",
  });

  const g = svg.g(roundSvg, textSvg).attr({ id: id });
  g.hover(
    function() {
      g.select("circle").animate({ r: r + 2 }, 100);
    },
    function() {
      g.select("circle").animate({ r: r }, 100);
    }
  );
  return g;
}
