---
title: What the spec doesn't cover
prependJs:
    - "import * as constants from '../../constants';"
    - "import { NotIncludedDiagram } from '../../components/illustrations/not-included-diagram';"
---

## What the spec doesn't cover

This specification is very explicit in the way a vector tile should pack data. However, there are some related concepts that this specification does not cover.

### How to use vector tiles as a dataset

This specification IS NOT intended to explain how to use vector tiles as a dataset. This is something that has been considered for the future, but it will likely be a separate specification. This specification does not cover how to store, request, or share vector tiles. Consider this specification similar to how the PNG spec explains how to *pack data*.

### How to encode attributes that aren't strings or numbers

Attributes in geometric data, such as the `properties` object in GeoJSON can include more than just strings and numbers. They can be arrays or objects. The specification doesn't cover how to encode these values and is up to the encoder to decide. Tools like Mapnik will turn arrays and objects into strings, which requires the decoder to parse them accordingly. For example, if you had a GeoJSON property called `categories` and it was an array:

```
"categories": ["one", "two", "three"]
```

It would be converted into a string and stored in the protobuf like this:

```
keys: "categories"
values: {
  string_value: "[\"one\",\"two\",\"three\"]"
}
```

### Clipping

The specification does not explain how geographic data should be clipped between vector tiles since clipping, like simplification, can be executed in many ways. Mapbox specifically clips features at a buffer around the tile (see the encoding example above). Any geometry within this buffer is assumed to carry over to another tile. This is up for consideration for a future release.

*Note: encoded geometry in vector tiles can actually extend beyond the bound of the tile. This means features are not required to be clipped.*

A common question, when it comes to clipping is "how do renderers know which lines to connect for clipped geometry?". This is the very reason Mapbox adds a buffer to vector tiles and clipped geometry. When it is time to render the canvas is set to the exact tile size, which sets the edges outside of the visual frame, thus the tiles all line up. Therefore, there is no need to know which nodes are part of others for rendering purposes. That being said, one *could* use the `id` field in the protobuf to store information necessary for reconstructing polygons.

### Simplification

The conversion from geographic coordinates (latitude and longitude) to vector tile coordinates (x, y) is an important step, but can be implemented in many different ways prior to vector tile encoding. It is not included in this specification, but there are some important GOTCHAs worth noting.

{{ <NotIncludedDiagram /> }}

## Open Specification

Interested in diving into the complete specification? Take a look at the [repository on Github]({{constants.VERSION_URL}}{{constants.CURRENT}}). If you have any questions or notice anything incorrect with this page or the specification, you can [submit an issue](https://github.com/mapbox/vector-tiles/issues) and we'll work through it.

If you are interested in contributing please refer to the [`CONTRIBUTING.md`]({{constants.VERSION_URL}}) file on GitHub.
