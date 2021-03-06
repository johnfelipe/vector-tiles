import React from 'react';
import mapboxgl from 'mapbox-gl';
import { ACCESS_TOKEN } from '../constants';
import ControlToggleSet from '@mapbox/mr-ui/control-toggle-set';
import CodeSnippet from '@mapbox/mr-ui/code-snippet';
import { highlightJson } from '../util/highlight-json';

mapboxgl.accessToken = ACCESS_TOKEN;

class MapPreview extends React.Component {
  map;

  constructor(props) {
    super(props);
    this.state = {
      toggleValue: 'map'
    };
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: this.props.styleJson,
      center: [this.props.lon, this.props.lat],
      zoom: this.props.zoom
    });

    let popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    this.map.on('load', () => {
      this.map.showTileBoundaries = true;
    });
    this.map.on('mousemove', e => {
      const features = this.map.queryRenderedFeatures(e.point);
      this.map.getCanvas().style.cursor = 'crosshair';
      const sourceLayers = features.map(feature => {
        let color = 'black';
        let icon = 'dot';
        if (feature.layer.type === 'circle') {
          color = 'pink';
          icon = 'marker';
        } else if (feature.layer.type === 'fill') {
          color = 'blue';
          icon = 'polygon';
        } else if (feature.layer.type === 'line') {
          color = 'blue-light';
          icon = 'polyline';
        }
        return {
          sourceLayer: feature.sourceLayer,
          color: color,
          icon: icon
        };
      });
      if (sourceLayers.length > 0) {
        let popupContent = '';
        sourceLayers.forEach(layer => {
          popupContent = popupContent.concat(
            `<div class="txt-bold color-${
              layer.color
            }"><svg class='icon inline-block mr6' style="margin-bottom:-2px"><use xlink:href='#icon-${
              layer.icon
            }'/></svg>${layer.sourceLayer}</div>`
          );
        });
        popup
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(this.map);
      } else {
        popup.remove();
      }
    });

    this.map.on('mouseleave', 'result-points', () => {
      popup.remove();
    });
  }

  render() {
    return (
      <div className="my24" style={{ minHeight: '500px' }}>
        <div className="relative" style={{ height: '424px' }}>
          <div
            ref={el => (this.mapContainer = el)}
            className="w-full bg-blue-faint my12 absolute"
            style={{
              height: '400px',
              visibility:
                this.state.toggleValue === 'map' ? 'visible' : 'hidden'
            }}
          />
          <div
            id="style-json-snippet"
            className="w-full my12 absolute bg-white"
            style={{
              height: '400px',
              visibility:
                this.state.toggleValue === 'style-json' ? 'visible' : 'hidden'
            }}
          >
            <CodeSnippet
              code={JSON.stringify(this.props.styleJson, null, 2)}
              highlightedCode={highlightJson(
                JSON.stringify(this.props.styleJson, null, 2)
              )}
              maxHeight={400}
            />
          </div>
        </div>
        <div className="flex-parent flex-parent--space-between-main">
          <div className="flex-child txt-s color-gray">
            The map above uses minimal styling to illustrate the coverage,
            density, and zoom extents of various source layers in this tileset.
            Toggle between <strong>Map</strong> and <strong>Style JSON</strong>{' '}
            to see the relationship between the visual map and the source data.
          </div>
          <div className="flex-child wmin180 align-r">
            <ControlToggleSet
              id="map-toggle"
              value={this.state.toggleValue}
              onChange={value => {
                this.setState({ toggleValue: value });
              }}
              options={[
                {
                  label: 'Map',
                  value: 'map'
                },
                {
                  label: 'Style JSON',
                  value: 'style-json'
                }
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
}

export { MapPreview };
