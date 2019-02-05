import React from 'react';
import Icon from '@mapbox/mr-ui/icon';

class SourceLayerTypes extends React.PureComponent {
  render() {
    return (
      <div className="mb18">
        <div className="mb6">
          <span className="color-blue">
            <Icon name="marker" size={24} inline={true} />
          </span>{' '}
          Point
        </div>
        <div className="mb6">
          <span className="color-blue">
            <Icon name="polyline" size={24} inline={true} />
          </span>{' '}
          Linestring / multilinestring
        </div>
        <div className="mb6">
          <span className="color-blue">
            <Icon name="polygon" size={24} inline={true} />
          </span>{' '}
          Polygon / multipolygon
        </div>
      </div>
    );
  }
}

export { SourceLayerTypes };
