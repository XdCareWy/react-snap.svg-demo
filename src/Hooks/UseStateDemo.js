import React, { useState, useEffect } from "react";

export default function Counter() {
  const [count, handleCount] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {
    console.log("count effect");
    return () => {
      console.log(`unMount count: ${count}`);
    };
  }, [count]);

  
  useEffect(() => {
    console.log("data effect");
    return () => {
      console.log(`unMount data: ${JSON.stringify(data)}`);
    };
  }, [data]);
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => handleCount(count + 1)}>+</button>
      <button onClick={() => handleCount(count - 1)}>-</button>
      <button onClick={() => setData({name: count})}>更新数据</button>
    </div>
  );
}
