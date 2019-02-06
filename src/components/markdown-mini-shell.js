import React from 'react';

export default class MarkdownMiniShell extends React.Component {
  componentDidMount() {
    this.props.callbackFromParent(this.props.frontMatter.headings);
  }
  render() {
    const { props } = this;
    return <React.Fragment>{props.children}</React.Fragment>;
  }
}
