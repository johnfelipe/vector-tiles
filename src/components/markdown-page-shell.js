import React from 'react';
import PageShell from './page-shell';
import Copiable from '@mapbox/mr-ui/copiable';

export default class MarkdownPageshell extends React.Component {
  render() {
    return (
      <PageShell {...this.props}>
        <div className="prose">
          {this.props.frontMatter.title !== 'Introduction' ? (
            <h1 className="txt-fancy">{this.props.frontMatter.title}</h1>
          ) : (
            ''
          )}
          {this.props.frontMatter.mapid ? (
            <div>
              <div className="mb18">
                <strong>Source id</strong>:
                <span className="inline-block ml6">
                  <Copiable value={this.props.frontMatter.mapid} />
                </span>
              </div>
            </div>
          ) : (
            ''
          )}
          {this.props.children}
        </div>
      </PageShell>
    );
  }
}
