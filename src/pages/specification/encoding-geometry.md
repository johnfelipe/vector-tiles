---
title: Encoding geometry
prependJs:
    - "import * as constants from '../../constants';"
    - "import { EncodingGeometryDiagram } from '../../components/illustrations/encoding-geometry-diagram';"
description: To encode geographic information into a vector tile a tool must convert geographic coordinates, such as latitude and longitude, into vector tile grid coordinates.
---

## Encoding geometry

To encode geographic information into a vector tile a tool must convert geographic coordinates, such as latitude and longitude, into vector tile grid coordinates. Vector tiles hold no concept of geographic information. They encode points, lines, and polygons as `x`/`y` pairs relative to the top left of the grid in a right-down manner.

This is a step-by-step example showing how a single vector tile encodes geometry in the grid. It follows the commands of the "pen" to encode two rings.

{{ <EncodingGeometryDiagram /> }}
