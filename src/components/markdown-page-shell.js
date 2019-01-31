import React from 'react';
import PageShell from './page-shell';

export default class MarkdownPageshell extends React.Component {
  render() {
    return (
      <PageShell {...this.props}>
        <div className="prose">{this.props.children}</div>
      </PageShell>
    );
  }
}
