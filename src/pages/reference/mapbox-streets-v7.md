---
title: Mapbox Streets v7
description: Reference documentation for the Mapbox Streets v7 tileset.
mapid: mapbox.mapbox-streets-v7
prependJs: 
  - "import Icon from '@mapbox/mr-ui/icon';"
  - "import { LayerInfo } from '../../components/layer-info';"
---

This is an in-depth guide to the data inside the Mapbox Streets vector tile source to help with styling.

## Overview


### OpenStreetMap

Mapbox Streets vector tiles are largely based on data from [OpenStreetMap](http://openstreetmap.org), a free & global source of geographic data built by volunteers. An understanding of the OSM data structure and tagging system is not neccessary to make use of Mapbox Streets vector tiles, though it's helpful to understand some of the details.

When you publicly use styles or software that use Mapbox Streets vector tiles, you must [display proper attribution](https://www.mapbox.com/help/attribution/).


### Name fields

There are 12 different name fields for each of the label layers:

| Field | Description |
|---|---|
| `name` | The name (or names) used locally for the place. |
| `name_ar` | Arabic (if available, otherwise same as name) |
| `name_en` | English (if available, otherwise same as name) |
| `name_es` | Spanish (if available, otherwise same as name_en) |
| `name_fr` | French (if available, otherwise same as name_en) |
| `name_de` | German (if available, otherwise same as name_en) |
| `name_pt` | Portuguese (if available, otherwise same as name_en) |
| `name_ru` | Russian (if available, otherwise same as name) |
| `name_ja` | Japanese (if available, otherwise same as name) |
| `name_ko` | Korean (if available, otherwise same as name) |
| `name_zh` | Chinese&#42; (if available, otherwise same as name) |
| `name_zh-Hans` | Simplified Chinese&#42; (if available, otherwise same as name) |

&#42; The `name_zh` field contains Mandarin using simplified Chinese characters for our custom label layers: `#country_label`, `#state_label`, and `#marine_label`. All other label layers are sourced from OpenStreetMap and may contain one of several dialects and either simplified or traditional Chinese characters in the `name_zh` field. The `name_zh-Hans` field is similar, except any Traditional Chinese characters are automatically transformed to Simplified Chinese.


### Boolean fields

Some fields represent a boolean condition; the value may be either true or false. To keep the vector tiles compact these fields may be stored as integers, where `0` = false and `1` = true.


### Multiple geometry types

Mapnik vector tiles support multiple geometry types in the same layer. The Mapbox Streets source takes advantage of this for some layers.

A geometry in the vector tile can be one of 3 types:

1. {{ <Icon name="marker" inline={true} /> }} Point
2. {{ <Icon name="polyline" inline={true} /> }} Linestring / multilinestring
3. {{ <Icon name="polygon" inline={true} /> }} Polygon / multipolygon

In Mapbox Studio, you can select one, two, or all three of these geometry types with the Geometry Type toggles in each layer's **Select data** tab.

### Data updates

The current supported version of the Mapbox Streets vector tiles receives regular data updates as new information becomes available and existing information is improved.

| Layer | Source |
|---|---|
| most layers | OpenStreetMap replication feed |
| [#admin](#admin) | custom OpenStreetMap processing |
| [#water](#water) (ocean parts) | [OpenStreetMap Data](http://openstreetmapdata.com) |
| [#marine_label](#marine_label), [#country_label](#country_label), [#state_label](#state_label) | custom data |

### OSM IDs

OSM IDs are not stored as object properties but as object IDs within the vector tile. This means they are not available for styling via Mapbox Studio, but can still be interacted with via Mapbox GL JS and other vector tile libraries.

OpenStreetMap ID spaces are not unique across node, way, and relation object types. In order to make them unique for vector tiles, the IDs are transformed based on their OpenStreetMap object type.

| OSM type | OSM ID transform |
|---|---|
| node     | `id × 10`       _eg. 123 → 1230_ |
| way      | `(id × 10) + 1` _eg. 123 → 1231_ |
| relation | `(id × 10) + 4` _eg. 123 → 1234_ |

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


<!-- LANDUSE ----------------------------------------------------------->

{{ <LayerInfo name="landuse" type={["polygon"]} buffer={4} /> }}

This layer includes polygons representing both land-use and land-cover.

It's common for many different types of landuse/landcover to be overlapping, so the polygons in this layer are ordered by the area of their geometries to ensure smaller objects will not be obscured by larger ones. Pay attention to use of transparency when styling - the overlapping shapes can cause muddied or unexpected colors.

#### Classes

The main field used for styling the landuse layer is __`class`__.

| Value | Description |
|---|---|
| `'aboriginal_lands'` | The boundary of aboriginal lands. |
| `'agriculture'` | Various types of crop and farmland |
| `'cemetery'` | Cemeteries and graveyards |
| `'glacier'` | Glaciers or permanent ice/snow |
| `'grass'` | Grasslands, meadows, fields, lawns, etc |
| `'hospital'` | Hospital grounds |
| `'industrial'` | Currently only includes airport areas |
| `'park'` | City parks, village greens, playgrounds, national parks, nature reserves, etc |
| `'pitch'` | Sports fields & courts of all types |
| `'rock'` | Bare rock, scree, quarries |
| `'sand'` | Sand, beaches, dunes |
| `'school'` | Primary, secondary, post-secondary school grounds |
| `'scrub'` | Bushes, scrub, heaths |
| `'wood'` | Woods and forestry areas |


<!-- WATERWAY ----------------------------------------------------------->

{{ <LayerInfo name="waterway" type={["line"]} buffer={4} /> }}

The waterway layer contains classes for rivers, streams, canals, etc represented as lines. These classes can represent a wide variety of possible widths. It's best to have your line stying biased toward the smaller end of the scales since larger rivers and canals are usually also represented by polygons in the [#water](#water) layer. Also works best under `#water` layer.

#### Classes and types

The waterway layer has two fields for styling - __`class`__ and __`type`__ - each with similar values.

| Value | Description |
|---|---|
| `'river'` | Everything from the Amazon down to small creeks a couple meters wide |
| `'canal'` | Medium to large artificial waterway |
| `'stream'` | Very small waterway, usually no wider than a meter or two |
| `'stream_intermittent'` | **Class only**. A stream that does not always have water flowing through it. |
| `'drain'` | Medium to small artificial channel for rainwater drainage, often concrete lined. |
| `'ditch'` | Small artificial channel dug in the ground for rainwater drainage. |


<!-- WATER -------------------------------------------------------------->

{{ <LayerInfo name="water" type={["polygon"]} buffer={8} /> }}

This layer includes all types of water bodies: oceans, rivers, lakes, ponds, reservoirs, fountains, and more.

It is a simple polygon layer with no differentiating types or classes, and consists of a single merged shape per tile. This allows for seamless stroke and transparency styling, but means there is no way to filter out or highlight specific water bodies or a partial subset of them.

Each zoom level includes a set of water bodies that has been filtered and simplified according to scale. Only oceans, seas, and very large lakes are shown at the lowest zoom levels, while smaller and smaller lakes and ponds appear as you zoom in.


<!-- AEROWAY ------------------------------------------------------------->

{{ <LayerInfo name="aeroway" type={["line"]} buffer={4} /> }}

The aeroway layer includes both lines and polygons representing runways, helipads, etc.

#### Types

The __`type`__ field separates different types of aeroways for styling.

| Value | Description |
|---|---|
| `'runway'` | Where planes take off & land |
| `'taxiway'` | Where planes move between runways, gates, and hangars |
| `'apron'` | Where planes park, refuel, load |
| `'helipad'` | Where helicopters take off & land |


<!-- BARRIER_LINE ----------------------------------------------------------->

{{ <LayerInfo name="barrier_line" type={["line", "polygon"]} buffer={4} /> }}

This layer includes lines and polygons for barriers - things such as walls and fences.

#### Classes

| Value | Description |
|---|---|
| `'cliff'` | The precipice of a vertical or very steep drop, gullies are included |
| `'fence'` | Include various types of fence and wall barriers |
| `'gate'` | Only gates that are lines or areas are included |
| `'hedge'` | A line of closely spaced shrubs and tree species, which form a barrier or mark the boundary of an area |
| `'land'` | Includes breakwaters and piers |

Cliff data from OSM is designed such that the left-hand side of the line is the top of the cliff, and the right-hand side is the bottom.


<!-- BUILDING ----------------------------------------------------------->

{{ <LayerInfo name="building" type={["polygon"]} buffer={2} /> }}

Large buildings appear at zoom level 13, and all buildings are included in zoom level 14 and up.

#### Underground buildings

The __`underground`__ field is usually `false`, but will be `true` for buildings that are underground (for example, some subway stations).

#### Building types

The __`type`__ field lets you differentiate building parts from building outlines. Building part polygons intended primarily for 3D rendering have a value of `building:part`. Building outlines (covering the full footprint of a building) will have a value of `building` if tagged as `building=yes` on OpenStreetMap, otherwise the value will match the `building` tag from OpenStreetMap ([see TagInfo for common values](http://taginfo.osm.org/keys/building#values)).

#### Building heights

The __`height`__ field contains the height of a building or building part in meters (rounded to the nearest integer). In many cases this value is derived from the `building:levels` tag on OpenStreetMap - we estimate 3 meters per level if no exact height is specified.

The __`min_height`__ field contains the height in meters from the ground to the _bottom_ of a building part, for cases where the bottom of the part is not on the ground. This allows for proper extrusion rendering of things such as sky bridges and cantilevered building parts.

The __`extrude`__ field is `true` or `false` depending one whether the object should be included in 3D-extrusion renderings. For example a complex building might have various `building:part` objects mapped with different heights, in addition to a building object representing the footprint of the entire building. Only the `building:part` objects are needed for 3D rendering, so the full footprint outline will have an `extrude` value of `false`.


<!-- LANDUSE_OVERLAY ------------------------------------------------------->

{{ <LayerInfo name="landuse_overlay" type={["polygon"]} buffer={8} /> }}

This layer is for landuse / landcover polygons that should be drawn above the [#water](#water) layer.

#### Classes

The main field used for styling the landuse_overlay layer is __`class`__.

| Value | Description |
|---|---|
| `'national_park'` | Relatively large area of land set aside by a government for human recreation and enjoyment, animal and environmental protection |
| `'wetland'` | Wetlands that may include vegetation (marsh, swamp, bog) |
| `'wetland_noveg'` | Wetlands that probably don't contain vegetation (mud, tidal flat) |


<!-- ROAD ------------------------------------------------------------------->

{{ <LayerInfo name="road" type={["point", "line", "polygon"]} buffer={4} /> }}

The roads layers are some of the most complex ones in Mapbox Streets. Separate `bridge` and `tunnel` layers are gone and  have been merged into road. `structure` field describes whether the road segment is a `bridge`, `tunnel`, `ford`, or `none`. Bridges and tunnels are not distinct from roads until zoom level 13.

#### Classes

The main field used for styling the road layers is __`class`__.

| Value | Description |
|---|---|
| `'motorway'` | High-speed, grade-separated highways |
| `'motorway_link'` | Interchanges / on & off ramps |
| `'trunk'` | Important roads that are not motorways. |
| `'primary'` | A major highway linking large towns. |
| `'secondary'` | A highway linking large towns. |
| `'tertiary'` | A road linking small settlements, or the local centres of a large town or city. |
| `'link'` | Contains link roads |
| `'street'` | Standard unclassified, residential, road, and living_street road types |
| `'street_limited'` | Streets that may have limited or no access for motor vehicles. |
| `'pedestrian'` | Includes pedestrian streets, plazas, and public transportation platforms. |
| `'construction'` | Includes motor roads under construction (but not service roads, paths, etc). |
| `'track'` | Roads mostly for agricultural and forestry use etc. |
| `'service'` | Access roads, alleys, agricultural tracks, and other services roads. Also includes parking lot aisles, public & private driveways. |
| `'ferry'` | Those that serves automobiles and no or unspecified automobile service. |
| `'path'` | Foot paths, cycle paths, ski trails. |
| `'major_rail'` | Railways, including mainline, commuter rail, and rapid transit. |
| `'minor_rail'` | Yard and service railways. |
| `'aerialway'` | Ski lifts, gondolas, and other types of aerialway. |
| `'golf'` | The approximate centerline of a golf course hole |

#### One-way roads

The __`oneway`__ field will have a value of either `'true'` or `'false'` to indicate whether the motor traffic on the road is one-way or not. If the road is one-way, traffic travels in the same direction as the linestring.


#### Types

The __`type`__ field is the value of the road's "primary" OpenStreetMap tag. For most roads this is the `highway` tag, but for aerialways it will be the `aerialway` tag, and for golf holes it will be the `golf` tag. See [Taginfo](http://taginfo.openstreetmap.org/keys/highway#values) for a list of used tag values. Several classes pull in additional detail when it is available from OpenStreetMap.

Possible `construction` class `type` values:

```
'construction:motorway'
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
```

Possible `track` class `type` values:

```
'track:grade1'
'track:grade2'
'track:grade3'
'track:grade4'
'track:grade5'
'track'
```

Possible `service` class `type` values:

```
'service:alley'
'service:emergency_access'
'service:drive_through'
'service:driveway'
'service:parking'
'service:parking_aisle'
'service'
```

For the `path` class, some custom type assignments have been made based on insight from various categorical, physical, and access tags from OpenStreetMap.

| Value | Description |
|---|---|
| `'steps'` | aka stairs |
| `'corridor'` | An indoors passageway |
| `'sidewalk'` | aka 'pavement' in many places outside North America |
| `'crossing'` | Usually connects sidewalk lines across a road |
| `'piste'` | Ski & snowboard trails, both downhill and cross-country. |
| `'mountain_bike'` | Trails used primarily or exclusively for mountain biking |
| `'hiking'` | Hiking trails or otherwise rough pedestrian paths |
| `'trail'` | May be suitable for either hiking or mountain biking |
| `'cycleway'` | Paths primarily or exclusively for cyclists |
| `'footway'` | Paths primarily or exclusively for pedestrians |
| `'path'` | Unspecified or mixed-use paths |
| `'bridleway'` | Equestrian trails |

Possible `ferry` class `type` values:

| Value | Description |
|---|---|
| `'ferry_auto'` | Ferry serves automobiles |
| `'ferry'` | No or unspecified automobile service |


Possible `aerialway` class `type` values:

| Value | Description |
|---|---|
| `'aerialway:cablecar'` | Just one or two large cars. The cable forms a loop, but the cars do not loop around, they just move up and down on their own side. |
| `'aerialway:gondola'` | Many cars on a looped cable. |
| `'aerialway:mixed_lift'` | Mix of chair lifts and gondolas on the same line; may change seasonally. |
| `'aerialway:chair_lift'` | Looped cable with a series of single chairs and exposed to the open air. |
| `'aerialway:drag_lift'` | Includes t-bars, j-bars, platter/button lifts, and tow ropes |
| `'aerialway:magic_carpet'` | Conveyor belt installed at the level of the snow, some include a canopy or tunnel. |
| `'aerialway'` | Other or unspecified type of aerialway |

#### Layers

The __`layer`__ field is used to determine drawing order of overlapping road segments in the tunnel and bridge layers. 95% of values are -1, 1, or 0, and 99.9999% of values are between -5 and 5.


<!-- ADMIN ------------------------------------------------------------------>

{{ <LayerInfo name="admin" type={["line"]} buffer={4} /> }}

Administrative boundary lines. These are constructed from the OSM data in such a way that there are no overlapping lines where multiple boundary areas meet.

#### Administrative level

The __`admin_level`__ field separates different levels of boundaries, using a similar numbering scheme to OpenStreetMap.

| Value | Description |
|---|---|
| `2` | Countries |
| `3` | Some subnational regions or groupings: regions of Papua New Guinea, The Philippines, Venezuela; governorates of Lebanon; federal districts of Russia; some disputed and semi-autonomous regions. |
| `4` | Most first-level subnational boundaries (states, provinces, etc.) |

#### Disputes

The __`disputed`__ field should be used to apply a dashed or otherwise distinct style to disputed boundaries. No single map of the world will ever keep everybody happy, but acknowledging disputes where they exist is an important aspect of good cartography.

#### Maritime boundaries

The __`maritime`__ field can be used as a filter to downplay or hide maritime boundaries, which are often not shown on maps. Note that the practice of tagging maritime boundaries is not entirely consitent or complete within OSM, so some boundaries may not have this field set correctly (this mostly affects admin levels 3 & 4).

#### ISO 3166-1 Codes

The __`iso_3166_1`__ field contains the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166) code or codes that apply to a boundary. For subnational boundaries this will be a single code of the parent country. For international boundaries between two countries, the value will be the codes of both countries in alphabetical order, separated by a dash (`-`).


<!-- COUNTRY_LABEL ---------------------------------------------------------->

{{ <LayerInfo name="country_label" type={["point"]} buffer={256} /> }}

This layer contains points used for labeling countries. The points are placed for minimal overlap with small to medium-sized text.

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### ISO 3166-1 Code

The __`iso_code`__ field contains the [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166) 2-letter country code.

#### Administrative Code

For territories and other special entities in the countries layer, the __`admin_code`__ field contains the ISO 3166-1 2-letter country code of the administering or "parent" state.

#### Scalerank

The __`scalerank`__ field is intended to help assign different label styles based on the size and available room to label different countries. The possible values are 1 through 6.


<!-- MARINE_LABEL -------------------------------------------------------->

{{ <LayerInfo name="marine_label" type={["line"]} buffer={256} /> }}

Points and lines for labeling major marine features such as oceans, seas, large lakes & bays.

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Labelrank & placement

The __`labelrank`__ field is intended to help assign different label styles based on the size and available room to label different water bodies. The possible values are whole numbers 1 through 6.

The value of the __`placement`__ field will be either `point` or `line` depending on the geometry type of the object. (You can also make this distinction with a Geometry Type filter.)


<!-- STATE_LABEL ----------------------------------------------------------->

{{ <LayerInfo name="state_label" type={["point"]} buffer={256} /> }}

Points for labeling states and provinces. Currently only a small number of countries are included.

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Abbreviations

The __`abbr`__ field contains abbreviated versions of the names suitable for labeling at lower zoom levels.

#### Area

The __`area`__ field is the physical area of the entity in square kilometers. Use it to help filter and size your state labels at different zoom levels.


<!-- PLACE_LABEL ------------------------------------------------------------>

{{ <LayerInfo name="place_label" type={["point"]} buffer={128} /> }}

This layer contains points for labeling human settlements.

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Types

The main field for styling labels for different kinds of places is __`type`__.

| Value | Description |
|---|---|
| `'city'` | Settlement of about 100,000 or more people. |
| `'town'` | Urban or rural settlement of about 10,000-100,000 people |
| `'village'` | Usually rural settlement of less than about 10,000 |
| `'hamlet'` | Rural settlement with a population of about 200 or fewer |
| `'suburb'` | A distinct section of an urban settlement such as an annexed town, historical district, or large & important neighborhood. |
| `'neighbourhood'` | A named part of a larger settlement |
| `'island'` |  |
| `'islet'` | A very small island. |
| `'archipelago'` | Collective name for a group of islands |
| `'residential'` | Named residential areas, including subdivisions and apartment complexes |
| `'aboriginal_lands'` | Reservations and other aboriginal lands |

#### Capitals

The __`capital`__ field allows distinct styling of labels or icons for the capitals of countries, regions, or states & provinces. The value of this field may be `2`, `3`, `4`, `5`, or `6`. National capitals are `2`, and `3` through `6` represent capitals of various sub-national administrative entities. These levels come from OpenStreetMap and have different meanings in different countries - see [the OpenStreetMap wiki](http://wiki.openstreetmap.org/wiki/Tag:boundary%3Dadministrative#admin_level) for specific details.

#### Scalerank

The __`scalerank`__ field can be used to adjust the prominence of label styles for larger and more prominent cities. The value number from 0 through 9, where 0 is the large end of the scale (eg New York City). All places other than large cities will have a scalerank of `null`.

#### Localrank

The __`localrank`__ field can be used to adjust the label density by showing fewer labels. It is a whole number greater than 0 calculated by grouping places into a 128 pixel grid at each zoom level, then assigning each place a ranking within that grid. The most important place in that 128 pixels will get a __`localrank`__ of 1, the second most important is 2, and so on. Therefore to reduce the label density to 4 labels per tile, you can add the filter `[localrank=1]`.

#### Label direction

The __`ldir`__ field can be used as a hint for label offset directions at lower zoom levels. For places with a __`scalerank`__ value set, the __`ldir`__ will be a cardinal direction such as `'N'`, `'E'`, `'SW'`.


<!-- WATER_LABEL ------------------------------------------------------------>

{{ <LayerInfo name="water_label" type={["point"]} buffer={64} /> }}

This layer contains points for labeling bodies of water such as lakes and ponds.

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Area

The __`area`__ field holds the area of the associated water polygon in square meters (Mercator-projected units rounded to the nearest whole number, not real-world area). You can use it to adjust label size and visibility.


<!-- POI_LABEL -------------------------------------------------------------->

{{ <LayerInfo name="poi_label" type={["point"]} buffer={64} /> }}

This layer is used to place icons and labels for various points of interest (POIs).

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Maki icons

The __`maki`__ field is designed to make it easy to add icons to POIs using the [Maki icon project](http://mapbox.com/maki), or with other icons that follow the same naming scheme.


Not all Maki icons are used, and different types of related POIs will sometimes have the same __`maki`__ value (eg universities and colleges, or art supply shops and art galleries). Nameless POIs will have never have a maki value of marker (the generic default). The possible values for the __`maki`__ field are listed below.

```
null
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
```

#### Type

The __`type`__ field contains a more specific classification intended for display - eg 'Cafe', 'Hotel', 'Laundry'. These values come from the original OpenStreetMap tags and are not a limited set.

#### Scalerank

The __`scalerank`__ field is intended to help assign different label styles based on the prominence of different features.

| Value | Description |
|---|---|
| `1` | The POI has a very large area |
| `2` | The POI has a medium-large area |
| `3` | The POI has a small area, or is of a type that is commonly large and important (eg hospital, university) |
| `4` | The POI has no known area |
| `5` | The POI has no name |

#### Controlling label density

The __`localrank`__ field can be used to adjust the label density by showing fewer labels. It is a whole number >=1 calculated by grouping places into a ~300m projected grid, then assigning each place a ranking within that grid. The most important place in each cell will get a __`localrank`__ of 1, the second most important is 2, and so on.


<!-- ROAD_LABEL ----------------------------------------------------------->

{{ <LayerInfo name="road_label" type={["point", "line"]} buffer={8} /> }}

#### Names

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Route numbers

In addition to the standard name fields, there is also a __`ref`__ field that holds any reference codes or route numbers a road may have. From zoom levels 6 through 10, all geometries are points and the only labels are highways shields. From zoom level 11 and up the geometries are all lines.

The __`shield`__ field indicates the style of shield needed for the route. Current possibilities are:

| Value | Description |
|---|---|
| `default` |  |
| `at-motorway` | Austria (Autobahnen) |
| `at-expressway` | Austria (Schnellstraßen) |
| `at-state-b` | Austria (Landesstraßen B) |
| `br-federal` | Brazil |
| `br-state` | Brazil |
| `bg-motorway` | Bulgaria |
| `bg-national` | Bulgaria |
| `hr-motorway` | Croatia |
| `hr-state` | Croatia |
| `hr-county` | Croatia |
| `cz-motorway` | Czech Republic |
| `cz-expressway` | Czech Republic |
| `cz-road` | Czech Republic |
| `dk-primary` | Denmark |
| `dk-secondary` | Denmark |
| `fi-main` | Finland |
| `fi-trunk` | Finland |
| `fi-regional` | Finland |
| `de-motorway` | Germany (Autobahnen) |
| `de-federal` | Germany (Bundesstraßen) |
| `gr-motorway` | Greece |
| `gr-national` | Greece |
| `hu-motorway` | Hungary |
| `hu-main` | Hungary |
| `in-national` | India |
| `in-state` | India |
| `nz-state` | New Zealand |
| `pe-national` | Peru |
| `pe-regional` | Peru |
| `pl-motorway` | Poland |
| `pl-expressway` | Poland |
| `pl-national` | Poland |
| `pl-voivodeship` | Poland |
| `ro-motorway` | Romania |
| `ro-national` | Romania |
| `ro-county` | Romania |
| `ro-communal` | Romania |
| `rs-motorway` | Serbia |
| `rs-state-1b` | Serbia |
| `rs-state-2a` | Serbia |
| `rs-state-2b` | Serbia |
| `sk-highway` | Slovakia |
| `sk-road` | Slovakia |
| `si-motorway` | Slovenia |
| `si-expressway` | Slovenia |
| `si-main` | Slovenia |
| `za-national` | South Africa |
| `za-provincial` | South Africa |
| `za-regional` | South Africa |
| `za-metropolitan` | South Africa |
| `se-main` | Sweden |
| `ch-motorway` | Switzerland |
| `ch-main` | Switzerland |
| `mx-federal` | United States |
| `mx-state` | United States |
| `us-interstate` | United States |
| `us-interstate-duplex` | United States |
| `us-interstate-business` | United States |
| `us-interstate-truck` | United States |
| `us-highway` | United States |
| `us-highway-duplex` | United States |
| `us-highway-alternate` | United States |
| `us-highway-business` | United States |
| `us-highway-bypass` | United States |
| `us-highway-truck` | United States |
| `us-state` | United States |
| `e-road` | European E-roads |

To aid with shield styling the __`reflen`__ field conveys the number of characters present in the __`ref`__ field. Values can be 1-4. If the ref is 'M27', then the reflen is 3.

#### Classes

The __`class`__ field for road labels matches the [#road](#road) layers.

| Value | Description |
|---|---|
| `'motorway'` | High-speed, grade-separated highways |
| `'motorway_link'` | Interchanges / on & off ramps |
| `'trunk'` | Important roads that are not motorways. |
| `'primary'` | A major highway linking large towns. |
| `'secondary'` | A highway linking large towns. |
| `'tertiary'` | A road linking small settlements, or the local centres of a large town or city. |
| `'link'` | Contains link roads |
| `'street'` | Standard unclassified, residential, road, and living_street road types |
| `'street_limited'` | Streets that may have limited or no access for motor vehicles. |
| `'pedestrian'` | Includes pedestrian streets, plazas, and public transportation platforms. |
| `'construction'` | Includes motor roads under construction (but not service roads, paths, etc). |
| `'track'` | Roads mostly for agricultural and forestry use etc. |
| `'service'` | Access roads, alleys, agricultural tracks, and other services roads. Also includes parking lot aisles, public & private driveways. |
| `'ferry'` | Those that serves automobiles and no or unspecified automobile service. |
| `'path'` | Foot paths, cycle paths, ski trails. |
| `'major_rail'` | Railways, including mainline, commuter rail, and rapid transit. |
| `'minor_rail'` | Yard and service railways. |
| `'aerialway'` | Ski lifts, gondolas, and other types of aerialway. |
| `'golf'` | The approximate centerline of a golf course hole |

#### Additional information

The __`len`__ field stores the length of the road segment in projected meters, rounded to the nearest whole number. This can be useful for limiting some label styles to longer roads.


<!-- MOTORWAY_JUNCTION_LABEL ----------------------------------------------->

{{ <LayerInfo name="motorway_junction" type={["point"]} buffer={8} /> }}

This layer contains point geometries for labeling motorway junctions (aka highway exits). Classes and types match the types in the road layer.

#### Label text

The motorway junction layer has a __`ref`__ field and a __`name`__ field for styling labels. The __`reflen`__ field tells you how long the __`ref`__ value is in case you want to style this layer with shields.

#### Classes & types

The __`class`__ and __`type`__ fields tell you what kind of road the junction is on. See the [#road](#road) layer for possible values.


<!-- WATERWAY_LABEL ------------------------------------------------------->

{{ <LayerInfo name="waterway_label" type={["line"]} buffer={8} /> }}

This layer contains line geometries that match those in the [#waterway](#waterway) layer but with name fields for label rendering.

#### Label text

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Classes & types

The __`class`__ and __`type`__ fields match those in the [#waterway](#waterway) layer.

| Value | Description |
|---|---|
| `'river'` | Everything from the Amazon down to small creeks a couple meters wide |
| `'canal'` | Medium to large artificial waterway |
| `'stream'` | Very small waterway, usually no wider than a meter or two |
| `'stream_intermittent'` | **Class only**. A stream that does not always have water flowing through it. |
| `'drain'` | Medium to small artificial channel for rainwater drainage, often concrete lined. |
| `'ditch'` | Small artificial channel dug in the ground for rainwater drainage. |


<!-- AIRPORT_LABEL ------------------------------------------------------->

{{ <LayerInfo name="airport_label" type={["line"]} buffer={64} /> }}

This layer contains point geometries that are one of: airport, airfield, heliport, and rocket.

#### Label text

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Airport Codes

The __`ref`__ field contains short identifier codes for many airports. These are pulled from the OpenStreetMap tags `iata`, `ref`, `icao`, or `faa` (in order of preference).

#### Maki

The __`maki`__ field lets you assign different icons to different types of airports.

| Value | Description |
|---|---|
| `'airport'` | Most commercial airports |
| `'airfield'` | Smaller airports & private airfields |
| `'heliport'` | For helicopters |
| `'rocket'` | Spaceflight facilities |

#### Scalerank

The __`scalerank`__ field is a number representing the size / importance of the airport. Possible values are `1` (very large airport) through `4` (very small airport).

<!-- RAIL_STATION_LABEL ------------------------------------------------->

{{ <LayerInfo name="rail_station_label" type={["point"]} buffer={64} /> }}

This layer contains point geometries with name fields for label rendering.

#### Label text

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Maki

The __`maki`__ field lets you assign icons to the rail station based on a few basic station types:

| Value | Description |
|---|---|
| `'rail'` | Default rail station |
| `'rail-metro'` | Station for a subway, metro, or other rapid-transit system |
| `'rail-light'` | Light rail station |
| `'entrance'` | Specific station entrance points (eg stairs, escalators, elevators) |

#### Network

The __`network`__ field lets you assign more specific icons for rail stations that are part of specific local or regional transit systems. They don't necessarily correspond to a specific network - eg `de-u-bahn` applies to any U-Bahn network in Germany since these can all use the same icon in a map style. Some stations serve multiple networks; in these cases, multiple network names are joined with a dot (in alphabetical order).

If none of the specific networks below apply to a station, the __`network`__ value will be the same as the __`maki`__ value (see previous section).

|Value | Description | 
|---|---|
| `'barcelona-metro'` | Barcelona, Spain |
| `'boston-t'` | Boston, Massachusetts |
| `'chongqing-rail-transit'` | Chongqing, China |
| `'de-s-bahn'` | Germany |
| `'de-s-bahn.de-u-bahn'` | Germany |
| `'de-u-bahn'` | Germany |
| `'delhi-metro'` | Delhi, India |
| `'gb-national-rail'` | London, United Kingdom |
| `'gb-national-rail.london-dlr'` | London, United Kingdom |
| `'gb-national-rail.london-dlr.london-overground.london-tfl-rail.london-underground'` | London, United Kingdom |
| `'gb-national-rail.london-dlr.london-overground.london-underground'` | London, United Kingdom |
| `'gb-national-rail.london-dlr.london-underground'` | London, United Kingdom |
| `'gb-national-rail.london-overground'` | London, United Kingdom |
| `'gb-national-rail.london-overground.london-tfl-rail.london-underground'` | London, United Kingdom |
| `'gb-national-rail.london-overground.london-underground'` | London, United Kingdom |
| `'gb-national-rail.london-tfl-rail'` | London, United Kingdom |
| `'gb-national-rail.london-tfl-rail.london-overground'` | London, United Kingdom |
| `'gb-national-rail.london-tfl-rail.london-underground'` | London, United Kingdom |
| `'gb-national-rail.london-underground'` | London, United Kingdom |
| `'hong-kong-mtr'` | Hong Kong |
| `'kiev-metro'` | Kiev, Ukraine |
| `'london-dlr'` | Docklands Light Rail, London, United Kingdom |
| `'london-dlr.london-tfl-rail'` | London, United Kingdom |
| `'london-dlr.london-tfl-rail.london-underground'` | London, United Kingdom |
| `'london-dlr.london-underground'` | London, United Kingdom |
| `'london-overground'` | London Overground, United Kingdom |
| `'london-overground.london-tfl-rail'` | London Overground, United Kingdom |
| `'london-overground.london-tfl-rail.london-underground'` | London Overground, United Kingdom |
| `'london-overground.london-underground'` | London, United Kingdom |
| `'london-tfl-rail'` | London, United Kingdom |
| `'london-tfl-rail.london-underground'` | London, United Kingdom |
| `'london-underground'` | London Underground, United Kingdom |
| `'madrid-metro'` | Madrid, Spain |
| `'mexico-city-metro'` | Mexico City, Mexico |
| `'milan-metro'` | Milan, Italy |
| `'moscow-metro'` | Moscow Metro, Russia |
| `'new-york-subway'` | New York City, New York |
| `'osaka-subway'` | Osaka, Japan |
| `'oslo-metro'` | Oslo, Norway |
| `'paris-metro'` | Paris Metro, France |
| `'paris-rer'` | Paris regional commuter rail, France |
| `'paris-metro.paris-rer'` | Paris, France |
| `'paris-rer.paris-transilien'` | Paris, France |
| `'paris-transilien'` | Paris suburban rail, France |
| `'philadelphia-septa'` | Philadelphia, Pennsylvania |
| `'san-francisco-bart'` | San Francisco, California |
| `'singapore-mrt'` | Singapore |
| `'stockholm-metro'` | stockholm, Sweden |
| `'taipei-metro'` | Taipei, Taiwan |
| `'tokyo-metro'` | Tokyo, Japan |
| `'vienna-u-bahn'` | Vienna, Austria |
| `'washington-metro'` | Washington DC Metro |


<!-- MOUTAIN_PEAK_LABEL ----------------------------------------------------->

{{ <LayerInfo name="mountain_peak_label" type={["point"]} buffer={64} /> }}

This layer contains point geometries that are contains mountain peaks. Include fields `elevation_m` & `elevation_ft` which contain the peak elevations in meters and feet, respectively. Values are rounded to the nearest integer.

#### Label text

See _Name fields_ in the [overview](#overview) for information about names and translations.

#### Maki

The __`maki`__ field lets you distinguish volcanoes from other types of peaks.

| Value | Description | 
|---|---|
| `'volcano'` | Volcanoes |
| `'mountain'` | All other types of peaks (necessarily just mountains) |

#### Elevations

The __`elevation_m`__ and __`elevation_ft`__ fields hold the peak elevation in meters and feet, respectively. Values are rounded to the nearest whole number and do not include units. Use a text field such as `{elevation_ft} feet` or `{elevation_m}m` in Mapbox Studio to display the units.


<!-- HOUSENUM_LABEL --------------------------------------------------------->

{{ <LayerInfo name="housenum_label" type={["point"]} buffer={64} /> }}

This layer contains points used to label the street number parts of specific addresses.

The __`house_num`__ field countains house and building numbers. These are commonly integers but may include letters or be only letters, eg "1600", "31B", "D". If an address has no number tag but has a house name or building name, the __`house_num`__ field will be the name instead.
