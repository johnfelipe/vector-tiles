---
title: Format
prependJs:
    - "import * as constants from '../../constants';"
description: Vector tiles are encoded as Google Protobufs.
---

## Format

Vector tiles are encoded as [Google Protobufs](https://github.com/google/protobuf) (PBF), which allow for serializing structured data. For clarity, Mapbox Vector Tiles use the `.mvt` file suffix. The specification details are largely structured around the rules implemented in the base [`.proto` file]({{constants.VERSION_URL}}{{constants.CURRENT}}/vector_tile.proto).

### How are OpenStreetMap PBF files related to Mapbox Vector Tiles?

They are not related at all. PBFs are a format, much like XML and can take many forms. Mapbox Vector Tiles and OpenStreetMap PBFs are protobuf files, but conform to completely different specifications and are used in different ways.
