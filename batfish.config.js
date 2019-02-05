'use strict';

const batfish = require('@mapbox/batfish');
const path = require('path');

const pageShellDir = path.join(__dirname, './vendor/docs-page-shell');

const productPageOrder = {
  'reference/': [
    'index',
    'mapbox-streets-v8',
    'mapbox-terrain-v2',
    'mapbox-traffic-v1',
    'enterprise-boundaries-v2',
    'mapbox-streets-v7',
    'mapbox-streets-v6',
    'mapbox-streets-v5'
  ],
  'specification/': ['index', 'format']
};

module.exports = () => {
  const config = {
    siteBasePath: '/vector-tiles',
    stylesheets: [
      require.resolve('@mapbox/mbx-assembly/dist/assembly.css'),
      path.join(pageShellDir, 'page-shell-styles.css'),
      path.join(__dirname, './css/site.css'),
      require.resolve('@mapbox/dr-ui/css/docs-prose.css'),
      path.join(__dirname, './src/css/prism.css'),
      'https://api.tiles.mapbox.com/mapbox-gl-js/v0.52.0/mapbox-gl.css'
    ],
    applicationWrapperPath: path.join(
      __dirname,
      'src/components/application-wrapper.js'
    ),
    inlineJs: [{ filename: path.join(pageShellDir, 'page-shell-script.js') }],
    webpackPlugins: [new batfish.webpack.EnvironmentPlugin(['DEPLOY_ENV'])],
    webpackStaticIgnore: [/mapbox-gl.js$/],
    jsxtremeMarkdownOptions: {
      getWrapper: resource => {
        if (/\/specification\//.test(resource)) {
          return path.join(
            __dirname,
            './src/components/markdown-mini-shell.js'
          );
        } else {
          return path.join(
            __dirname,
            './src/components/markdown-page-shell.js'
          );
        }
      },
      rehypePlugins: [
        require('rehype-slug'),
        require('@mapbox/dr-ui/plugins/add-links-to-headings'),
        require('@mapbox/dr-ui/plugins/create-sections')
      ]
    },
    dataSelectors: {
      listSubFolders: data => {
        const folders = data.pages.filter(
          file => file.path.split(path.sep).length === 4
        );
        return folders;
      },
      orderedPages: data => {
        const pages = data.pages.map(p => ({
          title: p.frontMatter.title,
          description: p.frontMatter.description,
          path: p.path
        }));
        const result = Object.keys(productPageOrder).reduce(
          (reduced, prefix) => {
            const order = productPageOrder[prefix];
            reduced[prefix] = order.map(item => {
              return pages.find(p => {
                const urlEnding = item === 'index' ? '' : `${item}/`;
                return new RegExp(`${prefix}${urlEnding}$`).test(p.path);
              });
            });
            return reduced;
          },
          {}
        );
        return result;
      }
    }
  };

  return config;
};
