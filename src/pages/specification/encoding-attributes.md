---
title: Encoding attributes
prependJs:
  - "import { EncodingAttributesDiagram } from '../../components/illustrations/encoding-attributes-diagram';"
---

## Encoding attributes

Attributes are encoded in a series of `tag`s that exist within a feature in the vector that have integer values that reference `keys` and `values` designating the original key:value pairs from the geometry. For large geometry, this removes redundancy for attributes that have the same keys and similar values.

Take a look at the original geojson `FeatureCollection` on the left and see how its individual parts are encoded into the proper `tags` of the vector tile protobuf.

{{ <EncodingAttributesDiagram /> }}
