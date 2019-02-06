/* @flow */
import React from 'react';

class EncodingAttributesDiagram extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeFeature: 0,
      activeAttribute: 0,
      activeKey: '',
      activeValue: ''
    };
  }

  resetState = () => {
    this.setState({ activeAttribute: 0, activeKey: '', activeValue: '' });
  };

  render() {
    const {
      activeFeature,
      activeAttribute,
      activeKey,
      activeValue
    } = this.state;
    return (
      <div>
        <p>Hover over the features and the properties of the GeoJSON.</p>
        <div className="grid grid--gut12">
          <div className="col col--6">
            <h3>Original geojson</h3>
            <pre className="unprose">
              <div className="txt-code bg-transparent">
                {'{'}
                {'\n'}
                <div className="ml18">
                  "type": "FeatureCollection",{'\n'}
                  "features": [{'\n'}
                  <div
                    className="feature ml18"
                    onMouseEnter={() => {
                      this.setState({ activeFeature: 1 });
                    }}
                    onMouseLeave={() => {
                      this.setState({ activeFeature: 0 });
                    }}
                  >
                    {'{'}
                    {'\n'}
                    <div className="ml18">
                      "geometry": {'{'} ... {'}'},{'\n'}
                      "type": "Feature",{'\n'}
                      "properties": {'{'}
                      {'\n'}
                      <div className="ml18">
                        <div
                          className="attr gj"
                          onMouseEnter={() => {
                            this.setState({
                              activeAttribute: 1,
                              activeKey: 'hello',
                              activeValue: 'world'
                            });
                          }}
                          onMouseLeave={this.resetState}
                        >
                          "hello": "world",{'\n'}
                        </div>
                        <div
                          className="attr gj"
                          onMouseEnter={() => {
                            this.setState({
                              activeAttribute: 2,
                              activeKey: 'h',
                              activeValue: 'world'
                            });
                          }}
                          onMouseLeave={this.resetState}
                        >
                          "h": "world",{'\n'}
                        </div>
                        <div
                          className="attr gj"
                          onMouseEnter={() => {
                            this.setState({
                              activeAttribute: 3,
                              activeKey: 'count',
                              activeValue: '123'
                            });
                          }}
                          onMouseLeave={this.resetState}
                        >
                          "count": 1.23{'\n'}
                        </div>
                      </div>
                      {'}'}
                      {'\n'}
                    </div>
                    {'}'},{'\n'}
                  </div>
                  <div
                    className="feature ml18"
                    onMouseEnter={() => {
                      this.setState({ activeFeature: 2 });
                    }}
                    onMouseLeave={() => {
                      this.setState({ activeFeature: 0 });
                    }}
                  >
                    {'{'}
                    {'\n'}
                    <div className="ml18">
                      "geometry": {'{'} ... {'}'},{'\n'}
                      "type": "Feature",{'\n'}
                      "properties": {'{'}
                      {'\n'}
                      <div className="ml18">
                        <div
                          className="attr gj"
                          onMouseEnter={() => {
                            this.setState({
                              activeAttribute: 4,
                              activeKey: 'hello',
                              activeValue: 'again'
                            });
                          }}
                          onMouseLeave={this.resetState}
                        >
                          "hello": "again",{'\n'}
                        </div>
                        <div
                          className="attr gj"
                          onMouseEnter={() => {
                            this.setState({
                              activeAttribute: 5,
                              activeKey: 'count',
                              activeValue: '2'
                            });
                          }}
                          onMouseLeave={this.resetState}
                        >
                          "count": 2{'\n'}
                        </div>
                      </div>
                      {'}'}
                    </div>
                    {'}'}
                    {'\n'}
                  </div>
                </div>
                ]{'}'}
              </div>
            </pre>
          </div>
          <div className="col col--6">
            <h3>Final vector tile</h3>
            <div className="txt-code">
              layers {'{'}
              {'\n'}
              <div className="ml18">
                version: 2{'\n'}
                name: "points"{'\n'}
                <div
                  className={`feat ${activeFeature === 1 ? 'highlight' : ''}`}
                  id="feat1"
                >
                  features: {'{'}
                  {'\n'}
                  <div className="ml18">
                    id: 1{'\n'}
                    <div
                      className={`tagset ${
                        activeAttribute === 1 ? 'highlight' : ''
                      }`}
                      id="attr1"
                    >
                      <div
                        className={`tag-key ${
                          activeAttribute === 1 ? 'highlight' : ''
                        }`}
                      >
                        tags: 0
                      </div>
                      <div
                        className={`tag-value ${
                          activeAttribute === 1 ? 'highlight' : ''
                        }`}
                      >
                        tags: 0
                      </div>
                    </div>
                    <div
                      className={`tagset ${
                        activeAttribute === 2 ? 'highlight' : ''
                      }`}
                      id="attr2"
                    >
                      <div
                        className={`tag-key ${
                          activeAttribute === 2 ? 'highlight' : ''
                        }`}
                      >
                        tags: 1
                      </div>
                      <div
                        className={`tag-value ${
                          activeAttribute === 2 ? 'highlight' : ''
                        }`}
                      >
                        tags: 0
                      </div>
                    </div>
                    <div
                      className={`tagset ${
                        activeAttribute === 3 ? 'highlight' : ''
                      }`}
                      id="attr3"
                    >
                      <div
                        className={`tag-key ${
                          activeAttribute === 3 ? 'highlight' : ''
                        }`}
                      >
                        tags: 2
                      </div>
                      <div
                        className={`tag-value ${
                          activeAttribute === 3 ? 'highlight' : ''
                        }`}
                      >
                        tags: 1
                      </div>
                    </div>
                    type: Point{'\n'}
                    geometry: ...{'\n'}
                  </div>
                  {'}'}
                </div>
                <div
                  className={`feat ${activeFeature === 2 ? 'highlight' : ''}`}
                  id="feat2"
                >
                  features {'{'}
                  {'\n'}
                  <div className="ml18">
                    id: 2
                    <div
                      className={`tagset ${
                        activeAttribute === 4 ? 'highlight' : ''
                      }`}
                      id="attr4"
                    >
                      <div
                        className={`tag-key ${
                          activeAttribute === 4 ? 'highlight' : ''
                        }`}
                      >
                        tags: 0{'\n'}
                      </div>
                      <div
                        className={`tag-value ${
                          activeAttribute === 4 ? 'highlight' : ''
                        }`}
                      >
                        tags: 2{'\n'}
                      </div>
                    </div>
                    <div
                      className={`tagset ${
                        activeAttribute === 5 ? 'highlight' : ''
                      }`}
                      id="attr5"
                    >
                      <div
                        className={`tag-key ${
                          activeAttribute === 5 ? 'highlight' : ''
                        }`}
                      >
                        tags: 2{'\n'}
                      </div>
                      <div
                        className={`tag-value ${
                          activeAttribute === 5 ? 'highlight' : ''
                        }`}
                      >
                        tags: 3{'\n'}
                      </div>
                    </div>
                    type: Point{'\n'}
                    geometry: ...{'\n'}
                  </div>
                  {'}'}
                </div>
                <div className="key-group">
                  <div
                    className={`key ${
                      activeKey === 'hello' ? 'highlight' : ''
                    }`}
                    id="key-hello"
                  >
                    keys: "hello"
                  </div>
                  <div
                    className={`key ${activeKey === 'h' ? 'highlight' : ''}`}
                    id="key-h"
                  >
                    keys: "h"
                  </div>
                  <div
                    className={`key ${
                      activeKey === 'count' ? 'highlight' : ''
                    }`}
                    id="key-count"
                  >
                    keys: "count"
                  </div>
                </div>
                <div className="value-group">
                  <div
                    className={`value ${
                      activeValue === 'world' ? 'highlight' : ''
                    }`}
                    id="value-world"
                  >
                    values: {'{ '}
                    string_value: "world"
                    {' }'}
                  </div>
                  <div
                    className={`value ${
                      activeValue === '123' ? 'highlight' : ''
                    }`}
                    id="value-123"
                  >
                    values: {'{ '}
                    double_value: 1.23
                    {' }'}
                  </div>
                  <div
                    className={`value ${
                      activeValue === 'again' ? 'highlight' : ''
                    }`}
                    id="value-again"
                  >
                    values: {'{ '}
                    string_value: "again"
                    {' }'}
                  </div>
                  <div
                    className={`value ${
                      activeValue === '2' ? 'highlight' : ''
                    }`}
                    id="value-2"
                  >
                    values: {'{ '}
                    int_value: 2{' }'}
                  </div>
                </div>
                extent: 4096
              </div>
              {'}'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { EncodingAttributesDiagram };
