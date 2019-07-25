interface IData {
  label: string;
  childNodeCount?: number; // 当前节点一共有多个子节点
  floor?: number; // 当前节点所处树的层数
  floorNumber?: number; // 当前节点所处树的层数
  children: Array<IData> | [];
  x?: number;
  y?: number;
}

const d1 = [
  {
    label: "&&",
    children: [
      {
        label: "||",
        children: [
          {
            label: "&&",
            children: [
              {
                label: "A111",
                children: []
              },
              {
                label: "A112",
                children: []
              },
              {
                label: "A113",
                children: []
              }
            ]
          },
          {
            label: "&&",
            children: [
              {
                label: "A121",
                children: []
              },
              {
                label: "A122",
                children: []
              },
              {
                label: "A123",
                children: []
              }
            ]
          },
          {
            label: "||",
            children: [
              {
                label: "A131",
                children: []
              },
              {
                label: "A132",
                children: []
              },
              {
                label: "A133",
                children: []
              }
            ]
          }
        ]
      },
      {
        label: "A2",
        children: []
      },
      {
        label: "A3",
        children: []
      }
    ]
  }
];

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

/**
 * 画弧度
 */
interface IArc {
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  anticlockwise?: boolean;
}

function paintArc(ctx: CanvasRenderingContext2D, config: IArc) {
  const { x, y, radius, startAngle, endAngle, anticlockwise = false } = config;
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  ctx.stroke();
}

/**
 * 画圆
 */
interface IRound {
  x: number;
  y: number;
  radius?: number;
}
function paintRound(ctx: CanvasRenderingContext2D, config: IRound) {
  paintArc(ctx, {
    anticlockwise: false,
    endAngle: 2 * Math.PI,
    radius: 5,
    startAngle: 0,
    ...config
  });
}

/**
 * 画直线
 */
interface IStraightLine {
  x: number;
  y: number;
}

function paintStraightLine(
  ctx: CanvasRenderingContext2D,
  startPoint: IStraightLine,
  endPoint: IStraightLine
) {
  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();
}

const point1 = {
  x: 20,
  y: 60
};
const point2 = {
  x: 30,
  y: 20
};
// paintRound(ctx, point1);
// paintRound(ctx, point2);
// paintStraightLine(ctx, point1, point2);

// 1. 第一个点在第二个点下面
// 第一个控制点：两点x做减法，取绝对值，取1/4
// 第一个控制点两点y做减法，取绝对值，取1
// 第二个控制点：两点x做减法，取绝对值，取3/4
// 第二个控制点两点y做减法，取绝对值，取1/2
// 2. 第一个点在第二个点上面
// 3，第一个点和第二个点在一条线上

// ctx.beginPath();
// ctx.moveTo(point1.x, point1.y);
// ctx.bezierCurveTo(
//   Math.abs(point1.x - point2.x) / 2,
//   Math.abs(point1.y - point2.y) / 2,
//   Math.abs(point1.x - point2.x) / 2,
//   Math.abs(point1.y - point2.y) / 2,
//   point2.x,
//   point2.y
// );
// ctx.stroke();

function getTreeDepth(data: any[]) {
  let max = 0;
  function each(data: any[], floor: number = 0) {
    if (data.length) {
      data.forEach(node => {
        if (floor > max) {
          max = floor;
        }
        if (node.children.length > 0) {
          each(node.children, floor + 1);
        }
      });
    } else {
      max = 0;
    }
  }
  each(data, 1);
  return max;
}
const depth111 = getTreeDepth(d1);
console.log(depth111);

// 获取每一层的节点数
function getCount(data: Array<IData>): Array<number> {
  return [1, 3, 3, 9];
}

/**
 * 获取树中各个节点下子节点的数目
 * @param data
 * @param floor
 */
function order(data: Array<IData>, floor: number) {
  let rootCount = 0; // 记录每个子树下的节点数目
  // 1. 循环该树
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    node.floor = floor;
    // 2. 该节点是否为 叶子 节点，如果是，当前节点的childNodeCount设置为1；否则，统计当前节点下所有叶子节点的 childNodeCount
    if (node.children.length === 0) {
      node.childNodeCount = 1;
      node.floorNumber = rootCount;
      rootCount++;
    } else {
      const leafCount = order(node.children, floor + 1);
      node.childNodeCount = leafCount;
      node.floorNumber = rootCount;
      rootCount += leafCount;
    }
  }
  return rootCount;
}
order(d1, 1);
console.log(d1);

function getMock(
  data: Array<IData>,
  XGap = 50,
  yGap = 50,
  offSetY = -10,
  leftX = 0
) {
  for (let node of data) {
    // @ts-ignore
    node.y = node.floor * yGap + offSetY;
    // @ts-ignore
    node.x = node.childNodeCount * XGap * 0.5 + node.floorNumber * XGap + leftX;
    if (node.children.length) {
      getMock(
        node.children,
        XGap,
        yGap,
        offSetY,
        // @ts-ignore
      node.floorNumber * XGap + leftX
      );
    }
  }
}

// function getMock(height = 300, width = 300, depth = 0, data: any[]) {
//   // 1. 计算每一层一共有多少的节点
//   const columnCount = getCount(data);
//   // 2. 根据每一层的节点数计算每一层的x坐标
//   for (let i = 0; i < data.length; i++) {
//     const mid = data[i];
//     const columnHeight = Math.floor(height / depth);
//     const columnWidth = Math.floor(width / (columnCount[mid.floor] + 1));
//     // console.log(`floor: ${mid.floor + 1}, x: ${columnWidth}`);
//     mid.x = columnWidth * (mid.floor + 1) * (mid.floorIndex + 1);
//     mid.y = columnHeight * mid.floor + 20;
//     if (mid.children.length) {
//       getMock(height, width, depth, mid.children);
//     }
//   }
// }
// getMock(300, 300, depth111, d1);
getMock(d1);
console.log(d1);

// flat树
function flatTree(treeData: Array<IData>, res: Array<any>) {
  for (let node of treeData) {
    const { children: subNode, ...other } = node;
    res.push(other);
    if (subNode.length) {
      flatTree(subNode, res);
    }
  }
  return res;
}

console.log(flatTree(d1, []));

function loopRound(data: Array<any>) {
  // 画节点
  for (let i = 0; i < data.length; i++) {
    const mid = data[i];

    paintRound(ctx, { x: mid.x, y: mid.y });
    ctx.font = "10px STheiti, SimHei";
    ctx.fillText(mid.label, mid.x + 3, mid.y - 3);
    if (mid.children.length) {
      loopRound(mid.children);
    }
  }
}
function loopLine(data: Array<any>) {
  // 画直线
  for (let node of data) {
    if (node.children.length) {
      for (let subNode of node.children) {
        paintStraightLine(ctx, node, subNode);
      }
      loopLine(node.children);
    }
  }
}
loopRound(d1);
loopLine(d1);

const allPoint = flatTree(d1, []);

// 绑定事件
canvas.addEventListener("click", e => {
  let eventX = e.clientX - canvas.getBoundingClientRect().left;
  let eventY = e.clientY - canvas.getBoundingClientRect().top;

  const p = allPoint.find(node => {
    const { x, y } = node;
    return Math.abs(x - eventX) < 5*Math.sign(45) && Math.abs(y - eventY) < 5*Math.sign(45);
  });
  console.log(p)
  const input = document.getElementById("inputId") as HTMLInputElement;

  if(p) {
    input.style.left = `${eventX}px`;
    input.style.top = `${eventY - 8}px`;
    input.style.display = "block"
  }else {
    input.style.display = "none"
  }
});
