import React, { useContext } from 'react';
import styled from 'styled-components';
import { shape, string } from 'prop-types';
import VisuallyHiddenText from '@bbc/psammead-visually-hidden-text';
import { formatUnixTimestamp } from '@bbc/psammead-timestamp-container/utilities';
import { GEL_SPACING_TRPL } from '@bbc/gel-foundations/spacings';
import ATIAnalytics from '../../containers/ATIAnalytics';
import Grid, { GelPageGrid } from '#app/components/Grid';
import MediaMessage from '../MediaAssetPage/MediaMessage';
import MetadataContainer from '../../containers/Metadata';
import { ServiceContext } from '../../contexts/ServiceContext';
import OnDemandHeadingBlock from '#containers/RadioPageBlocks/Blocks/OnDemandHeading';
import ParagraphBlock from '#containers/RadioPageBlocks/Blocks/Paragraph';

const StyledGelWrapperGrid = styled.div`
  padding-top: ${GEL_SPACING_TRPL};
`;

const getGroups = (zero, one, two, three, four, five) => ({
  group0: zero,
  group1: one,
  group2: two,
  group3: three,
  group4: four,
  group5: five,
});

const StyledGelPageGrid = styled(GelPageGrid)`
  width: 100%;
  flex-grow: 1; /* needed to ensure footer positions at bottom of viewport */
`;

const OnDemandTvPage = ({ pageData }) => {
  const {
    language,
    headline,
    shortSynopsis,
    brandTitle,
    releaseDateTimeStamp,
  } = pageData;

  const { timezone, locale, dir } = useContext(ServiceContext);

  const formattedTimestamp = formatUnixTimestamp({
    timestamp: releaseDateTimeStamp,
    format: 'LL',
    timezone,
    locale,
    isRelative: false,
  });

  return (
    <>
      <ATIAnalytics data={pageData} />
      <MetadataContainer
        title={headline}
        lang={language}
        description={shortSynopsis}
        openGraphType="website"
      />

      <StyledGelPageGrid
        forwardedAs="main"
        role="main"
        dir={dir}
        columns={getGroups(6, 6, 6, 6, 8, 20)}
        enableGelGutters
      >
        <Grid
          item
          dir={dir}
          startOffset={getGroups(1, 1, 1, 1, 2, 5)}
          columns={getGroups(6, 6, 6, 6, 6, 12)}
          margins={getGroups(true, true, true, true, false, false)}
        >
          <VisuallyHiddenText as="h1" tabIndex="-1" id="content">
            {brandTitle}, {formattedTimestamp}
          </VisuallyHiddenText>
          <StyledGelWrapperGrid
            columns={getGroups(6, 6, 6, 6, 6, 6)}
            enableGelGutters
          >
            <MediaMessage />
          </StyledGelWrapperGrid>
          <OnDemandHeadingBlock
            brandTitle={brandTitle}
            releaseDateTimeStamp={releaseDateTimeStamp}
            ariaHidden
          />
          <ParagraphBlock text={shortSynopsis} />
        </Grid>
      </StyledGelPageGrid>
    </>
  );
};

OnDemandTvPage.propTypes = {
  pageData: shape({
    brandTitle: string,
  }).isRequired,
};

export default OnDemandTvPage;
