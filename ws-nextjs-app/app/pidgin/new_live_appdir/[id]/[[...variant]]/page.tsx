import React from 'react';
import { headers } from 'next/headers';
import { ParsedUrlQuery } from 'querystring';
import omit from 'ramda/src/omit';
import constructPageFetchUrl from '#app/routes/utils/constructPageFetchUrl';
import getToggles from '#app/lib/utilities/getToggles/withCache';
import { LIVE_PAGE } from '#app/routes/utils/pageTypes';
import nodeLogger from '#lib/logger.node';
import {
  ROUTING_INFORMATION,
  SERVER_SIDE_RENDER_REQUEST_RECEIVED,
  BFF_FETCH_ERROR,
} from '#app/lib/logger.const';
import { Services, Variants } from '#models/types/global';
import { FetchError } from '#models/types/fetch';

import getEnvironment from '#app/routes/utils/getEnvironment';
import fetchPageData from '#app/routes/utils/fetchPageData';
import getAgent from '../../../../../utilities/undiciAgent';
import LivePageLayout from './LivePageLayout';
import Providers from '../../../../Providers';

interface PageDataParams extends ParsedUrlQuery {
  id: string;
  page?: string;
  service: Services;
  variant?: Variants;
  // eslint-disable-next-line camelcase
  renderer_env?: string;
}

const logger = nodeLogger(__filename);

const getPageData = async ({
  id,
  page,
  service,
  variant,
  rendererEnv,
}: PageDataParams) => {
  const reqHeaders = headers();

  const pathname = `${id}${rendererEnv ? `?renderer_env=${rendererEnv}` : ''}`;
  const livePageUrl = constructPageFetchUrl({
    page,
    pageType: 'live',
    pathname,
    service,
    variant,
  });

  const env = getEnvironment(pathname);

  const optHeaders = { 'ctx-service-env': env };
  const isLocal = !env || env === 'local';
  const certsNeeded = !isLocal && process.env.INTEGRATION_TEST_BUILD !== 'true';

  const agent = certsNeeded ? await getAgent() : null;

  let pageStatus;
  let pageJson;
  let errorMessage;

  const path = livePageUrl.toString();

  try {
    // @ts-expect-error Due to jsdoc inference, and no TS within fetchPageData
    const { status, json } = await fetchPageData({
      path,
      agent,
      optHeaders,
    });
    pageStatus = status;
    pageJson = json;
  } catch (error: unknown) {
    const { message, status } = error as FetchError;

    logger.error(BFF_FETCH_ERROR, {
      service,
      status,
      pathname,
      message,
    });
    pageStatus = status;
    errorMessage = message;
  }

  const data = pageJson
    ? { pageData: pageJson.data, status: pageStatus }
    : { error: errorMessage, status: pageStatus };

  const toggles = await getToggles(service);

  // return { data, toggles };

  return {
    bbcOrigin: reqHeaders.get('bbc-origin') || null,
    error: data?.error || null,
    id,
    isAmp: false,
    isNextJs: true,
    page: page || null,
    pageData: data?.pageData || null,
    pageType: LIVE_PAGE,
    // pathname: context.resolvedUrl,
    pathname: '',
    service,
    showAdsBasedOnLocation: reqHeaders.get('bbc-adverts') === 'true' || false,
    status: data.status,
    timeOnServer: Date.now(), // TODO: check if needed?
    toggles,
    variant: variant?.[0] || null,
  };
};

export default async (props: any) => {
  const data = await getPageData({
    id: props.params.id,
    service: 'pidgin',
    rendererEnv: 'test',
    variant: props.params.variant,
  });

  return (
    <Providers pageProps={data}>
      <LivePageLayout {...data} />
    </Providers>
  );
};
