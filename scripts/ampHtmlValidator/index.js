/* eslint-disable no-console */
import fetch from 'isomorphic-fetch';

import amphtmlValidator from 'amphtml-validator';
import { getPageUrls } from '../../cypress/support/helpers/getPageUrls';

const environment = 'local';
const isSmoke = true;
const baseUrl = 'http://localhost:7080';
const pageTypes = [
  'frontPage',
  'articles',
  'liveRadio',
  'photoGalleryPage',
  'mostReadPage',
  'onDemandAudio',
  'onDemandTV',
  'mediaAssetPage',
  'storyPage',
  'idxPage',
  'featureIndexPage',
];

// list of urls we have decided are acceptable to fail amp validation
const excludedUrls = [
  '/mundo/23263889' /* https://github.com/bbc/simorgh/issues/8104 */,
  '/mundo/noticias-internacional-51266689',
];

const getPageString = async url => {
  const response = await fetch(url);
  return response.text();
};

const printResult = result => {
  const consoleMethod = result.status === 'PASS' ? console.log : console.error;
  consoleMethod(result.url);
  consoleMethod(result.status);

  result.errors.forEach(error => {
    let msg = `line ${error.line}, col ${error.col}: ${error.message}`;
    if (error.specUrl !== null) {
      msg += ` (see ${error.specUrl})`;
    }
    console.error(msg);
  });
  console.log('\n');
};

const printSummary = results => {
  const passed = results.filter(result => result.status === 'PASS').length;
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${results.length - passed}`);
};

const validate = async ({ validator, url }) => {
  const pageString = await getPageString(`${baseUrl}${url}.amp`);
  const result = validator.validateString(pageString);
  result.url = url;
  return result;
};

const runValidator = async verbose => {
  const validator = await amphtmlValidator.getInstance();

  const urls = pageTypes
    .map(pageType => getPageUrls({ pageType, environment, isSmoke }).flat())
    .flat()
    .filter(url => !excludedUrls.includes(url));

  return Promise.all(urls.map(url => validate({ validator, url }))).then(
    results => {
      results.forEach(result => {
        if (result.status === 'PASS') {
          if (verbose) printResult(result);
        } else {
          printResult(result);
          process.exitCode = 1;
        }
      });

      printSummary(results);
    },
  );
};

export default {
  getPageString,
  printResult,
  printSummary,
  runValidator,
  validate,
};
