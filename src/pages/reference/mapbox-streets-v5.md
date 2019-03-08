---
title: Mapbox Streets v5
description: Reference documentation for the Mapbox Streets v5 tileset.
mapid: mapbox.mapbox-streets-v5
prependJs:
  - "import Icon from '@mapbox/mr-ui/icon';"
  - "import { LayerInfo } from '../../components/layer-info';"
  - "import { SourceLayerTypes } from '../../components/source-layer-types';"
  - "import Note from '@mapbox/dr-ui/note';"
  - "import WarningImage from '@mapbox/dr-ui/warning-image';"
---

{{ <Note title="Update to Mapbox Streets v8" theme="warning" imageComponent={<WarningImage color="orange" size="60" />} > }}

We recommend moving to [Mapbox Streets v8](/vector-tiles/reference/mapbox-streets-v8/) for additional features and improvements. Mapbox Streets v5 no longer receives data updates from OpenStreetMap.

{{</Note>}}

This is an in-depth guide the data inside the Mapbox Streets vector tile source to help with styling. For a complete and documented example of using Mapbox Streets vector tiles to style a Mapbox Studio Classic project, see the [OpenStreetMap Bright project for Mapbox Studio Classic](https://github.com/mapbox/osm-bright.tm2).

## Overview

### OpenStreetMap

Mapbox Streets vector tiles are largely based on data from [OpenStreetMap](http://openstreetmap.org), a free & global source of geographic data built by volunteers. An understanding of the OpenStreetMap data structure and tagging system is not necessary to make use of Mapbox Streets vector tiles, though it's helpful to understand some of the details.

When you publicly use styles or software that uses Mapbox Streets vector tiles you must [display proper attribution](https://docs.mapbox.com/help/how-mapbox-works/attribution/).

### Name fields

There are 5 different name fields for each of the label layers:

| Field | Description |
|---|---|
| `name` | The name (or names) used locally for the place. |
| `name` | The name (or names) used locally for the place. |
| `name_en` | English (if available, otherwise same as name) |
| `name_es` | Spanish (if available, otherwise same as name_en) |
| `name_fr` | French (if available, otherwise same as name_en) |
| `name_de` | German (if available, otherwise same as name_en) |


### OpenStreetMap IDs

Most layers in the Mapbox Streets vector tile source have an __`osm_id`__ field. The values for this field are integers based on the IDs assigned to objects in the main [OpenStreetMap](http://openstreetmap.org) database.

With raw OpenStreetMap IDs it's possible for two different objects of different types to share the same ID, but the Mapbox __`osm_id`__ is modified such that a layer containing a mix of object types will not contain any duplicate IDs. The following modification rules are in place, providing non-overlapping IDs to work with while keeping the original IDs simple to deduce at a glance.

| Original OpenStreetMap object | Vector tile geometry | ID transform | Example |
|---|---|---|---|
| node | point | original + 10<sup>15</sup> | 123 → 1000000000000123 |
| way | line | none | 123 → 123 |
| way | polygon, point | original + 10<sup>12</sup> | 123 → 1000000000123 |
| relation | line | original + 2×10<sup>12</sup> | 123 → 2000000000123 |
| relation | polygon, point | original + 3×10<sup>12</sup> | 123 → 3000000000123 |

Some objects in the vector tiles are the result of merging multiple OpenStreetMap objects. In these cases, the __`osm_id`__ will be based on one of the original IDs (and there is no guarantee about which one). Some objects are not from OpenStreetMap at all, or processed in such a way that the original OpenStreetMap IDs are unknown (for example ocean polygons). In these cases, the __`osm_id`__ will be `0`.

### Boolean fields

Some fields represent a boolean condition; the value may be either true or false. To keep the vector tiles compact these fields are stored as integers, where `0` = false and `1` = true.

_CartoCSS examples:_

```css
#admin[dispute=1] { /* boundaries that are disputed */ }
#road[oneway=0] { /* roads that are not one-way */ }
```

### Multiple geometry types

Mapnik vector tiles support multiple geometry types in the same layer. The Mapbox Streets source takes advantage of this for some layers.

A geometry in the vector tile can be one of 3 types:

{{ <SourceLayerTypes /> }}

In CartoCSS you can select one or two of the 3 types by filtering on the special `mapnik::geometry_type` property.

_CartoCSS examples:_

```css
#layer['mapnik::geometry_type'=1] { /* point styles */ }
#layer['mapnik::geometry_type'=2] { /* line styles */ }
#layer['mapnik::geometry_type'=3] { /* polygon styles */ }
```

### Data updates

The current supported version of the Mapbox Streets vector tiles receives regular data updates as new information becomes available and existing information is improved.

| Layer | Source |
|---|---|
| most layers | OpenStreetMap replication feed |
| [#admin](#admin) | custom OpenStreetMap processing |
| [#water](#water) (ocean parts) | [OpenStreetMap Data](http://openstreetmapdata.com) |
| [#marine_label](#marine_label), [#country_label](#country_label), [#country_label_line](#country_label_line), [#state_label](#state_label) | custom data |


## Layer Reference


<!-- LANDUSE ------------------------------------------------------->

### `#landuse`

{{ <LayerInfo type={["polygon"]} buffer={4} /> }}

This layer includes polygons representing both land-use and land-cover.

It's common for many different types of landuse/landcover to be overlapping, so the polygons in this layer are ordered by the area of their geometries to make sure smaller objects will not be obscured by larger ones. Pay attention to use of transparency when styling - the overlapping shapes can cause muddied or unexpected colors.

#### Classes

The main field used for styling the landuse layer is __`class`__.

| Value | Description |
|---|---|
| `agriculture` | Various types of crop and farmland |
| `cemetery` | Cemeteries and graveyards |
| `glacier` | Glaciers or permanent ice/snow |
| `grass` | Grasslands, meadows, fields, lawns, etc |
| `hospital` | Hospital grounds |
| `industrial` | Only includes airport areas |
| `park` | City parks, village greens, playgrounds, national parks, nature reserves, etc |
| `pitch` | Sports fields & courts of all types |
| `rock` | Bare rock, scree, quarries |
| `sand` | Sand, beaches, dunes |
| `school` | Primary, secondary, post-secondary school grounds |
| `scrub` | Bushes, scrub, heaths |
| `wood` | Woods and forestry areas |


<!-- WATERWAY -------------------------------------------------------------->

### `#waterway`

{{ <LayerInfo type={["line"]} buffer={4} /> }}

The waterway layer contains rivers, streams, canals, etc represented as lines.

Waterway classes can represent a wide variety of possible widths. Since larger rivers and canals are usually also represented by polygons in the [#water](#water) layer, make your line styling biased toward the smaller end of the scales.

#### Classes and types

The waterway layer has two fields for styling - __`class`__ and __`type`__ - each with similar values.

| Value | Description |
|---|---|
| `river` | Everything from the Amazon down to small creeks a couple meters wide |
| `canal` | Medium to large artificial waterway |
| `stream` | Very small waterway, usually no wider than a meter or two |
| `stream_intermittent` | **Class only**. A stream that does not always have water flowing through it. |
| `drain` | Medium to small artificial channel for rainwater drainage, often concrete lined. |
| `ditch` | Small artificial channel dug in the ground for rainwater drainage. |

_CartoCSS example:_

```css
#waterway {
  [class='stream'], [class='stream_intermittent'] {
    line-color: #ace;
    line-width: 2;
  }
  [class='stream_intermittent'] { line-dasharray, 4, 2; }
}
```

<!-- WATER ----------------------------------------------------------------->

### `#water`

{{ <LayerInfo type={["polygon"]} buffer={8} /> }}

This is a simple polygon layer with no differentiating types or classes. The tileset filters and simplifies water bodies according to scale. It only shows oceans and large lakes at the lowest zoom levels, while smaller and smaller lakes and ponds appear as you zoom in.

Water polygons sometimes have overlapping pieces with each other, so avoiding CartoCSS styles such as `polygon-opacity` and most `polygon-comp-op` values is recommended. Instead, use the style-level properties `opacity` and `comp-op`.

Drawing outlines on water can be tricky. Since rivers and lakes are often broken into multiple pieces you can end up with seams in the middle of water bodies. A common CartoCSS pattern to avoid this is this blur method to create an inner-glow effect:

```
#water {
  ::shadow { polygon-fill: #07f; }
  ::fill {
    // a white fill and overlay comp-op lighten the polygon-fill from ::shadow.
    polygon-fill: #fff;
    comp-op: soft-light;
    // blurring reveals the polygon fill from ::shadow around the edges of the water
    image-filters: agg-stack-blur(2,2);
  }
}
```

<!-- AEROWAY ---------------------------------------------------------->

### `#aeroway`

{{ <LayerInfo type={["line"]} buffer={4} /> }}

The aeroway layer includes both lines and polygons representing runways, helipads, etc.

#### Types

The __`type`__ field separates different types of aeroways for styling.

| Value | Description |
|---|---|
| `runway` | Where planes take off & land |
| `taxiway` | Where planes move between runways, gates, and hangars |
| `apron` | Where planes park, refuel, load |
| `helipad` | Where helicopters take off & land |

_CartoCSS example:_

```css
#aeroway {
  ['mapnik::geometry_type'=2] {
    line-color: #888;
    [type='runway'] { line-width: 3; }
  }
  ['mapnik::geometry_type'=3] { polygon-fill: #888; }
}
```


<!-- BARRIER_LINE ------------------------------------------------------->

### `#barrier_line`

{{ <LayerInfo type={["line", "polygon"]} buffer={4} /> }}

This layer includes lines and polygons for barriers - things such as walls and fences.

#### Classes

| Value | Description |
|---|---|
| `cliff` | The precipice of a vertical or steep drop |
| `fence` | Include various types of fence and wall barriers |
| `gate` | Only gates that are lines or areas are included |
| `hedge` |  |
| `land` | Includes breakwaters and piers |

Cliff data from OpenStreetMap is designed such that the left-hand side of the line is the top of the cliff, and the right-hand side is the bottom. See the [Line patterns with images](https://tilemill-project.github.io/tilemill/docs/guides/styling-lines/) section of the TileMill Styling Lines guide for how to design an appropriate image pattern for cliffs.

_CartoCSS example:_

```css
#barrier_line[class='fence'] { line-color: #864; }
#barrier_line[class='hedge'] { line-color: #aec; }
```


<!-- BUILDING ------------------------------------------------------------->

### `#building`

{{ <LayerInfo type={["polygon"]} buffer={2} /> }}

This is a simple polygon layer with no differentiating types or classes. Large buildings appear at zoom level 13, and all buildings are included in zoom level 14 and up.

_CartoCSS example:_

```css
#building {
  polygon-fill: #eca;
  line-color: #864;
}
```


<!-- LANDUSE_OVERLAY -->

### `#landuse_overlay`

{{ <LayerInfo type={["polygon"]} buffer={4} /> }}

This layer is for landuse / landcover polygons that your style should draw above the [#water](#water) layer.

#### Classes

The main field used for styling the landuse_overlay layer is __`class`__.

| Value | Description |
|---|---|
| `wetland` | Wetlands that may include vegetation (marsh, swamp, bog) |
| `wetland_noveg` | Wetlands that probably don't contain vegetation (mud, tidal flat) |

_CartoCSS example:_

```css
#landuse_overlay[class='wetland'] {
  polygon-pattern-file: url("./icons/wetland.png");
}
```


<!-- TUNNEL, ROAD, & BRIDGE ------------------------------------------->

### `#tunnel, #road, #bridge`

{{ <LayerInfo type={["point", "line", "polygon"]} buffer={4} /> }}

The roads layers are some of the most complex ones in Mapbox Streets. Starting at zoom level 12, the tileset breaks tunnels and bridges out of the `#road` layer into either `#tunnel` or `#bridge`.

#### Classes

The main field used for styling the tunnel, road, and bridge layers is __`class`__.

| Value | Description |
|---|---|
| `motorway` | High-speed, grade-separated highways |
| `motorway_link` | Interchanges / on & off ramps |
| `main` | Trunk, primary, secondary, and tertiary roads & links lumped together for simpler styling. |
| `street` | Standard unclassified or residential streets |
| `street_limited` | Streets that may have limited or no access for motor vehicles. Pedestrian streets, roads under construction, private roads, etc. |
| `service` | Access roads, alleys, agricultural tracks, and other services roads. |
| `driveway` | For local access. Includes parking lot aisles, public & private driveways |
| `path` | Foot paths, cycle paths, ski trails. |
| `major_rail` | Railways, including mainline, commuter rail, and rapid transit. |
| `minor_rail` | Yard and service railways. |
| `aerialway` | Ski lifts, gondolas, and other types of aerialway. |
| `golf` | The approximate centerline of a golf course hole |

#### One-way roads

A __`oneway`__ field indicates whether the motor traffic on the road is one-way or not. If the road is one-way, traffic travels in the same direction as the linestring.  

_CartoCSS example:_

```css
#road[oneway=1] {
  marker-file: url(shape://arrow);
  marker-fill: red;
}
```

#### Types

The __`type`__ field is the value of the road's "primary" OpenStreetMap tag. For most roads this is the `highway` tag, but for aerialways it will be the `aerialway` tag, and for golf holes it will be the `golf` tag. See [TagInfo](http://taginfo.openstreetmap.org/keys/highway#values) for a list of used tag values.

#### Layers

The __`layer`__ field is used to determine drawing order of overlapping road segments in the tunnel and bridge layers. 95% of values are -1, 1, or 0, and 99.9999% of values are between -5 and 5.

If you want to make sure proper ordering of overlapping bridges when dealing with styles that involve road casing, you'll need to manually add some extra code to your project.yml. The `layer` field is intended to be used by this feature, not in your CartoCSS styles directly.

```
project.yml:
_properties:
  bridge:
    "group-by": layer
    # ...
```


<!-- ADMIN ------------------------------------------------------------------->

### `#admin`

{{ <LayerInfo type={["line"]} buffer={4} /> }}

Administrative boundary lines. These are constructed from the OpenStreetMap data in such a way that there are no overlapping lines where multiple boundary areas meet.

#### Administrative level

The __`admin_level`__ field separates different levels of boundaries, using the same numbering scheme as OpenStreetMap. See [admin_level](http://wiki.openstreetmap.org/wiki/Admin_level) for details about what the different values translate to in different countries.

| Value | Description |
|---|---|
| `2` | countries |
| `3` | regions (not commonly used) |
| `4` | states, provinces, etc. |

#### Disputes

The __`disputed`__ field should be used to apply a dashed or otherwise distinct style to disputed boundaries. No single map of the world will ever keep everybody happy, but acknowledging disputes where they exist is an important aspect of good cartography.

_CartoCSS example:_

```css
#admin[admin_level=2] {
  line-width: 2;
  [dispute=1] { line-dasharray: 4, 4; }
}
```

#### Maritime boundaries

The __`maritime`__ field can be used as a filter to downplay or hide maritime boundaries, which are often not shown on maps. Note that the practice of tagging maritime boundaries is not entirely consistent or complete within OpenStreetMap, so some boundaries may not have this field set correctly (this mostly affects admin levels 3 & 4).

_CartoCSS example:_

```css
#admin {
  [maritime=0] { line-color: black; }
  [maritime=1] { line-color: blue; }
}
```


<!-- COUNTRY_LABEL_LINE ---------------------------------------------------->

### `#country_label_line`

{{ <LayerInfo type={["line"]} buffer={2} /> }}

This layer contains lines used as label leader lines for some country labels at low zoom levels. There are no data fields for this layer - only a single, simple line style is needed.

_CartoCSS example:_

```css
#country_label_line { line-color: #333; }
```


<!-- COUNTRY_LABEL --------------------------------------------------------->

### `#country_label`

{{ <LayerInfo type={["point"]} buffer={256} /> }}

This layer contains points used for labeling countries. The points are placed for minimal overlap with small to medium-sized text.

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Scalerank

The __`scalerank`__ field is intended to help assign different label styles based on the size and available room to label different countries.

_CartoCSS example:_

```css
#country_label {
  text-name: [name_en];
  text-face-name: 'Open Sans Semibold';
  text-size: 10;
  [scalerank=0] { text-size: 14; }
  [scalerank=1] { text-size: 13; }
  [scalerank=2] { text-size: 12; }
  [scalerank=3] { text-size: 11; }
}
```


<!-- MARINE_LABEL -------------------------------------------------------->

### `#marine_label`

{{ <LayerInfo type={["line"]} buffer={256} /> }}

Points and lines for labeling major marine features such as oceans, seas, large lakes & bays.

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Labelrank & placement

The __`labelrank`__ field is intended to help assign different label styles based on the size and available room to label different water bodies. The possible values are whole numbers 1 through 6.

The value of the __`placement`__ field will be either `point` or `line` depending on the geometry type of the object.

_CartoCSS example:_

```css
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
```


<!-- STATE_LABEL ----------------------------------------------------------->

### `#state_label`

{{ <LayerInfo type={["point"]} buffer={256} /> }}

Points for labeling states and provinces. Only a small number of countries are included.

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Area

The __`area`__ field is the physical area of the entity in square kilometers. Use it to help filter and size your state labels at different zoom levels.

_CartoCSS example:_

```css
#state_label {
  text-name: [name];
  text-face-name: 'Open Sans Regular';
  text-size: 12;
  [area>=10000] { text-size: 14; }
  [area>=500000] { text-size: 16; }
  [area>=1000000] { text-size: 18; }
```


<!-- PLACE_LABEL ------------------------------------------------------------>

### `#place_label`

{{ <LayerInfo type={["point"]} buffer={128} /> }}

This layer contains points for labeling human settlements.

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Types

The main field for styling labels for different kinds of places is __`type`__.

| Value | Description |
|---|---|
| `city` | Settlement of about 100,000 or more people. |
| `town` | Urban or rural settlement of about 10,000-100,000 people |
| `village` | Usually rural settlement of less than about 10,000 |
| `hamlet` | Rural settlement with a population of about 200 or fewer |
| `suburb` | A distinct section of an urban settlement such as an annexed town, historical district, or large & important neighborhood. |
| `neighbourhood` | A named part of a larger settlement |

#### Capitals

The __`capital`__ field allows distinct styling of labels or icons for the capitals of countries, regions, or states & provinces.

| capital | _limited integer_ |
|---|---|
| `2` | National capital |
| `3` | Regional capital (uncommon) |
| `4` | State / provincial capital |

_CartoCSS example:_

```css
#place_label {
  [capital=2] { marker-file: url("./icons/star-national.svg"); }
  [capital=3] { marker-file: url("./icons/star-region.svg"); }
  [capital=4] { marker-file: url("./icons/star-state.svg"); }
}
```

#### Scalerank

The __`scalerank`__ field can be used to adjust the prominence of label styles for larger and more prominent cities. The value number from 0 through 9, where 0 is the large end of the scale (for example New York City). All places other than large cities will have a scalerank of `null`.

_CartoCSS example:_

```css
#place_label[type='city] {
  text-name: [name];
  text-face-name: 'Open Sans Regular';
  text-size: 12;
  [scalerank>=0][scalerank<=2] { text-size: 18; }
  [scalerank>=3][scalerank<=4] { text-size: 16; }
  [scalerank>=5][scalerank<=6] { text-size: 14; }
  [scalerank>=7][scalerank<=8] { text-size: 13; }
}
```

#### Localrank

The __`localrank`__ field can be used to adjust the label density by showing fewer labels. This method is preferred to CartoCSS's __`text-min-distance`__ because it leads to far fewer labels clipped across tile boundaries. It is a whole number greater than 0 calculated by grouping places into a 128 pixel grid at each zoom level, then assigning each place a ranking within that grid. The most important place in that 128 pixels will get a __`localrank`__ of 1, the second most important is 2, and so on. So to reduce the label density to 4 labels per tile, you can add the filter `[localrank=1]`.

_CartoCSS example:_

```css
#place_label[localrank<=1] {
  text-name: [name];
  text-face-name: 'Open Sans Regular';
}
```

#### Label direction

The __`ldir`__ field can be used as a hint for label offset directions at lower zoom levels. For places with a __`scalerank`__ value set, the __`ldir`__ will be a cardinal direction such as `N`, `E`, `SW`.

_CartoCSS example:_

```css
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
```


<!-- WATER_LABEL --------------------------------------------------------->

### `#water_label`

{{ <LayerInfo type={["point"]} buffer={64} /> }}

This layer contains points for labeling bodies of water such as lakes and ponds.

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Area

The __`area`__ field holds the area of the associated water polygon in square meters (Mercator-projected units rounded to the nearest whole number, not real-world area). You can use it to adjust label size and visibility.

_CartoCSS example:_

```css
#water_label {
  [zoom<=15][area>=200000],
  [zoom=16][area>=50000],
  [zoom=17][area>=10000],
  [zoom>=18][area>0] {
    text-name: [name];
    text-face-name: 'Open Sans Regular';
  }
}
```


<!-- POI_LABEL -------------------------------------------------------------->

### `#poi_label`

{{ <LayerInfo type={["point"]} buffer={64} /> }}

This layer is used to place icons and labels for various points of interest (POIs).

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Maki icons

The __`maki`__ field is designed to make it easier to add icons to POIs using the [Maki icon project](https://labs.mapbox.com/maki-icons/), or with other icons that follow the same naming scheme.

_CartoCSS example:_

```css
#poi_label[maki!=null] { marker-file: url("icons/[maki].svg"); }
```

Not all Maki icons are used, and different types of related POIs will sometimes have the same __`maki`__ value (for example universities and colleges, or art supply shops and art galleries). The possible values for the __`maki`__ field are listed below.

```
null
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
```

#### Type

The __`type`__ field contains a more specific classification intended for display - for example 'Cafe', 'Hotel', 'Laundry'. These values come from the original OpenStreetMap tags and are not a limited set.

#### Scalerank

The __`scalerank`__ field is intended to help assign different label styles based on the prominence of different features.

| Value | Description |
|---|---|
| `1` | The POI has a large area |
| `2` | The POI has a medium-large area |
| `3` | The POI has a small area, or is of a type that is commonly large and important (for example hospital, university) |
| `4` | The POI has no known area |

#### Controlling label density

The __`localrank`__ field can be used to adjust the label density by showing fewer labels. This method is preferred to CartoCSS's __`text-min-distance`__ because it leads to far fewer labels clipped across tile boundaries. It is a whole number >=1 calculated by grouping places into a ~300m projected grid, then assigning each place a ranking within that grid. The most important place in each cell will get a __`localrank`__ of 1, the second most important is 2, and so on.

_CartoCSS example:_

```css
#poi_label {
  [zoom=15][localrank<=1],
  [zoom=16][localrank<=2],
  [zoom=17][localrank<=4] { /* icon styles */ }
}
```

#### Rail station networks

The __`network`__ field is aimed at helping assign icons for rail stations - the value will be `null` for all other types of POIs. They don't necessarily correspond to a specific network - for example `u-bahn` applies to any U-Bahn network in Germany. Some stations serve multiple networks; in these cases, multiple network names are joined with a dot (in alphabetical order).

| Value | Description |
|---|---|
| `null` | POI is not a rail station |
| `rail` | Default rail station |
| `subway` | Default subway/metro station |
| `light` | Default light rail station |
| `dlr` | Docklands Light Rail, London, UK |
| `dlr.london-overground.london-underground.national-rail` | London, UK |
| `dlr.london-underground` | London, UK |
| `dlr.london-underground.national-rail` | London, UK |
| `dlr.national-rail` | London, UK |
| `london-overground` | London Overground, UK |
| `london-overground.london-underground` | London, UK |
| `london-overground.london-underground.national-rail` | London, UK |
| `london-overground.national-rail` | London, UK |
| `london-underground` | London Underground, UK |
| `london-underground.national-rail` | London, UK |
| `national-rail` | UK |
| `washington-metro` | Washington DC Metro |
| `wiener-linien` | Vienna, Austria |
| `metro` | Paris Metro, France |
| `rer` | Paris regional commuter rail, France |
| `metro.rer` | Paris, France |
| `transilien` | Paris suburban rail, France |
| `rer.transilien` | Paris, France |
| `moscow-metro` | Moscow Metro, Russia |
| `s-bahn` | Germany |
| `u-bahn` | Germany |
| `s-bahn.u-bahn` | Germany |

#### Additional information

The __`ref`__ field is a short reference code that can be used as an alternative name. It is only used for airports.

<!-- ROAD_LABEL ----------------------------------------------------------->

### `#road_label`

{{ <LayerInfo type={["point", "line"]} buffer={64} /> }}

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Route numbers

Besides the standard name fields, there is also a __`ref`__ field that holds any reference codes or route numbers a road may have.

To aid with shield styling in TileMill and Mapnik, the __`reflen`__ field conveys the number of characters present in the __`ref`__ field. If the ref is 'I 95', then the reflen is 4.

_CartoCSS example:_

```css
#road_label[reflen>=1] {
  shield-name: [ref];
  shield-face-name: 'Open Sans Regular';
  shield-file: url("./img/shield-[reflen].png");
}
```


#### Classes

The __`class`__ field for road labels matches the [#tunnel, #road, & #bridge](#tunnel-road-bridge) layers.

| Value | Description |
|---|---|
| `motorway` | High-speed, grade-separated highways |
| `main` | Trunk, primary, secondary, and tertiary roads & links lumped together for simpler styling. |
| `street` | Standard unclassified or residential streets |
| `street_limited` | Streets that may have limited or no access for motor vehicles. Pedestrian streets, roads under construction, private roads, etc. |
| `service` | Access roads, alleys, agricultural tracks, and other services roads. |
| `path` | Foot paths, cycle paths, ski trails. |
| `aerialway` | Ski lifts, gondolas, and other types of aerialway. |
| `golf` | The approximate centerline of a golf course hole |

#### Additional information

The __`len`__ field stores the length of the road segment in projected meters, rounded to the nearest whole number. This can be useful for limiting some label styles to longer roads.


<!-- WATERWAY_LABEL --------------------------------------------------------->

### `#waterway_label`

{{ <LayerInfo type={["line"]} buffer={64} /> }}

This layer contains line geometries that match those in the [#waterway](#waterway) layer but with name fields for label rendering.

#### Label text

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Classes & types

The __`class`__ and __`type`__ fields match those in the [#waterway](#waterway) layer.

| Value | Description |
|---|---|
| `river` | Everything from the Amazon down to small creeks a couple meters wide |
| `canal` | Medium to large artificial waterway |
| `stream` | Very small waterway, usually no wider than a meter or two |
| `stream_intermittent` | **Class only**. A stream that does not always have water flowing through it. |
| `drain` | Medium to small artificial channel for rainwater drainage, often concrete lined. |
| `ditch` | Small artificial channel dug in the ground for rainwater drainage. |


<!-- HOUSENUM_LABEL --------------------------------------------------------->

### `#housenum_label`

{{ <LayerInfo type={["point"]} buffer={64} /> }}

This layer contains points used to label the street number parts of specific addresses.

The __`house_num`__ field contains house and building numbers. These are commonly integers but may include letters or be only letters, for example "1600", "31B", "D". If an address has no number tag but has a house name or building name, the __`house_num`__ field will be the name instead.

_CartoCSS example:_

```css
#housenum_label {
  text-name: [house_num];
  text-face-name: 'Open Sans Regular';
}
```


## Changelog

A summary of the changes from v4:

- New __`class`__ field added in the [#waterway](#waterway) layer. You can safely ignore this change when upgrading styles from v4
- New __`maki`__ values in the [#poi_label](#poi_label) layer: `bakery`, `camera`, `car`, `clothing-store`, `dog-park`, `entrance`, `laundry`, `rail-light`, `rail-metro`, `suitcase`. If upgrading a v4 style that uses `[maki]` in a URL expression (for example `marker-file`), you will need to make sure to add files to match the new values.
- New __`network`__ values in the [#poi_label](#poi_label) layer: `wiener-linien`, `metro`, `rer`, `metro.rer`, `transilien`, `rer.transilien`, `moscow-metro`, `s-bahn`, `u-bahn`, `sbahn.u-bahn`. If upgrading a v4 style that uses `[network]` in a URL expression (for example `marker-file`), you will need to make sure to add files to match the new values.
- New [`#housenum_label`](#housenum_label) layer for labeling house and building numbers. You can safely ignore this change when upgrading styles from v4
- New __`localrank`__ field in the [#place_label](#place_label) layer. When upgrading styles from v4 it is recommended to remove any `text-min-distance` styles from you place labels and use __`localrank`__ to control label density.
- New __`class`__ values in the [#landuse](#landuse) layer: `agriculture`, `glacier`, `grass`, `piste`, `rock`, `scrub`. When upgrading styles from v4, look for catch-all styles that may have unexpected results for unhandled values (for example dark gray polygon fills, black outlines).
- In the [#road_label](#road_label) layer, the __`ref`__ field is now available for all road types. Before it was only available for motorways. For most style upgrades from it should be safe to ignore this change, though there may be edge cases where action is needed.
- The [#marine_label](#marine_label) layer now contains actual point geometries so you can use `['mapnik::geometry_type'=1]` instead of `[placement='point']`. The tileset keeps __`placement`__ for backwards-compatibility, but no action is necessary for this change when upgrading styles from v4.
- New __`capital`__ field added in the [#place_label](#place_label) layer to identify cities that are the capitals of countries, regions, or states/provinces. You can safely ignore this change when upgrading styles from v4.
