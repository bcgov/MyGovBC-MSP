require('core-js/es6');
require('core-js/es7/reflect');
require('zone.js/dist/zone');
require('blueimp-canvas-to-blob');
import { environment } from './environments/environment';


if (environment.runtimeEnv === 'production') {
  // Production
} else {
  // Development
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}
