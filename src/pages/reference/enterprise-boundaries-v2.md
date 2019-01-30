---
title: Enterprise Boundaries v2
description: Reference documentation for the Enterprise Boundaries v2 tileset.
prependJs: 
  - "import Icon from '@mapbox/mr-ui/icon';"
  - "import { LayerInfo } from '../../components/layer-info';"
  - "import Note from '@mapbox/dr-ui/note';"
  - "import BookImage from '@mapbox/dr-ui/book-image';"
---


{{ <Note title="Access to Enterprise Boundaries" imageComponent={<BookImage height="60" width="60"/>}> }}
Access to the Enterprise Boundaries tilesets are controlled by Mapbox account access token. If you do not have access on your account, [contact a Mapbox sales representative](https://www.mapbox.com/contact/) to request access to Enterprise Boundaries tilesets.
{{</Note>}}

## Overview

The Enterprise Boundaries vector tiles do not directly contain detailed feature properties such as names or parent boundary information. Such detailed data is delivered separately as offline lookup tables, allowing the vector tiles to stay small and fast. For more details on how to make use of Enterprise Boundaries for data visualizations, see our [getting started tutorial](https://docs.mapbox.com/help/tutorials/get-started-enterprise-boundaries/).

## Tilesets

Enterprise Boundaries are composed of a number of separate tilesets each with their own tileset ID. There are two types of tilesets: lines & areas.

| Tileset ID | Description |
|---|---|
| `mapbox.enterprise-boundaries-a0-v2` | States or territories that have ISO 3166-1 codes, plus Kosovo |
| `mapbox.enterprise-boundaries-a1-v2` | First-level administrative areas |
| `mapbox.enterprise-boundaries-a2-v2` | Second-level administrative areas |
| `mapbox.enterprise-boundaries-a3-v2` | Third-level administrative areas |
| `mapbox.enterprise-boundaries-a4-v2` | Fourth-level administrative areas |
| `mapbox.enterprise-boundaries-a5-v2` | Fifth-level administrative areas |
| `mapbox.enterprise-boundaries-aL-v2` | Administrative division lines for all levels |
| `mapbox.enterprise-boundaries-p1-v2` | Postal code grouping areas |
| `mapbox.enterprise-boundaries-p2-v2` | Postal code grouping areas |
| `mapbox.enterprise-boundaries-p3-v2` | Postal code grouping areas |
| `mapbox.enterprise-boundaries-p4-v2` | Full-detail postal code areas |
| `mapbox.enterprise-boundaries-s1-v2` | First-level statistical areas |
| `mapbox.enterprise-boundaries-s2-v2` | Second-level statistical areas |
| `mapbox.enterprise-boundaries-s3-v2` | Third-level statistical areas |
| `mapbox.enterprise-boundaries-s4-v2` | Fourth-level statistical areas |

### Geometry types

Each layer in Enterprise Boundary tilesets will contain one of 3 geometry types:

1. {{ <Icon name="marker" inline={true} /> }} Point
2. {{ <Icon name="polyline" inline={true} /> }} Linestring / multilinestring
3. {{ <Icon name="polygon" inline={true} /> }} Polygon / multipolygon


## Area Layer Reference

{{ <LayerInfo name="boundaries_{type}_{level}" type={["polygon"]} /> }}

Each area tileset has a layer named `boundaries_{type}_{level}`, where `{type}` is one of `admin`, `postal`, or `stats`, and `{level}` is a number `0` through `5`. The `{type}` and `{level}` values correspond to the given tileset.

#### <!--area--> `id` _text_

The `id` field provides an identifier string for each feature. These IDs are globally unique within a given “worldview”; some are duplicated but only where they represent different versions of the same feature for different worldviews.

#### <!--area--> `worldview` _text_

The vector tiles contain multiple versions of some boundaries, each with a `worldview` value indicating the intended audience. It is important to apply a worldview filter to all of your `admin` style layers, otherwise your map will show conflicting and overlapping boundary lines. The filter should always include both `all` and one of the region-specific values.

| Value | Description |
|---|---|
| `all` | Appropriate for all worldviews (most boundaries). |
| `CN` | Boundaries for a mainland Chinese audience/worldview, but not officially approved for use in the PRC. |
| `IN` | Boundaries conforming to cartographic requirements for use in India. |
| `US` | Boundaries for an American audience, & which are generally appropriate outside of China & India. (Lines do not necessarily reflect official US foreign policy.) |

{{ <LayerInfo name="points_{type}_{level}" type={["point"]} /> }}

Each area tileset has a layer named `points_{type}_{level}`, where `{type}` is one of `admin`, `postal`, or `stats`, and `{level}` is a number `0` through `5`. The `{type}` and `{level}` values correspond to the given tileset.

The `points_*` layers contain approximate center points corresponding to the polygons in the `boundaries_*` layers. They can be used for labeling or for visualizations using symbols. Points are generally available one zoom level lower than the polygons they correspond to.

The point layers have the same two [`id`](#area---id-text) and [`worldview`](#area---worldview-text) fields as the area layers with the same meaning.

## Administrative Line Layer Reference

{{ <LayerInfo name="boundaries_admin_lines" type={["line"]} /> }}

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
