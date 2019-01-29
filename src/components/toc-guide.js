/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Scrollspy from 'react-scrollspy';

class TocGuide extends React.PureComponent {
  static propTypes = {
    headings: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        level: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired
      }).isRequired
    )
  };

  render() {
    const items = this.props.headings.map(heading =>
      heading.url.replace('#', '')
    );
    const tocContent = this.props.headings.map((heading, index) => {
      const nextHeading = this.props.headings[index + 1] || null;
      const headingClasses = classnames({
        'pb6 mx36': heading.level === 2,
        'mb6 mx36 color-gray': heading.level === 3,
        mb24: nextHeading && nextHeading.level === 2 && heading.level === 3,
        mb6: nextHeading && nextHeading.level === 2 && heading.level === 2
      });
      return (
        <li key={index} className={headingClasses}>
          <a href={heading.url} className="color-blue-on-hover">
            {heading.title}
          </a>
        </li>
      );
    });
    return (
      <Scrollspy items={items} currentClassName="txt-bold">
        {tocContent}
      </Scrollspy>
    );
  }
}

export default TocGuide;
