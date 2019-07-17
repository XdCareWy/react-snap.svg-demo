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
var d1 = [
    {
        label: "A",
        children: [
            {
                label: "A1",
                children: [
                    {
                        label: "A11",
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
                        label: "A12",
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
                        label: "A13",
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
function getDepth(data) {
    var max = 0;
    function each(data, floor) {
        if (floor === void 0) { floor = 0; }
        data.forEach(function (e, index) {
            e.floor = floor;
            e.floorIndex = index;
            if (floor > max) {
                max = floor;
            }
            if (e.children.length > 0) {
                each(e.children, floor + 1);
            }
        });
    }
    each(data, 0);
    return max;
}
var depth111 = getDepth(d1);
// console.log(depth111);
// 获取每一层的节点数
function getCount(data) {
    return [1, 3, 3, 9];
}
function order(data, floor) {
    for (var i = 0; i < data.length; i++) {
        var mid = data[i];
        console.log("floor: " + floor + ", label: " + mid.label);
        if (mid.children.length) {
            order(mid.children, floor + 1);
        }
    }
}
order(d1, 1);
function getMock(height, width, depth, data) {
    if (height === void 0) { height = 300; }
    if (width === void 0) { width = 300; }
    if (depth === void 0) { depth = 0; }
    // 1. 计算每一层一共有多少的节点
    var columnCount = getCount(data);
    // 2. 根据每一层的节点数计算每一层的x坐标
    for (var i = 0; i < data.length; i++) {
        var mid = data[i];
        var columnHeight = Math.floor(height / depth);
        var columnWidth = Math.floor(width / (columnCount[mid.floor] + 1));
        // console.log(`floor: ${mid.floor + 1}, x: ${columnWidth}`);
        mid.x = columnWidth * (mid.floor + 1) * (mid.floorIndex + 1);
        mid.y = columnHeight * mid.floor + 20;
        if (mid.children.length) {
            getMock(height, width, depth, mid.children);
        }
    }
}
getMock(300, 300, depth111, d1);
// console.log(d1);
function loopRound(data) {
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
loopRound(d1);
