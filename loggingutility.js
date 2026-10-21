//  Logger Utility
//  A flexible, level-aware logging utility for JavaScript.
//  Supports: log levels, timestamps, labels, history, filtering,
//            grouped output, timers, and log export.


// ----- Log Levels -----
const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4,
};

// ----- Console color codes (ANSI) for Node.js environments -----
const COLORS = {
    RESET:  "\x1b[0m",
    DEBUG:  "\x1b[36m",   // Cyan
    INFO:   "\x1b[32m",   // Green
    WARN:   "\x1b[33m",   // Yellow
    ERROR:  "\x1b[31m",   // Red
    FATAL:  "\x1b[35m",   // Magenta
    DIM:    "\x1b[2m",    // Dim (used for timestamps)
};


//  Logger Class

class Logger {
    /**
     * @param {string} label     - A name/label for this logger instance (e.g. "AuthModule")
     * @param {string} minLevel  - Minimum level to log: "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL"
     */
    constructor(label = "App", minLevel = "DEBUG") {
        this.label    = label;
        this.minLevel = minLevel;
        this.history  = [];        // Stores all log entries
        this._timers  = {};        // Stores active timers
    }

    
    //  Internal: Format & emit a log entry
    
    _log(level, message, data = undefined) {
        // Respect minimum log level filter
        if (LOG_LEVELS[level] < LOG_LEVELS[this.minLevel]) return;

        const timestamp = new Date().toISOString();
        const entry = {
            timestamp,
            level,
            label: this.label,
            message,
            data: data !== undefined ? data : null,
        };

        // Save to history
        this.history.push(entry);

        // Build the formatted string
        const color   = COLORS[level] || COLORS.RESET;
        const dimTime = COLORS.DIM + timestamp + COLORS.RESET;
        const badge   = `${color}[${level}]${COLORS.RESET}`;
        const src     = COLORS.DIM + `[${this.label}]` + COLORS.RESET;
        const msg     = `${color}${message}${COLORS.RESET}`;

        const output = `${dimTime} ${badge} ${src} ${msg}`;

        // Route to correct console method
        if (level === "ERROR" || level === "FATAL") {
            data !== undefined ? console.error(output, data) : console.error(output);
        } else if (level === "WARN") {
            data !== undefined ? console.warn(output, data) : console.warn(output);
        } else {
            data !== undefined ? console.log(output, data) : console.log(output);
        }
    }

    
    //  Public log level methods
    

    /** Detailed diagnostic information */
    debug(message, data) {
        this._log("DEBUG", message, data);
    }

    /** General informational messages */
    info(message, data) {
        this._log("INFO", message, data);
    }

    /** Something unexpected but non-breaking */
    warn(message, data) {
        this._log("WARN", message, data);
    }

    /** An error occurred */
    error(message, data) {
        this._log("ERROR", message, data);
    }

    /** Critical failure — application may not recover */
    fatal(message, data) {
        this._log("FATAL", message, data);
    }

    
    //  Grouped output  (collapsible in browser DevTools)
    

    /**
     * Begin a named log group.
     * @param {string} groupName
     */
    group(groupName) {
        console.group(`${COLORS.DIM}[${this.label}]${COLORS.RESET} ${groupName}`);
    }

    /** End the current log group */
    groupEnd() {
        console.groupEnd();
    }

    
    //  Performance Timers
    

    /**
     * Start a named timer.
     * @param {string} timerName
     */
    startTimer(timerName) {
        this._timers[timerName] = Date.now();
        this.debug(`Timer started: "${timerName}"`);
    }

    /**
     * Stop a named timer and log the elapsed time.
     * @param {string} timerName
     * @returns {number|null} Elapsed milliseconds, or null if timer not found.
     */
    stopTimer(timerName) {
        if (!this._timers[timerName]) {
            this.warn(`Timer "${timerName}" was never started.`);
            return null;
        }
        const elapsed = Date.now() - this._timers[timerName];
        delete this._timers[timerName];
        this.info(`Timer "${timerName}" finished in ${elapsed}ms`);
        return elapsed;
    }

    
    //  History & Filtering
   

    /**
     * Get all log history entries, optionally filtered by level.
     * @param {string|null} level - Filter by level name (e.g. "WARN"), or null for all.
     * @returns {Array} Array of log entry objects.
     */
    getHistory(level = null) {
        if (!level) return this.history;
        return this.history.filter(entry => entry.level === level.toUpperCase());
    }

    /**
     * Clear all stored log history.
     */
    clearHistory() {
        this.history = [];
        this.debug("Log history cleared.");
    }

    /**
     * Export all log history as a JSON string.
     * @returns {string} JSON-formatted log history.
     */
    exportAsJSON() {
        return JSON.stringify(this.history, null, 2);
    }

    /**
     * Export all log history as a plain-text string.
     * @returns {string} Human-readable log history.
     */
    exportAsText() {
        return this.history
            .map(e => {
                const dataStr = e.data ? ` | data: ${JSON.stringify(e.data)}` : "";
                return `[${e.timestamp}] [${e.level}] [${e.label}] ${e.message}${dataStr}`;
            })
            .join("\n");
    }

    /**
     * @param {string} subLabel
     * @returns {Logger}
     */
    child(subLabel) {
        return new Logger(`${this.label}:${subLabel}`, this.minLevel);
    }
}


const logger = new Logger("MainApp", "DEBUG");

logger.info("Application started");
logger.debug("Debugging mode is active");
logger.warn("Config file not found — using defaults", { config: "app.config.json" });
logger.error("Failed to connect to database", { host: "localhost", port: 5432 });

// --- Grouped logs ---
logger.group("User Authentication Flow");
logger.info("User attempted login", { username: "john_doe" });
logger.warn("Incorrect password entered", { attempt: 1 });
logger.error("Account locked after too many attempts", { username: "john_doe" });
logger.groupEnd();

// --- Performance timer ---
logger.startTimer("dataFetch");

// Simulate async work with setTimeout
setTimeout(() => {
    logger.stopTimer("dataFetch");
    logger.info("Data fetched and processed successfully");

    // --- Child logger ---
    const authLogger = logger.child("Auth");
    authLogger.info("Token issued to user", { userId: 42, role: "admin" });
    authLogger.fatal("JWT secret missing — cannot sign tokens");

    // --- History filtering ---
    console.log("\n--- WARN entries only ---");
    console.log(logger.getHistory("WARN"));

    // --- Plain text export ---
    console.log("\n--- Full Log Export (text) ---");
    console.log(logger.exportAsText());
}, 150);
