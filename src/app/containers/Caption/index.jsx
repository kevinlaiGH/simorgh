import React from 'react';
import { objectOf, any } from 'prop-types';
import VisuallyHiddenText from '@bbc/psammead-visually-hidden-text';
import Caption from '@bbc/psammead-caption';
import Paragraph from '@bbc/psammead-paragraph';
import deepGet from '../../helpers/json/deepGet';
import { ServiceContext } from '../../contexts/ServiceContext';
import Blocks from '../Blocks';
import Fragment from '../Fragment';
import InlineLink from '../InlineLink';

const componentsToRender = { fragment: Fragment, urlLink: InlineLink };

const renderParagraphs = paragraphBlock => (
  <Paragraph>
    <Blocks blocks={paragraphBlock} componentsToRender={componentsToRender} />
  </Paragraph>
);

const renderCaption = (paragraphBlocks, imageCaptionOffscreenText) => (
  <Caption>
    {imageCaptionOffscreenText ? (
      <VisuallyHiddenText>{imageCaptionOffscreenText}</VisuallyHiddenText>
    ) : null}
    {paragraphBlocks.map(block =>
      renderParagraphs(deepGet(['model', 'blocks'], block)),
    )}
  </Caption>
);

const CaptionContainer = ({ block }) => {
  const paragraphBlocks = deepGet(
    ['model', 'blocks', 0, 'model', 'blocks'],
    block,
  );

  return (
    <ServiceContext.Consumer>
      {({ imageCaptionOffscreenText }) =>
        renderCaption(paragraphBlocks, imageCaptionOffscreenText)
      }
    </ServiceContext.Consumer>
  );
};

CaptionContainer.propTypes = {
  block: objectOf(any).isRequired,
};

export default CaptionContainer;
