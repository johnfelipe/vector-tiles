---
title: Mapbox Streets v6
description: Some description.
options: full
class: fill-light
---

<!-- STYLE GUIDELINES

References to layer names should include the hash and link to that layer's
section, eg:

    The [#water](#water) layer...

References to field names in body text should be in code tags and bolded.
References to field values should be in code tags, and if the value is a string
is should be in single quotes as if you are using it in CartoCSS, eg:

    The __`maritime`__ field value is either `1` or `0`.
    The `'street_limited'` value refers to...

-->

<pre class='fill-darken3 dark round'>
<span class='quiet'>Source ID:</span>
<strong>mapbox.mapbox-streets-v6</strong>
</pre>

This is an in-depth guide to the data inside the Mapbox Streets vector tile source to help with styling. For a complete and documented example of using Mapbox Streets vector tiles to style a Mapbox Studio Classic project, check out the [OSM Bright project for Mapbox Studio Classic](https://github.com/mapbox/osm-bright.tm2).

## Overview

<h3>OpenStreetMap</h3>

Mapbox Streets vector tiles are largely based on data from [OpenStreetMap](http://openstreetmap.org), a free & global source of geographic data built by volunteers. An understanding of the OSM data structure and tagging system is not neccessary to make use of Mapbox Streets vector tiles, though it's helpful to understand some of the details.

When you publicly use styles or software that use Mapbox Streets vector tiles, you must [display proper attribution](https://www.mapbox.com/help/attribution/).

<h3>Name fields</h3>

There are 7 different name fields for each of the label layers:

<table class='small space-bottom2'>
<tr><th>Field</th><th>Description</th></tr>
<tr><td><code><strong>name</strong></code></td><td>The name (or names) used locally for the place.</td></tr>
<tr><td><code><strong>name_en</strong></code></td><td>English (if available, otherwise same as name)</td></tr>
<tr><td><code><strong>name_es</strong></code></td><td>Spanish (if available, otherwise same as name_en)</td></tr>
<tr><td><code><strong>name_fr</strong></code></td><td>French (if available, otherwise same as name_en)</td></tr>
<tr><td><code><strong>name_de</strong></code></td><td>German (if available, otherwise same as name_en)</td></tr>
<tr><td><code><strong>name_ru</strong></code></td><td>Russian (if available, otherwise same as name)</td></tr>
<tr><td><code><strong>name_zh</strong></code></td><td>Chinese&#42; (if available, otherwise same as name)</td></tr>
</table>

&#42; The `name_zh` field contains Mandarin using simplified Chinese characters for our custom label layers: `#country_label`, `#state_label`, and `#marine_label`. All other label layers are sourced from OpenStreetMap and may contain one of several dialects and either simplified or traditional Chinese characters in the `name_zh` field.

<h3>OSM IDs</h3>

Most layers in the Mapbox Streets vector tile source have an __`osm_id`__ field. The values for this field are integers based on the IDs assigned to objects in the main [OpenStreetMap](http://openstreetmap.org) database.

With raw OSM IDs it's possible for two different objects of different types to share the same ID, but the Mapbox __`osm_id`__ is modified such that a layer containing a mix of object types will not contain any duplicate IDs. The following modification rules are in place, providing non-overlapping IDs to work with while keeping the original IDs simple to deduce at a glance.

<table class='small'>
<tr><th>Original OSM object</th><th>Vector tile geometry</th><th>ID transform</th><th>Example</th></tr>
<tr><td>node</td><td>point</td><td>original + 10<sup>15</sup></td><td>123 → 1000000000000123</td></tr>
<tr><td>way</td><td>line</td><td>none</td><td>123 → 123</td></tr>
<tr><td>way</td><td>polygon, point</td><td>original + 10<sup>12</sup></td><td>123 → 1000000000123</td></tr>
<tr><td>relation</td><td>line</td><td>original + 2×10<sup>12</sup></td><td>123 → 2000000000123</td></tr>
<tr><td>relation</td><td>polygon, point</td><td>original + 3×10<sup>12</sup></td><td>123 → 3000000000123</td></tr>
</table>

Some objects in the vector tiles are the result of merging multple OSM objects. In these cases, the __`osm_id`__ will be based on just one of the original IDs (and there is no guarantee about which one). Some objects are not from OSM at all, or processed in such a way that the original OSM IDs are unknown (eg. ocean polygons). In these cases, the __`osm_id`__ will be `0`.

<h3>Boolean fields</h3>

Some fields represent a boolean condition; the value may be either true or false. To keep the vector tiles compact these fields are stored as integers, where `0` = false and `1` = true.

<pre>
<span class='quiet'>CartoCSS Examples:</span>
#admin[dispute=1] { <em>/* boundaries that are disputed */</em> }
#road[oneway=0] { <em>/* roads that are not one-way */</em> }
</pre>

<h3>Multiple geometry types</h3>

Mapnik vector tiles support multiple geometry types in the same layer. The Mapbox Streets source takes advantage of this for some layers.

A geometry in the vector tile can be one of 3 types:

1. <span class='small inline icon marker'></span> Point
2. <span class='small inline icon polyline'></span> Linestring / multilinestring
3. <span class='small inline icon polygon'></span> Polygon / multipolygon

In CartoCSS you can select just one or two of the 3 types by filtering on the special `'mapnik::geometry_type'` property.

<pre>
<span class='quiet'>CartoCSS Examples:</span>
#layer['mapnik::geometry_type'=1] { <em>/* point styles */</em> }
#layer['mapnik::geometry_type'=2] { <em>/* line styles */</em> }
#layer['mapnik::geometry_type'=3] { <em>/* polygon styles */</em> }
</pre>

<h3>Data updates</h3>

The current supported version of the Mapbox Streets vector tiles receives regular data updates as new information becomes available and existing information is improved.

<table class='small'>
<tr><th>Layer</th><th>Source</th></tr>
<tr><td>most layers</td><td>OpenStreetMap replication feed</td></tr>
<tr><td><a href='#admin'>#admin</a></td><td>custom OpenStreetMap processing</td></tr>
<tr><td><a href='#water'>#water</a> (ocean parts)</td><td><a href='http://openstreetmapdata.com'>OpenStreetMap Data</a></td></tr>
<tr><td><a href='#marine_label'>#marine_label</a>, <a href='#country_label'>#country_label</a>, <a href='#state_label'>#state_label</a></td><td>custom data</td></tr>
</table>

## Changelog

A summary of the changes from v5:

Mapbox Streets v6 contains 2 major changes that may require extensive reworking of your styles depending on how they've been constructed:

1. The density of features across most layers has been increased to acommodate using the vector tiles in [Mapbox GL](/mapbox-gl) in addition to Mapbox Studio Classic. Some label layers include a `localrank` fields which you can use to reduce the density of those layers in your style. For other layers, you may wish to adjust your styles to tone down or hide certain features when moving projects from v5 to v6.
2. Most elements will appear 1 or 2 zoom levels lower compared to v5. For example, the `street` class of road was available from zoom level 12 and up in v5, and is now available from zoom level 11 and up. Depending on how your styles have been put together adjustments may be required when moving projects from v5 to v6.

Additionally, v6 includes the following more specific/limited changes:

- The maximum vector tile zoom level has increased from z14 to z15. As always, overzooming to even higher zoom levels for rendering is possible.
    - No style adjustments needed when updating projects from v5.
- New languages for all label layers: Russian & Chinese.
    - No style adjustments needed when updating projects from v5.
- The '#country_label_line' layer has been removed.
    - Style adjustments recommended when updating projects from v5 - CartoCSS styles for this layer will not cause harm but should be removed to avoid confusion.
- New __`iso_code`__ and __`admin_code`__ fields in the [#country_label](#country_label) layer.
    - Style adjustments optional when updating projects from v5 - if you wish to continue showing country codes at low zoom levels you will need to handle this manually.
- The __`scalerank`__ field in the [#country_label](#country_label) layer now ranges from 1-6 instead of 1-8.
    - Style adjustments recommended when updating projects from v5.
- New __`abbr`__ field in the [#state_label](#state_label) layer.
    - Style adjustments optional when updating project from v5 - if you wish to continue showing state abbreviations at low zoom levels you will need to handle this manually.
- New __`maki`__ value in the [#poi_label](#poi_label) layer: `'rocket'`.
    - Style adjustments necessary when updating projects from v5 if they use `[maki]` in a URL expression (eg for `marker-file`). You will need to make sure to add image files to match the new value.
- New __`shield`__ field [#road_label](#road_label) for assigning more specific highway shield designs. Additionally, highway shields in this layer are now points instead of lines for lower zoom levels in order to improve placement & density.
    - Style adjustments recommended when updating projects from v5 - see the [#road_label](#road_label) section for shield styling tips.
- The [#state_label](#state_label) layer now covers China, India, & Mexico
    - No style adjustments necessary when updating projects from v5.


## Layer Reference


<!-- LANDUSE -->
<a class='doc-section' id='landuse'></a>
<h3><a href='#landuse'>#landuse</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

This layer includes polygons representing both land-use and land-cover.

It's common for many different types of landuse/landcover to be overlapping, so the polygons in this layer are ordered by the area of their geometries to ensure smaller objects will not be obscured by larger ones. Pay attention to use of transparency when styling - the overlapping shapes can cause muddied or unexpected colors.

<h4>Classes</h4>

The main field used for styling the landuse layer is __`class`__.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'agriculture'</code></td><td>Various types of crop and farmland</td></tr>
<tr><td><code>'cemetery'</code></td><td>Cemeteries and graveyards</td></tr>
<tr><td><code>'glacier'</code></td><td>Glaciers or permanent ice/snow</td></tr>
<tr><td><code>'grass'</code></td><td>Grasslands, meadows, fields, lawns, etc</td></tr>
<tr><td><code>'hospital'</code></td><td>Hospital grounds</td></tr>
<tr><td><code>'industrial'</code></td><td>Currently only includes airport areas</td></tr>
<tr><td><code>'park'</code></td><td>City parks, village greens, playgrounds, national parks, nature reserves, etc</td></tr>
<tr><td><code>'pitch'</code></td><td>Sports fields & courts of all types</td></tr>
<tr><td><code>'rock'</code></td><td>Bare rock, scree, quarries</td></tr>
<tr><td><code>'sand'</code></td><td>Sand, beaches, dunes</td></tr>
<tr><td><code>'school'</code></td><td>Primary, secondary, post-secondary school grounds</td></tr>
<tr><td><code>'scrub'</code></td><td>Bushes, scrub, heaths</td></tr>
<tr><td><code>'wood'</code></td><td>Woods and forestry areas</td></tr>
</table>


<!-- WATERWAY -->
<a class='doc-section' id='waterway'></a>
<h3><a href='#waterway'>#waterway</a>
    <div class='geomtype' title='lines'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

The waterway layer contains rivers, streams, canals, etc represented as lines.

Wateray classes can represent a wide variety of possible widths. It's best to have your line stying biased toward the smaller end of the scales since larger rivers and canals are usually also represented by polygons in the [#water](#water) layer.

<h4>Classes and types</h4>

The waterway layer has two fields for styling - __`class`__ and __`type`__ - each with similar values.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'river'</code></td><td>Everything from the Amazon down to small creeks a couple meters wide</td></tr>
<tr><td><code>'canal'</code></td><td>Medium to large artificial waterway</td></tr>
<tr><td><code>'stream'</code></td><td>Very small waterway, usually no wider than a meter or two</td></tr>
<tr><td><code>'stream_intermittent'</code></td><td><strong>Class only</strong>. A stream that does not always have water flowing through it.</td></tr>
<tr><td><code>'drain'</code></td><td>Medium to small artificial channel for rainwater drainage, often concrete lined.</td></tr>
<tr><td><code>'ditch'</code></td><td>Small artificial channel dug in the ground for rainwater drainage.</td></tr>
</table>

<pre>
<span class='quiet'>CartoCSS Example:</span>
#waterway {
  [class='stream'], [class='stream_intermittent'] {
    line-color: #ace;
    line-width: 2;
  }
  [class='stream_intermittent'] { line-dasharray, 4, 2; }
}
</pre>

<!-- WATER -->
<a class='doc-section' id='water'></a>
<h3><a href='#water'>#water</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>8</strong>
    </div>
</h3>

This is a simple polygon layer with no differentiating types or classes. Water bodies are filtered and simplified according to scale - only oceans and very large lakes are shown at the lowest zoom levels, while smaller and smaller lakes and ponds appear as you zoom in.

Water polygons sometimes have overlapping pieces with each other, so avoiding CartoCSS styles such as `polygon-opacity` and most `polygon-comp-op` values is recommended. Instead, use the style-level properties `opacity` and `comp-op`.

Drawing outlines on water can be tricky. Since rivers and lakes are often broken into multiple pieces you can end up with seams in the middle of water bodies. A common CartoCSS pattern to avoid this is this blur method to create an inner-glow effect:

<pre>
#water {
  ::shadow { polygon-fill: #07f; }
  ::fill {
    <em>// a white fill and overlay comp-op lighten the polygon-fill from ::shadow.</em>
    polygon-fill: #fff;
    comp-op: soft-light;
    <em>// blurring reveals the polygon fill from ::shadow around the edges of the water</em>
    image-filters: agg-stack-blur(2,2);
  }
}
</pre>

<!-- AEROWAY -->
<a class='doc-section' id='aeroway'></a>
<h3><a href='#aeroway'>#aeroway</a>
    <div class='geomtype' title='lines & polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

The aeroway layer includes both lines and polygons representing runways, helipads, etc.

<h4>Types</h4>

The __`type`__ field separates different types of aeroways for styling.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'runway'</code></td><td>Where planes take off & land</td></tr>
<tr><td><code>'taxiway'</code></td><td>Where planes move between runways, gates, and hangars</td></tr>
<tr><td><code>'apron'</code></td><td>Where planes park, refuel, load</td></tr>
<tr><td><code>'helipad'</code></td><td>Where helicopters take off & land</td></tr>
</table>

<pre>
<span class='quiet'>CartoCSS Example:</span>
#aeroway {
  ['mapnik::geometry_type'=2] {
    line-color: #888;
    [type='runway'] { line-width: 3; }
  }
  ['mapnik::geometry_type'=3] { polygon-fill: #888; }
}
</pre>


<!-- BARRIER_LINE -->
<a class='doc-section' id='barrier_line'></a>
<h3><a href='#barrier_line'>#barrier_line</a>
    <div class='geomtype' title='lines & polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

This layer includes lines and polygons for barriers - things such as walls and fences.

<h4>Classes</h4>

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'cliff'</code></td><td>The precipice of a vertical or very steep drop</td></tr>
<tr><td><code>'fence'</code></td><td>Include various types of fence and wall barriers</td></tr>
<tr><td><code>'gate'</code></td><td>Only gates that are lines or areas are included</td></tr>
<tr><td><code>'hedge'</code></td><td></td></tr>
<tr><td><code>'land'</code></td><td>Includes breakwaters and piers</td></tr>
</table>

Cliff data from OSM is designed such that the left-hand side of the line is the top of the cliff, and the right-hand side is the bottom. See the [Line patterns with images](/tilemill/docs/guides/styling-lines/#line_patterns_with_images) section of the TileMill Styling Lines guide for how to design an appropriate image pattern for cliffs.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#barrier_line[class='fence'] { line-color: #864; }
#barrier_line[class='hedge'] { line-color: #aec; }
</pre>


<!-- BUILDING -->
<a class='doc-section' id='building'></a>
<h3><a href='#building'>#building</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>2</strong>
    </div>
</h3>

This is a simple polygon layer with no differentiating types or classes. Large buildings appear at zoom level 13, and all buildings are included in zoom level 14 and up.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#building {
  polygon-fill: #eca;
  line-color: #864;
}
</pre>


<!-- LANDUSE_OVERLAY -->
<a class='doc-section' id='landuse_overlay'></a>
<h3><a href='#landuse_overlay'>#landuse_overlay</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

This layer is for landuse / landcover polygons that should be drawn above the [#water](#water) layer.

<h4>Classes</h4>

The main field used for styling the landuse_overlay layer is __`class`__.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'wetland'</code></td><td>Wetlands that may include vegetation (marsh, swamp, bog)</td></tr>
<tr><td><code>'wetland_noveg'</code></td><td>Wetlands that probably don't contain vegetation (mud, tidal flat)</td></tr>
</table>

<pre>
<span class='quiet'>CartoCSS Example:</span>
#landuse_overlay[class='wetland'] {
  polygon-pattern-file: url("./icons/wetland.png");
}
</pre>


<!-- TUNNEL, ROAD, & BRIDGE -->
<a class='doc-section' id='tunnel-road-bridge'></a>
<h3><a href='#tunnel-road-bridge'>#tunnel, #road, &amp; #bridge</a>
    <div class='geomtype' title='points, lines, & polygons'>
        <span class='inline small icon marker'></span>
        <span class='inline small icon polyline'></span>
        <span class='inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

The roads layers are some of the most complex ones in Mapbox Streets. Starting at zoom level 12, tunnels and bridges are broken out of the `#road` layer into either `#tunnel` or `#bridge`.

<h4>Classes</h4>

The main field used for styling the tunnel, road, and bridge layers is __`class`__.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'motorway'</code></td><td>High-speed, grade-separated highways</td></tr>
<tr><td><code>'motorway_link'</code></td><td>Interchanges / on & off ramps</td></tr>
<tr><td><code>'main'</code></td><td>Trunk, primary, secondary, and tertiary roads & links lumped together for simpler styling.</td></tr>
<tr><td><code>'street'</code></td><td>Standard unclassified or residential streets</td></tr>
<tr><td><code>'street_limited'</code></td><td>Streets that may have limited or no access for motor vehicles. Pedestrian streets, roads under construction, private roads, etc.</td></tr>
<tr><td><code>'service'</code></td><td>Access roads, alleys, agricultural tracks, and other services roads.</td></tr>
<tr><td><code>'driveway'</code></td><td>For very local access. Includes parking lot aisles, public & private driveways</td></tr>
<tr><td><code>'path'</code></td><td>Foot paths, cycle paths, ski trails.</td></tr>
<tr><td><code>'major_rail'</code></td><td>Railways, including mainline, commuter rail, and rapid transit.</td></tr>
<tr><td><code>'minor_rail'</code></td><td>Yard and service railways.</td></tr>
<tr><td><code>'aerialway'</code></td><td>Ski lifts, gondolas, and other types of aerialway.</td></tr>
<tr><td><code>'golf'</code></td><td>The approximate centerline of a golf course hole</td></tr>
</table>

<h4>One-way roads</h4>

A __`oneway`__ field indicates whether the motor traffic on the road is one-way or not. If the road is one-way, traffic travels in the same direction as the linestring.  

<pre>
<span class='quiet'>CartoCSS Example:</span>
#road[oneway=1] {
  marker-file: url(shape://arrow);
  marker-fill: red;
}
</pre>

<h4>Types</h4>

The __`type`__ field is the value of the road's "primary" OpenStreetMap tag. For most roads this is the `highway` tag, but for aerialways it will be the `aerialway` tag, and for golf holes it will be the `golf` tag. See <a href='http://taginfo.openstreetmap.org/keys/highway#values'>Taginfo</a> for a list of used tag values.

<h4>Layers</h4>

The __`layer`__ field is used to determine drawing order of overlapping road segments in the tunnel and bridge layers. 95% of values are -1, 1, or 0, and 99.9999% of values are between -5 and 5.

If you want to ensure proper ordering of overlapping bridges when dealing with styles that involve road casing, you'll need to [manually add some extra code](https://hey.mapbox.com/tm2-carto-patterns/roads-with-casing/) to your project.yml. The `layer` field is intended to be used by this feature, not in your CartoCSS styles directly.

<pre>
<span class='quiet'>project.yml:</span>
_properties:
  bridge:
    "group-by": layer
<em># ...</em>
</pre>


<!-- ADMIN -->
<a class='doc-section' id='admin'></a>
<h3><a href='#admin'>#admin</a>
    <div class='geomtype' title='lines'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

Administrative boundary lines. These are constructed from the OSM data in such a way that there are no overlapping lines where multiple boundary areas meet.

<h4>Administrative level</h4>

The __`admin_level`__ field separates different levels of boundaries, using the same numbering scheme as OpenStreetMap. See [the admin_level wiki page](http://wiki.openstreetmap.org/wiki/Admin_level) for details about what the different values translate to in different countries.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>2</code></td><td>countries</td></tr>
<tr><td><code>3</code></td><td>regions (not commonly used)</td></tr>
<tr><td><code>4</code></td><td>states, provinces, etc.</td></tr>
</table>

<h4>Disputes</h4>

The __`disputed`__ field should be used to apply a dashed or otherwise distinct style to disputed boundaries. No single map of the world will ever keep everybody happy, but acknowledging disputes where they exist is an important aspect of good cartography.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#admin[admin_level=2] {
  line-width: 2;
  [dispute=1] { line-dasharray: 4, 4; }
}
</pre>

<h4>Maritime boundaries</h4>

The __`maritime`__ field can be used as a filter to downplay or hide maritime boundaries, which are often not shown on maps. Note that the practice of tagging maritime boundaries is not entirely consitent or complete within OSM, so some boundaries may not have this field set correctly (this mostly affects admin levels 3 & 4).

<pre>
<span class='quiet'>CartoCSS Example:</span>
#admin {
  [maritime=0] { line-color: black; }
  [maritime=1] { line-color: blue; }
}
</pre>

<h4>ISO 3166-1 Codes</h4>

The __`iso_3166_1`__ field contains the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166) code or codes that apply to a boundary. For subnational boundaries this will be a single code of the parent country. For international boundaries between two countries, the value will be the codes of both countries in alphabetical order, separated by a dash (`-`).

<!-- COUNTRY_LABEL -->
<a class='doc-section' id='country_label'></a>
<h3><a href='#country_label'>#country_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>256</strong>
    </div>
</h3>

This layer contains points used for labeling countries. The points are placed for minimal overlap with small to medium-sized text.

<h4>Names</h4>

See _Name fields_ in the [overview](#Overview) for information about names and translations.

<h4>ISO 3166-1 Code</h4>

The __`iso_code`__ field contains the [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166) 2-letter country code.

<h4>Administrative Code</h4>

For territories and other special entities in the countries layer, the __`admin_code`__ field contains the ISO 3166-1 2-letter country code of the administering or "parent" state.

<h4>Scalerank</h4>

The __`scalerank`__ field is intended to help assign different label styles based on the size and available room to label different countries. The possible values are 1 through 6.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#country_label {
  text-name: [name_en];
  text-face-name: 'Open Sans Semibold';
  text-size: 10;
  [scalerank=0] { text-size: 14; }
  [scalerank=1] { text-size: 13; }
  [scalerank=2] { text-size: 12; }
  [scalerank=3] { text-size: 11; }
}
</pre>

<!-- MARINE_LABEL -->
<a class='doc-section' id='marine_label'></a>
<h3><a href='#marine_label'>#marine_label</a>
    <div class='geomtype' title='lines'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>256</strong>
    </div>
</h3>

Points and lines for labeling major marine features such as oceans, seas, large lakes & bays.

<h4>Names</h4>

See _Name fields_ in the [overview](#Overview) for information about names and translations.

<h4>Labelrank & placement</h4>

The __`labelrank`__ field is intended to help assign different label styles based on the size and available room to label different water bodies. The possible values are whole numbers 1 through 6.

The value of the __`placement`__ field will be either `point` or `line` depending on the geometry type of the object.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#marine_label {
  text-name: [name_en];
  text-face-name: 'Merriweather Italic';
  placement: point;
  [placement='line'] { placement: line; }
  text-size: 12;
  [labelrank=0] { text-size: 20; }
  [labelrank=1] { text-size: 18; }
  [labelrank=2] { text-size: 16; }
  [labelrank=3] { text-size: 15; }
  [labelrank=4] { text-size: 14; }
  [labelrank=5] { text-size: 13; }
}
</pre>


<!-- STATE_LABEL -->
<a class='doc-section' id='state_label'></a>
<h3><a href='#state_label'>#state_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>256</strong>
    </div>
</h3>

Points for labeling states and provinces. Currently only a small number of countries are included.

<h4>Names</h4>

See _Name fields_ in the [overview](#Overview) for information about names and translations.

<h4>Abbreviations</h4>

The __`abbr`__ field contains abbreviated versions of the names suitable for labeling at lower zoom levels.

<h4>Area</h4>

The __`area`__ field is the physical area of the entity in square kilometers. Use it to help filter and size your state labels at different zoom levels.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#state_label {
  text-name: [name];
  text-face-name: 'Open Sans Regular';
  text-size: 12;
  [area>=10000] { text-size: 14; }
  [area>=500000] { text-size: 16; }
  [area>=1000000] { text-size: 18; }
</pre>


<!-- PLACE_LABEL -->
<a class='doc-section' id='place_label'></a>
<h3><a href='#place_label'>#place_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>128</strong>
    </div>
</h3>

This layer contains points for labeling human settlements.

<h4>Names</h4>

See _Name fields_ in the [overview](#Overview) for information about names and translations.

<h4>Types</h4>

The main field for styling labels for different kinds of places is __`type`__.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'city'</code></td><td>Settlement of about 100,000 or more people.</td></tr>
<tr><td><code>'town'</code></td><td>Urban or rural settlement of about 10,000-100,000 people</td></tr>
<tr><td><code>'village'</code></td><td>Usually rural settlement of less than about 10,000</td></tr>
<tr><td><code>'hamlet'</code></td><td>Rural settlement with a population of about 200 or fewer</td></tr>
<tr><td><code>'suburb'</code></td><td>A distinct section of an urban settlement such as an annexed town, historical district, or large & important neighborhood.</td></tr>
<tr><td><code>'neighbourhood'</code></td><td>A named part of a larger settlement</td></tr>
</table>

<h4>Capitals</h4>

The __`capital`__ field allows distinct styling of labels or icons for the capitals of countries, regions, or states & provinces.

<table class='small'>
<tr><th>capital</th><th><em>limited integer</em></th></tr>
<tr><td><code>2</code></td><td>National capital</td></tr>
<tr><td><code>3</code></td><td>Regional capital (uncommon)</td></tr>
<tr><td><code>4</code></td><td>State / provincial capital</td></tr>
</table>

<pre>
<span class='quiet'>CartoCSS Example:</span>
#place_label {
  [capital=2] { marker-file: url("./icons/star-national.svg"); }
  [capital=3] { marker-file: url("./icons/star-region.svg"); }
  [capital=4] { marker-file: url("./icons/star-state.svg"); }
}
</pre>

<h4>Scalerank</h4>

The __`scalerank`__ field can be used to adjust the prominence of label styles for larger and more prominent cities. The value number from 0 through 9, where 0 is the large end of the scale (eg New York City). All places other than large cities will have a scalerank of `null`.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#place_label[type='city] {
  text-name: [name];
  text-face-name: 'Open Sans Regular';
  text-size: 12;
  [scalerank>=0][scalerank<=2] { text-size: 18; }
  [scalerank>=3][scalerank<=4] { text-size: 16; }
  [scalerank>=5][scalerank<=6] { text-size: 14; }
  [scalerank>=7][scalerank<=8] { text-size: 13; }
}
</pre>

<h4>Localrank</h4>

The __`localrank`__ field can be used to adjust the label density by showing fewer labels. This method is preferred to CartoCSS's __`text-min-distance`__ because it leads to far fewer labels clipped across tile boundaries. It is a whole number greater than 0 calculated by grouping places into a 128 pixel grid at each zoom level, then assigning each place a ranking within that grid. The most important place in that 128 pixels will get a __`localrank`__ of 1, the second most important is 2, and so on. Therefore to reduce the label density to 4 labels per tile, you can add the filter `[localrank=1]`.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#place_label[localrank<=1] {
  text-name: [name];
  text-face-name: 'Open Sans Regular';
}
</pre>

<h4>Label direction</h4>

The __`ldir`__ field can be used as a hint for label offset directions at lower zoom levels. For places with a __`scalerank`__ value set, the __`ldir`__ will be a cardinal direction such as `'N'`, `'E'`, `'SW'`.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#place[type='city'] {
  text-name: [name];
  text-face-name: 'Open Sans Regular';
  text-placement-type: simple;
  text-dx: 3;
  text-dy: 3;
  [ldir='N'] { text-placements: 'N'; }
  [ldir='NE'] { text-placements: 'NE'; }
  [ldir='E'] { text-placements: 'E'; }
  [ldir='SE'] { text-placements: 'SE'; }
  [ldir='S'] { text-placements: 'S'; }
  [ldir='SW'] { text-placements: 'SW'; }
  [ldir='W'] { text-placements: 'W'; }
  [ldir='NW'] { text-placements: 'NW'; }
}
</pre>


<!-- WATER_LABEL -->
<a class='doc-section' id='water_label'></a>
<h3><a href='#water_label'>#water_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>64</strong>
    </div>
</h3>

This layer contains points for labeling bodies of water such as lakes and ponds.

<h4>Names</h4>

See _Name fields_ in the [overview](#Overview) for information about names and translations.

<h4>Area</h4>

The __`area`__ field holds the area of the associated water polygon in square meters (Mercator-projected units rounded to the nearest whole number, not real-world area). You can use it to adjust label size and visibility.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#water_label {
  [zoom<=15][area>=200000],
  [zoom=16][area>=50000],
  [zoom=17][area>=10000],
  [zoom>=18][area>0] {
    text-name: [name];
    text-face-name: 'Open Sans Regular';
  }
}
</pre>


<!-- POI_LABEL -->
<a class='doc-section' id='poi_label'></a>
<h3><a href='#poi_label'>#poi_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>128</strong>
    </div>
</h3>

This layer is used to place icons and labels for various points of interest (POIs).

<h4>Names</h4>

See _Name fields_ in the [overview](#Overview) for information about names and translations.

<h4>Maki icons</h4>

The __`maki`__ field is designed to make it easy to add icons to POIs using the [Maki icon project](http://mapbox.com/maki), or with other icons that follow the same naming scheme.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#poi_label[maki!=null] { marker-file: url("icons/[maki].svg"); }
</pre>

Not all Maki icons are used, and different types of related POIs will sometimes have the same __`maki`__ value (eg universities and colleges, or art supply shops and art galleries). The possible values for the __`maki`__ field are listed below.

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1 row3 scroll-styled'>null
'airport'
'airfield'
'alcohol-shop'
'art-gallery'
'bakery'
'bank'
'bar'
'beer'
'bicycle'
'bus'
'cafe'
'car'
'campsite'
'cemetery'
'cinema'
'clothing-store'
'college'
'dog-park'
'embassy'
'entrance'
'fast-food'
'ferry'
'fire-station'
'fuel'
'garden'
'golf'
'grocery'
'harbor'
'heliport'
'hospital'
'laundry'
'library'
'lodging'
'monument'
'museum'
'music'
'park'
'pharmacy'
'camera'
'place-of-worship'
'rail'
'rail-light'
'rail-metro'
'religious-christian'
'religious-jewish'
'religious-muslim'
'rocket'
'police'
'post'
'prison'
'restaurant'
'school'
'shop'
'swimming'
'theatre'
'town-hall'
'suitcase'
'zoo'
</code>
</div>

<h4>Type</h4>

The __`type`__ field contains a more specific classification intended for display - eg 'Cafe', 'Hotel', 'Laundry'. These values come from the original OpenStreetMap tags and are not a limited set.

<h4>Scalerank</h4>

The __`scalerank`__ field is intended to help assign different label styles based on the prominence of different features.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>1</code></td><td>The POI has a very large area</td></tr>
<tr><td><code>2</code></td><td>The POI has a medium-large area</td></tr>
<tr><td><code>3</code></td><td>The POI has a small area, or is of a type that is commonly large and important (eg hospital, university)</td></tr>
<tr><td><code>4</code></td><td>The POI has no known area</td></tr>
</table>

<h4>Controlling label density</h4>

The __`localrank`__ field can be used to adjust the label density by showing fewer labels. This method is preferred to CartoCSS's __`text-min-distance`__ because it leads to far fewer labels clipped across tile boundaries. It is a whole number >=1 calculated by grouping places into a ~300m projected grid, then assigning each place a ranking within that grid. The most important place in each cell will get a __`localrank`__ of 1, the second most important is 2, and so on.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#poi_label {
  [zoom=15][localrank<=1],
  [zoom=16][localrank<=2],
  [zoom=17][localrank<=4] { <em>/* icon styles */</em> }
}
</pre>

<h4>Rail station networks</h4>

The __`network`__ field is aimed at helping assign icons for rail stations - the value will be `null` for all other types of POIs. They don't necessarily correspond to a specific network - eg `u-bahn` applies to any U-Bahn network in Germany. Some stations serve multiple networks; in these cases, multiple network names are joined with a dot (in alphabetical order).

<table class='small'>
<tr><th style='width: 36em'>Value</th><th>Description</th></tr>
<tr><td><code>null</code></td><td>POI is not a rail station</td></tr>
<tr><td><code>'rail'</code></td><td>Default rail station</td></tr>
<tr><td><code>'subway'</code></td><td>Default subway/metro station</td></tr>
<tr><td><code>'light'</code></td><td>Default light rail station</td></tr>
<tr><td><code>'dlr'</code></td><td>Docklands Light Rail, London, UK</td></tr>
<tr><td><code>'dlr.london-overground.london-underground.national-rail'</code></td><td>London, UK</td></tr>
<tr><td><code>'dlr.london-underground'</code></td><td>London, UK</td></tr>
<tr><td><code>'dlr.london-underground.national-rail'</code></td><td>London, UK</td></tr>
<tr><td><code>'dlr.national-rail'</code></td><td>London, UK</td></tr>
<tr><td><code>'london-overground'</code></td><td>London Overground, UK</td></tr>
<tr><td><code>'london-overground.london-underground'</code></td><td>London, UK</td></tr>
<tr><td><code>'london-overground.london-underground.national-rail'</code></td><td>London, UK</td></tr>
<tr><td><code>'london-overground.national-rail'</code></td><td>London, UK</td></tr>
<tr><td><code>'london-underground'</code></td><td>London Underground, UK</td></tr>
<tr><td><code>'london-underground.national-rail'</code></td><td>London, UK</td></tr>
<tr><td><code>'national-rail'</code></td><td>UK</td></tr>
<tr><td><code>'washington-metro'</code></td><td>Washington DC Metro</td></tr>
<tr><td><code>'wiener-linien'</code></td><td>Vienna, Austria</td></tr>
<tr><td><code>'metro'</code></td><td>Paris Metro, France</td></tr>
<tr><td><code>'rer'</code></td><td>Paris regional commuter rail, France</td></tr>
<tr><td><code>'metro.rer'</code></td><td>Paris, France</td></tr>
<tr><td><code>'transilien'</code></td><td>Paris suburban rail, France</td></tr>
<tr><td><code>'rer.transilien'</code></td><td>Paris, France</td></tr>
<tr><td><code>'moscow-metro'</code></td><td>Moscow Metro, Russia</td></tr>
<tr><td><code>'s-bahn'</code></td><td>Germany</td></tr>
<tr><td><code>'u-bahn'</code></td><td>Germany</td></tr>
<tr><td><code>'s-bahn.u-bahn'</code></td><td>Germany</td></tr>
</table>

<h4>Additional information</h4>

The __`ref`__ field is a short reference code that can be used as an alternative name. It is currently only used for airports.

<!-- ROAD_LABEL -->
<a class='doc-section' id='road_label'></a>
<h3><a href='#road_label'>#road_label</a>
    <div class='geomtype' title='points & lines'>
        <span class='      inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>8</strong>
    </div>
</h3>

<h4>Names</h4>

See _Name fields_ in the [overview](#Overview) for information about names and translations.

<h4>Route numbers</h4>

In addition to the standard name fields, there is also a __`ref`__ field that holds any reference codes or route numbers a road may have. From zoom levels 6 through 10, all geometries are points and the only labels are highways shields. From zoom level 11 and up the geometries are all lines.

The __`shield`__ field indicates the style of shield needed for the route. Current possibilities are:

```
'default'
'mx-federal'
'mx-state'
'us-interstate'
'us-interstate-duplex'
'us-interstate-business'
'us-interstate-truck'
'us-highway'
'us-highway-duplex'
'us-highway-alternate'
'us-highway-business'
'us-highway-truck'
'us-state'
```

To aid with shield styling the __`reflen`__ field conveys the number of characters present in the __`ref`__ field. If the ref is 'M27', then the reflen is 3.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#road_label[reflen>=1] {
  shield-name: [ref].replace('·', '\n');
  shield-face-name: 'Open Sans Regular';
  shield-file: url("./img/[shield]-[reflen].png");
}
</pre>


<h4>Classes</h4>

The __`class`__ field for road labels matches the [#tunnel, #road, & #bridge](#tunnel-road-bridge) layers.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'motorway'</code></td><td>High-speed, grade-separated highways</td></tr>
<tr><td><code>'main'</code></td><td>Trunk, primary, secondary, and tertiary roads & links lumped together for simpler styling.</td></tr>
<tr><td><code>'street'</code></td><td>Standard unclassified or residential streets</td></tr>
<tr><td><code>'street_limited'</code></td><td>Streets that may have limited or no access for motor vehicles. Pedestrian streets, roads under construction, private roads, etc.</td></tr>
<tr><td><code>'service'</code></td><td>Access roads, alleys, agricultural tracks, and other services roads.</td></tr>
<tr><td><code>'path'</code></td><td>Foot paths, cycle paths, ski trails.</td></tr>
<tr><td><code>'aerialway'</code></td><td>Ski lifts, gondolas, and other types of aerialway.</td></tr>
<tr><td><code>'golf'</code></td><td>The approximate centerline of a golf course hole</td></tr>
</table>

<h4>Additional information</h4>

The __`len`__ field stores the length of the road segment in projected meters, rounded to the nearest whole number. This can be useful for limiting some label styles to longer roads.


<!-- WATERWAY_LABEL -->
<a class='doc-section' id='waterway_label'></a>
<h3><a href='#waterway_label'>#waterway_label</a>
    <div class='geomtype' title='lines'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>8</strong>
    </div>
</h3>

This layer contains line geometries that match those in the [#waterway](#waterway) layer but with name fields for label rendering.

<h4>Label text</h4>

See _Name fields_ in the [overview](#Overview) for information about names and translations.

<h4>Classes & types</h4>

The __`class`__ and __`type`__ fields match those in the [#waterway](#waterway) layer.

<table class='small'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'river'</code></td><td>Everything from the Amazon down to small creeks a couple meters wide</td></tr>
<tr><td><code>'canal'</code></td><td>Medium to large artificial waterway</td></tr>
<tr><td><code>'stream'</code></td><td>Very small waterway, usually no wider than a meter or two</td></tr>
<tr><td><code>'stream_intermittent'</code></td><td><strong>Class only</strong>. A stream that does not always have water flowing through it.</td></tr>
<tr><td><code>'drain'</code></td><td>Medium to small artificial channel for rainwater drainage, often concrete lined.</td></tr>
<tr><td><code>'ditch'</code></td><td>Small artificial channel dug in the ground for rainwater drainage.</td></tr>
</table>


<!-- HOUSENUM_LABEL -->
<a class='doc-section' id='housenum_label'></a>
<h3><a href='#housenum_label'>#housenum_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>64</strong>
    </div>
</h3>

This layer contains points used to label the street number parts of specific addresses.

The __`house_num`__ field countains house and building numbers. These are commonly integers but may include letters or be only letters, eg "1600", "31B", "D". If an address has no number tag but has a house name or building name, the __`house_num`__ field will be the name instead.

<pre>
<span class='quiet'>CartoCSS Example:</span>
#housenum_label {
  text-name: [house_num];
  text-face-name: 'Open Sans Regular';
}
</pre>
