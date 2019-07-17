// 基本类型的定义方式
let a: string = "1";
let b: boolean = false;
let arr: number[] = [1, 2, 3];
let arr1: Array<number> = [1, 2, 3];
let c: null = null;
let d12: undefined = undefined;
let s: symbol = Symbol("as");

let t: [string, number, boolean] = ["1", 3, false];

enum Week {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}
let an: any = 1;
an = undefined;
an = "1";
an = false;
an = null;

// 函数的定义方式
function getData(): void {}

function getData1(): never {
  throw new Error("asd");
}

const f1 = function(name: string, age: number, address: string = "BJ"): string {
  return `name: ${name}, age: ${age}, address: ${address}`;
};
const res = f1("zxd", 20);

const f2 = (...rest: Array<number>): number => {
  return rest.reduce((a: number, c: number) => a + c);
};

// console.log(f2(1,2,3,4,5));

// 函数的重载
function f3(name: string): string;

function f3(age: number): number;

function f3(str: any) {
  if (typeof str === "string") {
    return str;
  } else {
    return str;
  }
}

function print(n: number) {
  setTimeout(() => {
    console.log(n);
  }, Math.floor(Math.random() * 1000) + (100 - n) * 1000);
}
function print1(n: number) {
  setTimeout(
    () => {
      console.log(n);
    },
    1,
    Math.floor(Math.random() * 1000)
  );
}

for (var i = 0; i < 100; i++) {
  // print1(i);
}

function reserveInt(n: number): string {
  const num1 = n % 10;
  const num2 = n / 10;
  if (num2 < 1) return `${n}`;
  return `${num1}${reserveInt(Math.floor(num2))}`;
}

// console.log(reserveInt(123456))

// 类
class Person {
  protected name: string;
  constructor(n: string) {
    this.name = n;
  }
  getName(): string {
    return this.name;
  }
  setName(n: string): void {
    this.name = n;
  }
}

class Web extends Person {
  constructor(n: string) {
    super(n);
  }
  static name1 = "123";
  name = "s";
  getWebName(): string {
    return this.name;
  }
  static getN(): string {
    return Web.name1;
  }
}

var p = new Web("zxd");
// console.log(p.getWebName());
// console.log(Web.getN());

// abstract class Animal {
//   constructor(public name: string) {
//     this.name = name;
//   }
//   abstract getName(): string;
// }
//
// class Dog extends Animal {
//   getName(): string {
//     return this.name;
//   }
// }
//
// let d1: Dog = new Dog("asd");
// // console.log(d1.getName())

function localStorage1() {
  let storage: { [key: string]: string } = {};
  // @ts-ignore
  this.getItem = function(key: string): string {
    return storage[key];
  };
  // @ts-ignore
  this.setItem = function(k: string, v: any) {
    storage[k] = JSON.stringify(v);
  };
}

// @ts-ignore
var aaa = new localStorage1();
// @ts-ignore
aaa.setItem("a", 1);
// @ts-ignore
// console.log(aaa.getItem("a"));

abstract class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  abstract sayName(): string;
}

interface Common {
  run(leg: number): string;
  eat(food: string): string;
}

class Dog extends Animal implements Common {
  sayName(): string {
    return "";
  }
  run(leg: number): string {
    return "";
  }
  eat(food: string): string {
    return "";
  }
}
const dddd = [
  {
    label: "A",
    children: [
      {
        label: "B",
        children: [
          {
            label: "C",
            children: [
              {
                label: "C1",
                children: []
              },
              {
                label: "C2",
                children: []
              },
              {
                label: "C3",
                children: []
              }
            ]
          },
          {
            label: "D",
            children: [
              {
                label: "D1",
                children: []
              },
              {
                label: "D2",
                children: []
              },
              {
                label: "D3",
                children: []
              }
            ]
          },
          {
            label: "E",
            children: [
              {
                label: "E1",
                children: []
              },
              {
                label: "E2",
                children: []
              },
              {
                label: "E3",
                children: []
              }
            ]
          }
        ]
      },
      {
        label: "C",
        children: []
      },
      {
        label: "D",
        children: []
      }
    ]
  }
];

function depth(data: Array<{ label: string; children: Array<any> }>): number {
  let max = 0;
  if(data.length === 0) return max;
  for (let i = 0; i< data.length;i++) {
      const mid = data[i];
      if(mid.children.length === 0) {
          max = 1;
      }else {
         max = 1 + depth(mid.children);
      }
  }


  return max;
}
