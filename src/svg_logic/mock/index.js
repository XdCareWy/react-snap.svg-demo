export const allData = [
  {
    id: 1,
    type: 1,
    nextLeftNode: 2,
    label: "开始",
    condition: "",
    status: 0,
    // isActivity: true,
  },
  {
    id: 2,
    type: 3,
    prevNode: 1,
    nextLeftNode: 1574835179627,
    nextRightNode: 1574835138148,
    label: "京腾支付价",
    status: 1,
    condition: "channelPrice.JDPrice > 198 && jxiang > 2000",
    // isActivity: false,
    logicUnitData: [
      {
        id: 1,
        type: 3,
        parentId: 2,
        tips: "channelPrice.JDPrice > 198",
        unitValue: {
          leftStyle: "1",
          leftType: "1",
          leftValue: ["channelPrice", "JDPrice"],
          expression: "1",
          rightStyle: "2",
          rightType: "1",
          rightValue: "198",
        },
      },
      {
        id: 2,
        type: 1,
        label: "&&",
        parentId: undefined,
      },
      {
        id: 3,
        type: 3,
        label: 3,
        parentId: 2,
        tips: "jxiang > 2000",
        unitValue: {
          leftStyle: "1",
          leftType: "1",
          leftValue: ["jxiang"],
          expression: "1",
          rightStyle: "2",
          rightType: "1",
          rightValue: "2000",
        },
      },
    ],
  },
  {
    id: 1574835138148,
    type: 3,
    prevNode: 2,
    nextLeftNode: 1574835174931,
    nextRightNode: 1574835177147,
    label: "xxxx",
    status: 2,
    condition: "jxiang < 1000 || channelPrice.TXPrice > 98",
    // isActivity: true,
    logicUnitData: [
      {
        id: 1,
        type: 3,
        parentId: 2,
        tips: "jxiang < 323",
        unitValue: {
          leftStyle: "1",
          leftType: "1",
          leftValue: ["jxiang"],
          expression: "2",
          rightStyle: "2",
          rightType: "1",
          rightValue: "1000",
        },
      },
      {
        id: 2,
        type: 2,
        label: "||",
        parentId: undefined,
      },
      {
        id: 3,
        type: 3,
        label: 3,
        parentId: 2,
        tips: "channelPrice.TXPrice > 98",
        unitValue: {
          leftStyle: "1",
          leftType: "1",
          leftValue: ["channelPrice", "TXPrice"],
          expression: "1",
          rightStyle: "2",
          rightType: "1",
          rightValue: "98",
        },
      },
    ],
  },
  {
    id: 1574835174931,
    type: 2,
    prevNode: 1574835138148,
    label: "显示联名卡",
    condition: "请配置完成节点",
    status: 1,
    // isActivity: true,
  },
  {
    id: 1574835177147,
    type: 2,
    prevNode: 1574835138148,
    label: "显示经典卡",
    condition: "请配置完成节点",
    status: 2,
    // isActivity: false,
  },
  {
    id: 1574835179627,
    type: 2,
    prevNode: 2,
    label: "兜底方案",
    condition: "请配置完成节点",
    status: 1,
    // isActivity: false,
  },
];
