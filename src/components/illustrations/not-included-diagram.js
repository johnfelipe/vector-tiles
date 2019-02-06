/* @flow */
import React from 'react';

class NotIncludedDiagram extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      intervalId: 0,
      currentStep: 1
    };
  }

  componentDidMount() {
    let intervalId = setInterval(this.timer, 2000);
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  timer = () => {
    // setState method is used to update the state
    this.setState({
      currentStep: this.state.currentStep < 4 ? this.state.currentStep + 1 : 1
    });
  };

  render() {
    const { currentStep } = this.state;
    return (
      <div>
        <div className="grid grid--gut24 my24">
          <div className="col col--6-ml col--12">
            <p>
              Simplification can cause <strong>invalid polygons</strong>{' '}
              according to the OGC standards by oversimplifying polygon rings to
              the point where their edges overlap. See below how simplifying one
              line changes the rendering of a polygon by pushing the interior
              ring outside of the exterior ring.
            </p>
          </div>
          <div className="col col--6-ml col--12 mt0-ml mt24">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="300"
              height="300"
              viewBox="0 0 300 300"
            >
              <g id="simp1" className={currentStep === 1 ? '' : 'none'}>
                <text x="0" y="10" fontSize="12">
                  1 / 4
                </text>
                <text x="0" y="24" fontSize="12">
                  Polygon with a "hole"
                </text>
                <path
                  d="M267.53,102.13L220.72,45.34,172,29.73,42.27,65.48,25.69,189.32l84.46,34.2L182,273.12,254.42,240,275,177ZM171.81,219.89l-83.94-45.6L54.71,76.88,206,74.29l18.65,118.66Z"
                  className="simp-geom simp-poly"
                />
              </g>
              <g id="simp2" className={currentStep === 2 ? '' : 'none'}>
                <text x="0" y="10" fontSize="12">
                  2 / 4
                </text>
                <text x="0" y="24" fontSize="12">
                  Exterior (blue) and interior (red) rings
                </text>
                <polygon
                  points="42.27 65.48 172.05 29.73 220.72 45.34 267.53 102.13 275.02 177.01 254.42 240.05 182.03 273.12 110.15 223.51 25.69 189.32 42.27 65.48"
                  className="simp-geom simp-ring simp-ring-outer hide"
                />
                <polygon
                  points="54.71 76.88 87.87 174.29 171.81 219.89 224.66 192.94 206.01 74.29 54.71 76.88"
                  className="simp-geom simp-ring simp-ring-inner hide"
                />
              </g>
              <g id="simp3" className={currentStep === 3 ? '' : 'none'}>
                <text x="0" y="10" fontSize="12">
                  3 / 4
                </text>
                <text x="0" y="24" fontSize="12">
                  Simplified exterior ring
                </text>
                <line
                  x1="26.92"
                  y1="180.14"
                  x2="41.46"
                  y2="71.56"
                  className="simp-geom simp-dashed"
                />
                <polyline
                  points="41.87 68.45 42.27 65.48 45.16 64.68"
                  className="simp-geom simp-dashed"
                />
                <line
                  x1="51.07"
                  y1="63.06"
                  x2="166.2"
                  y2="31.34"
                  className="simp-geom simp-dashed"
                />
                <polygon
                  points="172.05 29.73 220.72 45.34 267.53 102.13 275.02 177.01 254.42 240.05 182.03 273.12 110.15 223.51 25.69 189.32 172.05 29.73"
                  className="simp-geom simp-ring simp-ring-outer hide"
                />
                <polygon
                  points="54.71 76.88 87.87 174.29 171.81 219.89 224.66 192.94 206.01 74.29 54.71 76.88"
                  className="simp-geom simp-ring simp-ring-inner hide"
                />
              </g>
              <g id="simp4" className={currentStep === 4 ? '' : 'none'}>
                <text x="0" y="10" fontSize="12">
                  4 / 4
                </text>
                <text x="0" y="24" fontSize="12">
                  Invalid geometry
                </text>
                <line
                  x1="26.92"
                  y1="180.14"
                  x2="41.46"
                  y2="71.56"
                  className="simp-geom simp-dashed"
                />
                <polyline
                  points="41.87 68.45 42.27 65.48 45.16 64.68"
                  className="simp-geom simp-dashed"
                />
                <line
                  x1="51.07"
                  y1="63.06"
                  x2="166.2"
                  y2="31.34"
                  className="simp-geom simp-dashed"
                />
                <polygon
                  points="267.53 102.13 220.72 45.34 172.05 29.73 129.99 75.59 206.01 74.29 224.66 192.94 171.81 219.89 87.87 174.29 74.77 135.81 25.69 189.32 110.15 223.51 182.03 273.12 254.42 240.05 275.02 177.01 267.53 102.13"
                  className="simp-geom simp-poly hide"
                />
                <polygon
                  points="54.71 76.88 74.77 135.81 129.99 75.59 54.71 76.88"
                  className="simp-geom simp-poly hide"
                />
              </g>
            </svg>
          </div>
        </div>
        <div className="grid grid--gut24 my24">
          <div className="col col--6-ml col--12">
            <p>
              When spatial coordinates are converted to tile coordinates, they
              are rounded to integers. Simplifying (rounding) the coordinates
              can <strong>reverse the winding order</strong>. Consider a
              triangle polygon that is simplified to the vector tile grid. The
              rounded point can cross over the polygon and "flip" it, rendering
              its winding order reversed.
            </p>
          </div>
          <div className="col col--6-ml col--12 mt0-ml mt24">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="300"
              height="300"
              viewBox="0 0 300 300"
            >
              <g id="flip-grid" className="show">
                <path
                  className="flip-grid"
                  d="M242.41,0h1m-63,0h1m-63,0h1m-63,0h1M0,57.59v-1m0,63v-1m0,63v-1m0,63v-1M57.59,300h-1m63,0h-1m63,0h-1m63,0h-1M300,242.41v1m0-63v1m0-63v1m0-63v1"
                />
                <path
                  className="flip-grid"
                  d="M243.45,0h-1V56.55H181.49V0h-1V56.55H119.54V0h-1V56.55H57.59V0h-1V56.55H0v1H56.55v60.92H0v1H56.55v60.92H0v1H56.55v60.92H0v1H56.55V300h1V243.45h60.92V300h1V243.45h60.92V300h1V243.45h60.92V300h1V243.45H300v-1H243.45V181.49H300v-1H243.45V119.54H300v-1H243.45V57.59H300v-1H243.45V0ZM118.51,242.41H57.59V181.49h60.92v60.92Zm0-62H57.59V119.54h60.92v60.92Zm0-62H57.59V57.59h60.92v60.92Zm62,123.91H119.54V181.49h60.92v60.92Zm0-62H119.54V119.54h60.92v60.92Zm0-62H119.54V57.59h60.92v60.92Zm62,123.91H181.49V181.49h60.92v60.92Zm0-62H181.49V119.54h60.92v60.92Zm0-62H181.49V57.59h60.92v60.92Z"
                />
              </g>
              <g id="flip1" className={currentStep === 1 ? '' : 'none'}>
                <text x="0" y="10" fontSize="12">
                  1 / 4
                </text>
                <text x="0" y="24" fontSize="12">
                  Polygon pre-simplification
                </text>
                <polygon
                  points="36.06 204.47 219.82 83.96 153.8 155.53 36.06 204.47"
                  className="flip-ring flip-outer"
                />
              </g>
              <g id="flip2" className={currentStep === 2 ? '' : 'none'}>
                <text x="0" y="10" fontSize="12">
                  2 / 4
                </text>
                <text x="0" y="24" fontSize="12">
                  Simplify a point to the grid
                </text>
                <polygon
                  points="36.06 204.47 219.82 83.96 153.8 155.53 36.06 204.47"
                  className="flip-ring flip-dashed"
                />
                <polygon
                  points="56.55 181.49 219.82 83.96 153.8 155.53 56.55 181.49"
                  className="flip-ring flip-outer"
                />
              </g>
              <g id="flip3" className={currentStep === 3 ? '' : 'none'}>
                <text x="0" y="10" fontSize="12">
                  3 / 4
                </text>
                <text x="0" y="24" fontSize="12">
                  Simplify the second point to the grid
                </text>
                <polygon
                  points="36.06 204.47 219.82 83.96 153.8 155.53 36.06 204.47"
                  className="flip-ring flip-dashed"
                />
                <polygon
                  points="56.55 181.49 180.46 118.51 153.8 155.53 56.55 181.49"
                  className="flip-ring flip-outer"
                />
              </g>
              <g id="flip4" className={currentStep === 4 ? '' : 'none'}>
                <text x="0" y="10" fontSize="12">
                  4 / 4
                </text>
                <text x="0" y="24" fontSize="12">
                  Simplifying the final point flips the
                </text>
                <text x="0" y="38" fontSize="12">
                  triangle and reverses the winding order
                </text>
                <polygon
                  points="36.06 204.47 219.82 83.96 153.8 155.53 36.06 204.47"
                  className="flip-ring flip-dashed"
                />
                <polygon
                  points="56.55 181.49 180.46 118.51 119.54 119.54 56.55 181.49"
                  className="flip-ring flip-inner"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export { NotIncludedDiagram };
