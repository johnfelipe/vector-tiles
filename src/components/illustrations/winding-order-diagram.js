/* @flow */
import React from 'react';

class WindingOrderDiagram extends React.PureComponent {
  render() {
    return <div id="js-example-encoding" class="js-example clearfix" />;
  }
}

export { WindingOrderDiagram };

/*
<div class="js-example-body">
  <div class="wo-block col12 clearfix">
    <div class="col6 pad1"><strong>Description</strong></div>
    <div class="col3 pad1" style="text-align: center;"><strong>Winding order</strong></div>
    <div class="col3 pad1" style="text-align: center;"><strong>Rendered</strong></div>
  </div>
  <div class="wo-block col12 clearfix">
    <div class="col6 pad1">
      <p>A single ring, in clockwise order is rendered as a single, solid polygon.</p>
      <pre><code>Ring 1: Clockwise</code></pre>
    </div>
    <div class="col3 pad1 rotating-rings">
      <div id="winding-order-axis"><div class="axis" id="x-axis"></div><div class="axis" id="y-axis"></div></div>
      <img src="/vector-tiles/images/cw.png" class="ring outer cw" id="axis-bump" />
    </div>
    <div class="col3 pad1">
      <img src="/vector-tiles/images/wo-1.png" class="render" />
    </div>
  </div>
  <div class="wo-block col12 clearfix">
    <div class="col6 pad1">
      <p>Two rings with the same winding order will render as two unique polygons overlapping.</p>
      <pre><code>Ring 1: Clockwise
Ring 2: Clockwise</code></pre></div>
    <div class="col3 pad1 rotating-rings">
      <img src="/vector-tiles/images/cw.png" class="ring outer cw" />
      <img src="/vector-tiles/images/cw.png" class="ring inner cw" />
    </div>
    <div class="col3 pad1">
      <img src="/vector-tiles/images/wo-2.png" class="render" />
    </div>
  </div>
  <div class="wo-block col12 clearfix">
    <div class="col6 pad1">
    <p>Two rings, the first (exterior) ring is in clockwise order, while the second is counter-clockwise. This results in a "hole" in the final render.</p>
    <pre><code>Ring 1: Clockwise
Ring 2: Counter-Clockwise</code></pre></div>
    <div class="col3 pad1 rotating-rings">
      <img src="/vector-tiles/images/cw.png" class="ring outer cw" />
      <img src="/vector-tiles/images/ccw.png" class="ring inner ccw" />
    </div>
    <div class="col3 pad1">
      <img src="/vector-tiles/images/wo-3.png" class="render" />
    </div>
  </div>
  <div class="wo-block col12 clearfix">
    <div class="col6 pad1">
      <p>Three rings in a multipolygon that alternate winding order.</p>
      <pre><code>
        Ring 1: Clockwise
        Ring 2: Counter-Clockwise
        Ring 3: Clockwise
      </code></pre>
    </div>
    <div class="col3 pad1 rotating-rings">
      <img src="/vector-tiles/images/cw.png" class="ring outer cw" />
      <img src="/vector-tiles/images/ccw.png" class="ring inner left ccw" />
      <img src="/vector-tiles/images/cw.png" class="ring outer small cw" />
    </div>
    <div class="col3 pad1">
      <img src="/vector-tiles/images/wo-5.png" class="render" />
    </div>
  </div>
</div>
*/
