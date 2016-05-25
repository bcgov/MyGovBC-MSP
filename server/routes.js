/**
 * Main application routes
 */

'use strict';

import errors from './components/errors'
import config from './config/environment'

export default function (app) {
  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/profile', require('./api/profile'));
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route((config.rootUrlPath || '') + '/?*')
    .get((req, res) => {
      res.render('index.html', config)
    });
}
