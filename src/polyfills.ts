import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone');

if (process.env.ENV === 'production') {
  // Production
  require('angular2-ie9-shims/shims_for_IE.prod.js');
} else {
  // Development
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
  require('angular2-ie9-shims/shims_for_IE.dev.js');
}
