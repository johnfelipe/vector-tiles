---
title: Mapbox Traffic v1
description: Reference documentation for the Mapbox Traffic v1 tileset.
mapid: mapbox.mapbox-traffic-v1
prependJs:
  - "import * as constants from '../../constants';"
  - "import { LayerInfo } from '../../components/layer-info';"
  - "import { MapPreview } from '../../components/map';"
  - "import { trafficV1 } from '../../data/styles';"
---

This is a guide to the layers and data inside the Mapbox Traffic vector tile source to help with styling.

{{ 
<MapPreview 
    styleJson={trafficV1}
    lat={34.0422}
    lon={-118.2437}
    zoom={12}
/> 
}}

## Overview

Mapbox Traffic provides constantly updating congestion information on top of [Mapbox Streets](https://www.mapbox.com/maps/streets/) road geometries.

When you publicly use styles or software that use Mapbox Traffic vector tiles, you must [display proper attribution](https://docs.mapbox.com/help/how-mapbox-works/attribution/).

### Line offsets

Mapbox Traffic can be used to display congestion for both directions on two way roads. When styling congestion, it's recommended that you add a positive `line-offset` to the layer to visually separate the directions of travel.

In regions that use left-hand traffic, road directions are reversed to allow for consistent `line-offset` styling of all roads.

### Data updates

Mapbox Traffic receives two different types of data updates:

- Traffic speeds and densities: used to derive congestion, updated approximately every 8 minutes
- Road geometries: based on OpenStreetMap, periodically updated


## Layer Reference

### `#traffic`

{{ <LayerInfo type={["line"]} buffer={4} /> }}

#### Classes

The main field used for styling traffic layers is __`class`__.

| Value | Description |
|---|---|
| `motorway` | High-speed, grade-separated highways |
| `motorway_link` | Interchanges / on & off ramps |
| `trunk` | Important roads that are not motorways. |
| `trunk_link` | Ramps and physically separated at-grade turning lanes connecting trunks to other roads. |
| `primary` | A major highway linking large towns. |
| `primary_link` | Ramps and physically separated at-grade turning lanes connecting primary roads to other roads. |
| `secondary` | A highway linking large towns. |
| `tertiary` | A road linking small settlements, or the local centres of a large town or city. |
| `link` | Secondary and tertiary link roads |
| `street` | Standard unclassified, residential, road, and living_street road types |
| `service` | Access roads, alleys, agricultural tracks, and other services roads. Also includes parking lot aisles, public & private driveways. |

#### Structure

The __`structure`__ field describes the grade of a road. Bridges and tunnels are not distinct from surface roads until zoom level 13.

| Value | Description |
|---|---|
| `bridge` | Roads that lead over a bridge. |
| `tunnel` | Roads that run underground. |
| _no value_ | Surface roads and fords. |

#### Congestion

The __`congestion`__ field is a measure of the relative slowdown a road segment is experiencing.

| Value |
|---|
| `low` |
| `moderate` |
| `heavy` |
| `severe` |

#### Road Closures

The __`closed`__ field marks roads that are currently closed.

| Value | Description |
|---|---|
| `yes` | Roads that are closed. |
| _no value_ | Roads that are open. |
