import React from "react";
import "./App.css";
import UseStateDemo from "./Hooks/UseStateDemo";
// import TsDemo1 from "./TsDemo/Demo1";
import CanvasDemo from "./react-canvas/index";

function App() {
  return (
    <div className="App">
      <UseStateDemo />
      <CanvasDemo />
    </div>
  );
}

export default App;
