import React, { useContext } from 'react';
import { arrayOf, shape, number } from 'prop-types';
import { pathOr } from 'ramda';

import { StoryPromoLi, StoryPromoUl } from '@bbc/psammead-story-promo-list';
import { storyItem } from '#models/propTypes/storyItem';
import { ServiceContext } from '#contexts/ServiceContext';
import CpsOnwardJourney from '../CpsOnwardJourney';
import StoryPromo from '../StoryPromo';
import useViewTracker from '#hooks/useViewTracker';

const EVENT_TRACKING_DATA = {
  componentName: 'features',
};

const PromoListComponent = ({ promoItems, dir }) => {
  const { serviceDatetimeLocale } = useContext(ServiceContext);
  const viewRef = useViewTracker(EVENT_TRACKING_DATA);

  return (
    <StoryPromoUl>
      {promoItems.map(item => (
        <StoryPromoLi key={item.id || item.uri} ref={viewRef}>
          <StoryPromo
            item={item}
            dir={dir}
            displayImage
            displaySummary={false}
            serviceDatetimeLocale={serviceDatetimeLocale}
            eventTrackingData={EVENT_TRACKING_DATA}
          />
        </StoryPromoLi>
      ))}
    </StoryPromoUl>
  );
};

const PromoComponent = ({ promo, dir }) => {
  const { serviceDatetimeLocale } = useContext(ServiceContext);

  return (
    <StoryPromo
      item={promo}
      dir={dir}
      displayImage
      serviceDatetimeLocale={serviceDatetimeLocale}
    />
  );
};

const FeaturesAnalysis = ({ content, parentColumns }) => {
  const { translations } = useContext(ServiceContext);

  const title = pathOr(
    'Features & Analysis',
    ['featuresAnalysisTitle'],
    translations,
  );

  return (
    <CpsOnwardJourney
      labelId="features-analysis-heading"
      title={title}
      content={content}
      parentColumns={parentColumns}
      promoComponent={PromoComponent}
      promoListComponent={PromoListComponent}
      columnType="secondary"
    />
  );
};

FeaturesAnalysis.propTypes = {
  content: arrayOf(shape(storyItem)),
  parentColumns: shape({
    group0: number,
    group1: number,
    group2: number,
    group3: number,
    group4: number,
    group5: number,
  }),
};

FeaturesAnalysis.defaultProps = {
  content: [],
  parentColumns: null,
};

export default FeaturesAnalysis;
