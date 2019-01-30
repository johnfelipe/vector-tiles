/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mapbox/mr-ui/icon';

class LayerInfo extends React.PureComponent {
  render() {
    return (
      <div className="pt60 mb24 txt-l" id={this.props.name}>
        <a className="unprose mr18" href={`#${this.props.name}`}>
          <h3 className="inline txt-code pt0">{this.props.name}</h3>
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
      </div>
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
