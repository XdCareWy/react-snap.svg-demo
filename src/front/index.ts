function three(obj: object, res: object): object {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const keys = key.split(".");
      const firstKey = keys.shift();
      if(firstKey) {
        if(keys.length) {
          // @ts-ignore
          res[firstKey] = res[firstKey] || {}
          // @ts-ignore
          three({[keys.join(".")]: obj[key]}, res[firstKey]);
        }else {
          // @ts-ignore
          res[firstKey] = obj[key]
        }
      }
    }
  }
  return res;
}
const output = {
  "a.b.c.dd": "abcdd",
  "a.d.xx": "adxx",
  "a.e": "ae"
};
console.log(three(output, {}));

/*
*
var entry = {
  a: {
    b: {
      c: {
        dd: 'abcdd'
      }
    },
    d: {
      xx: 'adxx'
    },
    e: 'ae'
  }
}

// 要求转换成如下对象
  var output = {
  'a.b.c.dd': 'abcdd',
  'a.d.xx': 'adxx',
'a.e': 'ae'
}
* */
function two(obj: object, keyName: string, res: object): object {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // @ts-ignore
      if (typeof obj[key] === "object") {
        // @ts-ignore
        two(obj[key], `${keyName}${key}.`, res);
      } else {
        // @ts-ignore
        res[`${keyName}${key}`] = obj[key];
      }
    }
  }
  return res;
}
const entry = {
  a: {
    b: {
      c: {
        dd: "abcdd"
      }
    },
    d: {
      xx: "adxx"
    },
    e: "ae"
  }
};
// console.log(two(entry, "", {}));

/*
 *  输入： 1，2，3，5，7，8，10
 *  输出： 1~3，5，7~8，10
 * */

function one(src: string): string {
  let res: string[] = [];
  const srcArr = src.split(",");
  let first = srcArr[0];
  for (let i = 0; i < srcArr.length; i++) {
    let second = srcArr[i];
    if (+srcArr[i + 1] !== +second + 1) {
      if (+first === +second) {
        res.push(second);
      } else {
        res.push(`${first}~${second}`);
      }
      first = srcArr[i + 1];
    }
  }
  return res.join(",");
}

// console.log(one("1,2,3,5,7,8,10,11,12,13,17,19,20,21"));
