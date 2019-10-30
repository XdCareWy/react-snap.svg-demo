import React from "react";
import "./App.css";
// import UseStateDemo from "./Hooks/UseStateDemo";
// import TsDemo1 from "./TsDemo/Demo1";
// import CanvasDemo from "./react-canvas/index";
// import Svg from "./react-svg/index";
import Svg from "./react-svg/indexSvg"
// import ErrorDemo from "./errorDemo";
// import ErrorBoundary from "./errorDemo/ErrorCatch";

function App() {
  return (
    <div className="App">
      {/*<UseStateDemo />*/}
      <Svg />
      {/*<ErrorBoundary>*/}
      {/*  <ErrorDemo />*/}
      {/*</ErrorBoundary>*/}
    </div>
  );
}

export default App;
