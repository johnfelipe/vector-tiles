---
title: Mapbox Terrain v2
description: Reference documentation for the Mapbox Terrain v2 tileset.
mapid: mapbox.mapbox-terrain-v2
prependJs: 
  - "import { LayerInfo } from '../../components/layer-info';"
  - "import { SourceLayerTypes } from '../../components/source-layer-types';"
  - "import { MapPreview } from '../../components/map';"
  - "import { terrainV2 } from '../../data/styles';"
---

This is a guide to the layers and data inside the Mapbox Terrain vector tile source to help with styling.

{{ 
<MapPreview 
    styleJson={terrainV2}
    lat={40}
    lon={-1}
    zoom={12}
/> 
}}

## Overview

Mapbox Terrain provides hillshades, elevation contours, and landcover data all in vector form.

Mapbox Terrain is based on data from a variety of sources - see [the about page](https://www.mapbox.com/about/maps/) for details. When using the Mapbox Terrain layer publicly in a design or application you must provide [proper attribution](https://docs.mapbox.com/help/how-mapbox-works/attribution/).

A geometry in the vector tile can be one of 3 types:

{{ <SourceLayerTypes /> }}

## Layer Reference

<!-- LANDCOVER ---------------------------------------------------->

### `#landcover`

{{ <LayerInfo type={["polygon"]} buffer={8} /> }}

The landcover layer provides a generalized backdrop of vegetation, agriculture, and permanent ice & snow. It is intended for stylistic use and not appropriate for science or other analysis. Empty space in the landcover layer represents either water or bare earth, rock, sand, and built-up areas.

#### Classes

The __`class`__ field is used for styling different types of landcover. The classes are designed to look best when there is a smooth color gradient across from wood → scrub → grass → crop → map background → snow. Thin strips of "grass" or "crop" along the edge of a wooded area might not necessarily represent actual grass or cropland, but are there to smooth the transition from wood to bare land.

| Value | Description |
|---|---|
| `'wood'` | The area is mostly wooded or forest-like. |
| `'scrub'` | The area is either mostly bushy or a mix of wooded and grassy |
| `'grass'` | The area is mostly grassy. |
| `'crop'` | The area is mostly agricultural, or thin/patchy grass |
| `'snow'` | The area is mostly permanent ice, glacier or snow |

_CartoCSS example:_

```css
Map { background-color: cornsilk; }
#landcover {
  [class='wood'] { polygon-fill: darkseagreen; }
  [class='scrub'] { polygon-fill: mix(darkseagreen,cornsilk,75%); }
  [class='grass'] { polygon-fill: mix(darkseagreen,cornsilk,50%); }
  [class='crop'] { polygon-fill: mix(darkseagreen,cornsilk,25%); }
  [class='snow'] { polygon-fill: white; }
}
```


<!-- HILLSHADE ------------------------------------------------------------>

### `#hillshade`

{{<LayerInfo type={["polygon"]} buffer={8} />}}

The hillshade layer contains polygons that when styled appropriately display shaded relief of hills. The lighting direction is not realistic, but from the north-west (as is traditional in shaded relief).

At zoom levels above 14 you may want to blur, fade, or completely hide the hillshade layer as the resolution of the data is not enough to hold up at the largest scales.

#### Classes

The __`class`__ field is for simple styling of the different levels of light and shadow. With low `polygon-opacity` or certain `polygon-comp-op` settings, you can style all 6 brightness levels with just 2 filters.

| Value | Description |
|---|---|
| `'shadow'` | These should be styled darker than the background color. |
| `'highlight'` | These should be styled lighter than the background color. |

_CartoCSS example:_

```css
#hillshade {
  [class='shadow'] {
    polygon-fill: black;
    polygon-opacity: 0.05;
  }
  [class='highlight'] {
    polygon-fill: white;
    polygon-opacity: 0.10;
  }
}
```

#### Levels

The __`level`__ field allows for more granular styling of the different levels of light and shadow. The numbers represent the brightness threshold percentages that were used to generate the hillshading polygons.

| Value | Description |
|---|---|
| `94` | The brightest highlights |
| `90` | Medium highlights |
| `89` | Areas of faint shadow |
| `78` | Areas of medium shadow |
| `67` | Areas of dark shadow |
| `56` | Areas of extreme shadow |

_ CartoCSS example:_

```css
#hillshade[class='shadow'] {
  polygon-fill: black;
  [level=89] { polygon-opacity: 0.02; }
  [level=78] { polygon-opacity: 0.04; }
  [level=67] { polygon-opacity: 0.06; }
  [level=56] { polygon-opacity: 0.08; }
}
```


<!-- CONTOUR ---------------------------------------------------->

### `#contour`

{{<LayerInfo type={["polygon"]} buffer={4} />}}

Contour lines indicate vertical dimension on a region by joining points of equal elevation. Full contour line coverage begins at zoom 12, while index lines are available at zoom 9 + in values specified below.

#### Elevation

The __`ele`__ field stores the elevation of each contour line in meters and can be used for labeling or filtering. Ideally the values range from `-410` near the shore of the Dead Sea to `8840` near the peak of Mt Everest, but due to bugs and inconsistencies values outside this range may exist.

| Zoom level | Contour Interval |
|---|---|
|  9  | 500 meters |
| 10  | 200 meters |
| 11  | 100 meters |
| 12  |  50 meters |
| 13  |  20 meters |
| 14+ |  10 meters |

_CartoCSS example:_

```css
#contour {
  text-name: [ele]+' m';
  text-face-name: 'Open Sans Regular';
}
```

#### Index lines

The __`index`__ field can be used to accentuate index contours, but it can also be used to reduce the contour density if you wish. The highest value that applies to a contour will be the __`index`__ value, so if you want to highlight every fifth line, you need to select both `index=5` and `index=10`. If you want to highlight every other line, you need to select both `index=2` and `index=10` (or both `index=1` and `index=5`).

| Value | Description |
|---|---|
| `-1` | Sea level coastline |
| ` 1` | Every 1st line |
| ` 2` | Every 2nd line |
| ` 5` | Every 5th line |
| `10` | Every 10th line |

_CartoCSS example:_

```css
#contour {
  /* only show every other contour line */
  [index=10], [ele=2] { line-width: 1; }
}
```


## Changelog

A summary of the changes from v1:

- Various elevation data improvements and updates (notably over most of Europe and Africa)
- __`class`__ field in the [#hillshade](#hillshade) layer simplified to just 2 classes: `highlight`, `shadow`
- `level` field added to the [#hillshade](#hillshade) layer for more granular styling
- Coastlines have an `index` value of `-1` in the [#contour](#contour) layer
- 