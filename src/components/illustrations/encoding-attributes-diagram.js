/* @flow */
import React from 'react';

class EncodingAttributesDiagram extends React.PureComponent {
  render() {
    return (
      <div id="js-example-encoding" class="js-example clearfix">
        <p class="fallback-hide fill-darken0 round inline pad2x pad1y">
          Hover over the features and the properties of the GeoJSON.
        </p>
      </div>
    );
  }
}

export { EncodingAttributesDiagram };

/* <div class="js-example-body col12">
          <div class="col6 pad1">
            <h3>Original geojson</h3>
      <div class="code">{
        "type": "FeatureCollection",
          "features": [
          <span class='feature' data-feat='1' id='thisthing'>{
        "geometry": { ... },
        "type": "Feature",
        "properties": {
          <span class='attr gj' data-attr='1' data-key='hello' data-value='world'>"hello": "world",</span>
          <span class='attr gj' data-attr='2' data-key='h' data-value='world'>"h": "world",</span>
          <span class='attr gj' data-attr='3' data-key='count' data-value='123'>"count": 1.23</span>
        }
      },</span>
          <span class='feature' data-feat='2'>{
        "geometry": { ... },
        "type": "Feature",
        "properties": {
          <span class='attr gj' data-attr='4' data-key='hello' data-value='again'>"hello": "again",</span>
          <span class='attr gj' data-attr='5' data-key='count' data-value='2'>"count": 2</span>
        }
      }</span>
        ]
      }</div>

      </div>
          <div class="col6 pad1">
            <h3>Final vector tile</h3>
      <div class="code">layers {
        version: 2
        name: "points"
        <span class='feat' id='feat1'>features: {
        id: 1
        <span class='tagset' id='attr1'><span class='tag-key'>tags: 0</span>
      <span class='tag-value'>tags: 0</span></span>
        <span class='tagset' id='attr2'><span class='tag-key'>tags: 1</span>
      <span class='tag-value'>tags: 0</span></span>
        <span class='tagset' id='attr3'><span class='tag-key'>tags: 2</span>
      <span class='tag-value'>tags: 1</span></span>
        type: Point
        geometry: ...
      }</span>
        <span class='feat' id='feat2'>features {
        id: 2
        <span class='tagset' id='attr4'><span class='tag-key'>tags: 0</span>
      <span class='tag-value'>tags: 2</span></span>
        <span class='tagset' id='attr5'><span class='tag-key'>tags: 2</span>
      <span class='tag-value'>tags: 3</span></span>
        type: Point
        geometry: ...
      }</span>
      <span class='key-group'>  <span class='key' id='key-hello'>keys: "hello"</span>
        <span class='key' id='key-h'>keys: "h"</span>
        <span class='key' id='key-count'>keys: "count"</span></span>
      <span class='value-group'>  <span class='value' id='value-world'>values: {
        string_value: "world"
      }</span>
        <span class='value' id='value-123'>values: {
        double_value: 1.23
      }</span>
        <span class='value' id='value-again'>values: {
        string_value: "again"
      }</span>
        <span class='value' id='value-2'>values: {
        int_value: 2
      }</span></span>
        extent: 4096
      }</div>
            </div>
        </div> */

// <script>
// // attr encoding example
// $('.feature').on('mouseenter', featureEnter);
// $('.feature').on('mouseleave', featureLeave);

// function featureEnter(e) {
//   var id = $(this).attr('data-feat');
//   $('#feat'+id).addClass('highlight');
// }
// function featureLeave(e) {
//   $('.feat').removeClass('highlight');
// }

// $('.attr').on('mouseenter', attrEnter);
// $('.attr').on('mouseleave', attrLeave);
// function attrEnter(e) {
//   $('#attr'+$(this).attr('data-attr')).addClass('highlight');
//   $('#key-'+$(this).attr('data-key')).addClass('highlight');
//   $('#value-'+$(this).attr('data-value')).addClass('highlight');
//   $('.key-group, .value-group').addClass('highlight');
// }
// function attrLeave(e) {
//   $('.tagset, .key, .value, .key-group, .value-group').removeClass('highlight');
// }
// </script>
