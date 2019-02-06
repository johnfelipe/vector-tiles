/*---
title: Mapbox Vector Tile Specification
description: A guide to encoding tiled vector data with the Mapbox Vector Tile Specification.
---*/

import React from 'react';
import _ from 'lodash';
import MarkdownPageShell from '../../components/markdown-page-shell';

import Introduction from './introduction.md';
import Versioning from './versioning.md';
import Format from './format.md';
import EncodingGeometry from './encoding-geometry.md';
import EncodingAttributes from './encoding-attributes.md';
import WindingOrder from './winding-order.md';
import Implementations from './implementations.md';
import NotIncluded from './notincluded.md';

export default class Page extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { headings: [] };
  }

  myCallback = headings => {
    this.setState(prevState => ({
      headings: [...prevState.headings, headings]
    }));
  };
  render() {
    const headings = _.flatten(this.state.headings);
    return (
      <MarkdownPageShell {...this.props} headings={headings}>
        <div className="spec-page">
          <Introduction callbackFromParent={this.myCallback} />
          <Versioning callbackFromParent={this.myCallback} />
          <Format callbackFromParent={this.myCallback} />
          <EncodingGeometry callbackFromParent={this.myCallback} />
          <EncodingAttributes callbackFromParent={this.myCallback} />
          <WindingOrder callbackFromParent={this.myCallback} />
          <Implementations callbackFromParent={this.myCallback} />
          <NotIncluded callbackFromParent={this.myCallback} />
        </div>
      </MarkdownPageShell>
    );
  }
}
