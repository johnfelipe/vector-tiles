---
title: Mapbox Streets v8
description: Reference documentation for the Mapbox Streets v8 tileset.
mapid: mapbox.mapbox-streets-v8
prependJs: 
  - "import Icon from '@mapbox/mr-ui/icon';"
  - "import { LayerInfo } from '../../components/layer-info';"
---

This is an in-depth guide to the data inside the Mapbox Streets vector tile source to help with styling. For full examples of using Mapbox Streets vector tiles to create a map style, check out the default styles in [Mapbox Studio](https://studio.mapbox.com/).

## Overview

### Data sources & updates

Mapbox Streets vector tiles are largely based on data from [OpenStreetMap](http://openstreetmap.org), a free & global source of geographic data built by volunteers. An understanding of the OSM data structure and tagging system is not necessary to make use of Mapbox Streets vector tiles, though it's helpful to understand some of the details.

When you publicly use styles or software that use Mapbox Streets vector tiles, you must [display proper attribution](https://docs.mapbox.com/help/how-mapbox-works/attribution/).

The current supported version of the Mapbox Streets vector tiles receives regular data updates as new information becomes available and existing information is improved.

| Layer                  |  Source                              |
|------------------------|--------------------------------------|
| most layers            | OpenStreetMap replication feed       |
| `admin`                | custom Mapbox data                   |
| `water` (ocean parts)  | [OpenStreetMapData.com](http://openstreetmapdata.com/) | 
| `place_label`, types `country` & `state` | custom Mapbox data | 
| `natural_label`, types `ocean` & `sea`   | custom Mapbox data |


### Multiple geometry types

Mapnik vector tiles support multiple geometry types in the same layer. The Mapbox Streets source takes advantage of this for some layers.

A geometry in the vector tile can be one of 3 types:

1. {{ <Icon name="marker" inline={true} /> }} Point
2. {{ <Icon name="polyline" inline={true} /> }} Linestring / multilinestring
3. {{ <Icon name="polygon" inline={true} /> }} Polygon / multipolygon

In Mapbox Studio, you can select just one or two or all of the 3 types with the Geometry Type toggles in each layer's data selection tab.


### OSM IDs

OSM IDs are not stored as object properties but as object IDs within the vector tile. This means they are not available for styling via Mapbox Studio, but can still be interacted with via Mapbox GL JS and other vector tile libraries.

OpenStreetMap ID spaces are not unique across node, way, and relation object types. In order to make them unique for vector tiles, the IDs are transformed based on their OpenStreetMap object type.

| OSM type        | OSM ID transform                          |
|-----------------|-------------------------------------------|
| node            | `id × 10` <br /> _eg. 123 → 1230_         | 
| way             | `(id × 10) + 1` <br /> _eg. 123 → 1231_   |
| relation        | `(id × 10) + 4` <br /> _eg. 123 → 1234_   |

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

| Field | Description |
|---|---|
| `name` | The name (or names) used locally for the place. |
| `name_ar` | Arabic |
| `name_en` | English |
| `name_es` | Spanish |
| `name_fr` | French |
| `name_de` | German |
| `name_pt` | Portuguese |
| `name_ru` | Russian |
| `name_zh-Hans` | Simplified Chinese |
| `name_zh-Hant` | Traditional Chinese (if available, but may contain some Simplified Chinese) |
| `name_ja` | Japanese |
| `name_ko` | Korean |

For languages that may have regional variations, no particular preference is given where place name spellings differ. 

<a id='name_script'></a>

#### `name_script` _text_

Wherever there is a `name` field, there is also a `name_script` field that describes the primary script used in that text. This can be helpful for customizing fonts or language fallback conditions. Values include:

```
Arabic
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
```

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

Some layers have a `maki` field designed to make it easy to assign icons using the [Maki icon project](https://labs.mapbox.com/maki-icons/), or with other icons that follow the same naming scheme. Each layer uses a different subset of the names, but the full list of values used in Mapbox Streets is compiled here so you can ensure your style has all the icons needed across different layers.

Not all icons from the Maki project are used in Mapbox Streets, and different types of related features will sometimes have the same `maki` value (eg universities and colleges, or art supply shops and art galleries). Nameless POIs will have never have a maki value of marker (the generic default).

The possible values for the `maki` field for all layers are listed below. Icon names that were not part of any layer in v7 are marked with 🆕. No further values will be added in Mapbox Streets v8.

`airport_label:` 

```
airport
airfield
heliport
rocket
```

`natural_label:` 

```
marker
mountain
volcano
waterfall 🆕
```

`poi_label:` 

```
alcohol-shop
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
```

`transit_stop_label:` 

```
bicycle-share
bus
ferry
rail
rail-metro
rail-light
entrance
```


## Layer Reference

<!-- ADMIN --------------------------------------------------------------->

{{ <LayerInfo name="admin" type={["line"]} buffer={4} /> }}

This layer contains boundary lines for national and subnational administrative units. The data source & shapes match polygons from the [Mapbox Enterprise Boundaries product](/vector-tiles/reference/enterprise-boundaries-v2/).

#### <!--admin--> `admin_level` _number_

The `admin_level` field separates different levels of boundaries.

| Value | Description |
|---|---|
| `0` | Countries |
| `1` | First-level administrative divisions |
| `2` | Second-level administrative divisions |

#### <!--admin--> `worldview` _text_

Mapbox Streets v8 introduces the notion of worldviews to the administrative boundary layer. The vector tiles contain multiple versions of some boundaries, each with a `worldview` value indicating the intended audience. It is important to apply a worldview filter to all of your `admin` style layers, otherwise your map will show conflicting & overlapping boundary lines. The filter should always include both `all` and one of the region-specific values.

| Value   | Description                                      |
|---------|--------------------------------------------------|
| `all`   | Appropriate for all worldviews (most boundaries) |
| `CN`    | Boundaries for a mainland Chinese audience/worldview, but not officially approved for use in the PRC. |
| `IN`    | Boundaries conforming to cartographic requirements for use in India |
| `US`    | Boundaries for an American audience, & which are generally appropriate outside of China & India. Lines do not necessarily reflect official US foreign policy. |

#### <!--admin--> `disputed` _text_

Boundary lines with a `disputed` value of `true` should have a dashed or otherwise distinct style applied in styles. No single map of the world will ever keep everybody happy, but acknowledging disputes where they exist is an important aspect of good cartography. The value will always be either `true` or `false` (never _null_).

#### <!--admin--> `maritime` _text_

Mapbox Streets v8 includes a minimal set of maritime boundaries. These have a `maritime` value of `true` to use for distinct styling or filtering. The value will always be either `true` or `false` (never _null_).

#### <!--admin--> `iso_3166_1` _text_

The `iso_3166_1` field contains the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166) code or codes that apply to a boundary. For subnational boundaries this will be a single code of the parent country. For international boundaries between two countries, the value will be the codes of both countries in alphabetical order, separated by a dash (`-`).


<!-- AEROWAY --------------------------------------------------------------- -->

{{ <LayerInfo name="aeroway" type={["line"]} buffer={4} /> }}

The aeroway layer includes both lines and polygons representing runways, helipads, etc.

#### <!--aeroway--> `type` _text_

The `type` field separates different types of aeroways for styling.

| Value      | Description                                           |
|------------|-------------------------------------------------------|
| `runway`   | Where planes take off & land                          |
| `taxiway`  | Where planes move between runways, gates, and hangars |
| `apron`    | Where planes park, refuel, load                       |
| `helipad`  | Where helicopters take off & land                     |

#### <!--aeroway--> `ref` _text_

The `ref` field contains runway and taxiway identifiers. The value may be _null_.


<!-- AIRPORT_LABEL ------------------------------------------------------->

{{ <LayerInfo name="airport_label" type={["line"]} buffer={64} /> }}

This layer contains point geometries that are one of: airport, airfield, heliport, and rocket.

See [`names`](#names) and [`name_script`](#name_script) in for information about names and translations available for label text.

See [`sizerank`](#sizerank) for information about that field.

#### <!--airport_label--> `ref` _text_

The `ref` field contains short identifier codes for many airports. These are pulled from the OpenStreetMap tags `iata`, `ref`, `icao`, or `faa` (in order of preference). The value may be _null_.

#### <!--airport_label--> `maki` _text_

The `maki` field lets you assign different icons to different types of airports. See the [`maki](#maki) part of the Common Fields section for more details.

| Value      | Description                           |
|------------|---------------------------------------|
| `airport`  | Most commercial airports              |
| `airfield` | Smaller airports & private airfields  |
| `heliport` | For helicopters                       |
| `rocket`   | Spaceflight facilities                |


<!-- BUILDING ------------------------------------------------------------->

{{ <LayerInfo name="building" type={["polygon"]} buffer={2} /> }}

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


<!-- HOUSENUM_LABEL ---------------------------------------------------->

{{ <LayerInfo name="housenum_label" type={["point"]} buffer={64} /> }}

This layer contains points used to label the street number parts of specific addresses.

#### <!--housenum_label--> `house_num` _text_

The `house_num` field countains house and building numbers. These are commonly integers but may include letters or be only letters, eg "1600", "31B", "D". If an address has no number tag but has a house name or building name, the `house_num` field will be the name instead.


<!-- LANDUSE_OVERLAY ---------------------------------------------------->

{{ <LayerInfo name="landuse_overlay" type={["polygon"]} buffer={8} /> }}

This layer is for landuse / landcover polygons that should be drawn above the [#water](#water) layer.

#### <!--landuse_overlay--> `class` _text_

The main field used for styling the landuse_overlay layer is `class`.

| Value             | Description                                         |
|-------------------|-----------------------------------------------------|
| `national_park`   | Relatively large area of land set aside by a government for human recreation and environmental protection |
| `wetland`         | Wetlands that may include vegetation (marsh, swamp, bog) |
| `wetland_noveg`   | Wetlands that probably dont contain vegetation (mud, tidal flat) |


<!-- LANDUSE ------------------------------------------------------------->

{{ <LayerInfo name="landuse" type={["polygon"]} buffer={4} /> }}

This layer includes polygons representing both land-use and land-cover.

It's common for many different types of landuse/landcover to be overlapping, so the polygons in this layer are ordered by the area of their geometries to ensure smaller objects will not be obscured by larger ones. Pay attention to use of transparency when styling - the overlapping shapes can cause muddied or unexpected colors.

#### <!--landuse--> `class` _text_

The main field used for styling the landuse layer is `class`.

| Value               | Description                                 |
|---------------------|---------------------------------------------|
| `aboriginal_lands`  | The boundary of aboriginal lands.           |
| `agriculture`       | Various types of crop and farmland          |
| `airport`           | Airport grounds                             |
| `cemetery`          | Cemeteries and graveyards                   |
| `glacier`           | Glaciers or permanent ice/snow              |
| `grass`             | Grasslands, meadows, fields, lawns, etc     |
| `hospital`          | Hospital grounds                            |
| `park`              | City parks, village greens, playgrounds, national parks, nature reserves, etc |
| `piste`             | Area used for skiing, snowboading, and other snow/mountain sports |
| `pitch`             | Sports fields & courts of all types         |
| `rock`              | Bare rock, scree, quarries                  |
| `sand`              | Sand, beaches, dunes                        |
| `school`            | Primary, secondary, post-secondary school grounds |
| `scrub`             | Bushes, scrub, heaths                       |
| `wood`              | Woods and forestry areas                    |


<!-- MOTORWAY_JUNCTION --------------------------------------------------->

{{ <LayerInfo name="motorway_junction" type={["point"]} buffer={8} /> }}

This layer contains point geometries for labeling motorway junctions (aka highway exits). Classes and types match the types in the road layer.

#### <!--motorway_junction--> `ref` _text_, `reflen` _number_, & `name` _text_

The motorway junction layer has a `ref` field and a `name` field for styling labels. The `reflen` field tells you how long the `ref` value is in case you want to style this layer with shields. All of these fields may be _null_.

#### <!--motorway_junction--> `class` _text_ & `type` _text_

The `class` and `type` fields tell you what kind of road the junction is on. See the [#road](#road) layer for possible values.


<!-- NATURAL_LABEL ------------------------------------------------------->

{{ <LayerInfo name="natural_label" type={["point", "line"]} buffer={64} /> }}

The `natural_label` layer contains points and lines for styling natural features such as bodies of water, mountain peaks, valleys, deserts, and so on.

See [`names`](#names) and [`name_script`](#name_script) in for information about names and translations available for label text.

See [`sizerank`](#sizerank) for information about that field.

#### <!--natural_label--> `class` _text_ & `maki` _text_

The `natural_label` layer is organized into a number of different classes for styling & filtering. Within each class, serveral `maki` values are available for assigning icons to features - see the [`maki`](#maki) part of the Common Fields section for more details about that field.

| class           | maki values | feature types                           |
|-----------------|-------------|-----------------------------------------|
| `bay`           | `marker`    | inlet in a large body of water          |
| `canal`         | `marker`    |                                         |
| `dock`          | `marker`    | enclosed area of water for ships        |
| `glacier`       | `marker`    | glacier                                 |
| `landform`      | `mountain` , `volcano` , `marker` | peaks, meadows, cave entrances, archipelago, island, islet, saddle, fell, desert, valley, etc. |
| `ocean`         | `marker`    | oceans                                  |
| `reservoir`     | `marker`    | human water containment areas           |
| `river`         | `marker`    |                                         |
| `sea`           | `marker`    | seas and other very large water features including some gulfs, straits, bays, etc. |
| `stream`        | `marker`    |                                         |
| `water_feature` | `waterfall` , `marker` | waterfalls                   |
| `water`         | `marker`    | lakes, ponds, etc.                      |
| `wetland`       | `marker`    | wetland, marsh                          |

#### <!--natural_label--> `elevation_m` _number_ & `elevation_ft` _number_

The `elevation_m` and `elevation_ft` fields hold the feature elevation in meters and feet, respectively. Values are rounded to the nearest whole number and do not include units. Use a text field such as `{elevation_ft} feet` or `{elevation_m}m` in Mapbox Studio to display the units. These fields may be _null_.


<!-- PLACE_LABEL ------------------------------------------------------->

{{ <LayerInfo name="place_label" type={["point"]} buffer={128} /> }}

This layer contains points for labeling places including countries, states, cities, towns, and neighbourhoods.

See [`names`](#names) and [`name_script`](#name_script) in for information about names and translations available for label text.

See [`filterrank`](#filterrank) for information on using that field.


#### <!--place_label--> `type`

The main field for styling labels for different kinds of places is `type`.

| Value                | Description |
|----------------------|---|
| `country`            | Sovereign or partially-recognized states |
| `sar`                | Special Administrative Region |
| `territory`          | Semi-autonomous or other subnational entities with ISO 3166-1 codes |
| `disputed_territory` | Disputed territories with ISO 3166-1 codes. |
| `state`              | First-level administrative divisions or similar. Only a small subset of these are included in order to reduce clutter and put focus on cities, towns, etc. |
| `city`               | Settlement of about 100,000 or more people. |
| `town`               | Urban or rural settlement of about 10,000-100,000 people | 
| `village`            | Usually rural settlement of less than about 10,000 |
| `hamlet`             | Rural settlement with a population of about 200 or fewer |
| `suburb`             | A distinct section of an urban settlement such as an annexed town, historical district, or large & important neighborhood. |
| `quarter`            | A large neighborhood or section of a larger city or town |
| `neighbourhood`      | A smaller neighborhood or part of a larger settlement |

#### <!--place_label--> `symbolrank`

The `symbolrank` value is intended to simplify styling of the label size and symbol prominence of place features. It ranges from 1 to 19 and is consistently assigned across zoom levels - ie a place with a `symbolrank` of 6 at z4 will have the same value as you zoom in to any other level.

The value will never be _null_ and will always be in the range of 1-19.

#### <!--place_label--> `iso_3166_1` _text_

The `iso_3166_1` field contains the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166) code of the country the place is in. The value may be _null_ - either due to location match errors or for features that are in international waters.

#### <!--place_label--> `capital` _number_

The `capital` field allows distinct styling of labels or icons for the capitals of countries, regions, or states & provinces. The value of this field may be `2`, `3`, `4`, `5`, or `6`. National capitals are `2`, and `3` through `6` represent capitals of various sub-national administrative entities. These levels come from OpenStreetMap and have different meanings in different countries - see [the OpenStreetMap wiki](http://wiki.openstreetmap.org/wiki/Tag:boundary%3Dadministrative#admin_level) for specific details.

The value will be _null_ for any place that is not a capital.

#### <!--place_label--> `text_anchor` _text_

The `text_anchor` field can be used as a hint for label placement. Possible values match the [Mapbox GL Style Spec for text anchor](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layout-symbol-text-anchor). The value may be _null_. <!-- FIXME - more detail? -->

| Value          | Meaning                                                 |
|----------------|---------------------------------------------------------|
| `center`       | The center of the text is placed closest to the anchor. |
| `left`         | The left side of the text is placed closest to the anchor. |
| `right`        | The right side of the text is placed closest to the anchor. |
| `top`          | The top of the text is placed closest to the anchor.    |
| `bottom`       | The bottom of the text is placed closest to the anchor. |
| `top-left`     | The top left corner of the text is placed closest to the anchor. |
| `top-right`    | The top right corner of the text is placed closest to the anchor. |
| `bottom-left`  | The bottom left corner of the text is placed closest to the anchor. |
| `bottom-right` | The bottom right corner of the text is placed closest to the anchor. |


<!-- POI_LABEL ------------------------------------------------------------>

{{ <LayerInfo name="poi_label" type={["point"]} buffer={64} /> }}

This layer is used to place icons and labels for various points of interest (POIs).

See [`names`](#names) and [`name_script`](#name_script) in for information about names and translations available for label text.

See [`sizerank`](#sizerank) and [`filterrank`](#filterrank) for information on using those fields to style text size and label density.

See [`maki`](#maki) for more information about using this field for assigning icons.

#### <!--poi_label--> `class` _text_

The `class` field groups points of interest into broad categories for styling purposes. The values are useful for designing icon color schemes, for example.

```
arts_and_entertainment
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
```


#### <!--poi_label--> `type` _text_

The `type` field contains a more specific classification intended for display - eg 'Cafe', 'Hotel', 'Laundry'. These values come from the original OpenStreetMap tags and are not a limited set.

#### <!--poi_label--> `category_en` _text_ & `category_zh-Hans` _text_

The `category_en` & `category_zh-Hans` fields contain translated category descriptions for POIs. These can be used as a fallback or as supplemental information where English or simplified Chinese translations may not exist. These values may be _null_.

Language coverage may be expanded in a future v8 update.


<!-- ROAD -------------------------------------------------------------->

{{ <LayerInfo name="road" type={["point", "line", "polygon"]} buffer={4} /> }}

The roads layer contains lines, points, and polygons needed for drawing features such as roads, railways, paths and their labels.

See [`names`](#names) and [`name_script`](#name_script) in for information about names and translations available for label text.

#### <!--road--> `class` _text_

The main field used for styling the road layers is `class`.

| Value              | Description                                  |
|--------------------|----------------------------------------------|
| `motorway`         | High-speed, grade-separated highways         |
| `motorway_link`    | Link roads/lanes/ramps connecting to motorways |
| `trunk`            | Important roads that are not motorways.      |
| `trunk_link`       | Link roads/lanes/ramps  connecting to trunk roads |
| `primary`          | A major highway linking large towns.         |
| `primary_link`     | Link roads/lanes connecting to primary roads |
| `secondary`        | A highway linking large towns.               |
| `secondary_link`   | Link roads/lanes connecting to secondary roads |
| `tertiary`         | A road linking small settlements, or the local centres of a large town or city. |
| `tertiary_link`    | Link roads/lanes connecting to tertiary roads|
| `street`           | Standard unclassified, residential, road, and living_street road types |
| `street_limited`   | Streets that may have limited or no access for motor vehicles. |
| `pedestrian`       | Includes pedestrian streets, plazas, and public transportation platforms. |
| `construction`     | Includes motor roads under construction (but not service roads, paths, etc). |
| `track`            | Roads mostly for agricultural and forestry use etc. |
| `service`          | Access roads, alleys, agricultural tracks, and other services roads. Also includes parking lot aisles, public & private driveways. |
| `ferry`            | Those that serves automobiles and no or unspecified automobile service. |
| `path`             | Foot paths, cycle paths, ski trails.         |
| `major_rail`       | Railways, including mainline, commuter rail, and rapid transit. |
| `minor_rail`       | Includes light rail & tram lines.            |
| `service_rail`     | Yard and service railways.                   |
| `aerialway`        | Ski lifts, gondolas, and other types of aerialway. |
| `golf`             | The approximate centerline of a golf course hole |
| `roundabout`       | Circular continuous-flow intersection         |
| `mini_roundabout`  | Smaller variation of a roundabout with no center island or obstacle |
| `turning_circle`   | (point) Widened section at the end of a cull-de-sac for turning around a vehicle |
| `turning_loop`     | (point) Similar to a turning circle but with an island or other obstruction at the centerpoint |
| `traffic_signals`  | (point) Lights or other signal controlling traffic flow at an intersection |

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

| Value              | reflen range | Description                          |
|--------------------|--------------|--------------------------------------|
| `default`          | 2-6          | No specific shield design suggested. |
| `rectangle-white`  | 2-6          |                                      |
| `rectangle-red`    | 2-6          |                                      |
| `rectangle-orange` | 2-6          |                                      |
| `rectangle-yellow` | 2-6          |                                      |
| `rectangle-green`  | 2-6          |                                      |
| `rectangle-blue`   | 2-6          |                                      |
| `circle-white`     | 2-6          |                                      |


Other highways with more specific shield design requirements are captured individually:

| Value                  | reflen range | Description                     |
|------------------------|--------------|---------------------------------|
| `ae-national`          | 3-4          | United Arab Emirates national routes |
| `ae-d-route`           | 3-4          | UAE Dubai D-routes              |
| `ae-f-route`           | 3            | UAE Fujairah F-routes           |
| `ae-s-route`           | 4            | UAE Sharjah S-routes            |
| `au-national-highway`  | 2-3          | Australia national highways     |
| `au-national-route`    | 2-6          | Australia national routes       |
| `au-state`             | 2-6          | Australia state roads           |
| `au-tourist`           | 2-3          | Australia tourist routes        |
| `br-federal`           | 3            | Brazil federal highways         |
| `br-state`             | 2-3          | Brazil state highways           |
| `ch-motorway`          | 2-3          | Switzerland motorways           |
| `cn-nths-expy`         | 3-5          | China national expressway       |
| `cn-provincial-expy`   | 3-5          | China provincial/regional expressway |
| `de-motorway`          | 2-3          | Germany motorways (Autobahnen)  |
| `gr-motorway`          | 2-4          | Greece motorways                |
| `hk-strategic-route`   | 2            | Hong Kong strategic routes      |
| `hr-motorway`          | 3-4          | Croatia motorways               |
| `hu-motorway`          | 2-3          | Hungary motorways               |
| `hu-main`              | 2-5          | Hungary main roads              |
| `in-national`          | 2-4          | India national highways & expressways |
| `in-state`             | 2-3          | India state highways            |
| `kr-natl-expy`         | 2-3          | South Korea national expressways|
| `kr-natl-hwy`          | 2            | South Korea national highways   |
| `kr-metro-expy`        | 2-3          | South Korea metropolitan expressways |
| `kr-metropolitan`      | 2-6          | South Korea metropolitan routes |
| `kr-local`             | 2-6          | South Korea local routes        |
| `mx-federal`           | 2-4          | Mexico federal highways         |
| `mx-state`             | 2-4          | Mexico state highways           |
| `nz-state`             | 2-3          | New Zealand state highways      |
| `pe-national`          | 2-3          | Peru national highways          |
| `pe-regional`          | 3-4          | Peru departmental / regional highways |
| `ro-national`          | 2-3          | Romania national roads          |
| `ro-county`            | 3-4          | Romania county roads            |
| `ro-communal`          | 2-4          | Romania communal roads          |
| `si-motorway`          | 2            | Slovenia motorways              |
| `tw-national`          | 2            | Taiwan national routes          |
| `tw-provincial-expy`   | 2            | Taiwan provincial expressways   |
| `tw-provincial`        | 2            | Taiwan provincial routes        |
| `tw-county-township`   | 2-6          | Taiwan county / township routes |
| `us-interstate`        | 2-4          | US Interstates                  |
| `us-interstate-duplex` | 4-5          | US Interstates - segment shared by 2 route numbers |
| `us-interstate-business` | 2-3        | US Interstates - business routes|
| `us-interstate-truck`  | 2-3          | US Interstates - truck routes   |
| `us-highway`           | 2-4          | US highways                     |
| `us-highway-duplex`    | 3-5          | US highways - segment shared by 2 route numbers |
| `us-highway-alternate` | 2-3          | US highways - alternate routes  |
| `us-highway-business`  | 2-3          | US highways - business routes   |
| `us-highway-bypass`    | 2-3          | US highways - bypasses          |
| `us-highway-truck`     | 2-3          | US highways - truck routes      |
| `us-bia`               | 2-4          | US BIA Indian routes            |
| `za-national`          | 2-3          | South Africa national routes    |
| `za-provincial`        | 2            | South Africa provincial routes  |

The `shield` value will be _null_ where `ref` is also _null_. No further `shield` values will be added in Mapbox Streets v8.


#### <!--road--> `type` _text_

The `type` field is the value of the road's "primary" OpenStreetMap tag. For most roads this is the `highway` tag, but for aerialways it will be the `aerialway` tag, and for golf holes it will be the `golf` tag. See [Taginfo](http://taginfo.openstreetmap.org/keys/highway#values) for a list of used tag values. Several classes pull in additional detail when it is available from OpenStreetMap.

Possible `construction` class `type` values:

```
construction:motorway
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
```

Possible `track` class `type` values:

```
track:grade1
track:grade2
track:grade3
track:grade4
track:grade5
track
```

Possible `service` class `type` values:

```
service:alley
service:emergency_access
service:drive_through
service:driveway
service:parking
service:parking_aisle
service
```

For the `path` class, some custom type assignments have been made based on insight from various categorical, physical, and access tags from OpenStreetMap.

| Value          | Description                                                |
|-----------------|-----------------------------------------------------------|
| `steps`         | aka stairs                                                |
| `corridor`      | An indoors passageway                                     |
| `sidewalk`      | aka pavement in many places outside North America         |
| `crossing`      | Usually connects sidewalk lines across a road             |
| `piste`         | Ski & snowboard trails, both downhill and cross-country   |
| `mountain_bike` | Trails used primarily or exclusively for mountain biking  |
| `hiking`        | Hiking trails or otherwise rough pedestrian paths         |
| `trail`         | May be suitable for either hiking or mountain biking      |
| `cycleway`      | Paths primarily or exclusively for cyclists               |
| `footway`       | Paths primarily or exclusively for pedestrians            |
| `path`          | Unspecified or mixed-use paths                            |
| `bridleway`     | Equestrian trails                                         |

Possible `ferry` class `type` values:

| Value        | Description                            |
|--------------|----------------------------------------|
| `ferry_auto` | Ferry serves automobiles               |
| `ferry`      | No or unspecified automobile service   |


Possible `aerialway` class `type` values:

| Value                     | Description                                     |
|---------------------------|-------------------------------------------------|
| `aerialway:cablecar`      | Just one or two large cars. The cable forms a loop, but the cars do not loop around, they just move up and down on their own side. |
| `aerialway:gondola`       | Many cars on a looped cable.                    |
| `aerialway:mixed_lift`    | Mix of chair lifts and gondolas on the same line; may change seasonally. |
| `aerialway:chair_lift`    | Looped cable with a series of single chairs and exposed to the open air. |
| `aerialway:drag_lift`     | Includes t-bars, j-bars, platter/button lifts, and tow ropes |
| `aerialway:magic_carpet`  | Conveyor belt installed at the level of the snow, some include a canopy or tunnel. |
| `aerialway`               | Other or unspecified type of aerialway           |

#### <!--road--> `layer` _number_

The `layer` field is used to determine drawing order of overlapping road segments in the tunnel and bridge layers. The value may be any integer number, but 95% of values are -1, 1, or 0, and 99.9999% of values are between -5 and 5.

#### <!--road--> `len` _number_

The `len` field stores the length of the road segment in projected meters, rounded to the nearest whole number. This can be useful for limiting some label styles to longer roads. The value may be _null_ where the geometry is not a line.


<!-- STRUCTURE ---------------------------------------------------------->

{{ <LayerInfo name="structure" type={["line", "polygon"]} buffer={4} /> }}

This layer includes lines and polygons for structures which are not buildings. This includes both natural and human features - cliffs, walls, piers, gates.

Cliff data is designed such that the left-hand side of the line is the top of the cliff, and the right-hand side is the bottom.

#### <!--structure--> `class` _text_

| Value      | Description                                              |
|------------|----------------------------------------------------------|
| `cliff`    | The precipice of a vertical or very steep drop, gullies are included |
| `fence`    | Include various types of fence and wall barriers         |
| `gate`     | Only gates that are lines or areas are included          |
| `hedge`    | A line of closely spaced shrubs and tree species, which form a barrier or mark the boundary of an area |
| `land`     | Includes breakwaters and piers                           |

#### <!--structure--> `type` _text_

The `type` field contains the original value of the feature's primary tag from OSM.


<!-- TRANSIT_STOP_LABEL -------------------------------------------------->

{{ <LayerInfo name="transit_stop_label" type={["point"]} buffer={64} /> }}

The `transit_stop_label` contains points for symbolizing transit stops, stations, and associated features such as entrances.

See [`names`](#names) and [`name_script`](#name_script) in for information about names and translations available for label text.

#### <!--transit_stop_label--> `stop_type` _text_

| Value         | Description                                             |
|---------------|---------------------------------------------------------|
| `station`     | Used as the standard stop type for most rail & ferry modes. For buses and trams, stations represent centralized hubs. |
| `stop`        | Used for bus and tram modes as the standard stop type. They are generally more frequently-spaced than stations and may need smaller symbols/text. |
| `entrance`    | Specific entry points to a station.                     |

#### <!--transit_stop_label--> `mode` _text_

| Value         | Description                                     |
|---------------|-------------------------------------------------|
| `rail`        | National, regional, or commuter rail systems.   |
| `metro_rail`  | Urban rapid transit systems with dedicated rights of way, sometimes partially or fully underground. |
| `light_rail`  | Less capacity than heavy/metro rail. Often on tracks separated from motor traffic but may share grade at intersections. |
| `tram`        | Lighter rail with 1 or 2 carriages, often on a tracks shared with motor vehicle traffic. |
| `monorail`    | Often medium-low capacity and with localized or private use such as in theme parks or airports. |
| `funicular`   | Cable-driven inclined railways. Often touristic and low-capacity. |
| `bicycle`     | For bicycle rental docks/stations               |
| `bus`         | For bus stops or stations                       |
| `ferry`       | A boat that may take passengers on foot, in motor vehicles, or both |

#### <!--transit_stop_label--> `maki` _text_

The `maki` field lets you assign icons to the rail station based on a few basic station types. See [`maki`](#maki) in the Common Fields section for more information.

| Value             | Description                                 |
|-------------------|---------------------------------------------|
| `bicycle-share`   |                                             |
| `bus`             |                                             |
| `ferry`           |                                             |
| `rail`            | Default rail station                        |
| `rail-metro`      | Station for a subway, metro, or other rapid-transit system |
| `rail-light`      | Light rail station                          |
| `entrance`        | Specific station entrance points (eg stairs, escalators, elevators) |

#### <!--transit_stop_label--> `network` _text_

The `network` field lets you assign more specific icons for rail stations that are part of specific local or regional transit systems. They don't necessarily correspond to a specific network - eg `de-u-bahn` applies to any U-Bahn network in Germany since these can all use the same icon in a map style. Some stations serve multiple networks; in these cases, multiple network names are joined with a dot (in alphabetical order).

If none of the specific networks below apply to a station, the `network` value will be the same as the `maki` value (see previous section).

| Value                             | Description                             |
|-----------------------------------|-----------------------------------------|
| `barcelona-metro`                 | Barcelona, Spain                        |
| `boston-t`                        | Boston, Massachusetts                   |
| `chongqing-rail-transit`          | Chongqing, China                        |
| `de-s-bahn`                       | Germany                                 |
| `de-s-bahn.de-u-bahn`             | Germany                                 |
| `de-u-bahn`                       | Germany                                 |
| `delhi-metro`                     | Delhi, India                            |
| `gb-national-rail`                | London, United Kingdom                  |
| `gb-national-rail.london-dlr`     | London, United Kingdom                  |
| `gb-national-rail.london-dlr.london-overground.london-tfl-rail.london-underground` | London, United Kingdom |
| `gb-national-rail.london-dlr.london-overground.london-underground` | London, United Kingdom |
| `gb-national-rail.london-dlr.london-underground` | London, United Kingdom |
| `gb-national-rail.london-overground` | London, United Kingdom |
| `gb-national-rail.london-overground.london-tfl-rail.london-underground` | London, United Kingdom |
| `gb-national-rail.london-overground.london-underground` | London, United Kingdom |
| `gb-national-rail.london-tfl-rail` | London, United Kingdom                 |
| `gb-national-rail.london-tfl-rail.london-overground` | London, United Kingdom |
| `gb-national-rail.london-tfl-rail.london-underground` | London, United Kingdom |
| `gb-national-rail.london-underground` | London, United Kingdom              |
| `hong-kong-mtr`                   | Hong Kong                               |
| `kiev-metro`                      | Kiev, Ukraine                           |
| `london-dlr`                      | Docklands Light Rail, London, United Kingdom |
| `london-dlr.london-tfl-rail`      | London, United Kingdom                  |
| `london-dlr.london-tfl-rail.london-underground` | London, United Kingdom    |
| `london-dlr.london-underground`   | London, United Kingdom                  |
| `london-overground`               | London Overground, United Kingdom       |
| `london-overground.london-tfl-rail` | London Overground, United Kingdom     |
| `london-overground.london-tfl-rail.london-underground` | London Overground, United Kingdom |
| `london-overground.london-underground` | London, United Kingdom             |
| `london-tfl-rail`                 | London, United Kingdom                  |
| `london-tfl-rail.london-underground` | London, United Kingdom               |
| `london-underground`              | London Underground, United Kingdom      |
| `madrid-metro`                    | Madrid, Spain                           |
| `mexico-city-metro`               | Mexico City, Mexico                     |
| `milan-metro`                     | Milan, Italy                            |
| `moscow-metro`                    | Moscow Metro, Russia                    |
| `new-york-subway`                 | New York City, New York                 |
| `osaka-subway`                    | Osaka, Japan                            |
| `oslo-metro`                      | Oslo, Norway                            |
| `paris-metro`                     | Paris Metro, France                     |
| `paris-rer`                       | Paris regional commuter rail, France    |
| `paris-metro.paris-rer`           | Paris, France                           |
| `paris-rer.paris-transilien`      | Paris, France                           |
| `paris-transilien`                | Paris suburban rail, France             |
| `philadelphia-septa`              | Philadelphia, Pennsylvania              |
| `san-francisco-bart`              | San Francisco, California               |
| `singapore-mrt`                   | Singapore                               |
| `stockholm-metro`                 | Stockholm, Sweden                       |
| `taipei-metro`                    | Taipei, Taiwan                          |
| `tokyo-metro`                     | Tokyo, Japan                            |
| `vienna-u-bahn`                   | Vienna, Austria                         |
| `washington-metro`                | Washington DC Metro                     |

No further `network` values will be added in Mapbox Streets v8.


<!-- WATER ----------------------------------------------------------->

{{ <LayerInfo name="water" type={["polygon"]} buffer={8} /> }}

This layer includes all types of water bodies: oceans, rivers, lakes, ponds, reservoirs, fountains, and more.

It is a simple polygon layer with no differentiating types or classes, and consists of a single merged shape per tile. This allows for seamless stroke and transparency styling, but means there is no way to filter out or highlight specific water bodies or a partial subset of them.

Each zoom level includes a set of water bodies that has been filtered and simplified according to scale. Only oceans, seas, and very large lakes are shown at the lowest zoom levels, while smaller and smaller lakes and ponds appear as you zoom in.


<!-- WATERWAY ---------------------------------------------------------->

{{ <LayerInfo name="waterway" type={["line"]} buffer={4} /> }}

The waterway layer contains classes for rivers, streams, canals, etc represented as lines. These classes can represent a wide variety of possible widths. It's best to have your line stying biased toward the smaller end of the scales since larger rivers and canals are usually also represented by polygons in the [#water](#water) layer. Also works best under `#water` layer.

#### <!--waterway--> `class` _text_ & `type` _text_

The waterway layer has two fields for styling - `class` and `type` - each with similar values.

| Value                 | Description                                  |
|-----------------------|----------------------------------------------|
| `river`               | Everything from the Amazon down to small creeks a couple meters wide |
| `canal`               | Medium to large artificial waterway          |
| `stream`              | Very small waterway, usually no wider than a meter or two |
| `stream_intermittent` | **Class only**. A stream that does not always have water flowing through it. |
| `drain`               | Medium to small artificial channel for rainwater drainage, often concrete lined. |
| `ditch`               | Small artificial channel dug in the ground for rainwater drainage. |

