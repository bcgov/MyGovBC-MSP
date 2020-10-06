import { environment } from 'environments/environment';

const devOnlyConsoleLog = (...args: any[]): void => {
  if (environment.runtimeEnv === 'development') {
    console.log(...args);
  }
}

export default devOnlyConsoleLog;
