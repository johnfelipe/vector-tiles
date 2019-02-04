/* @flow */
import React from 'react';
import AppropriateImage from '../appropriate-image';

class WindingOrderDiagram extends React.PureComponent {
  render() {
    return (
      <div className="js-example-body">
        <div className="wo-block grid grid--gut12 py12 clearfix">
          <div className="col col--6-ml col--12 mb0-ml mb24 px12 block-ml none">
            <strong>Description</strong>
          </div>
          <div className="col col--3-ml col--6 px12 align-center block-ml none">
            <strong>Winding order</strong>
          </div>
          <div className="col col--3-ml col--6 px12 align-center block-ml none">
            <strong>Rendered</strong>
          </div>
        </div>
        <div className="wo-block grid grid--gut12 py12 clearfix">
          <div className="col col--6-ml col--12 mb0-ml mb24 px12">
            <p>
              A single ring, in clockwise order is rendered as a single, solid
              polygon.
            </p>
            <pre>
              <code>Ring 1: Clockwise</code>
            </pre>
          </div>
          <div className="col col--3-ml col--6 px12 rotating-rings">
            <AppropriateImage
              imageId="cw"
              className="ring outer cw"
              id="axis-bump"
            />
          </div>
          <div className="col col--3-ml col--6 px12">
            <AppropriateImage imageId="wo1" className="render" />
          </div>
        </div>
        <div className="wo-block grid grid--gut12 py12 clearfix">
          <div className="col col--6-ml col--12 mb0-ml mb24 px12">
            <p>
              Two rings with the same winding order will render as two unique
              polygons overlapping.
            </p>
            <pre>
              <code>Ring 1: Clockwise Ring 2: Clockwise</code>
            </pre>
          </div>
          <div className="col col--3-ml col--6 px12 rotating-rings">
            <AppropriateImage imageId="cw" className="ring outer cw" />
            <AppropriateImage imageId="cw" className="ring inner cw" />
          </div>
          <div className="col col--3-ml col--6 px12">
            <AppropriateImage imageId="wo2" className="render" />
          </div>
        </div>
        <div className="wo-block grid grid--gut12 py12 clearfix">
          <div className="col col--6-ml col--12 mb0-ml mb24 px12">
            <p>
              Two rings, the first (exterior) ring is in clockwise order, while
              the second is counter-clockwise. This results in a "hole" in the
              final render.
            </p>
            <pre>
              <code>Ring 1: Clockwise Ring 2: Counter-Clockwise</code>
            </pre>
          </div>
          <div className="col col--3-ml col--6 px12 rotating-rings">
            <AppropriateImage imageId="cw" className="ring outer cw" />
            <AppropriateImage imageId="ccw" className="ring inner ccw" />
          </div>
          <div className="col col--3-ml col--6 px12">
            <AppropriateImage imageId="wo3" className="render" />
          </div>
        </div>
        <div className="wo-block grid grid--gut12 py12 clearfix">
          <div className="col col--6-ml col--12 mb0-ml mb24 px12">
            <p>Three rings in a multipolygon that alternate winding order.</p>
            <pre>
              <code>
                Ring 1: Clockwise Ring 2: Counter-Clockwise Ring 3: Clockwise
              </code>
            </pre>
          </div>
          <div className="col col--3-ml col--6 px12 rotating-rings">
            <AppropriateImage imageId="cw" className="ring outer cw" />
            <AppropriateImage imageId="ccw" className="ring inner ccw" />
            <AppropriateImage imageId="cw" className="ring outer small cw" />
          </div>
          <div className="col col--3-ml col--6 px12">
            <AppropriateImage imageId="wo5" className="render" />
          </div>
        </div>
      </div>
    );
  }
}

export { WindingOrderDiagram };

/*

*/
