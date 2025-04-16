import { useEffect } from "react";
import logger from "../utils/logger";

function useLogger(componentName, props = {}) {
  useEffect(() => {
    logger.debug(`${componentName} mounted`, props);

    return () => {
      logger.debug(`${componentName} unmounted`);
    };
  }, [componentName]);

  return {
    debug: (message, data) =>
      logger.debug(`${componentName}: ${message}`, data),
    info: (message, data) => logger.info(`${componentName}: ${message}`, data),
    warn: (message, data) => logger.warn(`${componentName}: ${message}`, data),
    error: (message, data) => logger.error(`${componentName}: ${message}`, data)
  };
}

export default useLogger;
