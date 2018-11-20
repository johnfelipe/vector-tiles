---
layout: docs
section: developers
category: services
title: Mapbox Streets v8
permalink: /mapbox-streets-v8/
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
    h3.layer-ref-section {
      margin-top: 30px;
      border-top: 1px solid #ddd;
    }
    h3 em,
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
    h2 code,
    h3 code,
    h4 code,
    h5 code {
      text-size: 100%;
      font-weight: bold;
    }
    h3 em,
    h4 em {
      display: inline-block;
      font-family: Menlo, Bitstream Vera Sans Mono, Monaco, Consolas, monospace;
      font-style: italic;
      font-weight: normal;
      text-size: 10px !important;
      color: #666;
    }
  </style>
---

<pre class='fill-darken3 dark round'>
<span class='quiet'>Source ID:</span>
<strong>mapbox.mapbox-streets-v8</strong>
</pre>

<div class='note'><strong>Note:</strong> Mapbox Streets v8 is currently a beta release. The data structure is stable as documented, but there are still known issues and limited style examples.</div>

This is an in-depth guide to the data inside the Mapbox Streets vector tile source to help with styling. <!--For full examples of using Mapbox Streets vector tiles to create a map style, check out the default templates in [Mapbox Studio](/studio).-->

## Overview

### Data sources & updates

Mapbox Streets vector tiles are largely based on data from [OpenStreetMap](http://openstreetmap.org), a free & global source of geographic data built by volunteers. An understanding of the OSM data structure and tagging system is not neccessary to make use of Mapbox Streets vector tiles, though it's helpful to understand some of the details.

When you publicly use styles or software that use Mapbox Streets vector tiles, you must [display proper attribution](https://www.mapbox.com/help/attribution/).


The current supported version of the Mapbox Streets vector tiles receives regular data updates as new information becomes available and existing information is improved.

<table class='small space-bottom2'>
<tr><th>Layer</th><th>Source</th></tr>
<tr><td>most layers</td><td>OpenStreetMap replication feed</td></tr>
<tr><td><code>admin</code></td><td>custom Mapbox data</td></tr>
<tr><td><code>water</code> (ocean parts)</td><td><a href='http://openstreetmapdata.com/'>OpenStreetMapData.com</a></td></tr>
<tr><td><code>place_label</code>, types ‘country’ & ‘state’</td><td>custom Mapbox data</td></tr>
<tr><td><code>natural_label</code>, types ‘ocean’ & ‘sea’  </td><td>custom Mapbox data</td></tr>
</table>


### Multiple geometry types

Mapnik vector tiles support multiple geometry types in the same layer. The Mapbox Streets source takes advantage of this for some layers.

A geometry in the vector tile can be one of 3 types:

1. <span class='small inline icon marker'></span> Point
2. <span class='small inline icon polyline'></span> Linestring / multilinestring
3. <span class='small inline icon polygon'></span> Polygon / multipolygon


In Mapbox Studio, you can select just one or two or all of the 3 types with the Geometry Type toggles in each layer's data selection tab.


### OSM IDs

OSM IDs are not stored as object properties but as object IDs within the vector tile. This means they are not available for styling via Mapbox Studio, but can still be interacted with via Mapbox GL JS and other vector tile libraries.

OpenStreetMap ID spaces are not unique across node, way, and relation object types. In order to make them unique for vector tiles, the IDs are transformed based on their OpenStreetMap object type.

<table class='small space-bottom2'>
<tr><th>OSM type</th><th>OSM ID transform</th></tr>
<tr><td>node    </td><td><code>id × 10</code>       <em class='quiet'>eg. 123 → 1230</em></td></tr>
<tr><td>way     </td><td><code>(id × 10) + 1</code> <em class='quiet'>eg. 123 → 1231</em></td></tr>
<tr><td>relation</td><td><code>(id × 10) + 4</code> <em class='quiet'>eg. 123 → 1234</em></td></tr>
</table>

In many cases, mulitple objects from OpenStreetMap will be combined into a single object in our vector tiles. For example, water polygons are unioned to avoid seams and road lines are joined to save space and simplify better. In these cases the `osm_id` will either be `0`, or one of the input IDs chosen at random.

## Changelog

The layers and properties in Mapbox Streets v8 have undergone a major reorganization to optimize for styling with the latest features in Mapbox Studio such as expressions. We've also expanded coverage of feature types and properties for styling, with a particular emphasis on labels & icons.

- 3 new layer names:
  - [`natural_label`](#natural_label)
  - [`structure`](#structure)
  - [`transit_stop_label`](#transit_stop_label)
- 9 removed layer names - the data from these layers have moved into other layers as noted here:
  - `barrier_line` - data moved to new layer [`structure`](#structure)
  - `country_label` - data moved to [`place_label`](#place_label)
  - `marine_label` - data moved to new layer [`natural_label`](#natural_label)
  - `mountain_peak_label` - data moved to new layer [`natural_label`](#natural_label)
  - `rail_station_label` - data moved to new layer [`transit_stop_label`](#transit_stop_label)
  - `road_label` - data moved to [`road`](#road)
  - `state_label` - data moved to [`place_label`](#place_label)
  - `water_label` - data moved to new layer [`natural_label`](#natural_label)
  - `waterway_label` - data moved to new layer [`natural_label`](#natural_label)
- New ranking fields fields for label layers:
  - [`sizerank`](#sizerank)
  - [`filterrank`](#sizerank)
  - [`symbolrank`](#place_label---symbolrank) (`place_label` layer)
  - `scalerank` and `localrank` have been removed from all layers
- Name fields:
  - Translated name fields (`name_en`, `name_fr`, etc) will now contain _null_ values where no translation is available, rather than falling back to `name`. This will allow you to customize your fallback preferences using Mapbox GL expressions.
  - `name_zh` field removed and replaced by `name_zh-Hant` (traditional Chinese)
  - New field: `name_script` indicates the primary script used in the `name` field (`Latin`, `Cyrillic`, etc)
- [`admin`](#admin) layer:
  - Data source has changed to match Mapbox Enterprise Boundaries
  - New field: `worldview` - provides the option to cater boundary lines to different locales. See boundaries section below for details.
  - The `admin_level` now has a range of `0`  through `2` with slightly different division definitions compared to v7 - see boundaries section below for details.
  - The `disputed` and `maritime` fields now have text values of `true` or `false` rather than numeric `1` and `0`
- [`aeroway`](#aeroway) layer:
  - New field: `ref` indicates the runway or taxiway identifier
- [`place_label`](#place_label) layer:
  - New fields:
    - `iso_3166_1`: indicates the 2-letter country/territory code of the place or the country that the place is within.
    - `symbolrank` and `filterrank`: see description in table
    - `text_anchor` - replaces `ldir`
  - Added support for OSM `place=quarter`
  - Several feature types have moved to either `poi_label` or `natural_label`
- [`poi_label`](#poi_label) layer:
  - New fields:
    - `category_en` / `category_zh-Hans`: contains POI category description for text display in English / simplified Chinese 
    - `class`: contains broad categories useful for filtering & symbol styling
    - `filterrank`: see description in table
  - Many new `maki` values 
  - Many new feature types added
- [`road`](#road) layer:
  - New fields: 
    - Fields from former `road_label` layer: names, `ref`, `reflen`, `len`, `shield`, `iso_3166_2`
    - `toll`: `true` for toll roads and not present / null for all other roads.
    - `surface`: indicates either `paved` or `unpaved` where this data is available from OSM.
    - `bike_lane`: indicates presence and location of a bike lane that is part of the road itself (as opposed to a separated bike lane).
  - New class values: 
    - `service_rail` - includes service tracks such as sidings or yard rails. These were previously included in the `minor_rail` class.
    - `link` has been removed and broken out into `trunk_link`, `primary_link`, `secondary_link`, `tertiary_link`
  - Previous `road_label` layer is now merged into `road` layer, with all label fields included: `len`, `ref`, `reflen`, and `shield`.
- [`transit_stop_label`](#transit_stop_label) layer:
  - Replaces the `railway_station_label` layer from v7 and includes some new features such as bus stops (new), ferry terminals, and bikeshare stations (previously in the `poi_label` layer).
  - New fields:
    - `mode`: provides more detail about the particular mode of transport served by a stop/station
    - `stop_type`: value is one of: `stop`, `station`, `entrance`

## Data stability

As we make ongoing data updates to reflect changes in the world, we may also add new layers, fields, and values Mapbox Streets v8 tiles. Our goal is to do this in a way that preserves compatibility with existing v8 styles as much as possible. Here's what you need to know about how Mapbox Streets v8 may change in the future:

- Layers
  - Existing layers will not be renamed or removed
  - New layers may be added
- Fields
  - Existing fields will not be renamed or removed
  - New fields may be added to any layer
- Field values
  - The meanings of existing values will not change
  - Values of specific features may change to correct errors or reflect real-world changes.
  - New values may be added to any field unless otherwise noted in this documentation
  - Fields that may contain null values are noted in this documentation, and null values will not be introduced to existing layers that do not already have them.

You should design your styles to account for the possibility of new field values. Be explicit in your filters where possible, and make sure to include appropriate default styles when using expressions.

## Common fields

<a id='names'></a>

#### `name` _text_ & `name_<lang-code>` _text_

Label names are available in a number of languages. The `name_*` value will be `null` if no translation data is available for a given feature; when styling label layers, you are responsible for determining an appropriate fallback approach.

If the `name` field is null for a particular feature, then all of the language-specific `name_*` fields will also be null. This means that `name` should always be the final fallback value if you want to include it in your set of label languages.

<table class='small space-bottom2'>
<tr><th>Field</th><th>Description</th></tr>
<tr><td><code><strong>name</strong></code></td><td>The name (or names) used locally for the place.</td></tr>
<tr><td><code><strong>name_ar</strong></code></td><td>Arabic</td></tr>
<tr><td><code><strong>name_en</strong></code></td><td>English</td></tr>
<tr><td><code><strong>name_es</strong></code></td><td>Spanish</td></tr>
<tr><td><code><strong>name_fr</strong></code></td><td>French</td></tr>
<tr><td><code><strong>name_de</strong></code></td><td>German</td></tr>
<tr><td><code><strong>name_pt</strong></code></td><td>Portuguese</td></tr>
<tr><td><code><strong>name_ru</strong></code></td><td>Russian</td></tr>
<tr><td><code><strong>name_zh-Hans</strong></code></td><td>Simplified Chinese</td></tr>
<tr><td><code><strong>name_zh-Hant</strong></code></td><td>Traditional Chinese (if available, but may contain some Simplified Chinese)</td></tr>
<tr><td><code><strong>name_ja</strong></code></td><td>Japanese</td></tr>
<tr><td><code><strong>name_ko</strong></code></td><td>Korean</td></tr>
</table>

For languages that may have regional variations, no particular preference is given where place name spellings differ. 

<a id='name_script'></a>

#### `name_script` _text_

Wherever there is a `name` field, there is also a `name_script` field that describes the primary script used in that text. This can be helpful for customizing fonts or language fallback conditions. Values include:

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1 row3 scroll-styled'>Arabic
Armenian
Bengali
Bopomofo
Canadian_Aboriginal
Common
Cyrillic
Devanagari
Ethiopic
Georgian
Glagolitic
Greek
Gujarati
Gurmukhi
Han
Hangul
Hebrew
Hiragana
Kannada
Katakana
Khmer
Lao
Latin
Malayalam
Mongolian
Myanmar
Nko
Sinhala
Syriac
Tamil
Telugu
Thaana
Thai
Tibetan
Tifinagh
Unknown
</code>
</div>

The value will be _null_ if `name` is also null.

<a id='sizerank'></a>

#### `sizerank` _number_

The `sizerank` field is included in label layers where points or lines have been derived from polygons, such as `poi_label`, `natural_label`, `airport_label`. It lets you style & filter based on the size of a feature relative to the current zoom level. The largest objects are given `sizerank=0`, and points are given `sizerank=16`. 

A single feature will have a changing sizerank as you zoom in and the relative size of the feature increases. For example, a park might have a `sizerank` of 9 at z11, 6 at z12, and 2 at z13.

The value will never be _null_ and will always be within the range 0-16.

<a id='filterank'></a>

#### `filterrank` _number_

Filterrank is a value from 0-5 used to customize label density. It's intended to be used in style layer filters (in the 'Select data' tab in Mapbox Studio). The value is relative to the current zoom level. For example the same POI might have `filterrank=5` at z10 while having `filterrank=1` at z14, since zooming in changed the relative importance of the POI.

You could set `filterrank<=1` to only show the most prominent labels, `filterrank<=3` to produce moderate density, and `filterrank<=5` to see as many labels as possible.

The value will never be _null_ and will always be in the range of 0-5.

<a id='maki'></a>

#### `maki` _text_

Some layers have a `maki` field designed to make it easy to assign icons using the [Maki icon project](http://mapbox.com/maki), or with other icons that follow the same naming scheme. Each layer uses a different subset of the names, but the full list of values used in Mapbox Streets is compiled here so you can ensure your style has all the icons needed across different layers.

Not all icons from the Maki project are used in Mapbox Streets, and different types of related features will sometimes have the same `maki` value (eg universities and colleges, or art supply shops and art galleries). Nameless POIs will have never have a maki value of marker (the generic default).

The possible values for the `maki` field for all layers are listed below. Icon names that were not part of any layer in v7 are marked with 🆕. No further values will be added in Mapbox Streets v8.

<code>airport_label:</code>

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1'>airport
airfield
heliport
rocket
</code>
</div>

<code>natural_label:</code>

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1'>marker
mountain
volcano
waterfall 🆕
</code>
</div>

<code>poi_label:</code>

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1 row3 scroll-styled'>alcohol-shop
american-football 🆕
amusement-park
aquarium
art-gallery
attraction
bakery
bank
bar
basketball 🆕
beach 🆕
beer
bicycle
bowling-alley 🆕
bridge 🆕
cafe
campsite
car
car-rental 🆕
car-repair 🆕
casino 🆕
castle
cemetery
charging-station 🆕
cinema
clothing-store
college
communications-tower 🆕
confectionery 🆕
convenience 🆕
dentist
doctor
dog-park
drinking-water
embassy
farm 🆕
fast-food
fire-station
fitness-centre 🆕
fuel
furniture 🆕
garden
globe 🆕
golf
grocery
harbor
hardware 🆕
horse-riding 🆕
hospital
ice-cream
information
jewelry-store 🆕
laundry
library
lodging
marker
mobile-phone 🆕
monument
museum
music
optician 🆕
park
parking 🆕
parking-garage 🆕
pharmacy
picnic-site
pitch 🆕
place-of-worship
playground
police
post
prison
ranger-station 🆕
religious-buddhist 🆕
religious-christian
religious-jewish
religious-muslim
restaurant
restaurant-noodle 🆕
restaurant-pizza 🆕
restaurant-seafood 🆕
school
shoe 🆕
shop
skateboard 🆕
slipway 🆕
stadium
suitcase 🆕
swimming
table-tennis 🆕
tennis 🆕
theatre
toilet
town-hall
veterinary
viewpoint 🆕
volleyball 🆕
watch 🆕
watermill 🆕
windmill 🆕
zoo
</code>
</div>

<code>transit_stop_label:</code>

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1 row3 scroll-styled'>bicycle-share
bus
ferry
rail
rail-metro
rail-light
entrance
</code>
</div>

## Layer Reference


<!-- ADMIN ----------------------------------------------------------------- -->
<a class='doc-section' id='admin'></a>
<h3 class='layer-ref-section'><a href='#admin'>admin</a>
    <div class='geomtype' title='lines'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

This layer contains boundary lines for national and subnational administrative units. The data source & shapes match polygons from the [Mapbox Enterprise Boundaries product](https://blog.mapbox.com/introducing-mapbox-enterprise-boundaries-2fca4a36d8ba).

#### <!--admin--> `admin_level` _number_

The `admin_level` field separates different levels of boundaries.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>0</code></td><td>Countries</td></tr>
<tr><td><code>1</code></td><td>First-level administrative divisions</td></tr>
<tr><td><code>2</code></td><td>Second-level administrative divisions</td></tr>
</table>

#### <!--admin--> `worldview` _text_

Mapbox Streets v8 introduces the notion of worldviews to the administrative boundary layer. The vector tiles contain multiple versions of some boundaries, each with a `worldview` value indicating the intended audience. It is important to apply a worldview filter to all of your `admin` style layers, otherwise your map will show conflicting & overlapping boundary lines. The filter should always include both `all` and one of the region-specific values.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>all</code></td><td>Appropriate for all worldviews (most boundaries)</td></tr>
<tr><td><code>CN</code></td><td>Boundaries for a mainland Chinese audience/worldview, but not officially approved for use in the PRC.</td></tr>
<tr><td><code>IN</code></td><td>Boundaries conforming to cartographic requirements for use in India</td></tr>
<tr><td><code>US</code></td><td>Boundaries for an American audience, & which are generally appropriate outside of China & India. Lines do not necessarily reflect official US foreign policy.</td></tr>
</table>

#### <!--admin--> `disputed` _text_

Boundary lines with a `disputed` value of `true` should have a dashed or otherwise distinct style applied in styles. No single map of the world will ever keep everybody happy, but acknowledging disputes where they exist is an important aspect of good cartography. The value will always be either `true` or `false` (never _null_).

#### <!--admin--> `maritime` _text_

Mapbox Streets v8 includes a minimal set of maritime boundaries. These have a `maritime` value of `true` to use for distinct styling or filtering. The value will always be either `true` or `false` (never _null_).

#### <!--admin--> `iso_3166_1` _text_

The `iso_3166_1` field contains the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166) code or codes that apply to a boundary. For subnational boundaries this will be a single code of the parent country. For international boundaries between two countries, the value will be the codes of both countries in alphabetical order, separated by a dash (`-`).


<!-- AEROWAY --------------------------------------------------------------- -->
<a class='doc-section' id='aeroway'></a>
<h3 class='layer-ref-section'><a href='#aeroway'>aeroway</a>
    <div class='geomtype' title='lines & polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

The aeroway layer includes both lines and polygons representing runways, helipads, etc.

#### <!--aeroway--> `type` _text_

The `type` field separates different types of aeroways for styling.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>runway</code></td><td>Where planes take off & land</td></tr>
<tr><td><code>taxiway</code></td><td>Where planes move between runways, gates, and hangars</td></tr>
<tr><td><code>apron</code></td><td>Where planes park, refuel, load</td></tr>
<tr><td><code>helipad</code></td><td>Where helicopters take off & land</td></tr>
</table>

#### <!--aeroway--> `ref` _text_

The `ref` field contains runway and taxiway identifiers. The value may be _null_.


<!-- AIRPORT_LABEL --------------------------------------------------------- -->
<a class='doc-section' id='airport_label'></a>
<h3 class='layer-ref-section'><a href='#airport_label'>airport_label</a>
    <div class='geomtype' title='lines'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>64</strong>
    </div>
</h3>

This layer contains point geometries that are one of: airport, airfield, heliport, and rocket.

See [`names`](#names) and [`name_script`](#name_script) in for information about names and translations available for label text.

See [`sizerank`](#sizerank) for information about that field.

#### <!--airport_label--> `ref` _text_

The `ref` field contains short identifier codes for many airports. These are pulled from the OpenStreetMap tags `iata`, `ref`, `icao`, or `faa` (in order of preference). The value may be _null_.

#### <!--airport_label--> `maki` _text_

The `maki` field lets you assign different icons to different types of airports. See the [`maki](#maki) part of the Common Fields section for more details.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>airport</code></td><td>Most commercial airports</td></tr>
<tr><td><code>airfield</code></td><td>Smaller airports & private airfields</td></tr>
<tr><td><code>heliport</code></td><td>For helicopters</td></tr>
<tr><td><code>rocket</code></td><td>Spaceflight facilities</td></tr>
</table>


<!-- BUILDING -------------------------------------------------------------- -->
<a class='doc-section' id='building'></a>
<h3 class='layer-ref-section'><a href='#building'>building</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>2</strong>
    </div>
</h3>

Large buildings appear at zoom level 13, and all buildings are included in zoom level 14 and up.

#### <!--building--> `underground` _text_

The `underground` field will be `true` for buildings that are underground (for example, some subway stations). This value will always be either `true` or `false` (never _null_).

#### <!--building--> `type` _text_

The `type` field lets you differentiate building parts from building outlines. Building part polygons intended primarily for 3D rendering have a value of `building:part`. Building outlines (covering the full footprint of a building) will have a value of `building` if tagged as `building=yes` on OpenStreetMap, otherwise the value will match the `building` tag from OpenStreetMap ([see TagInfo for common values](http://taginfo.osm.org/keys/building#values)).

#### <!--building--> `height` _number_

The `height` field contains the height of a building or building part in meters (rounded to the nearest integer). In many cases this value is derived from the `building:levels` tag on OpenStreetMap - we estimate 3 meters per level if no exact height is specified. This value may be _null_ where `extrude` is `false`.

#### <!--building--> `min_height` _number_

The `min_height` field contains the height in meters from the ground to the _bottom_ of a building part, for cases where the bottom of the part is not on the ground. This allows for proper extrusion rendering of things such as sky bridges and cantilevered building parts. This value may be _null_ where `extrude` is `false`.

#### <!--building--> `extrude` _text_

The `extrude` field indicates whether the object should be included in 3D-extrusion renderings. For example a complex building might have various `building:part` objects mapped with different heights, in addition to a building object representing the footprint of the entire building. Only the `building:part` objects are needed for 3D rendering, so the full footprint outline will have an `extrude` value of `false`. The `extrude` value will always be either `true` or `false` (never _null_).


<!-- HOUSENUM_LABEL -------------------------------------------------------- -->
<a class='doc-section' id='housenum_label'></a>
<h3 class='layer-ref-section'><a href='#housenum_label'>housenum_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>64</strong>
    </div>
</h3>

This layer contains points used to label the street number parts of specific addresses.

#### <!--housenum_label--> `house_num` _text_

The `house_num` field countains house and building numbers. These are commonly integers but may include letters or be only letters, eg "1600", "31B", "D". If an address has no number tag but has a house name or building name, the `house_num` field will be the name instead.


<!-- LANDUSE_OVERLAY ------------------------------------------------------- -->
<a class='doc-section' id='landuse_overlay'></a>
<h3 class='layer-ref-section'><a href='#landuse_overlay'>landuse_overlay</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>8</strong>
    </div>
</h3>

This layer is for landuse / landcover polygons that should be drawn above the [#water](#water) layer.

#### <!--landuse_overlay--> `class` _text_

The main field used for styling the landuse_overlay layer is `class`.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>national_park</code></td><td>Relatively large area of land set aside by a government for human recreation and environmental protection</td></tr>
<tr><td><code>wetland</code></td><td>Wetlands that may include vegetation (marsh, swamp, bog)</td></tr>
<tr><td><code>wetland_noveg</code></td><td>Wetlands that probably dont contain vegetation (mud, tidal flat)</td></tr>
</table>


<!-- LANDUSE --------------------------------------------------------------- -->
<a class='doc-section' id='landuse'></a>
<h3 class='layer-ref-section'><a href='#landuse'>landuse</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

This layer includes polygons representing both land-use and land-cover.

It's common for many different types of landuse/landcover to be overlapping, so the polygons in this layer are ordered by the area of their geometries to ensure smaller objects will not be obscured by larger ones. Pay attention to use of transparency when styling - the overlapping shapes can cause muddied or unexpected colors.

#### <!--landuse--> `class` _text_

The main field used for styling the landuse layer is `class`.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>aboriginal_lands</code></td><td>The boundary of aboriginal lands.</td></tr>
<tr><td><code>agriculture</code></td><td>Various types of crop and farmland</td></tr>
<tr><td><code>airport</code></td><td>Airport grounds</td></tr>
<tr><td><code>cemetery</code></td><td>Cemeteries and graveyards</td></tr>
<tr><td><code>glacier</code></td><td>Glaciers or permanent ice/snow</td></tr>
<tr><td><code>grass</code></td><td>Grasslands, meadows, fields, lawns, etc</td></tr>
<tr><td><code>hospital</code></td><td>Hospital grounds</td></tr>
<tr><td><code>park</code></td><td>City parks, village greens, playgrounds, national parks, nature reserves, etc</td></tr>
<tr><td><code>piste</code></td><td>Area used for skiing, snowboading, and other snow/mountain sports</td></tr>
<tr><td><code>pitch</code></td><td>Sports fields & courts of all types</td></tr>
<tr><td><code>rock</code></td><td>Bare rock, scree, quarries</td></tr>
<tr><td><code>sand</code></td><td>Sand, beaches, dunes</td></tr>
<tr><td><code>school</code></td><td>Primary, secondary, post-secondary school grounds</td></tr>
<tr><td><code>scrub</code></td><td>Bushes, scrub, heaths</td></tr>
<tr><td><code>wood</code></td><td>Woods and forestry areas</td></tr>
</table>


<!-- MOTORWAY_JUNCTION ----------------------------------------------------- -->
<a class='doc-section' id='motorway_junction'></a>
<h3><a href='#motorway_junction'>motorway_junction</a>
    <div class='geomtype' title='lines'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>8</strong>
    </div>
</h3>

This layer contains point geometries for labeling motorway junctions (aka highway exits). Classes and types match the types in the road layer.

#### <!--motorway_junction--> `ref` _text_, `reflen` _number_, & `name` _text_

The motorway junction layer has a `ref` field and a `name` field for styling labels. The `reflen` field tells you how long the `ref` value is in case you want to style this layer with shields. All of these fields may be _null_.

#### <!--motorway_junction--> `class` _text_ & `type` _text_

The `class` and `type` fields tell you what kind of road the junction is on. See the [#road](#road) layer for possible values.


<!-- NATURAL_LABEL --------------------------------------------------------- -->
<a class='doc-section' id='natural_label'></a>
<h3 class='layer-ref-section'><a href='#natural_label'>natural_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>64</strong>
    </div>
</h3>

The `natural_label` layer contains points and lines for styling natural features such as bodies of water, mountain peaks, valleys, deserts, and so on.

See [`names`](#names) and [`name_script`](#name_script) in for information about names and translations available for label text.

See [`sizerank`](#sizerank) for information about that field.

#### <!--natural_label--> `class` _text_ & `maki` _text_

The `natural_label` layer is organized into a number of different classes for styling & filtering. Within each class, serveral `maki` values are available for assigning icons to features - see the [`maki`](#maki) part of the Common Fields section for more details about that field.

<table class='small space-bottom2'>
<tr><th>class</th><th>maki values</th><th>feature types</th></tr>
<tr><td><code>bay</code></td><td><code>marker</code></td><td>inlet in a large body of water</td></tr>
<tr><td><code>canal</code></td><td><code>marker</code></td><td></td></tr>
<tr><td><code>dock</code></td><td><code>marker</code></td><td>enclosed area of water for ships</td></tr>
<tr><td><code>glacier</code></td><td><code>marker</code></td><td>glacier</td></tr>
<tr><td><code>landform</code></td><td><code>mountain</code>, <code>volcano</code>, <code>marker</code></td><td>peaks, meadows, cave entrances, archipelago, island, islet, saddle, fell, desert, valley, etc.</td></tr>
<tr><td><code>ocean</code></td><td><code>marker</code></td><td>oceans</td></tr>
<tr><td><code>reservoir</code></td><td><code>marker</code></td><td>human water containment areas</td></tr>
<tr><td><code>river</code></td><td><code>marker</code></td><td></td></tr>
<tr><td><code>sea</code></td><td><code>marker</code></td><td>seas and other very large water features including some gulfs, straits, bays, etc.</td></tr>
<tr><td><code>stream</code></td><td><code>marker</code></td><td></td></tr>
<tr><td><code>water_feature</code></td><td><code>waterfall</code>, <code>marker</code></td><td>waterfalls</td></tr>
<tr><td><code>water</code></td><td><code>marker</code></td><td>lakes, ponds, etc.</td></tr>
<tr><td><code>wetland</code></td><td><code>marker</code></td><td>wetland, marsh</td></tr>
</table>

#### <!--natural_label--> `elevation_m` _number_ & `elevation_ft` _number_

The `elevation_m` and `elevation_ft` fields hold the feature elevation in meters and feet, respectively. Values are rounded to the nearest whole number and do not include units. Use a text field such as `{elevation_ft} feet` or `{elevation_m}m` in Mapbox Studio to display the units. These fields may be _null_.


<!-- PLACE_LABEL ----------------------------------------------------------- -->
<a class='doc-section' id='place_label'></a>
<h3 class='layer-ref-section'><a href='#place_label'>place_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>128</strong>
    </div>
</h3>

This layer contains points for labeling places including countries, states, cities, towns, and neighbourhoods.

See [`names`](#names) and [`name_script`](#name_script) in for information about names and translations available for label text.

See [`filterrank`](#filterrank) for information on using that field.


#### <!--place_label--> `type`

The main field for styling labels for different kinds of places is `type`.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>country</code></td><td>Sovereign or partially-recognized states</td></tr>
<tr><td><code>sar</code></td><td>Special Administrative Region</td></tr>
<tr><td><code>territory</code></td><td>Semi-autonomous or other subnational entities with ISO 3166-1 codes</td></tr>
<tr><td><code>disputed_territory</code></td><td>Disputed territories with ISO 3166-1 codes.</td></tr>
<tr><td><code>state</code></td><td>First-level administrative divisions or similar. Only a small subset of these are included in order to reduce clutter and put focus on cities, towns, etc.</td></tr>
<tr><td><code>city</code></td><td>Settlement of about 100,000 or more people.</td></tr>
<tr><td><code>town</code></td><td>Urban or rural settlement of about 10,000-100,000 people</td></tr>
<tr><td><code>village</code></td><td>Usually rural settlement of less than about 10,000</td></tr>
<tr><td><code>hamlet</code></td><td>Rural settlement with a population of about 200 or fewer</td></tr>
<tr><td><code>suburb</code></td><td>A distinct section of an urban settlement such as an annexed town, historical district, or large & important neighborhood.</td></tr>
<tr><td><code>quarter</code></td><td>A large neighborhood or section of a larger city or town</td></tr>
<tr><td><code>neighbourhood</code></td><td>A smaller neighborhood or part of a larger settlement</td></tr>
</table>

#### <!--place_label--> `symbolrank`

The `symbolrank` value is intended to simplify styling of the label size and symbol prominence of place features. It ranges from 1 to 19 and is consistently assigned across zoom levels - ie a place with a `symbolrank` of 6 at z4 will have the same value as you zoom in to any other level.

The value will never be _null_ and will always be in the range of 1-19.

#### <!--place_label--> `iso_3166_1` _text_

The `iso_3166_1` field contains the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166) code of the country the place is in. The value may be _null_ - either due to location match errors or for features that are in international waters.

#### <!--place_label--> `capital` _number_

The `capital` field allows distinct styling of labels or icons for the capitals of countries, regions, or states & provinces. The value of this field may be `2`, `3`, `4`, `5`, or `6`. National capitals are `2`, and `3` through `6` represent capitals of various sub-national administrative entities. These levels come from OpenStreetMap and have different meanings in different countries - see [the OpenStreetMap wiki](http://wiki.openstreetmap.org/wiki/Tag:boundary%3Dadministrative#admin_level) for specific details.

The value will be _null_ for any place that is not a capital.

#### <!--place_label--> `text_anchor` _text_

The `text_anchor` field can be used as a hint for label placement. Possible values match the [Mapbox GL Style Spec for text anchor](https://www.mapbox.com/mapbox-gl-js/style-spec/#layout-symbol-text-anchor). The value may be _null_. <!-- FIXME - more detail? -->

<table class='small space-bottom2'>
<tr><th>Value</th><th>Meaning</th></tr>
<tr><td><code>center</code></td><td>The center of the text is placed closest to the anchor.</td></tr>
<tr><td><code>left</code></td><td>The left side of the text is placed closest to the anchor.</td></tr>
<tr><td><code>right</code></td><td>The right side of the text is placed closest to the anchor.</td></tr>
<tr><td><code>top</code></td><td>The top of the text is placed closest to the anchor.</td></tr>
<tr><td><code>bottom</code></td><td>The bottom of the text is placed closest to the anchor.</td></tr>
<tr><td><code>top-left</code></td><td>The top left corner of the text is placed closest to the anchor.</td></tr>
<tr><td><code>top-right</code></td><td>The top right corner of the text is placed closest to the anchor.</td></tr>
<tr><td><code>bottom-left</code></td><td>The bottom left corner of the text is placed closest to the anchor.</td></tr>
<tr><td><code>bottom-right</code></td><td>The bottom right corner of the text is placed closest to the anchor.</td></tr>
</table>


<!-- POI_LABEL ------------------------------------------------------------- -->
<a class='doc-section' id='poi_label'></a>
<h3 class='layer-ref-section'><a href='#poi_label'>poi_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>64</strong>
    </div>
</h3>

This layer is used to place icons and labels for various points of interest (POIs).

See [`names`](#names) and [`name_script`](#name_script) in for information about names and translations available for label text.

See [`sizerank`](#sizerank) and [`filterrank`](#filterrank) for information on using those fields to style text size and label density.

See [`maki`](#maki) for more information about using this field for assigning icons.

#### <!--poi_label--> `class` _text_

The `class` field groups points of interest into broad categories for styling purposes. The values are useful for designing icon color schemes, for example.

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1 row3 scroll-styled'>arts_and_entertainment
building
commercial_services
education
food_and_drink
food_and_drink_stores
general
historic
industrial
landmark
lodging
medical
motorist
park_like
place_like
public_facilities
religion
sport_and_leisure
store_like
visitor_amenities
</code>
</div>


#### <!--poi_label--> `type` _text_

The `type` field contains a more specific classification intended for display - eg 'Cafe', 'Hotel', 'Laundry'. These values come from the original OpenStreetMap tags and are not a limited set.

#### <!--poi_label--> `category_en` _text_ & `category_zh-Hans` _text_

The `category_en` & `category_zh-Hans` fields contain translated category descriptions for POIs. These can be used as a fallback or as supplemental information where English or simplified Chinese translations may not exist. These values may be _null_.

Language coverage may be expanded in a future v8 update.


<!-- ROAD ------------------------------------------------------------------ -->
<a class='doc-section' id='road'></a>
<h3 class='layer-ref-section'><a href='#road'>road</a>
    <div class='geomtype' title='points, lines, & polygons'>
        <span class='inline small icon marker'></span>
        <span class='inline small icon polyline'></span>
        <span class='inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

The roads layer contains lines, points, and polygons needed for drawing features such as roads, railways, paths and their labels.

See [`names`](#names) and [`name_script`](#name_script) in for information about names and translations available for label text.

#### <!--road--> `class` _text_

The main field used for styling the road layers is `class`.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>motorway</code></td><td>High-speed, grade-separated highways</td></tr>
<tr><td><code>motorway_link</code></td><td>Link roads/lanes/ramps connecting to motorways</td></tr>
<tr><td><code>trunk</code></td><td>Important roads that are not motorways.</td></tr>
<tr><td><code>trunk_link</code></td><td>Link roads/lanes/ramps  connecting to trunk roads</td></tr>
<tr><td><code>primary</code></td><td>A major highway linking large towns.</td></tr>
<tr><td><code>primary_link</code></td><td>Link roads/lanes connecting to primary roads</td></tr>
<tr><td><code>secondary</code></td><td>A highway linking large towns.</td></tr>
<tr><td><code>secondary_link</code></td><td>Link roads/lanes connecting to secondary roads</td></tr>
<tr><td><code>tertiary</code></td><td>A road linking small settlements, or the local centres of a large town or city.</td></tr>
<tr><td><code>tertiary_link</code></td><td>Link roads/lanes connecting to tertiary roads</td></tr>
<tr><td><code>street</code></td><td>Standard unclassified, residential, road, and living_street road types</td></tr>
<tr><td><code>street_limited</code></td><td>Streets that may have limited or no access for motor vehicles.</td></tr>
<tr><td><code>pedestrian</code></td><td>Includes pedestrian streets, plazas, and public transportation platforms.</td></tr>
<tr><td><code>construction</code></td><td>Includes motor roads under construction (but not service roads, paths, etc).</td></tr>
<tr><td><code>track</code></td><td>Roads mostly for agricultural and forestry use etc.</td></tr>
<tr><td><code>service</code></td><td>Access roads, alleys, agricultural tracks, and other services roads. Also includes parking lot aisles, public & private driveways.</td></tr>
<tr><td><code>ferry</code></td><td>Those that serves automobiles and no or unspecified automobile service.</td></tr>
<tr><td><code>path</code></td><td>Foot paths, cycle paths, ski trails.</td></tr>
<tr><td><code>major_rail</code></td><td>Railways, including mainline, commuter rail, and rapid transit.</td></tr>
<tr><td><code>minor_rail</code></td><td>Includes light rail & tram lines.</td></tr>
<tr><td><code>service_rail</code></td><td>Yard and service railways.</td></tr>
<tr><td><code>aerialway</code></td><td>Ski lifts, gondolas, and other types of aerialway.</td></tr>
<tr><td><code>golf</code></td><td>The approximate centerline of a golf course hole</td></tr>
<tr><td><code>roundabout</code></td><td>Circular continous-flow intersection</td></tr>
<tr><td><code>mini_roundabout</code></td><td>Smaller variation of a roundabout with no center island or obstacle</td></tr>
<tr><td><code>turning_circle</code></td><td>(point) Widened section at the end of a cull-de-sac for turning around a vehicle</td></tr>
<tr><td><code>turning_loop</code></td><td>(point) Similar to a turning circle but with an island or other obstruction at the centerpoint</td></tr>
<tr><td><code>traffic_signals</code></td><td>(point) Lights or other signal controlling traffic flow at an intersection</td></tr>
</table>

#### <!--road--> `oneway` _text_

The `oneway` field indicates whether the motor traffic on the road is one-way or not. If the road is one-way, traffic travels in the same direction as the linestring. The value will always be either `true` or `false` (never _null_).

#### <!--road--> `structure` _text_

The `structure` field describes whether the road segment is a `bridge`, `tunnel`, `ford`, or `none` of those. No further values will be added in Mapbox Streets v8.

##### <!--road--> `iso_3166_2` _text_

The [ISO 3166-2 code](https://en.wikipedia.org/wiki/ISO_3166-2) of the state/province/region the road is in. Not all areas are covered by this standard and the value may be _null_.

#### <!--road--> `ref` _text_ & `reflen` _number_

In addition to the standard name fields, there is also a `ref` field that holds any reference codes or route numbers a road may have.

The `reflen` value indicates how many characters are in the corresponding `ref` to help choose an appropriate size of shield graphic. The overall valid range is 2-6 but more detailed ranges for specific shield designs are noted below. Note that `ref` values with a single character are assigned a `reflen` value of 2 to reduce the number of required shield graphics.

From zoom levels 6 through 10, `ref` values are attached to separate points rather than lines in order to optimize symbol placement.

Both `ref` & `reflen` may be _null_.

#### <!--road--> `shield` _text_

The `shield` values help to assign highway shield graphics. They should be combined with `ref` for the text on the shield and `reflen` to determine the width of shield image needed.

Routes that can be symbolized with shields of a common shape & color have generic shared shield values:

<table class='small space-bottom2'>
<tr><th>Value</th><th>reflen range</th><th>Description</th></tr>
<tr><td><code>default</code></td><td>2-6</td><td>No specific shield design suggested.</td></tr>
<tr><td><code>rectangle-white</code></td><td>2-6</td><td></td></tr>
<tr><td><code>rectangle-red</code></td><td>2-6</td><td></td></tr>
<tr><td><code>rectangle-orange</code></td><td>2-6</td><td></td></tr>
<tr><td><code>rectangle-yellow</code></td><td>2-6</td><td></td></tr>
<tr><td><code>rectangle-green</code></td><td>2-6</td><td></td></tr>
<tr><td><code>rectangle-blue</code></td><td>2-6</td><td></td></tr>
<tr><td><code>circle-white</code></td><td>2-6</td><td></td></tr>
</table>


Other highways with more specific shield design requirements are captured individually:

<table class='small space-bottom2'>
<tr><th>Value</th><th>reflen range</th><th>Description</th></tr>
<tr><td><code>ae-national</code></td><td>3-4</td><td>United Arab Emirates national routes</td></tr>
<tr><td><code>ae-d-route</code></td><td>3-4</td><td>UAE Dubai D-routes</td></tr>
<tr><td><code>ae-f-route</code></td><td>3</td><td>UAE Fujairah F-routes</td></tr>
<tr><td><code>ae-s-route</code></td><td>4</td><td>UAE Sharjah S-routes</td></tr>
<tr><td><code>au-national-highway</code></td><td>2-3</td><td>Australia national highways</td></tr>
<tr><td><code>au-national-route</code></td><td>2-6</td><td>Australia national routes</td></tr>
<tr><td><code>au-state</code></td><td>2-6</td><td>Australia state roads</td></tr>
<tr><td><code>au-tourist</code></td><td>2-3</td><td>Australia tourist routes</td></tr>
<tr><td><code>br-federal</code></td><td>3</td><td>Brazil federal highways</td></tr>
<tr><td><code>br-state</code></td><td>2-3</td><td>Brazil state highways</td></tr>
<tr><td><code>ch-motorway</code></td><td>2-3</td><td>Switzerland motorways</td></tr>
<tr><td><code>cn-nths-expy</code></td><td>3-5</td><td>China national expressway</td></tr>
<tr><td><code>cn-provincial-expy</code></td><td>3-5</td><td>China provincial/regional expressway</td></tr>
<tr><td><code>de-motorway</code></td><td>2-3</td><td>Germany motorways (Autobahnen)</td></tr>
<tr><td><code>gr-motorway</code></td><td>2-4</td><td>Greece motorways</td></tr>
<tr><td><code>hk-strategic-route</code></td><td>2</td><td>Hong Kong strategic routes</td></tr>
<tr><td><code>hr-motorway</code></td><td>3-4</td><td>Croatia motorways</td></tr>
<tr><td><code>hu-motorway</code></td><td>2-3</td><td>Hungary motorways</td></tr>
<tr><td><code>hu-main</code></td><td>2-5</td><td>Hungary main roads</td></tr>
<tr><td><code>in-national</code></td><td>2-4</td><td>India national highways & expressways</td></tr>
<tr><td><code>in-state</code></td><td>2-3</td><td>India state highways</td></tr>
<tr><td><code>kr-natl-expy</code></td><td>2-3</td><td>South Korea national expressways</td></tr>
<tr><td><code>kr-natl-hwy</code></td><td>2</td><td>South Korea national highways</td></tr>
<tr><td><code>kr-metro-expy</code></td><td>2-3</td><td>South Korea metropolitan expressways</td></tr>
<tr><td><code>kr-metropolitan</code></td><td>2-6</td><td>South Korea metropolitan routes</td></tr>
<tr><td><code>kr-local</code></td><td>2-6</td><td>South Korea local routes</td></tr>
<tr><td><code>mx-federal</code></td><td>2-4</td><td>Mexico federal highways</td></tr>
<tr><td><code>mx-state</code></td><td>2-4</td><td>Mexico state highways</td></tr>
<tr><td><code>nz-state</code></td><td>2-3</td><td>New Zealand state highways</td></tr>
<tr><td><code>pe-national</code></td><td>2-3</td><td>Peru national highways</td></tr>
<tr><td><code>pe-regional</code></td><td>3-4</td><td>Peru departmental / regional highways</td></tr>
<tr><td><code>ro-national</code></td><td>2-3</td><td>Romania national roads</td></tr>
<tr><td><code>ro-county</code></td><td>3-4</td><td>Romania county roads</td></tr>
<tr><td><code>ro-communal</code></td><td>2-4</td><td>Romania communal roads</td></tr>
<tr><td><code>si-motorway</code></td><td>2</td><td>Slovenia motorways</td></tr>
<tr><td><code>tw-national</code></td><td>2</td><td>Taiwan national routes</td></tr>
<tr><td><code>tw-provincial-expy</code></td><td>2</td><td>Taiwan provincial expressways</td></tr>
<tr><td><code>tw-provincial</code></td><td>2</td><td>Taiwan provincial routes</td></tr>
<tr><td><code>tw-county-township</code></td><td>2-6</td><td>Taiwan county / township routes</td></tr>
<tr><td><code>us-interstate</code></td><td>2-4</td><td>US Interstates</td></tr>
<tr><td><code>us-interstate-duplex</code></td><td>4-5</td><td>US Interstates - segment shared by 2 route numbers</td></tr>
<tr><td><code>us-interstate-business</code></td><td>2-3</td><td>US Interstates - business routes</td></tr>
<tr><td><code>us-interstate-truck</code></td><td>2-3</td><td>US Interstates - truck routes</td></tr>
<tr><td><code>us-highway</code></td><td>2-4</td><td>US highways</td></tr>
<tr><td><code>us-highway-duplex</code></td><td>3-5</td><td>US highways - segment shared by 2 route numbers</td></tr>
<tr><td><code>us-highway-alternate</code></td><td>2-3</td><td>US highways - alternate routes</td></tr>
<tr><td><code>us-highway-business</code></td><td>2-3</td><td>US highways - business routes</td></tr>
<tr><td><code>us-highway-bypass</code></td><td>2-3</td><td>US highways - bypasses</td></tr>
<tr><td><code>us-highway-truck</code></td><td>2-3</td><td>US highways - truck routes</td></tr>
<tr><td><code>us-bia</code></td><td>2-4</td><td>US BIA Indian routes</td></tr>
<tr><td><code>za-national</code></td><td>2-3</td><td>South Africa national routes</td></tr>
<tr><td><code>za-provincial</code></td><td>2</td><td>South Africa provincial routes</td></tr>
</table>

The `shield` value will be _null_ where `ref` is also _null_. No further `shield` values will be added in Mapbox Streets v8.


#### <!--road--> `type` _text_

The `type` field is the value of the road's "primary" OpenStreetMap tag. For most roads this is the `highway` tag, but for aerialways it will be the `aerialway` tag, and for golf holes it will be the `golf` tag. See <a href='http://taginfo.openstreetmap.org/keys/highway#values'>Taginfo</a> for a list of used tag values. Several classes pull in additional detail when it is available from OpenStreetMap.

Possible `construction` class `type` values:

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1 row3 scroll-styled'>construction:motorway
construction:motorway_link
construction:trunk
construction:trunk_link
construction:primary
construction:primary_link
construction:secondary
construction:secondary_link
construction:tertiary
construction:tertiary_link
construction:unclassifed
construction:residential
construction:road
construction:living_street
construction:pedestrian
construction
</code>
</div>

Possible `track` class `type` values:

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1 row3 scroll-styled'>track:grade1
track:grade2
track:grade3
track:grade4
track:grade5
track
</code>
</div>

Possible `service` class `type` values:

<div class='col12 clearfix space-bottom2'>
<code class='col10 margin1 pad1 row3 scroll-styled'>service:alley
service:emergency_access
service:drive_through
service:driveway
service:parking
service:parking_aisle
service
</code>
</div>

For the `path` class, some custom type assignments have been made based on insight from various categorical, physical, and access tags from OpenStreetMap.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>steps</code></td><td>aka stairs</td></tr>
<tr><td><code>corridor</code></td><td>An indoors passageway</td></tr>
<tr><td><code>sidewalk</code></td><td>aka pavement in many places outside North America</td></tr>
<tr><td><code>crossing</code></td><td>Usually connects sidewalk lines across a road</td></tr>
<tr><td><code>piste</code></td><td>Ski & snowboard trails, both downhill and cross-country.</td></tr>
<tr><td><code>mountain_bike</code></td><td>Trails used primarily or exclusively for mountain biking</td></tr>
<tr><td><code>hiking</code></td><td>Hiking trails or otherwise rough pedestrian paths</td></tr>
<tr><td><code>trail</code></td><td>May be suitable for either hiking or mountain biking</td></tr>
<tr><td><code>cycleway</code></td><td>Paths primarily or exclusively for cyclists</td></tr>
<tr><td><code>footway</code></td><td>Paths primarily or exclusively for pedestrians</td></tr>
<tr><td><code>path</code></td><td>Unspecified or mixed-use paths</td></tr>
<tr><td><code>bridleway</code></td><td>Equestrian trails</td></tr>
</table>

Possible `ferry` class `type` values:

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>ferry_auto</code></td><td>Ferry serves automobiles</td></tr>
<tr><td><code>ferry</code></td><td>No or unspecified automobile service</td></tr>
</table>


Possible `aerialway` class `type` values:

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>aerialway:cablecar</code></td><td>Just one or two large cars. The cable forms a loop, but the cars do not loop around, they just move up and down on their own side.</td></tr>
<tr><td><code>aerialway:gondola</code></td><td>Many cars on a looped cable.</td></tr>
<tr><td><code>aerialway:mixed_lift</code></td><td>Mix of chair lifts and gondolas on the same line; may change seasonally.</td></tr>
<tr><td><code>aerialway:chair_lift</code></td><td>Looped cable with a series of single chairs and exposed to the open air.</td></tr>
<tr><td><code>aerialway:drag_lift</code></td><td>Includes t-bars, j-bars, platter/button lifts, and tow ropes</td></tr>
<tr><td><code>aerialway:magic_carpet</code></td><td>Conveyor belt installed at the level of the snow, some include a canopy or tunnel.</td></tr>
<tr><td><code>aerialway</code></td><td>Other or unspecified type of aerialway</td></tr>
</table>

#### <!--road--> `layer` _number_

The `layer` field is used to determine drawing order of overlapping road segments in the tunnel and bridge layers. The value may be any integer number, but 95% of values are -1, 1, or 0, and 99.9999% of values are between -5 and 5.

#### <!--road--> `len` _number_

The `len` field stores the length of the road segment in projected meters, rounded to the nearest whole number. This can be useful for limiting some label styles to longer roads. The value may be _null_ where the geometry is not a line.


<!-- STRUCTURE ------------------------------------------------------------- -->
<a class='doc-section' id='structure'></a>
<h3 class='layer-ref-section'><a href='#structure'>structure</a>
    <div class='geomtype' title='lines & polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

This layer includes lines and polygons for structures which are not buildings. This includes both natural and human features - cliffs, walls, piers, gates.

Cliff data is designed such that the left-hand side of the line is the top of the cliff, and the right-hand side is the bottom.

#### <!--structure--> `class` _text_

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>cliff</code></td><td>The precipice of a vertical or very steep drop, gullies are included</td></tr>
<tr><td><code>fence</code></td><td>Include various types of fence and wall barriers</td></tr>
<tr><td><code>gate</code></td><td>Only gates that are lines or areas are included</td></tr>
<tr><td><code>hedge</code></td><td>A line of closely spaced shrubs and tree species, which form a barrier or mark the boundary of an area</td></tr>
<tr><td><code>land</code></td><td>Includes breakwaters and piers</td></tr>
</table>

#### <!--structure--> `type` _text_

The `type` field contains the original value of the feature's primary tag from OSM.


<!-- TRANSIT_STOP_LABEL ---------------------------------------------------- -->
<a class='doc-section' id='transit_stop_label'></a>
<h3 class='layer-ref-section'><a href='#transit_stop_label'>transit_stop_label</a>
    <div class='geomtype' title='points'>
        <span class='      inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>64</strong>
    </div>
</h3>

The `transit_stop_label` contains points for symbolizing transit stops, stations, and associated features such as entrances.

See [`names`](#names) and [`name_script`](#name_script) in for information about names and translations available for label text.

#### <!--transit_stop_label--> `stop_type` _text_

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>station</code></td><td>Used as the standard stop type for most rail & ferry modes. For buses and trams, stations represent centralized hubs.</td></tr>
<tr><td><code>stop</code></td><td>Used for bus and tram modes as the standard stop type. They are generally more frequently-spaced than stations and may need smaller symbols/text.</td></tr>
<tr><td><code>entrance</code></td><td>Specific entry points to a station</td></tr>
</table>

#### <!--transit_stop_label--> `mode` _text_

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>rail</code></td><td>National, regional, or commuter rail systems.</td></tr>
<tr><td><code>metro_rail</code></td><td>Urban rapid transit systems with dedicated rights of way, sometimes partially or fully underground.</td></tr>
<tr><td><code>light_rail</code></td><td>Less capacity than heavy/metro rail. Often on tracks separated from motor traffic but may share grade at intersections.</td></tr>
<tr><td><code>tram</code></td><td>Lighter rail with 1 or 2 carriages, often on a tracks shared with motor vehicle traffic.</td></tr>
<tr><td><code>monorail</code></td><td>Often medium-low capacity and with localized or private use such as in theme parks or airports.</td></tr>
<tr><td><code>funicular</code></td><td>Cable-driven inclined railways. Often touristic and low-capacity.</td></tr>
<tr><td><code>bicycle</code></td><td>For bicycle rental docks/stations</td></tr>
<tr><td><code>bus</code></td><td>For bus stops or stations</td></tr>
<tr><td><code>ferry</code></td><td>A boat that may take passengers on foot, in motor vehicles, or both</td></tr>
</table>

#### <!--transit_stop_label--> `maki` _text_

The `maki` field lets you assign icons to the rail station based on a few basic station types. See [`maki`](#maki) in the Common Fields section for more information.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>bicycle-share</code></td><td></td></tr>
<tr><td><code>bus</code></td><td></td></tr>
<tr><td><code>ferry</code></td><td></td></tr>
<tr><td><code>rail</code></td><td>Default rail station</td></tr>
<tr><td><code>rail-metro</code></td><td>Station for a subway, metro, or other rapid-transit system</td></tr>
<tr><td><code>rail-light</code></td><td>Light rail station</td></tr>
<tr><td><code>entrance</code></td><td>Specific station entrance points (eg stairs, escalators, elevators)</td></tr>
</table>

#### <!--transit_stop_label--> `network` _text_

The `network` field lets you assign more specific icons for rail stations that are part of specific local or regional transit systems. They don't necessarily correspond to a specific network - eg `de-u-bahn` applies to any U-Bahn network in Germany since these can all use the same icon in a map style. Some stations serve multiple networks; in these cases, multiple network names are joined with a dot (in alphabetical order).

If none of the specific networks below apply to a station, the `network` value will be the same as the `maki` value (see previous section).

<table class='small space-bottom2'>
<tr><th style='width: 36em'>Value</th><th>Description</th></tr>
<tr><td><code>barcelona-metro</code></td><td>Barcelona, Spain</td></tr>
<tr><td><code>boston-t</code></td><td>Boston, Massachusetts</td></tr>
<tr><td><code>chongqing-rail-transit</code></td><td>Chongqing, China</td></tr>
<tr><td><code>de-s-bahn</code></td><td>Germany</td></tr>
<tr><td><code>de-s-bahn.de-u-bahn</code></td><td>Germany</td></tr>
<tr><td><code>de-u-bahn</code></td><td>Germany</td></tr>
<tr><td><code>delhi-metro</code></td><td>Delhi, India</td></tr>
<tr><td><code>gb-national-rail</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>gb-national-rail.london-dlr</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>gb-national-rail.london-dlr.london-overground.london-tfl-rail.london-underground</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>gb-national-rail.london-dlr.london-overground.london-underground</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>gb-national-rail.london-dlr.london-underground</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>gb-national-rail.london-overground</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>gb-national-rail.london-overground.london-tfl-rail.london-underground</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>gb-national-rail.london-overground.london-underground</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>gb-national-rail.london-tfl-rail</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>gb-national-rail.london-tfl-rail.london-overground</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>gb-national-rail.london-tfl-rail.london-underground</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>gb-national-rail.london-underground</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>hong-kong-mtr</code></td><td>Hong Kong</td></tr>
<tr><td><code>kiev-metro</code></td><td>Kiev, Ukraine</td></tr>
<tr><td><code>london-dlr</code></td><td>Docklands Light Rail, London, United Kingdom</td></tr>
<tr><td><code>london-dlr.london-tfl-rail</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>london-dlr.london-tfl-rail.london-underground</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>london-dlr.london-underground</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>london-overground</code></td><td>London Overground, United Kingdom</td></tr>
<tr><td><code>london-overground.london-tfl-rail</code></td><td>London Overground, United Kingdom</td></tr>
<tr><td><code>london-overground.london-tfl-rail.london-underground</code></td><td>London Overground, United Kingdom</td></tr>
<tr><td><code>london-overground.london-underground</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>london-tfl-rail</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>london-tfl-rail.london-underground</code></td><td>London, United Kingdom</td></tr>
<tr><td><code>london-underground</code></td><td>London Underground, United Kingdom</td></tr>
<tr><td><code>madrid-metro</code></td><td>Madrid, Spain</td></tr>
<tr><td><code>mexico-city-metro</code></td><td>Mexico City, Mexico</td></tr>
<tr><td><code>milan-metro</code></td><td>Milan, Italy</td></tr>
<tr><td><code>moscow-metro</code></td><td>Moscow Metro, Russia</td></tr>
<tr><td><code>new-york-subway</code></td><td>New York City, New York</td></tr>
<tr><td><code>osaka-subway</code></td><td>Osaka, Japan</td></tr>
<tr><td><code>oslo-metro</code></td><td>Oslo, Norway</td></tr>
<tr><td><code>paris-metro</code></td><td>Paris Metro, France</td></tr>
<tr><td><code>paris-rer</code></td><td>Paris regional commuter rail, France</td></tr>
<tr><td><code>paris-metro.paris-rer</code></td><td>Paris, France</td></tr>
<tr><td><code>paris-rer.paris-transilien</code></td><td>Paris, France</td></tr>
<tr><td><code>paris-transilien</code></td><td>Paris suburban rail, France</td></tr>
<tr><td><code>philadelphia-septa</code></td><td>Philadelphia, Pennsylvania</td></tr>
<tr><td><code>san-francisco-bart</code></td><td>San Francisco, California</td></tr>
<tr><td><code>singapore-mrt</code></td><td>Singapore</td></tr>
<tr><td><code>stockholm-metro</code></td><td>stockholm, Sweden</td></tr>
<tr><td><code>taipei-metro</code></td><td>Taipei, Taiwan</td></tr>
<tr><td><code>tokyo-metro</code></td><td>Tokyo, Japan</td></tr>
<tr><td><code>vienna-u-bahn</code></td><td>Vienna, Austria</td></tr>
<tr><td><code>washington-metro</code></td><td>Washington DC Metro</td></tr>
</table>

No further `network` values will be added in Mapbox Streets v8.


<!-- WATER ----------------------------------------------------------------- -->
<a class='doc-section' id='water'></a>
<h3 class='layer-ref-section'><a href='#water'>water</a>
    <div class='geomtype' title='polygons'>
        <span class='quiet inline small icon marker'></span>
        <span class='quiet inline small icon polyline'></span>
        <span class='      inline small icon polygon'></span>
        buffer: <strong>8</strong>
    </div>
</h3>

This layer includes all types of water bodies: oceans, rivers, lakes, ponds, reservoirs, fountains, and more.

It is a simple polygon layer with no differentiating types or classes, and consists of a single merged shape per tile. This allows for seamless stroke and transparency styling, but means there is no way to filter out or highlight specific water bodies or a partial subset of them.

Each zoom level includes a set of water bodies that has been filtered and simplified according to scale. Only oceans, seas, and very large lakes are shown at the lowest zoom levels, while smaller and smaller lakes and ponds appear as you zoom in.


<!-- WATERWAY -------------------------------------------------------------- -->
<a class='doc-section' id='waterway'></a>
<h3 class='layer-ref-section'><a href='#waterway'>waterway</a>
    <div class='geomtype' title='lines'>
        <span class='quiet inline small icon marker'></span>
        <span class='      inline small icon polyline'></span>
        <span class='quiet inline small icon polygon'></span>
        buffer: <strong>4</strong>
    </div>
</h3>

The waterway layer contains classes for rivers, streams, canals, etc represented as lines. These classes can represent a wide variety of possible widths. It's best to have your line stying biased toward the smaller end of the scales since larger rivers and canals are usually also represented by polygons in the [#water](#water) layer. Also works best under `#water` layer.

#### <!--waterway--> `class` _text_ & `type` _text_

The waterway layer has two fields for styling - `class` and `type` - each with similar values.

<table class='small space-bottom2'>
<tr><th>Value</th><th>Description</th></tr>
<tr><td><code>river</code></td><td>Everything from the Amazon down to small creeks a couple meters wide</td></tr>
<tr><td><code>canal</code></td><td>Medium to large artificial waterway</td></tr>
<tr><td><code>stream</code></td><td>Very small waterway, usually no wider than a meter or two</td></tr>
<tr><td><code>stream_intermittent</code></td><td><strong>Class only</strong>. A stream that does not always have water flowing through it.</td></tr>
<tr><td><code>drain</code></td><td>Medium to small artificial channel for rainwater drainage, often concrete lined.</td></tr>
<tr><td><code>ditch</code></td><td>Small artificial channel dug in the ground for rainwater drainage.</td></tr>
</table>

