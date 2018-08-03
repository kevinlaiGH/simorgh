import {
  getElement,
  getSecondElement,
  shouldContainText,
  shouldContainStyles,
} from '../support/testHelper';

describe('News Article', () => {
  // eslint-disable-next-line no-undef
  before(() => {
    // Only 'scenario-25' & 'scenario-27' are available within the PROD enviroment
    cy.visit('/article/scenario-25');
  });

  it('should render the BBC News branding', () => {
    const headerElement = getElement('header');
    shouldContainStyles(headerElement, 'height', '80px');
    shouldContainStyles(headerElement, 'background-color', 'rgb(184, 0, 0)');

    const anchorElement = getElement('header a');
    shouldContainText(anchorElement, 'BBC News');
  });

  it('should render a headline', () => {
    const h1 = getElement('h1');
    shouldContainText(
      h1,
      'Royal wedding 2018: Bouquet laid on tomb of unknown warrior',
    );
    shouldContainStyles(h1, 'color', 'rgb(34, 34, 34)');
    shouldContainStyles(
      h1,
      'font-family',
      'ReithSerifNewsMedium, Arial, Helvetica, freesans, sans-serif',
    );
  });

  it('should render a subheading', () => {
    const h2 = getElement('h2');
    shouldContainText(h2, "Queen Victoria's myrtle");
    shouldContainStyles(h2, 'color', 'rgb(64, 64, 64)');
    shouldContainStyles(
      h2,
      'font-family',
      'ReithSansNewsRegular, Arial, Helvetica, freesans, sans-serif',
    );
  });

  it('should render a paragraph', () => {
    const p = getElement('p');
    shouldContainText(
      p,
      'The Duchess of Sussex has followed tradition by having her bridal bouquet placed on the tomb of the unknown warrior at Westminster Abbey.',
    );
  });

  it('should have a visible image without a caption', () => {
    const firstFigure = getElement('figure').eq(0);

    firstFigure.should('be.visible');
    firstFigure.should('to.have.descendants', 'img');
    firstFigure.should('not.to.have.descendants', 'figcaption');
  });

  it('should have a visible image with a caption', () => {
    const thirdFigure = getElement('figure').eq(2);

    thirdFigure.should('be.visible');
    thirdFigure.should('to.have.descendants', 'img');
    thirdFigure.should('to.have.descendants', 'figcaption');
  });

  it('should render a title', () => {
    cy.title().should('eq', "Meghan's bouquet laid on tomb of unknown warrior");
  });

  it('should have a nofollow meta tag', () => {
    const metaElement = getElement('head meta[name="robots"]');
    metaElement.should('have.attr', 'content', 'nofollow');
  });

  it('should have resource hints', () => {
    const resources = [
      'https://ichef.bbci.co.uk',
      'https://static.bbci.co.uk',
      'https://gel.files.bbci.co.uk',
    ];

    resources.forEach(resource => {
      const selector = `head link[href="${resource}"]`;
      const firstElement = getElement(selector);
      firstElement.should('have.attr', 'rel', 'preconnect');
      const secondElement = getSecondElement(selector);
      secondElement.should('have.attr', 'rel', 'dns-prefetch');
    });
  });

  it('should include the font faces', () => {
    const expectedFonts = [
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSans_W_Lt.woff',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSans_W_Lt.woff2',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSans_W_Rg.woff',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSans_W_Rg.woff2',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSans_W_Md.woff',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSans_W_Md.woff2',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSans_W_Bd.woff',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSans_W_Bd.woff2',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Lt.woff',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Lt.woff2',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Rg.woff',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Rg.woff2',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Md.woff',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Md.woff2',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Bd.woff',
      'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Bd.woff2',
    ];
    const styleTag = getElement('head style');

    expectedFonts.forEach(font => {
      styleTag.should('contain', font);
    });
  });

  // Testing the actual fetch is not currently possible
  it('should have script to fetch bundle', () => {
    cy.get('script')
      .last()
      .should('have.attr', 'src')
      .and('match', /(\/static\/js\/bundle\.\w+\.js)/g);
  });

  it('should load a maximum of three font files', () => {
    const fontFamiliesArray = [];
    cy.get('*')
      .each(element => {
        const fontFamily = Cypress.$(element).css('font-family');
        if (
          fontFamily &&
          !fontFamiliesArray.includes(fontFamily) &&
          // !== 'Times' has been added as there elements not visible, which Cypress is assigning a font of 'Times'
          fontFamily !== 'Times'
        ) {
          fontFamiliesArray.push(fontFamily);
        }
      })
      .then(() => {
        expect(fontFamiliesArray.length).to.be.lessThan(4);
      });
  });
});
