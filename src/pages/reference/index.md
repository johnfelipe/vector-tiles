---
title: Introduction
description: Reference documentation for Mapbox-maintained vector tilesets.
prependJs:
    - "import * as constants from '../../constants';"
    - "import OverviewHeader from '@mapbox/dr-ui/overview-header';"
---

{{
  <div className="mb24 mt60 pt30 pt0-mm mt0-mm">
    <OverviewHeader
      features={[
        "Feature one",
        "Feature two",
        "Feature three",
        "Feature four"
      ]}
      title='Vector tiles'
      image={<div></div>}
    />
  </div>
}}

Vector tiles make huge maps fast while offering full design flexibility. They are the vector data equivalent of image tiles for web mapping, applying the strengths of tiling -- developed for caching, scaling and serving map imagery rapidly -- to vector data.

Traditionally, maps are created from image tiles. Like for instance this PNG image tile depicting the corner of lower Manhattan with roads, building footprints, and parks:

![](https://api.mapbox.com/v4/mapbox.streets/14/4823/6160.png?access_token={{constants.ACCESS_TOKEN}})

To get the underlying vector tile data that makes up this image, you can request it specifically:

```
http://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v7/14/4823/6160.mvt?access_token=<your access token>
```

As the name suggests, vector tiles contain vector data instead of the rendered image. They contain geometries and metadata -- like road names, place names, house numbers -- in a compact, structured format. Vector tiles are rendered only when requested by a client, like a web browser or a mobile app. Rendering happens either in the client ([Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/), [Mapbox iOS SDK](https://docs.mapbox.com/ios/maps/overview/), [Mapbox Android SDK](https://docs.mapbox.com/android/maps/overview/)) or on the fly on the server ([map API](https://docs.mapbox.com/api/maps/)). The [specification overview page](/vector-tiles/specification/) is a great place to learn more about the Mapbox Vector Tile Specification.

Vector tiles have two important advantages over fully rendered image tiles:

- **Styling** - as vectors, tiles can be styled when requested, allowing for [many map styles](https://www.mapbox.com/maps/) on global data
- **Size** - vector tiles are really small, enabling global high resolution maps, fast map loads, and efficient caching

Mapbox Streets, our global basemap, is entirely made of vector tiles. Any map data you upload with [Mapbox Studio](https://studio.mapbox.com/) is converted into vector tiles before styling.

## Open Standard

Vector tiles are an open standard under a Creative Commons Attribution 3.0 US License. We support vector tiles across our products and there is a [large list of vector tile implementation by other vendors](https://github.com/mapbox/awesome-vector-tiles).

[Read the Mapbox Vector Tile Spec on Github](https://github.com/mapbox/vector-tile-spec) and get in touch with us there with feedback and improvements.
