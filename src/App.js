import React from "react";
import "./App.css";
// import UseStateDemo from "./Hooks/UseStateDemo";
// import TsDemo1 from "./TsDemo/Demo1";
import CanvasDemo from "./react-canvas/index";
// import Svg from "./react-svg/index";
import Svg from "./react-svg/indexSvg"
import LogicConfig from "./react-svg/logicConfig/index"
// import ErrorDemo from "./errorDemo";
// import ErrorBoundary from "./errorDemo/ErrorCatch";
import SvgLogic from "./svg_logic"

function App() {
  return (
    <div className="App">
      {/*<UseStateDemo />*/}
      {/*<LogicConfig></LogicConfig>*/}
      <SvgLogic />
      {/*<CanvasDemo></CanvasDemo>*/}
      {/*<ErrorBoundary>*/}
      {/*  <ErrorDemo />*/}
      {/*</ErrorBoundary>*/}
    </div>
  );
}

export default App;
