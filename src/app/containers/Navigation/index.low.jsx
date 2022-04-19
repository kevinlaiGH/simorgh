import React from 'react';
import Navigation from '@bbc/psammead-navigation';
import { node, string, shape } from 'prop-types';
import { scriptPropType } from '@bbc/gel-foundations/prop-types';
import { ScrollableNavigation } from '@bbc/psammead-navigation/scrollable';
import { AmpDropdown, AmpMenuButton } from '@bbc/psammead-navigation/dropdown';
import { GEL_GROUP_2_SCREEN_WIDTH_MAX } from '@bbc/gel-foundations/breakpoints';
import styled from '@emotion/styled';

const DROPDOWN_ID = 'si-nav-dropdown-menu';
const NAVIGATION_ID = 'si-nav';
const SCROLLABLE_ID = 'si-nav-scrollable';
const HIDDEN_CLASS_NAME = 'si-nav-scrollable-hidden';
const OPEN_CLASS_NAME = 'si-nav-open';

const StyledAmpScrollableNavigation = styled(ScrollableNavigation)`
  &.${HIDDEN_CLASS_NAME} {
    @media (max-width: ${GEL_GROUP_2_SCREEN_WIDTH_MAX}) {
      display: none;
      visibility: hidden;
    }
  }
`;

const AmpNavigationContainer = ({
  script,
  service,
  dir,
  menuAnnouncedText,
  scrollableListItems,
  dropdownListItems,
  brandBackgroundColour,
  brandForegroundColour,
  brandHighlightColour,
  brandBorderColour,
}) => (
  <Navigation
    script={script}
    service={service}
    dir={dir}
    id={NAVIGATION_ID}
    ampOpenClass={OPEN_CLASS_NAME}
    brandBackgroundColour={brandBackgroundColour}
    brandForegroundColour={brandForegroundColour}
    brandHighlightColour={brandHighlightColour}
    brandBorderColour={brandBorderColour}
  >
  </Navigation>
);

AmpNavigationContainer.propTypes = {
  service: string.isRequired,
  dir: string.isRequired,
  script: shape(scriptPropType).isRequired,
  scrollableListItems: node.isRequired,
  dropdownListItems: node.isRequired,
  menuAnnouncedText: string.isRequired,
  brandBackgroundColour: string.isRequired,
  brandForegroundColour: string.isRequired,
  brandHighlightColour: string.isRequired,
  brandBorderColour: string.isRequired,
};

export default AmpNavigationContainer;
