import { matchRoutes } from 'react-router-config';
import path from 'ramda/src/path';
import pathOr from 'ramda/src/pathOr';
import { variantSanitiser } from '#lib/utilities/variantHandler';
import isAmpPath from '#app/routes/utils/isAmpPath';
import isLowPath from '#app/routes/utils/isLowPath';
import isLitePath from '#app/routes/utils/isLitePath';
import routes from '#app/routes';
import fallbackServiceParam from './fallbackServiceParam';

const getRouteProps = url => {
  const matchedRoutes = matchRoutes(routes, url);

  const route = path([0, 'route'], matchedRoutes);
  const match = path([0, 'match'], matchedRoutes);
  const params = pathOr({}, ['params'], match);

  const amp = path(['amp'], params);
  const low = path(['low'], params);
  const lite = path(['lite'], params);
  const service = path(['service'], params);
  const variantPath = path(['variant'], params);
  const id = path(['id'], params);
  const assetUri = path(['assetUri'], params);
  const variant = variantSanitiser(variantPath);
  const errorCode = path(['errorCode'], params);

  return {
    isAmp: 'amp' in params ? !!amp : isAmpPath(url),
    isLow: 'low' in params ? !!low : isLowPath(url),
    isLite: 'lite' in params ? !!lite : isLitePath(url),
    service: service || fallbackServiceParam(url),
    variant,
    id,
    assetUri,
    route,
    match,
    errorCode: errorCode ? Number(errorCode) : errorCode,
  };
};

export default getRouteProps;
