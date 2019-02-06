---
title: Winding order
prependJs:
  - "import { WindingOrderDiagram } from '../../components/illustrations/winding-order-diagram';"
---

## Winding order

Winding order refers to the direction a ring is drawn in a vector tile, either clockwise or counter-clockwise. Many geometries are multipolygons with "holes," which are also represented as polygon rings. It is important to be able to infer winding order to extract source data from a vector tile and understand if the geometry is part of a multipolygon or a unique polygon.

Extracting the original data from images has been difficult on maps in the past, because of the loss of underlying metadata from the geometry that might have been used to create the image. However, with the introduction of client side rendering of vector tiles via GL technologies, the raw geometry data has become useful for a source of information outside of just rendering.

In order for renderers to appropriately distinguish which polygons are holes and which are unique geometries, the specification requires all polygons to be valid ([OGC validity](http://www.opengeospatial.org/standards/sfa)). Any polygon interior ring must be oriented with the winding order opposite that of their parent exterior ring and all interior rings must directly follow the exterior ring to which they belong. Exterior rings must be oriented clockwise and interior rings must be oriented counter-clockwise (when viewed in screen coordinates).

The following example geometries show how encoding a ring's winding order can affect the rendered result. Each example assumes all rings are part of the same multipolygon.

*Note: the `Y` axis is positive-downward in vector tile coordinates!*

{{ <WindingOrderDiagram /> }}
