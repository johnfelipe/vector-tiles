---
title: Enterprise Boundaries v2
description: Some description.
options: full
class: fill-light
---

<div class='note small round'>
<div><strong>Access to Enterprise Boundaries</strong></div>
Access to the Enterprise Boundaries tilesets are controlled by Mapbox account access token. If you do not have access on your account, <a href="https://www.mapbox.com/contact/">contact a Mapbox sales representative</a> to request access to Enterprise Boundaries tilesets.
</div>

## Overview

The Enterprise Boundaries vector tiles do not directly contain detailed feature properties such as names or parent boundary information. Such detailed data is delivered separately as offline lookup tables, allowing the vector tiles to stay small and fast. For more details on how to make use of Enterprise Boundaries for data visualizations, see our [getting started tutorial](/help/get-started-enterprise-boundaries/).

## Tilesets

Enterprise Boundaries are composed of a number of separate tilesets each with their own tileset ID. There are two types of tilesets: lines & areas.

<table class='small space-bottom2'>
<tr><th>Tileset ID</th><th>Description</th></tr>
<tr><td><code>mapbox.enterprise-boundaries-a0-v2</code></td><td>States or territories that have ISO 3166-1 codes, plus Kosovo</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-a1-v2</code></td><td>First-level administrative areas</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-a2-v2</code></td><td>Second-level administrative areas</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-a3-v2</code></td><td>Third-level administrative areas</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-a4-v2</code></td><td>Fourth-level administrative areas</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-a5-v2</code></td><td>Fifth-level administrative areas</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-aL-v2</code></td><td>Administrative division lines for all levels</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-p1-v2</code></td><td>Postal code grouping areas</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-p2-v2</code></td><td>Postal code grouping areas</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-p3-v2</code></td><td>Postal code grouping areas</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-p4-v2</code></td><td>Full-detail postal code areas</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-s1-v2</code></td><td>First-level statistical areas</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-s2-v2</code></td><td>Second-level statistical areas</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-s3-v2</code></td><td>Third-level statistical areas</td></tr>
<tr><td><code>mapbox.enterprise-boundaries-s4-v2</code></td><td>Fourth-level statistical areas</td></tr>
</table>

### Geometry types

Each layer in Enterprise Boundary tilesets will contain one of 3 geometry types:

1. <span class='small inline icon marker'></span> Point
2. <span class='small inline icon polyline'></span> Linestring / multilinestring
3. <span class='small inline icon polygon'></span> Polygon / multipolygon


## Area Layer Reference

<a class='doc-section' id='boundaries'></a>
<h3 class='layer-ref-section'><a href='#boundaries'>boundaries_{type}_{level}</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
    </div>
</h3>

Each area tileset has a layer named `boundaries_{type}_{level}`, where `{type}` is one of `admin`, `postal`, or `stats`, and `{level}` is a number `0` through `5`. The `{type}` and `{level}` values correspond to the given tileset.

#### <!--area--> `id` _text_

The `id` field provides an identifier string for each feature. These IDs are globally unique within a given “worldview”; some are duplicated but only where they represent different versions of the same feature for different worldviews.

#### <!--area--> `worldview` _text_

The vector tiles contain multiple versions of some boundaries, each with a `worldview` value indicating the intended audience. It is important to apply a worldview filter to all of your `admin` style layers, otherwise your map will show conflicting and overlapping boundary lines. The filter should always include both `all` and one of the region-specific values.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>all</code></td><td>Appropriate for all worldviews (most boundaries).</td></tr>
<tr><td><code>CN</code></td><td>Boundaries for a mainland Chinese audience/worldview, but not officially approved for use in the PRC.</td></tr>
<tr><td><code>IN</code></td><td>Boundaries conforming to cartographic requirements for use in India.</td></tr>
<tr><td><code>US</code></td><td>Boundaries for an American audience, & which are generally appropriate outside of China & India. (Lines do not necessarily reflect official US foreign policy.)</td></tr>
</table>

<a class='doc-section' id='boundaries'></a>
<h3 class='layer-ref-section'><a href='#boundaries'>points_{type}_{level}</a>
    <div class='geomtype' title='polygons'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
    </div>
</h3>

Each area tileset has a layer named `points_{type}_{level}`, where `{type}` is one of `admin`, `postal`, or `stats`, and `{level}` is a number `0` through `5`. The `{type}` and `{level}` values correspond to the given tileset.

The `points_*` layers contain approximate center points corresponding to the polygons in the `boundaries_*` layers. They can be used for labeling or for visualizations using symbols. Points are generally available one zoom level lower than the polygons they correspond to.

The point layers have the same two [`id`](#area---id-text) and [`worldview`](#area---worldview-text) fields as the area layers with the same meaning.

## Administrative Line Layer Reference

<a class='doc-section' id='boundaries'></a>
<h3 class='layer-ref-section'><a href='#boundaries'>boundaries_admin_lines</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
    </div>
</h3>

The administrative lines tileset contains a single layer containing boundary lines for all administrative levels (a0 through a5).

#### <!--line--> `id` _text_

Boundary line IDs are usually composed by combining the IDs of the polygons from either side of the line (sorted alphanumerically & separated by a hyphen).

#### <!--line--> `admin_level` _text_

The `admin_level` is a number from 0 through 5 representing the lowest-numbered administrative level the boundary is a part of.

#### <!--line--> `disputed` _text_

Boundary lines with a `disputed` value of `true` should have a dashed or otherwise distinct style applied in styles. No single map of the world will reflect all global perspectives, but acknowledging disputes where they exist is an important aspect of good cartography. The value will always be either `true` or `false` (never _null_).

#### <!--line--> `coastal` _text_

The `coastal` field contains the text `true` or `false` indicating whether the boundary is along a coast or not. Most coastal boundaries are currently ommitted from the line layer, so the values are nearly always `false`.

#### <!--line--> `parent_0` _text_

For boundaries with an `admin_level` of 1 through 5, the `parent_0` value contains the `id` of the level 0 area that contains the boundary. For boundaries with an `admin_level` of 0, the `parent_0` is the same as the line `id`.

#### <!--line--> `worldview` _text_

Same as areas and points; see [documentation above](#area---worldview-text).
