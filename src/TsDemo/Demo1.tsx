import * as React from "react";

interface IProps {
  name: string;
}

interface IState {
  a: string;
}

class Demo1 extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      a: "1"
    };
  }
  render(): React.ReactElement {
    return <div>asd</div>;
  }
}

export default Demo1;
