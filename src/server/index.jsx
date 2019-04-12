import express from 'express';
import compression from 'compression';
import expressStaticGzip from 'express-static-gzip';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
// not part of react-helmet
import helmet from 'helmet';
import gnuTP from 'gnu-terry-pratchett';
import loadInitialData from '../app/routes/loadInitialData';
import routes, {
  articleRegexPath,
  articleDataRegexPath,
  frontpageDataRegexPath,
  manifestRegexPath,
  swRegexPath,
} from '../app/routes';
import nodeLogger from '../app/helpers/logger.node';
import renderDocument from './Document';

const morgan = require('morgan');

const access = promisify(fs.access);

const logger = nodeLogger(__filename);

const publicDirectory = 'build/public';
const dataFolderToRender =
  process.env.NODE_ENV === 'production' ? 'data/prod' : 'data/test';

logger.debug(
  `Application outputting logs to directory "${process.env.LOG_DIR}"`,
);

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["write"] }] */
class LoggerStream {
  write(message) {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
}

const server = express();

/*
 * Default headers, compression, logging, status route
 */

server
  .disable('x-powered-by')
  .use(
    morgan('tiny', {
      skip: (req, res) => res.statusCode === 200,
      stream: new LoggerStream(),
    }),
  )
  .use(compression())
  .use(helmet({ frameguard: { action: 'deny' } }))
  .use(gnuTP())
  .get('/status', (req, res) => {
    res.sendStatus(200);
  });

/*
 * Local env routes - fixture data
 */

if (process.env.APP_ENV === 'local') {
  const errorWhenAccessingFile = async dataFilePath => {
    try {
      await access(dataFilePath, fs.constants.R_OK);
    } catch (e) {
      return e;
    }
    return false;
  };

  const sendDataFile = async (res, dataFilePath) => {
    const accessErr = await errorWhenAccessingFile(dataFilePath);
    if (accessErr) {
      logger.error(accessErr);
      res.status(404).send(`404: Could not access data file ${dataFilePath}`);
      return;
    }

    try {
      const sendFile = promisify(res.sendFile).bind(res);
      await sendFile(dataFilePath, {});
    } catch (sendErr) {
      logger.error(sendErr);
      res
        .status(500)
        .send(
          `500: Failed to send data file ${dataFilePath}. Error: ${sendErr}`,
        );
    }
  };

  server
    .use(
      expressStaticGzip(publicDirectory, {
        enableBrotli: true,
        orderPreference: ['br'],
      }),
    )
    .get(articleDataRegexPath, async ({ params }, res) => {
      const { service, id } = params;

      const dataFilePath = path.join(
        process.cwd(),
        dataFolderToRender,
        service,
        'articles',
        `${id}.json`,
      );

      sendDataFile(res, dataFilePath);
    })
    .get(frontpageDataRegexPath, async ({ params }, res) => {
      const { service } = params;

      const dataFilePath = path.join(
        process.cwd(),
        dataFolderToRender,
        service,
        'frontpage',
        'index.json',
      );

      sendDataFile(res, dataFilePath);
    })
    .get('/ckns_policy/*', (req, res) => {
      // Route to allow the cookie banner to make the cookie oven request
      // without throwing an error due to not being on a bbc domain.
      res.sendStatus(200);
    });
}

/*
 * Application env routes
 */

server
  .get(swRegexPath, (req, res) => {
    const swPath = `${__dirname}/public/sw.js`;
    res.sendFile(swPath, {}, error => {
      if (error) {
        logger.error(error);
        res.status(500).send('Unable to find service worker.');
      }
    });
  })
  .get(manifestRegexPath, async ({ params }, res) => {
    const { service } = params;
    const manifestPath = `${__dirname}/public/${service}/manifest.json`;
    res.sendFile(manifestPath, {}, error => {
      if (error) {
        console.log(error); // eslint-disable-line no-console
        res.status(500).send('Unable to find manifest.');
      }
    });
  })
  .get(articleRegexPath, async ({ url, headers }, res) => {
    try {
      const data = await loadInitialData(url, routes);
      const { status } = data;
      const bbcOrigin = headers['bbc-origin'];

      res
        .status(status)
        .send(await renderDocument(url, data, routes, bbcOrigin));
    } catch ({ message, status }) {
      // Return an internal server error for any uncaught errors
      logger.error(`status: ${status || 500} - ${message}`);
      res.status(500).send(message);
    }
  });

export default server;
