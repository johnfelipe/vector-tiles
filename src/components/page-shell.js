import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { withLocation } from '@mapbox/batfish/modules/with-location';
import ReactPageShell from '../../vendor/docs-page-shell/react-page-shell.js';
import TopbarSticker from '@mapbox/dr-ui/topbar-sticker';
import ProductMenu from '@mapbox/dr-ui/product-menu/product-menu';
import TabList from '@mapbox/mr-ui/tab-list';
import PageLayout from '@mapbox/dr-ui/page-layout';
import NavigationAccordion from '@mapbox/dr-ui/navigation-accordion';
import orderedPages from '@mapbox/batfish/data/ordered-pages'; // eslint-disable-line
import { routeToPrefixed } from '@mapbox/batfish/modules/route-to';
import TocGuide from './toc-guide';

class PageShell extends React.Component {
  buildGuideToc = headings => {
    const sections = headings
      .filter(heading => {
        return heading.level === 2 || heading.level === 3;
      })
      .map(heading => {
        return {
          title: heading.text,
          url: `#${heading.slug}`,
          level: heading.level
        };
      });
    return (
      <div>
        <TocGuide headings={sections} />
      </div>
    );
  };

  componentDidMount() {
    // initialize analytics
    if (window && window.initializeMapboxAnalytics) {
      window.initializeMapboxAnalytics({
        sentry: {
          sentryDsn:
            'https://6ba8cfeeedad4fb7acb8576f0fd6e266@sentry.io/1384508'
        }
      });
    }
  }

  render() {
    const { props } = this;

    const meta = this.props.meta || {};
    if (!meta.title && props.frontMatter.title) {
      meta.title = props.frontMatter.title;
    }
    if (!meta.description && props.frontMatter.description) {
      meta.description = props.frontMatter.description;
    }
    if (!meta.pathname) {
      meta.pathname = props.location.pathname;
    }

    const normalizedPathname = /\/$/.test(props.location.pathname)
      ? props.location.pathname
      : `${props.location.pathname}/`;
    const baseUrl = props.location.pathname.split('/')[1];
    const checkBaseUrl = new RegExp(`/${baseUrl}/([^/]+/)`);
    const pathPrefixMatch = checkBaseUrl.exec(normalizedPathname);
    if (!pathPrefixMatch) {
      throw new Error(`No subnav known for ${this.props.location.pathname}`);
    }

    let pageNavigationNarrowStick = true;
    let pageNavigation = <div />;

    if (pathPrefixMatch[1] === 'reference/') {
      const parseHeadings = arr => {
        return arr.map((heading, index) => {
          return {
            level: heading.level,
            text: heading.text,
            slug: heading.slug,
            order: index
          };
        });
      };

      const orderedHeadings = this.props.frontMatter.headings
        ? parseHeadings(this.props.frontMatter.headings)
        : parseHeadings(this.props.headings);

      const topLevelHeadings = orderedHeadings.filter(h => h.level === 2);
      const secondLevelItems = topLevelHeadings.map((h2, index) => {
        const nextH2 = topLevelHeadings[index + 1];
        return {
          title: h2.text,
          path: h2.slug,
          thirdLevelItems: orderedHeadings
            .filter(
              f =>
                f.level === 3 &&
                f.order > h2.order &&
                (nextH2 ? f.order < nextH2.order : true)
            )
            .map(h3 => {
              return {
                title: h3.text,
                path: h3.slug
              };
            })
        };
      });
      pageNavigation = (
        <div className="mx0-mm ml-neg24 mr-neg36 relative-mm absolute right left">
          <NavigationAccordion
            currentPath={props.location.pathname}
            contents={{
              firstLevelItems: orderedPages['reference/'],
              secondLevelItems: secondLevelItems || null
            }}
            onDropdownChange={value => {
              routeToPrefixed(value);
            }}
          />
        </div>
      );
    } else if (pathPrefixMatch[1] === 'specification/') {
      pageNavigation = this.buildGuideToc(props.headings);
      pageNavigationNarrowStick = false;
    }

    return (
      <ReactPageShell {...props} meta={meta} darkHeaderText={true}>
        <Helmet>
          <link
            rel="canonical"
            href={`https://docs.mapbox.com${meta.pathname}`}
          />
        </Helmet>
        <div className="shell-header-buffer" />
        <TopbarSticker>
          <div className="limiter">
            <div className="grid grid--gut36 mr-neg36 mr0-mm">
              <div className="col col--4-mm col--12">
                <div className="ml24-mm pt12">
                  <ProductMenu
                    productName="Vector tiles"
                    homePage="/vector-tiles/"
                  />
                </div>
              </div>
              <div className="col col--8-mm col--12">
                <TabList
                  items={[
                    {
                      label: 'Reference',
                      id: 'reference/',
                      href: '/vector-tiles/reference/'
                    },
                    {
                      label: 'Specification',
                      id: 'specification/',
                      href: '/vector-tiles/specification/'
                    }
                  ]}
                  activeItem={pathPrefixMatch[1]}
                  truncateBy={1}
                />
              </div>
            </div>
          </div>
        </TopbarSticker>
        <div className="limiter">
          <PageLayout
            sidebarContent={pageNavigation}
            sidebarContentStickyTop={60}
            sidebarContentStickyTopNarrow={0}
            currentPath={props.location.pathname}
            sidebarStackedOnNarrowScreens={pageNavigationNarrowStick}
          >
            <div
              className={
                pathPrefixMatch[1] === 'reference/'
                  ? 'mt60 pt30 mt0-mm pt0-mm'
                  : 'mt30 mt0-mm'
              }
            >
              {props.children}
            </div>
          </PageLayout>
        </div>
      </ReactPageShell>
    );
  }
}

PageShell.propTypes = {
  meta: PropTypes.object,
  frontMatter: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  children: PropTypes.node.isRequired,
  // From withLocation
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default withLocation(PageShell);
