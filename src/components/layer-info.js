/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mapbox/mr-ui/icon';
const slugger = require('github-slugger')();

class LayerInfo extends React.PureComponent {
  render() {
    function slug(string) {
      slugger.reset();
      return slugger.slug(string);
    }
    return (
      <h3
        className="txt-code bg-transparent ml-neg6"
        id={slug(this.props.name)}
      >
        <a
          className="mr18 unprose color-blue-on-hover"
          href={`#${slug(this.props.name)}`}
        >
          <span className="mr18">{this.props.name}</span>
        </a>
        <span
          className={
            this.props.type.indexOf('point') > -1
              ? 'color-gray'
              : 'color-gray-light'
          }
        >
          <Icon name="marker" inline={true} size={32} />
        </span>
        <span
          className={
            this.props.type.indexOf('line') > -1
              ? 'color-gray'
              : 'color-gray-light'
          }
        >
          <Icon name="polyline" inline={true} size={32} />
        </span>
        <span
          className={
            this.props.type.indexOf('polygon') > -1
              ? 'color-gray'
              : 'color-gray-light'
          }
        >
          <Icon name="polygon" inline={true} size={32} />
        </span>
        {this.props.buffer ? (
          <span className="ml18">buffer: {this.props.buffer}</span>
        ) : (
          ''
        )}
      </h3>
    );
  }
}

LayerInfo.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.arrayOf(PropTypes.oneOf(['point', 'line', 'polygon']))
    .isRequired,
  buffer: PropTypes.number
};

export { LayerInfo };
