import React, { Component } from "react";
import { Button } from "antd";
import styled from "styled-components";
import Canvas from "./Canvas";
import data from "./data";

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  handleClick = () => {
    this.setState({ visible: true });
  };

  render() {

    return (
      <Content>
        <div>
          <Button onClick={this.handleClick}>逻辑关系图</Button>
        </div>
        <Canvas treeData={data} />
      </Content>
    );
  }
}

export default Demo;

const Content = styled.div`
  width: 100%;
  height: 400px;
  background-color: #dfdfdf;
`;
