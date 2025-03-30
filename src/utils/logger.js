import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Logger class for frontend
class FrontendLogger {
  constructor(options = {}) {
    this.apiEndpoint = options.apiEndpoint || "/api/logs/frontend";
    this.applicationName = options.applicationName || "frontend";
    this.environment = options.environment || "development";
    this.enabled = options.enabled !== false;
    this.consoleEnabled = options.consoleEnabled !== false;
    this.correlationId = options.correlationId || this.getCorrelationId();

    // Bind methods
    this.trace = this.trace.bind(this);
    this.debug = this.debug.bind(this);
    this.info = this.info.bind(this);
    this.warn = this.warn.bind(this);
    this.error = this.error.bind(this);
    this.fatal = this.fatal.bind(this);
  }

  getCorrelationId() {
    // Try to get correlation ID from URL param or HTTP header
    const urlParams = new URLSearchParams(window.location.search);
    const urlCorrelationId = urlParams.get("correlationId");

    // Generate a new ID if not found
    return urlCorrelationId || uuidv4();
  }

  // Helper method to send logs to backend
  async sendToServer(level, message, contextData = {}) {
    if (!this.enabled) return;

    try {
      // Strip sensitive data
      const sanitizedContext = this.sanitizeData(contextData);

      // Prepare log payload
      const logPayload = {
        level,
        message,
        contextData: sanitizedContext,
        application: this.applicationName,
        correlationId: this.correlationId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      // Send to server
      await axios.post(this.apiEndpoint, logPayload, {
        headers: {
          "x-correlation-id": this.correlationId
        }
      });
    } catch (error) {
      // If logging fails, output to console
      console.error("Failed to send log to server:", error);
    }
  }

  // Remove sensitive data from logs
  sanitizeData(data) {
    if (!data || typeof data !== "object") return data;

    const sensitiveKeys = ["password", "token", "secret", "creditCard", "ssn"];
    const sanitized = { ...data };

    Object.keys(sanitized).forEach((key) => {
      // Check if key contains any sensitive words
      if (
        sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))
      ) {
        sanitized[key] = "[REDACTED]";
      } else if (
        typeof sanitized[key] === "object" &&
        sanitized[key] !== null
      ) {
        sanitized[key] = this.sanitizeData(sanitized[key]);
      }
    });

    return sanitized;
  }

  // Log methods
  async trace(message, contextData) {
    if (this.consoleEnabled) console.trace(message, contextData);
    await this.sendToServer("trace", message, contextData);
  }

  async debug(message, contextData) {
    if (this.consoleEnabled) console.debug(message, contextData);
    await this.sendToServer("debug", message, contextData);
  }

  async info(message, contextData) {
    if (this.consoleEnabled) console.info(message, contextData);
    await this.sendToServer("info", message, contextData);
  }

  async warn(message, contextData) {
    if (this.consoleEnabled) console.warn(message, contextData);
    await this.sendToServer("warn", message, contextData);
  }

  async error(message, contextData) {
    if (this.consoleEnabled) console.error(message, contextData);

    // If it's an Error object, extract the message and stack
    if (contextData instanceof Error) {
      contextData = {
        errorMessage: contextData.message,
        stack: contextData.stack,
        name: contextData.name
      };
    }

    await this.sendToServer("error", message, contextData);
  }

  async fatal(message, contextData) {
    if (this.consoleEnabled) console.error("FATAL:", message, contextData);

    // If it's an Error object, extract the message and stack
    if (contextData instanceof Error) {
      contextData = {
        errorMessage: contextData.message,
        stack: contextData.stack,
        name: contextData.name
      };
    }

    await this.sendToServer("fatal", message, contextData);
  }
}

// Create and export a singleton instance
const logger = new FrontendLogger({
  apiEndpoint: "http://localhost:3001/api/logs/frontend",
  applicationName: "business-logic-builder",
  environment: import.meta.env.MODE
});

export default logger;
