/* eslint-disable jsx-a11y/aria-role */
import React from 'react';
import styled from '@emotion/styled';
import { oneOf, shape, string } from 'prop-types';

import { scriptPropType } from '#psammead/gel-foundations/src/prop-types';
import {
  GEL_GROUP_3_SCREEN_WIDTH_MIN,
  MEDIA_QUERY_TYPOGRAPHY,
} from '#psammead/gel-foundations/src/breakpoints';
import {
  GEL_SPACING,
  GEL_SPACING_DBL,
} from '#psammead/gel-foundations/src/spacings';
import {
  getLongPrimer,
  getDoublePica,
} from '#psammead/gel-foundations/src/typography';
import {
  C_EBON,
  C_GHOST,
  C_BLACK,
  C_WHITE,
} from '#psammead/psammead-styles/src/colours';
import { getSansBold } from '#psammead/psammead-styles/src/font-styles';

// Focus visible indicator to show around all focusable elements, links, buttons etc, across the WS sites.
const focusIndicatorThickness = '0.1875rem';

const minClickableHeightPx = 44;
const minClickableHeightRem = minClickableHeightPx / 16;

const paddingDir = ({ dir }) => `padding-${dir === 'rtl' ? 'left' : 'right'}`;
const paddingReverseDir = ({ dir }) =>
  `padding-${dir === 'rtl' ? 'right' : 'left'}`;

// Flex doesn't work right on IE11.
// This makes it work right. I don't fully understand how, but am
// eternally grateful to the Flexbugs project.
// https://github.com/philipwalton/flexbugs#flexbug-3
const FlexColumn = styled.span`
  display: flex;
  flex-direction: column;
`;

const SectionLabelLink = styled.a`
  color: ${C_EBON};
  text-decoration: none;

  // Izzy remove focus
  &:hover {
    text-decoration: underline;
  }

  // SOLUTION 2 - using focus:not(:focus-visible)
  // Applies all rules to focus state
  &:focus {
    text-decoration: underline;
    display: block;
    outline: ${focusIndicatorThickness} solid ${C_BLACK};
    box-shadow: 0 0 0 ${focusIndicatorThickness} ${C_WHITE};
    outline-offset: ${focusIndicatorThickness};
  }

  // Overrides these rules depending whether focus-visible state is being used, applies different styles to focus and focus-visible
  &:focus:not(:focus-visible) {
    outline: none;
    box-shadow: none;
    outline-offset: 0;
  }

  &:focus-visible {
    outline: ${focusIndicatorThickness} solid ${C_BLACK};
    box-shadow: 0 0 0 ${focusIndicatorThickness} ${C_WHITE};
    outline-offset: ${focusIndicatorThickness};
  }
  // END SOLUTION 2
`;

SectionLabelLink.propTypes = {
  href: string.isRequired,
  labelId: string.isRequired,
};

const FlexRow = styled.span`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  min-height: ${minClickableHeightRem}rem;

  align-items: baseline;
  ${MEDIA_QUERY_TYPOGRAPHY.LAPTOP_AND_LARGER} {
    align-items: stretch;
  }
`;

const titleMargins = `
  margin: ${GEL_SPACING_DBL} 0;

  ${MEDIA_QUERY_TYPOGRAPHY.LAPTOP_AND_LARGER} {
    margin: 0;
  }
`;

const Title = styled.span`
  ${({ script }) => script && getDoublePica(script)};
  ${({ service }) => getSansBold(service)}
  background-color: ${props => props.backgroundColor};
  ${titleMargins};
  ${paddingDir}: ${GEL_SPACING};

  @media (min-width: ${GEL_GROUP_3_SCREEN_WIDTH_MIN}) {
    ${paddingDir}: ${GEL_SPACING_DBL};
  }

  display: flex;
  align-items: center;
`;

Title.propTypes = {
  dir: oneOf(['ltr', 'rtl']).isRequired,
  id: string.isRequired,
  script: shape(scriptPropType).isRequired,
  service: string.isRequired,
};

const IndexLinkCta = styled.span`
  ${({ script }) => script && getLongPrimer(script)};
  ${({ service }) => getSansBold(service)};
  ${titleMargins};
  color: ${C_EBON};
  background-color: ${props => props.backgroundColor};
  white-space: nowrap;
  ${paddingReverseDir}: ${GEL_SPACING_DBL};

  /* needed to ensure always vertically centered even when FlexRow changes alignment */
  display: flex;
  align-items: center;
`;

IndexLinkCta.propTypes = {
  dir: oneOf(['ltr', 'rtl']).isRequired,
  script: shape(scriptPropType).isRequired,
  service: string.isRequired,
};

export const PlainTitle = ({
  children: title,
  dir,
  labelId,
  script,
  service,
  backgroundColor,
}) => (
  <FlexColumn>
    <FlexRow>
      <Title
        script={script}
        dir={dir}
        id={labelId}
        service={service}
        backgroundColor={backgroundColor}
      >
        {title}
      </Title>
    </FlexRow>
  </FlexColumn>
);

PlainTitle.propTypes = {
  children: string.isRequired,
  dir: oneOf(['ltr', 'rtl']).isRequired,
  labelId: string.isRequired,
  script: shape(scriptPropType).isRequired,
  service: string.isRequired,
  backgroundColor: string,
};

PlainTitle.defaultProps = {
  backgroundColor: C_GHOST,
};

export const LinkTitle = ({
  children: title,
  dir,
  href,
  labelId,
  linkText,
  script,
  service,
  backgroundColor,
}) => (
  <SectionLabelLink href={href} labelId={labelId}>
    <FlexColumn>
      <FlexRow role="text">
        <Title
          id={labelId}
          dir={dir}
          script={script}
          service={service}
          backgroundColor={backgroundColor}
        >
          {title}
        </Title>
        <IndexLinkCta
          dir={dir}
          script={script}
          service={service}
          backgroundColor={backgroundColor}
          aria-hidden="true"
        >
          {linkText}
        </IndexLinkCta>
      </FlexRow>
    </FlexColumn>
  </SectionLabelLink>
);

LinkTitle.propTypes = {
  children: string.isRequired,
  dir: oneOf(['ltr', 'rtl']).isRequired,
  href: string.isRequired,
  labelId: string.isRequired,
  linkText: string.isRequired,
  script: shape(scriptPropType).isRequired,
  service: string.isRequired,
  backgroundColor: string,
};

LinkTitle.defaultProps = {
  backgroundColor: C_GHOST,
};
