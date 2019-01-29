---
title: Mapbox Terrain
description: Some description.
options: full
class: fill-light
---

<pre class='fill-darken3 dark round'>
<span class='quiet'>Source ID:</span>
<strong>mapbox.mapbox-terrain-v2</strong>
</pre>

This is a guide to the layers and data inside the Mapbox Terrain vector tile source to help with styling.

## Overview

Mapbox Terrain provides hillshades, elevation contours, and landcover data all in vector form.

Mapbox Terrain is based on data from a variety of sources - see [the about page](https://www.mapbox.com/about/maps/) for details. When using the Mapbox Terrain layer publicly in a design or application you must provide [proper attribution](https://www.mapbox.com/help/attribution/).

## Changelog

A summary of the changes from v1:

- Various elevation data improvements and updates (notably over most of Europe and Africa)
- __`class`__ field in the [#hillshade](#hillshade) layer simplified to just 2 classes: `highlight`, `shadow`
- `level` field added to the [#hillshade](#hillshade) layer for more granular styling
- Coastlines have an `index` value of `-1` in the [#contour](#contour) layer

## Layer Reference


<!-- LANDCOVER -->
<a class='doc-section' id='landcover'></a>
<h3><a href='#landcover'>#landcover</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>8</strong>
    </div>
</h3>

The landcover layer provides a generalized backdrop of vegetation, agriculture, and permanent ice & snow. It is intended for stylistic use and not appropriate for science or other analysis. Empty space in the landcover layer represents either water or bare earth, rock, sand, and built-up areas.

<h4>Classes</h4>

The __`class`__ field is used for styling different types of landcover. The classes are designed to look best when there is a smooth color gradient across from wood → scrub → grass → crop → map background → snow. Thin strips of "grass" or "crop" along the edge of a wooded area might not necessarily represent actual grass or cropland, but are there to smooth the transition from wood to bare land.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'wood'</code></td><td>The area is mostly wooded or forest-like.</td></tr>
<tr><td><code>'scrub'</code></td><td>The area is either mostly bushy or a mix of wooded and grassy</td></tr>
<tr><td><code>'grass'</code></td><td>The area is mostly grassy.</td></tr>
<tr><td><code>'crop'</code></td><td>The area is mostly agricultural, or thin/patchy grass</td></tr>
<tr><td><code>'snow'</code></td><td>The area is mostly permanent ice, glacier or snow</td></tr>
</table>

<pre>
<span class='quiet'>CartoCSS Example:</span>
Map { background-color: cornsilk; }
#landcover {
  [class='wood'] { polygon-fill: darkseagreen; }
  [class='scrub'] { polygon-fill: mix(darkseagreen,cornsilk,75%); }
  [class='grass'] { polygon-fill: mix(darkseagreen,cornsilk,50%); }
  [class='crop'] { polygon-fill: mix(darkseagreen,cornsilk,25%); }
  [class='snow'] { polygon-fill: white; }
}
</pre>


<!-- HILLSHADE -->
<a class='doc-section' id='hillshade'></a>
<h3><a href='#hillshade'>#hillshade</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>8</strong>
    </div>
</h3>

The hillshade layer contains polygons that when styled appropriately display shaded relief of hills. The lighting direction is not realistic, but from the north-west (as is traditional in shaded relief).

At zoom levels above 14 you may want to blur, fade, or completely hide the hillshade layer as the resolution of the data is not enough to hold up at the largest scales.

<h4>Classes</h4>

The __`class`__ field is for simple styling of the different levels of light and shadow. With low `polygon-opacity` or certain `polygon-comp-op` settings, you can style all 6 brightness levels with just 2 filters.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'shadow'</code></td><td>These should be styled darker than the background color.</td></tr>
<tr><td><code>'highlight'</code></td><td>These should be styled lighter than the background color.</td></tr>
</table>

<pre>
<span class='quiet'>CartoCSS Example</span>
#hillshade {
  [class='shadow'] {
    polygon-fill: black;
    polygon-opacity: 0.05;
  }
  [class='highlight'] {
    polygon-fill: white;
    polygon-opacity: 0.10;
  }
}
</pre>

<h4>Levels</h4>

The __`level`__ field allows for more granular styling of the different levels of light and shadow. The numbers represent the brightness threshold percentages that were used to generate the hillshading polygons.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>94</code></td><td>The brightest highlights</td></tr>
<tr><td><code>90</code></td><td>Medium highlights</td></tr>
<tr><td><code>89</code></td><td>Areas of faint shadow</td></tr>
<tr><td><code>78</code></td><td>Areas of medium shadow</td></tr>
<tr><td><code>67</code></td><td>Areas of dark shadow</td></tr>
<tr><td><code>56</code></td><td>Areas of extreme shadow</td></tr>
</table>

<pre>
<span class='quiet'>CartoCSS Example</span>
#hillshade[class='shadow'] {
  polygon-fill: black;
  [level=89] { polygon-opacity: 0.02; }
  [level=78] { polygon-opacity: 0.04; }
  [level=67] { polygon-opacity: 0.06; }
  [level=56] { polygon-opacity: 0.08; }
}
</pre>


<!-- CONTOUR -->
<a class='doc-section' id='contour'></a>
<h3><a href='#contour'>#contour</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

Contour lines indicate vertical dimension on a region by joining points of equal elevation. Full contour line coverage begins at zoom 12, while index lines are available at zoom 9 + in values specified below.

<h4>Elevation</h4>

The __`ele`__ field stores the elevation of each contour line in meters and can be used for labeling or filtering. Ideally the values range from <code>-410</code> near the shore of the Dead Sea to <code>8840</code> near the peak of Mt Everest, but due to bugs and inconsistencies values outside this range may exist.

<table class='small'>
<tr><th>Zoom level</th><th>Contour Interval</th></tr>
<tr><td> 9 </td><td>500 meters</td></tr>
<tr><td>10 </td><td>200 meters</td></tr>
<tr><td>11 </td><td>100 meters</td></tr>
<tr><td>12 </td><td> 50 meters</td></tr>
<tr><td>13 </td><td> 20 meters</td></tr>
<tr><td>14+</td><td> 10 meters</td></tr>
</table>

<pre>
<span class='quiet'>CartoCSS Example:</span>
#contour {
  text-name: [ele]+' m';
  text-face-name: 'Open Sans Regular';
}
</pre>

<h4>Index lines</h4>

The __`index`__ field can be used to accentuate index contours, but it can also be used to reduce the contour density if you wish. The highest value that applies to a contour will be the __`index`__ value, so if you want to highlight every fifth line, you need to select both `index=5` and `index=10`. If you want to highlight every other line, you need to select both `index=2` and `index=10` (or both `index=1` and `index=5`).

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>-1</code></td><td>Sea level coastline</td></tr>
<tr><td><code> 1</code></td><td>Every 1st line</td></tr>
<tr><td><code> 2</code></td><td>Every 2nd line</td></tr>
<tr><td><code> 5</code></td><td>Every 5th line</td></tr>
<tr><td><code>10</code></td><td>Every 10th line</td></tr>
</table>

<p><pre><span class='quiet'>CartoCSS Example:</span>
#contour {
  <em>// only show every other contour line</em>
  [index=10], [ele=2] { line-width: 1; }
}
</pre></p>
