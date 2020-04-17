/**
 * @service pidgin
 * @pathname /pidgin/tori-51745682
 */

import { runCommonCrossPlatformTests } from '../../common';

runCommonCrossPlatformTests();

describe('Articles', () => {
  it('I can see an image with a caption', () => {
    const imageEl = document.querySelector(
      'main figure img, main figure amp-img',
    );
    const imageCaptionEl = document.querySelector('main figure figcaption');

    expect(imageEl).toBeInTheDocument();
    expect(imageEl).toBeTruthy();
    expect(imageEl.getAttribute('src')).toMatchInlineSnapshot(
      `"https://ichef.bbci.co.uk/news/640/cpsprodpb/1317C/production/_111140287_oshiobaba.jpg"`,
    );

    expect(imageCaptionEl).toBeInTheDocument();
    expect(imageCaptionEl.textContent).toBeTruthy();
    expect(imageCaptionEl.textContent).toMatchInlineSnapshot(
      `"Wetin we call dis foto, APC Chairman Adams Oshiomhole don be Govnor of Edo State before"`,
    );
  });
});
