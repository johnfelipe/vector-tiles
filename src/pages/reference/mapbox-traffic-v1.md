---
title: Mapbox Traffic v1
description: Some description.
options: full
class: fill-light
prependJs:
  - "import * as constants from '../../constants';"
---

<pre class='fill-darken3 dark round'>
<span class='quiet'>Source ID:</span>
<strong>mapbox.mapbox-traffic-v1</strong>
</pre>

This is a guide to the layers and data inside the Mapbox Traffic vector tile source to help with styling.

## Overview

Mapbox Traffic provides constantly updating congestion information on top of [Mapbox Streets](https://www.mapbox.com/maps/streets/) road geometries.

When you publicly use styles or software that use Mapbox Traffic vector tiles, you must [display proper attribution](https://www.mapbox.com/help/attribution/).

![](https://api.mapbox.com/styles/v1/mapbox/traffic-day-v2/tiles/256/14/4823/6160?access_token={{constants.ACCESS_TOKEN}})

### Line offsets

Mapbox Traffic can be used to display congestion for both directions on two way roads. When styling congestion, it's recommended that you add a positive `line-offset` to the layer to visually separate the directions of travel.

In regions that use left-hand traffic, road directions are reversed to allow for consistent `line-offset` styling of all roads.

### Data updates

Mapbox Traffic receives two different types of data updates:

- Traffic speeds and densities: used to derive congestion, updated approximately every 8 minutes
- Road geometries: based on OpenStreetMap, periodically updated


## Layer Reference

<a class='doc-section' id='traffic'></a>
<h3><a href='#traffic'>#traffic</a>
    <div class='geomtype' title='lines'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

<h4>Classes</h4>

The main field used for styling traffic layers is __`class`__.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'motorway'</code></td><td>High-speed, grade-separated highways</td></tr>
<tr><td><code>'motorway_link'</code></td><td>Interchanges / on & off ramps</td></tr>
<tr><td><code>'trunk'</code></td><td>Important roads that are not motorways.</td></tr>
<tr><td><code>'trunk_link'</code></td><td>Ramps and physically separated at-grade turning lanes connecting trunks to other roads.</td></tr>
<tr><td><code>'primary'</code></td><td>A major highway linking large towns.</td></tr>
<tr><td><code>'primary_link'</code></td><td>Ramps and physically separated at-grade turning lanes connecting primary roads to other roads.</td></tr>
<tr><td><code>'secondary'</code></td><td>A highway linking large towns.</td></tr>
<tr><td><code>'tertiary'</code></td><td>A road linking small settlements, or the local centres of a large town or city.</td></tr>
<tr><td><code>'link'</code></td><td>Secondary and tertiary link roads</td></tr>
<tr><td><code>'street'</code></td><td>Standard unclassified, residential, road, and living_street road types</td></tr>
<tr><td><code>'service'</code></td><td>Access roads, alleys, agricultural tracks, and other services roads. Also includes parking lot aisles, public & private driveways.</td></tr>
</table>

<h4>Structure</h4>

The __`structure`__ field describes the grade of a road. Bridges and tunnels are not distinct from surface roads until zoom level 13.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'bridge'</code></td><td>Roads that lead over a bridge.</td></tr>
<tr><td><code>'tunnel'</code></td><td>Roads that run underground.</td></tr>
<tr><td><em>no value</em></td><td>Surface roads and fords.</td></tr>
</table>

<h4>Congestion</h4>

The __`congestion`__ field is a measure of the relative slowdown a road segment is experiencing.

<table class='small'>
<tr><th>Value</th></tr>
<tr><td><code>'low'</code></td></tr>
<tr><td><code>'moderate'</code></td></tr>
<tr><td><code>'heavy'</code></td></tr>
<tr><td><code>'severe'</code></td></tr>
</table>

<h4>Road Closures</h4>

The __`closed`__ field marks roads that are currently closed.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'yes'</code></td><td>Roads that are closed.</td></tr>
<tr><td><em>no value</em></td><td>Roads that are open.</td></tr>
</table>
