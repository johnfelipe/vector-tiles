# [mapbox.com/vector-tiles](https://mapbox.com/vector-tiles)

This is a home for all vector tile documentation at mapbox.com.

* What are vector tiles?
* `mapbox-streets`, `mapbox-terrain`, and `mapbox-traffic` documentation
* Vector tile specification guide

## Getting started

### Installation

To install site and build dependencies, run:

```sh
npm install
```

### Hosting locally

The Vector tiles documentation uses [Batfish](https://github.com/mapbox/batfish), a static-site generator powered by react and webpack. To get started contributing to the documentation and running the site locally you'll need to navigate to this projects folder and execute:

```sh
npm start
```

This will set up a server running at http://localhost:8080/vector-tiles/. If you make changes to the source content, your browser should automatically refresh using livereload once you save the file.

### Run tests

All changes to this documentation need to pass the test suite to be merged. These tests check for broken links, properly formatted frontmatter, and descriptive link text.

To run the tests:

1. Run `npm test`
1. If a test fails, you will see a detailed message explaining why. Update the page and run the test again.

## Contributing

There are two kinds of documentation in this site: reference documentation for individual tilesets and the vector tile specification.

### Reference documentation

The reference page for each Mapbox-maintained tileset is built from a single Markdown file in [`src/pages/reference/`](./src/pages/reference/).

#### Frontmatter

- Each file should begin with frontmatter that contains a `title` and a `description`, which will be added to the meta data for the page.
- Frontmatter should always include a `mapid` for the tileset, which is used to display a [`Copiable`](https://mapbox.github.io/mr-ui/#copiable).
- In most cases, the frontmatter will also include `prependJs` with a list of all imports.

Here's an example of the frontmatter for Mapbox Streets v8:

```md
---
title: Mapbox Streets v8
description: Reference documentation for the Mapbox Streets v8 tileset.
mapid: mapbox.mapbox-streets-v8
prependJs:
  - "import Icon from '@mapbox/mr-ui/icon';"
  - "import { LayerInfo } from '../../components/layer-info';"
  - "import { SourceLayerTypes } from '../../components/source-layer-types';"
  - "import { MapPreview } from '../../components/map';"
  - "import { streetsV8 } from '../../data/styles';"
---
```

#### Map

The newest version of each publicly available tileset includes a `MapPreview` component, which contains an interactive map using a minimal style to illustrate the coverage, density, and type of data included in that tileset. There are three pieces involved:

- The [`MapPreview`](./src/components/map.js) component.
- A unique style JSON object exported from the [`src/data/style.js`](./src/data/style.js) file.
- The Markdown file for the page on which you're adding the map. Both the `MapPreview` component and style object should be imported into the Markdown file in the frontmatter using `prependJs`. The Map can be added anywhere on the page like in this example:

```
{{
<MapPreview
    styleJson={streetsV8}
    lat={48.8566}
    lon={2.3522}
    zoom={14}
/>
}}
```

#### Layer reference headings

Each source layer in the _Layer reference_ section should be an `h3` heading written using Markdown (`### source_layer`). Directly following the layer name, use the [`LayerInfo`](./src/components/layer-info.js) component to specify the geometry `type` (point, line, or polygon) and buffer size (any number) for that layer, like in this example:

```
### `place_label`

{{ <LayerInfo type={["point"]} buffer={128} /> }}
```

#### Components for use in-line

`SourceLayerTypes` (from [`src/components/`](./src/components/))

Use this to list the geometry types of features found in vector tiles (point, line, and polygon).

`Note` (from [`@mapbox/dr-ui`](https://github.com/mapbox/dr-ui))

Use this to add a note including additional information or warning to upgrade from versions that no longer receive data updates.

`Icon` (from [`@mapbox/mr-ui`](https://mapbox.github.io/mr-ui/))

Use this to add an [Assembly icon](https://labs.mapbox.com/assembly/icons).


### Vector tile specification

Content for the Vector tile specification is in Markdown files in [`src/pages/specification/`](./src/pages/specification/).

#### Written content

Content from all Markdown files are arranged on a single page using [`MarkdownMiniShell`](./src/components/markdown-mini-shell.js).

#### Interactive and animated illustrations

All interactive and animated illustrations are React components in [`src/components/illustrations/`](./src/components/illustrations/) and imported into the Markdown files in the frontmatter using `prependJs`.

### Images

General rules:
- Never add raw images directly to the site.
- Never add images directly to `src/img/dist/`.
- Never load images on the site from anywhere *except* `src/img/dist/`.

Follow this process to add a new image:

1. **Add the raw image.** Add the raw image to `src/img/src/` (no subdirectories).

2. **Add the new image to the image config**. Specify the sizes you need for each image in `conf/image-config.js`. Check out [the documentation about this file](https://github.com/mapbox/appropriate-images#image-configuration). Here's a sample image configuration item:

```js
tutorialLandingPage: {
  basename: 'tutorial-landing-page.png',
  sizes: [{ width: 480 }, { width: 960 }]
}
```

*Note: `width` is required. `height` is not. `width` and `height` should never exceed the natural dimensions of the image. If `height` is not provided, the natural aspect ratio of the image will be preserved. If `height` is provided, the image will be cropped. By default, it will be center-cropped.*

3. **Run the script.** Run `scripts/appropriate-images.js` in terminal, either specifying the image(s) you just added (to save time), or optimizing `--all`. For example, to add only the image in the example above, you would use:

```
scripts/appropriate-images.js tutorialLandingPage
```

*Note: You'll see that the generated images in `src/img/dist/` have filenames corresponding to the sizes you've defined.*


To add the image to your markdown page, reference the component under `prependJs` in the page's frontmatter:

```
- "import AppropriateImage from '../../components/appropriate-image';"
```

In the body of the page, where you want your image to appear:

```
{{
<AppropriateImage imageId="tutorialLandingPage" alt="" />
}}
```

* The `imageId` is the name of the image you entered in `conf/image-config.js`.
* The `alt` is a description of the image.
