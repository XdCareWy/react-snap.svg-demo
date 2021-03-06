var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var d1 = [
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
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
function paintArc(ctx, config) {
    var x = config.x, y = config.y, radius = config.radius, startAngle = config.startAngle, endAngle = config.endAngle, _a = config.anticlockwise, anticlockwise = _a === void 0 ? false : _a;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    ctx.stroke();
}
function paintRound(ctx, config) {
    paintArc(ctx, __assign({ anticlockwise: false, endAngle: 2 * Math.PI, radius: 5, startAngle: 0 }, config));
}
function paintStraightLine(ctx, startPoint, endPoint) {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
}
var point1 = {
    x: 20,
    y: 60
};
var point2 = {
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
function getTreeDepth(data) {
    var max = 0;
    function each(data, floor) {
        if (floor === void 0) { floor = 0; }
        if (data.length) {
            data.forEach(function (node) {
                if (floor > max) {
                    max = floor;
                }
                if (node.children.length > 0) {
                    each(node.children, floor + 1);
                }
            });
        }
        else {
            max = 0;
        }
    }
    each(data, 1);
    return max;
}
var depth111 = getTreeDepth(d1);
console.log(depth111);
// 获取每一层的节点数
function getCount(data) {
    return [1, 3, 3, 9];
}
/**
 * 获取树中各个节点下子节点的数目
 * @param data
 * @param floor
 */
function order(data, floor) {
    var rootCount = 0; // 记录每个子树下的节点数目
    // 1. 循环该树
    for (var i = 0; i < data.length; i++) {
        var node = data[i];
        node.floor = floor;
        // 2. 该节点是否为 叶子 节点，如果是，当前节点的childNodeCount设置为1；否则，统计当前节点下所有叶子节点的 childNodeCount
        if (node.children.length === 0) {
            node.childNodeCount = 1;
            node.floorNumber = rootCount;
            rootCount++;
        }
        else {
            var leafCount = order(node.children, floor + 1);
            node.childNodeCount = leafCount;
            node.floorNumber = rootCount;
            rootCount += leafCount;
        }
    }
    return rootCount;
}
order(d1, 1);
console.log(d1);
function getMock(data, XGap, yGap, offSetY, leftX) {
    if (XGap === void 0) { XGap = 50; }
    if (yGap === void 0) { yGap = 50; }
    if (offSetY === void 0) { offSetY = -10; }
    if (leftX === void 0) { leftX = 0; }
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var node = data_1[_i];
        // @ts-ignore
        node.y = node.floor * yGap + offSetY;
        // @ts-ignore
        node.x = node.childNodeCount * XGap * 0.5 + node.floorNumber * XGap + leftX;
        if (node.children.length) {
            getMock(node.children, XGap, yGap, offSetY, 
            // @ts-ignore
            node.floorNumber * XGap + leftX);
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
function flatTree(treeData, res) {
    for (var _i = 0, treeData_1 = treeData; _i < treeData_1.length; _i++) {
        var node = treeData_1[_i];
        var subNode = node.children, other = __rest(node, ["children"]);
        res.push(other);
        if (subNode.length) {
            flatTree(subNode, res);
        }
    }
    return res;
}
console.log(flatTree(d1, []));
function loopRound(data) {
    // 画节点
    for (var i = 0; i < data.length; i++) {
        var mid = data[i];
        paintRound(ctx, { x: mid.x, y: mid.y });
        ctx.font = "10px STheiti, SimHei";
        ctx.fillText(mid.label, mid.x + 3, mid.y - 3);
        if (mid.children.length) {
            loopRound(mid.children);
        }
    }
}
function loopLine(data) {
    // 画直线
    for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
        var node = data_2[_i];
        if (node.children.length) {
            for (var _a = 0, _b = node.children; _a < _b.length; _a++) {
                var subNode = _b[_a];
                paintStraightLine(ctx, node, subNode);
            }
            loopLine(node.children);
        }
    }
}
canvas.width = 650;
loopRound(d1);
loopLine(d1);
var allPoint = flatTree(d1, []);
// 绑定事件
// canvas.addEventListener("click", e => {
//   let eventX = e.clientX - canvas.getBoundingClientRect().left;
//   let eventY = e.clientY - canvas.getBoundingClientRect().top;
//
//   const p = allPoint.find(node => {
//     const { x, y } = node;
//     return Math.abs(x - eventX) < 5*Math.sign(45) && Math.abs(y - eventY) < 5*Math.sign(45);
//   });
//   console.log(p)
//   const input = document.getElementById("inputId") as HTMLInputElement;
//
//   if(p) {
//     input.style.left = `${eventX}px`;
//     input.style.top = `${eventY - 8}px`;
//     input.style.display = "block"
//   }else {
//     input.style.display = "none"
//   }
// });
var input = document.getElementById("inputId");
var operation = document.getElementById("operationId");
// 绑定鼠标悬停事件
canvas.addEventListener("mousemove", function (e) {
    var eventX = e.clientX - canvas.getBoundingClientRect().left;
    var eventY = e.clientY - canvas.getBoundingClientRect().top;
    var p = allPoint.find(function (node) {
        var x = node.x, y = node.y;
        return Math.abs(x - eventX) < 5 * Math.sign(45) && Math.abs(y - eventY) < 5 * Math.sign(45);
    });
    if (p) {
        operation.style.left = p.x - 50 + "px";
        operation.style.top = p.y - 20 + "px";
        operation.style.display = "block";
        input.style.display = "none";
        operation.addEventListener("click", function (e) {
            operation.style.display = "none";
            input.style.left = p.x - 50 + "px";
            input.style.top = p.y - 15 + "px";
            input.style.display = "block";
        });
    }
    else {
        operation.style.display = "none";
    }
});
