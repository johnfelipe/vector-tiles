/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mapbox/mr-ui/icon';

class LayerInfo extends React.PureComponent {
  render() {
    return (
      <div className="mb24">
        <span
          className={
            this.props.type.indexOf('point') > -1
              ? 'color-blue'
              : 'color-blue-light'
          }
        >
          <Icon name="marker" inline={true} size={24} />
        </span>
        <span
          className={
            this.props.type.indexOf('line') > -1
              ? 'color-blue'
              : 'color-blue-light'
          }
        >
          <Icon name="polyline" inline={true} size={24} />
        </span>
        <span
          className={
            this.props.type.indexOf('polygon') > -1
              ? 'color-blue'
              : 'color-blue-light'
          }
        >
          <Icon name="polygon" inline={true} size={24} />
        </span>
        {this.props.buffer ? (
          <span className="color-pink txt-em ml12">
            buffer: {this.props.buffer}
          </span>
        ) : (
          ''
        )}
      </div>
    );
  }
}

LayerInfo.propTypes = {
  type: PropTypes.arrayOf(PropTypes.oneOf(['point', 'line', 'polygon']))
    .isRequired,
  buffer: PropTypes.number
};

export { LayerInfo };
