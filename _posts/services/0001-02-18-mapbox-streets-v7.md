---
layout: docs
section: developers
category: services
title: Mapbox Streets v7
permalink: /mapbox-streets-v7/
options: full
class: fill-light
subnav:
- title: Overview
  id: overview
- title: Changelog
  id: changelog
- title: Layer Reference
  id: layer-reference
head: |
  <style>
    h3 div.geomtype {
      display: inline-block;
      margin-left: 5px;
      font-family: 'Open Sans Regular', sans-serif;
      font-weight: normal;
      color: #666;
    }
    .geomtype .quiet {
      color: #ddd;
    }
    table.small th:first-child { width: 15em; }
  </style>
---

<!-- STYLE GUIDELINES

References to layer names should include the hash and link to that layer's
section, eg:

    The [#water](#water) layer...

References to field names in body text should be in code tags and bolded.
References to field values should be in code tags, and if the value is a string
is should be in single quotes as if you are using it in JSON, eg:

    The __`maritime`__ field value is either `1` or `0`.
    The `'street_limited'` value refers to...

-->

<pre class='fill-darken3 dark round'>
<span class='quiet'>Source ID:</span>
<strong>mapbox.mapbox-streets-v7</strong>
</pre>

This is an in-depth guide to the data inside the Mapbox Streets vector tile source to help with styling. For full examples of using Mapbox Streets vector tiles to create a map style, check out the default templates in [Mapbox Studio](/studio).


## Overview


<h3>OpenStreetMap</h3>

Mapbox Streets vector tiles are largely based on data from [OpenStreetMap](http://openstreetmap.org), a free & global source of geographic data built by volunteers. An understanding of the OSM data structure and tagging system is not neccessary to make use of Mapbox Streets vector tiles, though it's helpful to understand some of the details.

When you publicly use styles or software that use Mapbox Streets vector tiles, you must [display proper attribution](https://www.mapbox.com/help/attribution/).


<h3>Name fields</h3>

There are 12 different name fields for each of the label layers:

<table class='small space-bottom2'>
<tr><th>Field</th><th>Description</th></tr>
<tr><td><code><strong>name</strong></code></td><td>The name (or names) used locally for the place.</td></tr>
<tr><td><code><strong>name_ar</strong></code></td><td>Arabic (if available, otherwise same as name)</td></tr>
<tr><td><code><strong>name_en</strong></code></td><td>English (if available, otherwise same as name)</td></tr>
<tr><td><code><strong>name_es</strong></code></td><td>Spanish (if available, otherwise same as name_en)</td></tr>
<tr><td><code><strong>name_fr</strong></code></td><td>French (if available, otherwise same as name_en)</td></tr>
<tr><td><code><strong>name_de</strong></code></td><td>German (if available, otherwise same as name_en)</td></tr>
<tr><td><code><strong>name_pt</strong></code></td><td>Portuguese (if available, otherwise same as name_en)</td></tr>
<tr><td><code><strong>name_ru</strong></code></td><td>Russian (if available, otherwise same as name)</td></tr>
<tr><td><code><strong>name_ja</strong></code></td><td>Japanese (if available, otherwise same as name)</td></tr>
<tr><td><code><strong>name_ko</strong></code></td><td>Korean (if available, otherwise same as name)</td></tr>
<tr><td><code><strong>name_zh</strong></code></td><td>Chinese&#42; (if available, otherwise same as name)</td></tr>
<tr><td><code><strong>name_zh-Hans</strong></code></td><td>Simplified Chinese&#42; (if available, otherwise same as name)</td></tr>
</table>

&#42; The `name_zh` field contains Mandarin using simplified Chinese characters for our custom label layers: `#country_label`, `#state_label`, and `#marine_label`. All other label layers are sourced from OpenStreetMap and may contain one of several dialects and either simplified or traditional Chinese characters in the `name_zh` field. The `name_zh-Hans` field is similar, except any Traditional Chinese characters are automatically transformed to Simplified Chinese.


<h3>Boolean fields</h3>

Some fields represent a boolean condition; the value may be either true or false. To keep the vector tiles compact these fields may be stored as integers, where `0` = false and `1` = true.


<h3>Multiple geometry types</h3>

Mapnik vector tiles support multiple geometry types in the same layer. The Mapbox Streets source takes advantage of this for some layers.

A geometry in the vector tile can be one of 3 types:

1. <span class='small inline icon marker'></span> Point
2. <span class='small inline icon polyline'></span> Linestring / multilinestring
3. <span class='small inline icon polygon'></span> Polygon / multipolygon

In Mapbox Studio, you can select one, two, or all three of these geometry types with the Geometry Type toggles in each layer's **Select data** tab.

<h3>Data updates</h3>

The current supported version of the Mapbox Streets vector tiles receives regular data updates as new information becomes available and existing information is improved.

<table class='small space-bottom2'>
<tr><th>Layer</th><th>Source</th></tr>
<tr><td>most layers</td><td>OpenStreetMap replication feed</td></tr>
<tr><td><a href='#admin'>#admin</a></td><td>custom OpenStreetMap processing</td></tr>
<tr><td><a href='#water'>#water</a> (ocean parts)</td><td><a href='http://openstreetmapdata.com'>OpenStreetMap Data</a></td></tr>
<tr><td><a href='#marine_label'>#marine_label</a>, <a href='#country_label'>#country_label</a>, <a href='#state_label'>#state_label</a></td><td>custom data</td></tr>
</table>

<h3>OSM IDs</h3>

OSM IDs are not stored as object properties but as object IDs within the vector tile. This means they are not available for styling via Mapbox Studio, but can still be interacted with via Mapbox GL JS and other vector tile libraries.

OpenStreetMap ID spaces are not unique across node, way, and relation object types. In order to make them unique for vector tiles, the IDs are transformed based on their OpenStreetMap object type.

<table class='small space-bottom2'>
<tr><th>OSM type</th><th>OSM ID transform</th></tr>
<tr><td>node    </td><td><code>id × 10</code>       <em class='quiet'>eg. 123 → 1230</em></td></tr>
<tr><td>way     </td><td><code>(id × 10) + 1</code> <em class='quiet'>eg. 123 → 1231</em></td></tr>
<tr><td>relation</td><td><code>(id × 10) + 4</code> <em class='quiet'>eg. 123 → 1234</em></td></tr>
</table>

In many cases, mulitple objects from OpenStreetMap will be combined into a single object in our vector tiles. For example, water polygons are unioned to avoid seams and road lines are joined to save space and simplify better. In these cases the __`osm_id`__ will either be `0`, or one of the input IDs chosen at random.

## Changelog

A summary of the changes from v6:

Mapbox Streets v7 contains 10 major changes that may require reworking of your styles depending on how they've been constructed:

1. The separate `#bridge` and `#tunnel` layers are gone and  have been merged into `#road`. A new `structure` class field describes whether the road segment is a `bridge`, `tunnel`, `ford`, or `none`. When upgrading from v6, bridge and tunnel style layers should be pointed at the `#road` layer with appropriate filters on the `structure` field. Bridges and tunnels are not distinct from roads until zoom level 13.
2. Major changes to the `class` fields have been made in the [#road](#road) layer:
    - The `main` class has been seperated into `trunk`, `primary`, `secondary`, and `tertiary` classes.
   - The `street` class has been modified to include `unclassified`, `residential`, `road` and `living_street`.
    - The `street_limited` class no longer includes pedestrian streets or roads under construction.
    - New classes:
      - `pedestrian` - includes pedestrian streets, plazas, and public transportation platforms
      - `construction` - includes motor roads under construction (but not service roads, paths, etc)
      - `track` - contains tracks that were part of the `service` class in v6
      - `ferry`
    - The following class names have been unchanged: `motorway`, `motorway_link`, `path`, `golf`, `major_rail`, and `minor_rail`.
    - Class names `main` and `driveway` have been removed.
    - Classes `construction`, `track`, `service`, `path`, `ferry` and `aerialway` pull in additional `type` detail when it is available from OpenStreetMap as outlined in [#road](#road) section.
7. Road labels: new road classes will also apply to their corresponding labels.
4. New possible combination of `shield=us-highway` with `reflen=4`. This may require a new sprite image. New networks added to the `road_label` layer's `shield` field. These will require new sprite images.
4. New layer [#mountain_peak_label](#mountain_peak_label) contains mountain peaks that were in the `poi_label` layer in v6. New fields `elevation_m` & `elevation_ft` contain the peak elevations in meters and feet, respectively. Values are rounded to the nearest integer. New values in the `maki` field: `mountain`, `volcano`.
5. New layer [#airport_label](#airport_label) contains airports that were in the `poi_label` layer in v6.
6. New layer [#rail_station_label](#rail_station_label) contains rail stations that were in the `#poi_label` layer in v6. Major changes have been made to `network` field values. New networks have been added and existing networks renamed for clarity. If you are using this field to style rail station icons you will need to rename existing sprite images and add new ones. See outlined below in [#rail_station_label](#rail_station_label).
7. National parks and similar parks are now in their own class `national_park` in the `landuse_overlay` layer, whereas in v6 they were part of the `park` class of the `landuse` layer.
9. New `type` values have been added to the `place_label` layer: `island` (moved from `poi_label`), `islet` (moved from `poi_label`), `archipelago`, `residential`, and `aboriginal_lands`.
10. OSM ID tranformation algorithm has changed (see previous section) and are stored as vector tile object IDs rather than standalone fields.


Additionally, v7 includes the following more specific/limited changes:

- Landuse: `class=aboriginal_lands` has been added here from `boundary=aboriginal_lands` and `boundary:type=aboriginal_lands` in OSM.
- POI labels: the `name` field of the `poi_label` layer may be null (in v6, nameless POIs were not included). Nameless POIs will have never have a `maki` value of `marker` (the generic default).
- POI labels: adjustments to existing maki values:
    - `grocery`: now includes marketplaces
    - `shop`: now includes camera and photo shops (`camera` value is removed)
- Gullies: the `class=cliff` features in the barrier_line layer now include `natural=earth_bank` (aka gully) objects from OSM.
- Road labels: 'Park' is no longer abbreviated to 'Pk'.
- Bridges and tunnels are not distinct from roads until zoom level 13.
- Underground buildings: the `building` layer includes a new `underground` field that is either `true` or `false` depending on whether the building is underground (eg a subway station)



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

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'aboriginal_lands'</code></td><td>The boundary of aboriginal lands.</td></tr>
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

The waterway layer contains classes for rivers, streams, canals, etc represented as lines. These classes can represent a wide variety of possible widths. It's best to have your line stying biased toward the smaller end of the scales since larger rivers and canals are usually also represented by polygons in the [#water](#water) layer. Also works best under `#water` layer.

<h4>Classes and types</h4>

The waterway layer has two fields for styling - __`class`__ and __`type`__ - each with similar values.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'river'</code></td><td>Everything from the Amazon down to small creeks a couple meters wide</td></tr>
<tr><td><code>'canal'</code></td><td>Medium to large artificial waterway</td></tr>
<tr><td><code>'stream'</code></td><td>Very small waterway, usually no wider than a meter or two</td></tr>
<tr><td><code>'stream_intermittent'</code></td><td><strong>Class only</strong>. A stream that does not always have water flowing through it.</td></tr>
<tr><td><code>'drain'</code></td><td>Medium to small artificial channel for rainwater drainage, often concrete lined.</td></tr>
<tr><td><code>'ditch'</code></td><td>Small artificial channel dug in the ground for rainwater drainage.</td></tr>
</table>


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

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'runway'</code></td><td>Where planes take off & land</td></tr>
<tr><td><code>'taxiway'</code></td><td>Where planes move between runways, gates, and hangars</td></tr>
<tr><td><code>'apron'</code></td><td>Where planes park, refuel, load</td></tr>
<tr><td><code>'helipad'</code></td><td>Where helicopters take off & land</td></tr>
</table>


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

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'cliff'</code></td><td>The precipice of a vertical or very steep drop, gullies are included</td></tr>
<tr><td><code>'fence'</code></td><td>Include various types of fence and wall barriers</td></tr>
<tr><td><code>'gate'</code></td><td>Only gates that are lines or areas are included</td></tr>
<tr><td><code>'hedge'</code></td><td>A line of closely spaced shrubs and tree species, which form a barrier or mark the boundary of an area</td></tr>
<tr><td><code>'land'</code></td><td>Includes breakwaters and piers</td></tr>
</table>

Cliff data from OSM is designed such that the left-hand side of the line is the top of the cliff, and the right-hand side is the bottom.


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

Large buildings appear at zoom level 13, and all buildings are included in zoom level 14 and up.

<h4>Underground buildings</h4>

The __`underground`__ field is usually `false`, but will be `true` for buildings that are underground (for example, some subway stations).

<h4>Building types</h4>

The __`type`__ field lets you differentiate building parts from building outlines. Building part polygons intended primarily for 3D rendering have a value of `building:part`. Building outlines (covering the full footprint of a building) will have a value of `building` if tagged as `building=yes` on OpenStreetMap, otherwise the value will match the `building` tag from OpenStreetMap ([see TagInfo for common values](http://taginfo.osm.org/keys/building#values)).

<h4>Building heights</h4>

The __`height`__ field contains the height of a building or building part in meters (rounded to the nearest integer). In many cases this value is derived from the `building:levels` tag on OpenStreetMap - we estimate 3 meters per level if no exact height is specified.

The __`min_height`__ field contains the height in meters from the ground to the _bottom_ of a building part, for cases where the bottom of the part is not on the ground. This allows for proper extrusion rendering of things such as sky bridges and cantilevered building parts.

The __`extrude`__ field is `true` or `false` depending one whether the object should be included in 3D-extrusion renderings. For example a complex building might have various `building:part` objects mapped with different heights, in addition to a building object representing the footprint of the entire building. Only the `building:part` objects are needed for 3D rendering, so the full footprint outline will have an `extrude` value of `false`.


<!-- LANDUSE_OVERLAY -->
<a class='doc-section' id='landuse_overlay'></a>
<h3><a href='#landuse_overlay'>#landuse_overlay</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>8</strong>
    </div>
</h3>

This layer is for landuse / landcover polygons that should be drawn above the [#water](#water) layer.

<h4>Classes</h4>

The main field used for styling the landuse_overlay layer is __`class`__.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'national_park'</code></td><td>Relatively large area of land set aside by a government for human recreation and enjoyment, animal and environmental protection</td></tr>
<tr><td><code>'wetland'</code></td><td>Wetlands that may include vegetation (marsh, swamp, bog)</td></tr>
<tr><td><code>'wetland_noveg'</code></td><td>Wetlands that probably don't contain vegetation (mud, tidal flat)</td></tr>
</table>


<!-- ROAD -->
<a class='doc-section' id='road'></a>
<h3><a href='#road'>#road</a>
    <div class='geomtype' title='points, lines, & polygons'>
        <span class='inline small icon marker'></span>
        <span class='inline small icon polyline'></span>
        <span class='inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

The roads layers are some of the most complex ones in Mapbox Streets. Separate `bridge` and `tunnel` layers are gone and  have been merged into road. `structure` field describes whether the road segment is a `bridge`, `tunnel`, `ford`, or `none`. Bridges and tunnels are not distinct from roads until zoom level 13.

<h4>Classes</h4>

The main field used for styling the road layers is __`class`__.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'motorway'</code></td><td>High-speed, grade-separated highways</td></tr>
<tr><td><code>'motorway_link'</code></td><td>Interchanges / on & off ramps</td></tr>
<tr><td><code>'trunk'</code></td><td>Important roads that are not motorways.</td></tr>
<tr><td><code>'primary'</code></td><td>A major highway linking large towns.</td></tr>
<tr><td><code>'secondary'</code></td><td>A highway linking large towns.</td></tr>
<tr><td><code>'tertiary'</code></td><td>A road linking small settlements, or the local centres of a large town or city.</td></tr>
<tr><td><code>'link'</code></td><td>Contains link roads</td></tr>
<tr><td><code>'street'</code></td><td>Standard unclassified, residential, road, and living_street road types</td></tr>
<tr><td><code>'street_limited'</code></td><td>Streets that may have limited or no access for motor vehicles.</td></tr>
<tr><td><code>'pedestrian'</code></td><td>Includes pedestrian streets, plazas, and public transportation platforms.</td></tr>
<tr><td><code>'construction'</code></td><td>Includes motor roads under construction (but not service roads, paths, etc).</td></tr>
<tr><td><code>'track'</code></td><td>Roads mostly for agricultural and forestry use etc.</td></tr>
<tr><td><code>'service'</code></td><td>Access roads, alleys, agricultural tracks, and other services roads. Also includes parking lot aisles, public & private driveways.</td></tr>
<tr><td><code>'ferry'</code></td><td>Those that serves automobiles and no or unspecified automobile service.</td></tr>
<tr><td><code>'path'</code></td><td>Foot paths, cycle paths, ski trails.</td></tr>
<tr><td><code>'major_rail'</code></td><td>Railways, including mainline, commuter rail, and rapid transit.</td></tr>
<tr><td><code>'minor_rail'</code></td><td>Yard and service railways.</td></tr>
<tr><td><code>'aerialway'</code></td><td>Ski lifts, gondolas, and other types of aerialway.</td></tr>
<tr><td><code>'golf'</code></td><td>The approximate centerline of a golf course hole</td></tr>
</table>

<h4>One-way roads</h4>

The __`oneway`__ field will have a value of either `'true'` or `'false'` to indicate whether the motor traffic on the road is one-way or not. If the road is one-way, traffic travels in the same direction as the linestring.


<h4>Types</h4>

The __`type`__ field is the value of the road's "primary" OpenStreetMap tag. For most roads this is the `highway` tag, but for aerialways it will be the `aerialway` tag, and for golf holes it will be the `golf` tag. See <a href='http://taginfo.openstreetmap.org/keys/highway#values'>Taginfo</a> for a list of used tag values. Several classes pull in additional detail when it is available from OpenStreetMap.

Possible `construction` class `type` values:

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1 row3 scroll-styled'>'construction:motorway'
'construction:motorway_link'
'construction:trunk'
'construction:trunk_link'
'construction:primary'
'construction:primary_link'
'construction:secondary'
'construction:secondary_link'
'construction:tertiary'
'construction:tertiary_link'
'construction:unclassifed'
'construction:residential'
'construction:road'
'construction:living_street'
'construction:pedestrian'
'construction'
</code>
</div>

Possible `track` class `type` values:

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1 row3 scroll-styled'>'track:grade1'
'track:grade2'
'track:grade3'
'track:grade4'
'track:grade5'
'track'
</code>
</div>

Possible `service` class `type` values:

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1 row3 scroll-styled'>'service:alley'
'service:emergency_access'
'service:drive_through'
'service:driveway'
'service:parking'
'service:parking_aisle'
'service'
</code>
</div>

For the `path` class, some custom type assignments have been made based on insight from various categorical, physical, and access tags from OpenStreetMap.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'steps'</code></td><td>aka stairs</td></tr>
<tr><td><code>'corridor'</code></td><td>An indoors passageway</td></tr>
<tr><td><code>'sidewalk'</code></td><td>aka 'pavement' in many places outside North America</td></tr>
<tr><td><code>'crossing'</code></td><td>Usually connects sidewalk lines across a road</td></tr>
<tr><td><code>'piste'</code></td><td>Ski & snowboard trails, both downhill and cross-country.</td></tr>
<tr><td><code>'mountain_bike'</code></td><td>Trails used primarily or exclusively for mountain biking</td></tr>
<tr><td><code>'hiking'</code></td><td>Hiking trails or otherwise rough pedestrian paths</td></tr>
<tr><td><code>'trail'</code></td><td>May be suitable for either hiking or mountain biking</td></tr>
<tr><td><code>'cycleway'</code></td><td>Paths primarily or exclusively for cyclists</td></tr>
<tr><td><code>'footway'</code></td><td>Paths primarily or exclusively for pedestrians</td></tr>
<tr><td><code>'path'</code></td><td>Unspecified or mixed-use paths</td></tr>
<tr><td><code>'bridleway'</code></td><td>Equestrian trails</td></tr>
</table>

Possible `ferry` class `type` values:

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'ferry_auto'</code></td><td>Ferry serves automobiles</td></tr>
<tr><td><code>'ferry'</code></td><td>No or unspecified automobile service</td></tr>
</table>


Possible `aerialway` class `type` values:

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'aerialway:cablecar'</code></td><td>Just one or two large cars. The cable forms a loop, but the cars do not loop around, they just move up and down on their own side.</td></tr>
<tr><td><code>'aerialway:gondola'</code></td><td>Many cars on a looped cable.</td></tr>
<tr><td><code>'aerialway:mixed_lift'</code></td><td>Mix of chair lifts and gondolas on the same line; may change seasonally.</td></tr>
<tr><td><code>'aerialway:chair_lift'</code></td><td>Looped cable with a series of single chairs and exposed to the open air.</td></tr>
<tr><td><code>'aerialway:drag_lift'</code></td><td>Includes t-bars, j-bars, platter/button lifts, and tow ropes</td></tr>
<tr><td><code>'aerialway:magic_carpet'</code></td><td>Conveyor belt installed at the level of the snow, some include a canopy or tunnel.</td></tr>
<tr><td><code>'aerialway'</code></td><td>Other or unspecified type of aerialway</td></tr>
</table>

<h4>Layers</h4>

The __`layer`__ field is used to determine drawing order of overlapping road segments in the tunnel and bridge layers. 95% of values are -1, 1, or 0, and 99.9999% of values are between -5 and 5.


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

The __`admin_level`__ field separates different levels of boundaries, using a similar numbering scheme to OpenStreetMap.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>2</code></td><td>Countries</td></tr>
<tr><td><code>3</code></td><td>Some subnational regions or groupings: regions of Papua New Guinea, The Philippines, Venezuela; governorates of Lebanon; federal districts of Russia; some disputed and semi-autonomous regions.</td></tr>
<tr><td><code>4</code></td><td>Most first-level subnational boundaries (states, provinces, etc.)</td></tr>
</table>

<h4>Disputes</h4>

The __`disputed`__ field should be used to apply a dashed or otherwise distinct style to disputed boundaries. No single map of the world will ever keep everybody happy, but acknowledging disputes where they exist is an important aspect of good cartography.

<h4>Maritime boundaries</h4>

The __`maritime`__ field can be used as a filter to downplay or hide maritime boundaries, which are often not shown on maps. Note that the practice of tagging maritime boundaries is not entirely consitent or complete within OSM, so some boundaries may not have this field set correctly (this mostly affects admin levels 3 & 4).

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

See _Name fields_ in the [overview](#overview) for information about names and translations.

<h4>ISO 3166-1 Code</h4>

The __`iso_code`__ field contains the [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166) 2-letter country code.

<h4>Administrative Code</h4>

For territories and other special entities in the countries layer, the __`admin_code`__ field contains the ISO 3166-1 2-letter country code of the administering or "parent" state.

<h4>Scalerank</h4>

The __`scalerank`__ field is intended to help assign different label styles based on the size and available room to label different countries. The possible values are 1 through 6.


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

See _Name fields_ in the [overview](#overview) for information about names and translations.

<h4>Labelrank & placement</h4>

The __`labelrank`__ field is intended to help assign different label styles based on the size and available room to label different water bodies. The possible values are whole numbers 1 through 6.

The value of the __`placement`__ field will be either `point` or `line` depending on the geometry type of the object. (You can also make this distinction with a Geometry Type filter.)


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

See _Name fields_ in the [overview](#overview) for information about names and translations.

<h4>Abbreviations</h4>

The __`abbr`__ field contains abbreviated versions of the names suitable for labeling at lower zoom levels.

<h4>Area</h4>

The __`area`__ field is the physical area of the entity in square kilometers. Use it to help filter and size your state labels at different zoom levels.


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

See _Name fields_ in the [overview](#overview) for information about names and translations.

<h4>Types</h4>

The main field for styling labels for different kinds of places is __`type`__.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'city'</code></td><td>Settlement of about 100,000 or more people.</td></tr>
<tr><td><code>'town'</code></td><td>Urban or rural settlement of about 10,000-100,000 people</td></tr>
<tr><td><code>'village'</code></td><td>Usually rural settlement of less than about 10,000</td></tr>
<tr><td><code>'hamlet'</code></td><td>Rural settlement with a population of about 200 or fewer</td></tr>
<tr><td><code>'suburb'</code></td><td>A distinct section of an urban settlement such as an annexed town, historical district, or large & important neighborhood.</td></tr>
<tr><td><code>'neighbourhood'</code></td><td>A named part of a larger settlement</td></tr>
<tr><td><code>'island'</code></td><td></td></tr>
<tr><td><code>'islet'</code></td><td>A very small island.</td></tr>
<tr><td><code>'archipelago'</code></td><td>Collective name for a group of islands</td></tr>
<tr><td><code>'residential'</code></td><td>Named residential areas, including subdivisions and apartment complexes</td></tr>
<tr><td><code>'aboriginal_lands'</code></td><td>Reservations and other aboriginal lands</td></tr>
</table>

<h4>Capitals</h4>

The __`capital`__ field allows distinct styling of labels or icons for the capitals of countries, regions, or states & provinces. The value of this field may be `2`, `3`, `4`, `5`, or `6`. National capitals are `2`, and `3` through `6` represent capitals of various sub-national administrative entities. These levels come from OpenStreetMap and have different meanings in different countries - see [the OpenStreetMap wiki](http://wiki.openstreetmap.org/wiki/Tag:boundary%3Dadministrative#admin_level) for specific details.

<h4>Scalerank</h4>

The __`scalerank`__ field can be used to adjust the prominence of label styles for larger and more prominent cities. The value number from 0 through 9, where 0 is the large end of the scale (eg New York City). All places other than large cities will have a scalerank of `null`.

<h4>Localrank</h4>

The __`localrank`__ field can be used to adjust the label density by showing fewer labels. It is a whole number greater than 0 calculated by grouping places into a 128 pixel grid at each zoom level, then assigning each place a ranking within that grid. The most important place in that 128 pixels will get a __`localrank`__ of 1, the second most important is 2, and so on. Therefore to reduce the label density to 4 labels per tile, you can add the filter `[localrank=1]`.

<h4>Label direction</h4>

The __`ldir`__ field can be used as a hint for label offset directions at lower zoom levels. For places with a __`scalerank`__ value set, the __`ldir`__ will be a cardinal direction such as `'N'`, `'E'`, `'SW'`.


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

See _Name fields_ in the [overview](#overview) for information about names and translations.

<h4>Area</h4>

The __`area`__ field holds the area of the associated water polygon in square meters (Mercator-projected units rounded to the nearest whole number, not real-world area). You can use it to adjust label size and visibility.


<!-- POI_LABEL -->
<a class='doc-section' id='poi_label'></a>
<h3><a href='#poi_label'>#poi_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>64</strong>
    </div>
</h3>

This layer is used to place icons and labels for various points of interest (POIs).

<h4>Names</h4>

See _Name fields_ in the [overview](#overview) for information about names and translations.

<h4>Maki icons</h4>

The __`maki`__ field is designed to make it easy to add icons to POIs using the [Maki icon project](http://mapbox.com/maki), or with other icons that follow the same naming scheme.


Not all Maki icons are used, and different types of related POIs will sometimes have the same __`maki`__ value (eg universities and colleges, or art supply shops and art galleries). Nameless POIs will have never have a maki value of marker (the generic default). The possible values for the __`maki`__ field are listed below.

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1 row3 scroll-styled'>null
'airfield'
'alcohol-shop'
'amusement-park'
'aquarium'
'art-gallery'
'attraction'
'bakery'
'bank'
'bar'
'beer'
'bicycle'
'bicycle-share'
'bus'
'cafe'
'car'
'campsite'
'castle'
'cemetery'
'cinema'
'clothing-store'
'college'
'dentist'
'doctor'
'dog-park'
'drinking-water'
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
'ice-cream'
'information'
'laundry'
'library'
'lodging'
'monument'
'museum'
'music'
'park'
'pharmacy'
'picnic-site'
'place-of-worship'
'playground'
'police'
'post'
'prison'
'religious-christian'
'religious-jewish'
'religious-muslim'
'restaurant'
'rocket'
'school'
'shop'
'stadium'
'swimming'
'suitcase'
'theatre'
'toilet'
'town-hall'
'veterinary'
'zoo'
</code>
</div>

<h4>Type</h4>

The __`type`__ field contains a more specific classification intended for display - eg 'Cafe', 'Hotel', 'Laundry'. These values come from the original OpenStreetMap tags and are not a limited set.

<h4>Scalerank</h4>

The __`scalerank`__ field is intended to help assign different label styles based on the prominence of different features.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>1</code></td><td>The POI has a very large area</td></tr>
<tr><td><code>2</code></td><td>The POI has a medium-large area</td></tr>
<tr><td><code>3</code></td><td>The POI has a small area, or is of a type that is commonly large and important (eg hospital, university)</td></tr>
<tr><td><code>4</code></td><td>The POI has no known area</td></tr>
<tr><td><code>5</code></td><td>The POI has no name</td></tr>
</table>

<h4>Controlling label density</h4>

The __`localrank`__ field can be used to adjust the label density by showing fewer labels. It is a whole number >=1 calculated by grouping places into a ~300m projected grid, then assigning each place a ranking within that grid. The most important place in each cell will get a __`localrank`__ of 1, the second most important is 2, and so on.


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

See _Name fields_ in the [overview](#overview) for information about names and translations.

<h4>Route numbers</h4>

In addition to the standard name fields, there is also a __`ref`__ field that holds any reference codes or route numbers a road may have. From zoom levels 6 through 10, all geometries are points and the only labels are highways shields. From zoom level 11 and up the geometries are all lines.

The __`shield`__ field indicates the style of shield needed for the route. Current possibilities are:

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>default</code></td><td></td></tr>
<tr><td><code>at-motorway</code></td><td>Austria (Autobahnen)</td></tr>
<tr><td><code>at-expressway</code></td><td>Austria (Schnellstraßen)</td></tr>
<tr><td><code>at-state-b</code></td><td>Austria (Landesstraßen B)</td></tr>
<tr><td><code>br-federal</code></td><td>Brazil</td></tr>
<tr><td><code>br-state</code></td><td>Brazil</td></tr>
<tr><td><code>bg-motorway</code></td><td>Bulgaria</td></tr>
<tr><td><code>bg-national</code></td><td>Bulgaria</td></tr>
<tr><td><code>hr-motorway</code></td><td>Croatia</td></tr>
<tr><td><code>hr-state</code></td><td>Croatia</td></tr>
<tr><td><code>hr-county</code></td><td>Croatia</td></tr>
<tr><td><code>cz-motorway</code></td><td>Czech Republic</td></tr>
<tr><td><code>cz-expressway</code></td><td>Czech Republic</td></tr>
<tr><td><code>cz-road</code></td><td>Czech Republic</td></tr>
<tr><td><code>dk-primary</code></td><td>Denmark</td></tr>
<tr><td><code>dk-secondary</code></td><td>Denmark</td></tr>
<tr><td><code>fi-main</code></td><td>Finland</td></tr>
<tr><td><code>fi-trunk</code></td><td>Finland</td></tr>
<tr><td><code>fi-regional</code></td><td>Finland</td></tr>
<tr><td><code>de-motorway</code></td><td>Germany (Autobahnen)</td></tr>
<tr><td><code>de-federal</code></td><td>Germany (Bundesstraßen)</td></tr>
<tr><td><code>gr-motorway</code></td><td>Greece</td></tr>
<tr><td><code>gr-national</code></td><td>Greece</td></tr>
<tr><td><code>hu-motorway</code></td><td>Hungary</td></tr>
<tr><td><code>hu-main</code></td><td>Hungary</td></tr>
<tr><td><code>in-national</code></td><td>India</td></tr>
<tr><td><code>in-state</code></td><td>India</td></tr>
<tr><td><code>nz-state</code></td><td>New Zealand</td></tr>
<tr><td><code>pe-national</code></td><td>Peru</td></tr>
<tr><td><code>pe-regional</code></td><td>Peru</td></tr>
<tr><td><code>pl-motorway</code></td><td>Poland</td></tr>
<tr><td><code>pl-expressway</code></td><td>Poland</td></tr>
<tr><td><code>pl-national</code></td><td>Poland</td></tr>
<tr><td><code>pl-voivodeship</code></td><td>Poland</td></tr>
<tr><td><code>ro-motorway</code></td><td>Romania</td></tr>
<tr><td><code>ro-national</code></td><td>Romania</td></tr>
<tr><td><code>ro-county</code></td><td>Romania</td></tr>
<tr><td><code>ro-communal</code></td><td>Romania</td></tr>
<tr><td><code>rs-motorway</code></td><td>Serbia</td></tr>
<tr><td><code>rs-state-1b</code></td><td>Serbia</td></tr>
<tr><td><code>rs-state-2a</code></td><td>Serbia</td></tr>
<tr><td><code>rs-state-2b</code></td><td>Serbia</td></tr>
<tr><td><code>sk-highway</code></td><td>Slovakia</td></tr>
<tr><td><code>sk-road</code></td><td>Slovakia</td></tr>
<tr><td><code>si-motorway</code></td><td>Slovenia</td></tr>
<tr><td><code>si-expressway</code></td><td>Slovenia</td></tr>
<tr><td><code>si-main</code></td><td>Slovenia</td></tr>
<tr><td><code>za-national</code></td><td>South Africa</td></tr>
<tr><td><code>za-provincial</code></td><td>South Africa</td></tr>
<tr><td><code>za-regional</code></td><td>South Africa</td></tr>
<tr><td><code>za-metropolitan</code></td><td>South Africa</td></tr>
<tr><td><code>se-main</code></td><td>Sweden</td></tr>
<tr><td><code>ch-motorway</code></td><td>Switzerland</td></tr>
<tr><td><code>ch-main</code></td><td>Switzerland</td></tr>
<tr><td><code>mx-federal</code></td><td>United States</td></tr>
<tr><td><code>mx-state</code></td><td>United States</td></tr>
<tr><td><code>us-interstate</code></td><td>United States</td></tr>
<tr><td><code>us-interstate-duplex</code></td><td>United States</td></tr>
<tr><td><code>us-interstate-business</code></td><td>United States</td></tr>
<tr><td><code>us-interstate-truck</code></td><td>United States</td></tr>
<tr><td><code>us-highway</code></td><td>United States</td></tr>
<tr><td><code>us-highway-duplex</code></td><td>United States</td></tr>
<tr><td><code>us-highway-alternate</code></td><td>United States</td></tr>
<tr><td><code>us-highway-business</code></td><td>United States</td></tr>
<tr><td><code>us-highway-bypass</code></td><td>United States</td></tr>
<tr><td><code>us-highway-truck</code></td><td>United States</td></tr>
<tr><td><code>us-state</code></td><td>United States</td></tr>
<tr><td><code>e-road</code></td><td>European E-roads</td></tr>
</table>

To aid with shield styling the __`reflen`__ field conveys the number of characters present in the __`ref`__ field. Values can be 1-4. If the ref is 'M27', then the reflen is 3.

<h4>Classes</h4>

The __`class`__ field for road labels matches the [#road](#road) layers.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'motorway'</code></td><td>High-speed, grade-separated highways</td></tr>
<tr><td><code>'motorway_link'</code></td><td>Interchanges / on & off ramps</td></tr>
<tr><td><code>'trunk'</code></td><td>Important roads that are not motorways.</td></tr>
<tr><td><code>'primary'</code></td><td>A major highway linking large towns.</td></tr>
<tr><td><code>'secondary'</code></td><td>A highway linking large towns.</td></tr>
<tr><td><code>'tertiary'</code></td><td>A road linking small settlements, or the local centres of a large town or city.</td></tr>
<tr><td><code>'link'</code></td><td>Contains link roads</td></tr>
<tr><td><code>'street'</code></td><td>Standard unclassified, residential, road, and living_street road types</td></tr>
<tr><td><code>'street_limited'</code></td><td>Streets that may have limited or no access for motor vehicles.</td></tr>
<tr><td><code>'pedestrian'</code></td><td>Includes pedestrian streets, plazas, and public transportation platforms.</td></tr>
<tr><td><code>'construction'</code></td><td>Includes motor roads under construction (but not service roads, paths, etc).</td></tr>
<tr><td><code>'track'</code></td><td>Roads mostly for agricultural and forestry use etc.</td></tr>
<tr><td><code>'service'</code></td><td>Access roads, alleys, agricultural tracks, and other services roads. Also includes parking lot aisles, public & private driveways.</td></tr>
<tr><td><code>'ferry'</code></td><td>Those that serves automobiles and no or unspecified automobile service.</td></tr>
<tr><td><code>'path'</code></td><td>Foot paths, cycle paths, ski trails.</td></tr>
<tr><td><code>'major_rail'</code></td><td>Railways, including mainline, commuter rail, and rapid transit.</td></tr>
<tr><td><code>'minor_rail'</code></td><td>Yard and service railways.</td></tr>
<tr><td><code>'aerialway'</code></td><td>Ski lifts, gondolas, and other types of aerialway.</td></tr>
<tr><td><code>'golf'</code></td><td>The approximate centerline of a golf course hole</td></tr>
</table>

<h4>Additional information</h4>

The __`len`__ field stores the length of the road segment in projected meters, rounded to the nearest whole number. This can be useful for limiting some label styles to longer roads.


<!-- MOTORWAY_JUNCTION_LABEL -->
<a class='doc-section' id='motorway_junction'></a>
<h3><a href='#motorway_junction'>#motorway_junction</a>
    <div class='geomtype' title='lines'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>8</strong>
    </div>
</h3>

This layer contains point geometries for labeling motorway junctions (aka highway exits). Classes and types match the types in the road layer.

<h4>Label text</h4>

The motorway junction layer has a __`ref`__ field and a __`name`__ field for styling labels. The __`reflen`__ field tells you how long the __`ref`__ value is in case you want to style this layer with shields.

<h4>Classes & types</h4>

The __`class`__ and __`type`__ fields tell you what kind of road the junction is on. See the [#road](#road) layer for possible values.


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

See _Name fields_ in the [overview](#overview) for information about names and translations.

<h4>Classes & types</h4>

The __`class`__ and __`type`__ fields match those in the [#waterway](#waterway) layer.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'river'</code></td><td>Everything from the Amazon down to small creeks a couple meters wide</td></tr>
<tr><td><code>'canal'</code></td><td>Medium to large artificial waterway</td></tr>
<tr><td><code>'stream'</code></td><td>Very small waterway, usually no wider than a meter or two</td></tr>
<tr><td><code>'stream_intermittent'</code></td><td><strong>Class only</strong>. A stream that does not always have water flowing through it.</td></tr>
<tr><td><code>'drain'</code></td><td>Medium to small artificial channel for rainwater drainage, often concrete lined.</td></tr>
<tr><td><code>'ditch'</code></td><td>Small artificial channel dug in the ground for rainwater drainage.</td></tr>
</table>


<!-- AIRPORT_LABEL -->
<a class='doc-section' id='airport_label'></a>
<h3><a href='#airport_label'>#airport_label</a>
    <div class='geomtype' title='lines'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>64</strong>
    </div>
</h3>

This layer contains point geometries that are one of: airport, airfield, heliport, and rocket.

<h4>Label text</h4>

See _Name fields_ in the [overview](#overview) for information about names and translations.

<h4>Airport Codes</h4>

The __`ref`__ field contains short identifier codes for many airports. These are pulled from the OpenStreetMap tags `iata`, `ref`, `icao`, or `faa` (in order of preference).

<h4>Maki</h4>

The __`maki`__ field lets you assign different icons to different types of airports.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'airport'</code></td><td>Most commercial airports</td></tr>
<tr><td><code>'airfield'</code></td><td>Smaller airports & private airfields</td></tr>
<tr><td><code>'heliport'</code></td><td>For helicopters</td></tr>
<tr><td><code>'rocket'</code></td><td>Spaceflight facilities</td></tr>
</table>

<h4>Scalerank</h4>

The __`scalerank`__ field is a number representing the size / importance of the airport. Possible values are `1` (very large airport) through `4` (very small airport).

<!-- RAIL_STATION_LABEL -->
<a class='doc-section' id='rail_station_label'></a>
<h3><a href='#rail_station_label'>#rail_station_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>64</strong>
    </div>
</h3>

This layer contains point geometries with name fields for label rendering.

<h4>Label text</h4>

See _Name fields_ in the [overview](#overview) for information about names and translations.

<h4>Maki</h4>

The __`maki`__ field lets you assign icons to the rail station based on a few basic station types:

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>'rail'</code></td><td>Default rail station</td></tr>
<tr><td><code>'rail-metro'</code></td><td>Station for a subway, metro, or other rapid-transit system</td></tr>
<tr><td><code>'rail-light'</code></td><td>Light rail station</td></tr>
<tr><td><code>'entrance'</code></td><td>Specific station entrance points (eg stairs, escalators, elevators)</td></tr>
</table>

<h4>Network</h4>

The __`network`__ field lets you assign more specific icons for rail stations that are part of specific local or regional transit systems. They don't necessarily correspond to a specific network - eg `de-u-bahn` applies to any U-Bahn network in Germany since these can all use the same icon in a map style. Some stations serve multiple networks; in these cases, multiple network names are joined with a dot (in alphabetical order).

If none of the specific networks below apply to a station, the __`network`__ value will be the same as the __`maki`__ value (see previous section).

<table class='small space-bottom2'>
<tr><th style='width: 36em'>Value</th><th>Description</th></tr>
<tr><td><code>'barcelona-metro'</code></td><td>Barcelona, Spain</td></tr>
<tr><td><code>'boston-t'</code></td><td>Boston, Massachusetts</td></tr>
<tr><td><code>'chongqing-rail-transit'</code></td><td>Chongqing, China</td></tr>
<tr><td><code>'de-s-bahn'</code></td><td>Germany</td></tr>
<tr><td><code>'de-s-bahn.de-u-bahn'</code></td><td>Germany</td></tr>
<tr><td><code>'de-u-bahn'</code></td><td>Germany</td></tr>
<tr><td><code>'delhi-metro'</code></td><td>Delhi, India</td></tr>
<tr><td><code>'gb-national-rail'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'gb-national-rail.london-dlr'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'gb-national-rail.london-dlr.london-overground.london-tfl-rail.london-underground'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'gb-national-rail.london-dlr.london-overground.london-underground'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'gb-national-rail.london-dlr.london-underground'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'gb-national-rail.london-overground'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'gb-national-rail.london-overground.london-tfl-rail.london-underground'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'gb-national-rail.london-overground.london-underground'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'gb-national-rail.london-tfl-rail'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'gb-national-rail.london-tfl-rail.london-overground'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'gb-national-rail.london-tfl-rail.london-underground'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'gb-national-rail.london-underground'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'hong-kong-mtr'</code></td><td>Hong Kong</td></tr>
<tr><td><code>'kiev-metro'</code></td><td>Kiev, Ukraine</td></tr>
<tr><td><code>'london-dlr'</code></td><td>Docklands Light Rail, London, United Kingdom</td></tr>
<tr><td><code>'london-dlr.london-tfl-rail'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'london-dlr.london-tfl-rail.london-underground'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'london-dlr.london-underground'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'london-overground'</code></td><td>London Overground, United Kingdom</td></tr>
<tr><td><code>'london-overground.london-tfl-rail'</code></td><td>London Overground, United Kingdom</td></tr>
<tr><td><code>'london-overground.london-tfl-rail.london-underground'</code></td><td>London Overground, United Kingdom</td></tr>
<tr><td><code>'london-overground.london-underground'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'london-tfl-rail'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'london-tfl-rail.london-underground'</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>'london-underground'</code></td><td>London Underground, United Kingdom</td></tr>
<tr><td><code>'madrid-metro'</code></td><td>Madrid, Spain</td></tr>
<tr><td><code>'mexico-city-metro'</code></td><td>Mexico City, Mexico</td></tr>
<tr><td><code>'milan-metro'</code></td><td>Milan, Italy</td></tr>
<tr><td><code>'moscow-metro'</code></td><td>Moscow Metro, Russia</td></tr>
<tr><td><code>'new-york-subway'</code></td><td>New York City, New York</td></tr>
<tr><td><code>'osaka-subway'</code></td><td>Osaka, Japan</td></tr>
<tr><td><code>'oslo-metro'</code></td><td>Oslo, Norway</td></tr>
<tr><td><code>'paris-metro'</code></td><td>Paris Metro, France</td></tr>
<tr><td><code>'paris-rer'</code></td><td>Paris regional commuter rail, France</td></tr>
<tr><td><code>'paris-metro.paris-rer'</code></td><td>Paris, France</td></tr>
<tr><td><code>'paris-rer.paris-transilien'</code></td><td>Paris, France</td></tr>
<tr><td><code>'paris-transilien'</code></td><td>Paris suburban rail, France</td></tr>
<tr><td><code>'philadelphia-septa'</code></td><td>Philadelphia, Pennsylvania</td></tr>
<tr><td><code>'san-francisco-bart'</code></td><td>San Francisco, California</td></tr>
<tr><td><code>'singapore-mrt'</code></td><td>Singapore</td></tr>
<tr><td><code>'stockholm-metro'</code></td><td>stockholm, Sweden</td></tr>
<tr><td><code>'taipei-metro'</code></td><td>Taipei, Taiwan</td></tr>
<tr><td><code>'tokyo-metro'</code></td><td>Tokyo, Japan</td></tr>
<tr><td><code>'vienna-u-bahn'</code></td><td>Vienna, Austria</td></tr>
<tr><td><code>'washington-metro'</code></td><td>Washington DC Metro</td></tr>
</table>


<!-- MOUTAIN_PEAK_LABEL -->
<a class='doc-section' id='mountain_peak_label'></a>
<h3><a href='#mountain_peak_label'>#mountain_peak_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>64</strong>
    </div>
</h3>

This layer contains point geometries that are contains mountain peaks. Include fields `elevation_m` & `elevation_ft` which contain the peak elevations in meters and feet, respectively. Values are rounded to the nearest integer.

<h4>Label text</h4>

See _Name fields_ in the [overview](#overview) for information about names and translations.

<h4>Maki</h4>

The __`maki`__ field lets you distinguish volcanoes from other types of peaks.

<table class='small space-bottom2'>
<tr><th style='width: 36em'>Value</th><th>Description</th></tr>
<tr><td><code>'volcano'</code></td><td>Volcanoes</td></tr>
<tr><td><code>'mountain'</code></td><td>All other types of peaks (necessarily just mountains)</td></tr>
</table>

<h4>Elevations</h4>

The __`elevation_m`__ and __`elevation_ft`__ fields hold the peak elevation in meters and feet, respectively. Values are rounded to the nearest whole number and do not include units. Use a text field such as `{elevation_ft} feet` or `{elevation_m}m` in Mapbox Studio to display the units.


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
