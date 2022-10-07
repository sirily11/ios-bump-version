/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 4317:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(489);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 9602:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(4317);
const file_command_1 = __nccwpck_require__(5288);
const utils_1 = __nccwpck_require__(489);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(907);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1663);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1663);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 5288:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(489);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 907:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(9706);
const auth_1 = __nccwpck_require__(8336);
const core_1 = __nccwpck_require__(9602);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 1663:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 489:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5082:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExecOutput = exports.exec = void 0;
const string_decoder_1 = __nccwpck_require__(1576);
const tr = __importStar(__nccwpck_require__(1668));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;
/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout and stderr
 *
 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
 * @param     options               optional exec options.  See ExecOptions
 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
 */
function getExecOutput(commandLine, args, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let stdout = '';
        let stderr = '';
        //Using string decoder covers the case where a mult-byte character is split
        const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
        const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
            stderr += stderrDecoder.write(data);
            if (originalStdErrListener) {
                originalStdErrListener(data);
            }
        };
        const stdOutListener = (data) => {
            stdout += stdoutDecoder.write(data);
            if (originalStdoutListener) {
                originalStdoutListener(data);
            }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        //flush any remaining characters
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
            exitCode,
            stdout,
            stderr
        };
    });
}
exports.getExecOutput = getExecOutput;
//# sourceMappingURL=exec.js.map

/***/ }),

/***/ 1668:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.argStringToArray = exports.ToolRunner = void 0;
const os = __importStar(__nccwpck_require__(2037));
const events = __importStar(__nccwpck_require__(2361));
const child = __importStar(__nccwpck_require__(2081));
const path = __importStar(__nccwpck_require__(1017));
const io = __importStar(__nccwpck_require__(157));
const ioUtil = __importStar(__nccwpck_require__(4498));
const timers_1 = __nccwpck_require__(9512);
/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            return s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
            return '';
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                }
                const fileName = this._getSpawnFileName();
                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                let stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                let errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
                if (this.options.input) {
                    if (!cp.stdin) {
                        throw new Error('child process missing stdin');
                    }
                    cp.stdin.end(this.options.input);
                }
            }));
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map

/***/ }),

/***/ 8336:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 9706:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(531));
const tunnel = __importStar(__nccwpck_require__(8125));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 531:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 4498:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCmdPath = exports.tryGetExecutablePath = exports.isRooted = exports.isDirectory = exports.exists = exports.IS_WINDOWS = exports.unlink = exports.symlink = exports.stat = exports.rmdir = exports.rename = exports.readlink = exports.readdir = exports.mkdir = exports.lstat = exports.copyFile = exports.chmod = void 0;
const fs = __importStar(__nccwpck_require__(7147));
const path = __importStar(__nccwpck_require__(1017));
_a = fs.promises, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
exports.IS_WINDOWS = process.platform === 'win32';
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}
// Get the path of cmd.exe in windows
function getCmdPath() {
    var _a;
    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
}
exports.getCmdPath = getCmdPath;
//# sourceMappingURL=io-util.js.map

/***/ }),

/***/ 157:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findInPath = exports.which = exports.mkdirP = exports.rmRF = exports.mv = exports.cp = void 0;
const assert_1 = __nccwpck_require__(9491);
const childProcess = __importStar(__nccwpck_require__(2081));
const path = __importStar(__nccwpck_require__(1017));
const util_1 = __nccwpck_require__(3837);
const ioUtil = __importStar(__nccwpck_require__(4498));
const exec = util_1.promisify(childProcess.exec);
const execFile = util_1.promisify(childProcess.execFile);
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Node doesn't provide a delete operation, only an unlink function. This means that if the file is being used by another
            // program (e.g. antivirus), it won't be deleted. To address this, we shell out the work to rd/del.
            // Check for invalid characters
            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
            if (/[*"<>|]/.test(inputPath)) {
                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
            }
            try {
                const cmdPath = ioUtil.getCmdPath();
                if (yield ioUtil.isDirectory(inputPath, true)) {
                    yield exec(`${cmdPath} /s /c "rd /s /q "%inputPath%""`, {
                        env: { inputPath }
                    });
                }
                else {
                    yield exec(`${cmdPath} /s /c "del /f /a "%inputPath%""`, {
                        env: { inputPath }
                    });
                }
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
            // Shelling out fails to remove a symlink folder with missing source, this unlink catches that
            try {
                yield ioUtil.unlink(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
        }
        else {
            let isDir = false;
            try {
                isDir = yield ioUtil.isDirectory(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
                return;
            }
            if (isDir) {
                yield execFile(`rm`, [`-rf`, `${inputPath}`]);
            }
            else {
                yield ioUtil.unlink(inputPath);
            }
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, 'a path argument must be provided');
        yield ioUtil.mkdir(fsPath, { recursive: true });
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
            return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
            return matches[0];
        }
        return '';
    });
}
exports.which = which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */
function findInPath(tool) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // build the list of extensions to try
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
                if (extension) {
                    extensions.push(extension);
                }
            }
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if (ioUtil.isRooted(tool)) {
            const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) {
                return [filePath];
            }
            return [];
        }
        // if any path separators, return empty
        if (tool.includes(path.sep)) {
            return [];
        }
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split(path.delimiter)) {
                if (p) {
                    directories.push(p);
                }
            }
        }
        // find all matches
        const matches = [];
        for (const directory of directories) {
            const filePath = yield ioUtil.tryGetExecutablePath(path.join(directory, tool), extensions);
            if (filePath) {
                matches.push(filePath);
            }
        }
        return matches;
    });
}
exports.findInPath = findInPath;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    const copySourceDirectory = options.copySourceDirectory == null
        ? true
        : Boolean(options.copySourceDirectory);
    return { force, recursive, copySourceDirectory };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map

/***/ }),

/***/ 9331:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    if(a===b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 4592:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var balanced = __nccwpck_require__(9331);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m) return [str];

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  if (/\$$/.test(m.pre)) {    
    for (var k = 0; k < post.length; k++) {
      var expansion = pre+ '{' + m.body + '}' + post[k];
      expansions.push(expansion);
    }
  } else {
    var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    var isSequence = isNumericSequence || isAlphaSequence;
    var isOptions = m.body.indexOf(',') >= 0;
    if (!isSequence && !isOptions) {
      // {a},b}
      if (m.post.match(/,.*\}/)) {
        str = m.pre + '{' + m.body + escClose + m.post;
        return expand(str);
      }
      return [str];
    }

    var n;
    if (isSequence) {
      n = m.body.split(/\.\./);
    } else {
      n = parseCommaParts(m.body);
      if (n.length === 1) {
        // x{{a,b}}y ==> x{a}y x{b}y
        n = expand(n[0], false).map(embrace);
        if (n.length === 1) {
          return post.map(function(p) {
            return m.pre + n[0] + p;
          });
        }
      }
    }

    // at this point, n is the parts, and we know it's not a comma set
    // with a single entry.
    var N;

    if (isSequence) {
      var x = numeric(n[0]);
      var y = numeric(n[1]);
      var width = Math.max(n[0].length, n[1].length)
      var incr = n.length == 3
        ? Math.abs(numeric(n[2]))
        : 1;
      var test = lte;
      var reverse = y < x;
      if (reverse) {
        incr *= -1;
        test = gte;
      }
      var pad = n.some(isPadded);

      N = [];

      for (var i = x; test(i, y); i += incr) {
        var c;
        if (isAlphaSequence) {
          c = String.fromCharCode(i);
          if (c === '\\')
            c = '';
        } else {
          c = String(i);
          if (pad) {
            var need = width - c.length;
            if (need > 0) {
              var z = new Array(need + 1).join('0');
              if (i < 0)
                c = '-' + z + c.slice(1);
              else
                c = z + c;
            }
          }
        }
        N.push(c);
      }
    } else {
      N = [];

      for (var j = 0; j < n.length; j++) {
        N.push.apply(N, expand(n[j], false));
      }
    }

    for (var j = 0; j < N.length; j++) {
      for (var k = 0; k < post.length; k++) {
        var expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion)
          expansions.push(expansion);
      }
    }
  }

  return expansions;
}



/***/ }),

/***/ 9014:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __nccwpck_require__(7147)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __nccwpck_require__(9710)

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),

/***/ 9710:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __nccwpck_require__(1017);
var isWindows = process.platform === 'win32';
var fs = __nccwpck_require__(7147);

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),

/***/ 1640:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var fs = __nccwpck_require__(7147)
var path = __nccwpck_require__(1017)
var minimatch = __nccwpck_require__(3)
var isAbsolute = (__nccwpck_require__(1017).isAbsolute)
var Minimatch = minimatch.Minimatch

function alphasort (a, b) {
  return a.localeCompare(b, 'en')
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute
  self.fs = options.fs || fs

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = path.resolve(cwd)
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  self.nomount = !!options.nomount

  if (process.platform === "win32") {
    self.root = self.root.replace(/\\/g, "/")
    self.cwd = self.cwd.replace(/\\/g, "/")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  }

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true
  // always treat \ in patterns as escapes, not path separators
  options.allowWindowsEscape = true

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),

/***/ 6760:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var rp = __nccwpck_require__(9014)
var minimatch = __nccwpck_require__(3)
var Minimatch = minimatch.Minimatch
var inherits = __nccwpck_require__(8520)
var EE = (__nccwpck_require__(2361).EventEmitter)
var path = __nccwpck_require__(1017)
var assert = __nccwpck_require__(9491)
var isAbsolute = (__nccwpck_require__(1017).isAbsolute)
var globSync = __nccwpck_require__(8887)
var common = __nccwpck_require__(1640)
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __nccwpck_require__(8738)
var util = __nccwpck_require__(3837)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __nccwpck_require__(6210)

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) ||
      isAbsolute(pattern.map(function (p) {
        return typeof p === 'string' ? p : '[*]'
      }).join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    self.fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  self.fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    self.fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return self.fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),

/***/ 8887:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = globSync
globSync.GlobSync = GlobSync

var rp = __nccwpck_require__(9014)
var minimatch = __nccwpck_require__(3)
var Minimatch = minimatch.Minimatch
var Glob = (__nccwpck_require__(6760).Glob)
var util = __nccwpck_require__(3837)
var path = __nccwpck_require__(1017)
var assert = __nccwpck_require__(9491)
var isAbsolute = (__nccwpck_require__(1017).isAbsolute)
var common = __nccwpck_require__(1640)
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert.ok(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert.ok(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) ||
      isAbsolute(pattern.map(function (p) {
        return typeof p === 'string' ? p : '[*]'
      }).join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = this.fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, this.fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = this.fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = this.fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),

/***/ 8738:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(262)
var reqs = Object.create(null)
var once = __nccwpck_require__(6210)

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),

/***/ 8520:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

try {
  var util = __nccwpck_require__(3837);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __nccwpck_require__(7415);
}


/***/ }),

/***/ 7415:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 4467:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


// A linked list to keep track of recently-used-ness
const Yallist = __nccwpck_require__(4851)

const MAX = Symbol('max')
const LENGTH = Symbol('length')
const LENGTH_CALCULATOR = Symbol('lengthCalculator')
const ALLOW_STALE = Symbol('allowStale')
const MAX_AGE = Symbol('maxAge')
const DISPOSE = Symbol('dispose')
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet')
const LRU_LIST = Symbol('lruList')
const CACHE = Symbol('cache')
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet')

const naiveLength = () => 1

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options }

    if (!options)
      options = {}

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))
    }

    this[CACHE] = new Map() // hash of items by key
    this[LRU_LIST] = new Yallist() // list of items in order of use recency
    this[LENGTH] = 0 // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE]

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0
    const len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const node = this[CACHE].get(key)
      const item = node.value

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value)
      }

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail
    if (!node)
      return null

    del(this, node)
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key))
  }

  load (arr) {
    // reset the cache
    this.reset()

    const now = Date.now()
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l]
      const expiresAt = hit.e || 0
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge)
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (node) {
    const hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now()
        self[LRU_LIST].unshiftNode(node)
      }
    }
    return hit.value
  }
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
}

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

const del = (self, node) => {
  if (node) {
    const hit = node.value
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value)

    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE])
      hit = undefined
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache


/***/ }),

/***/ 1203:
/***/ ((module) => {

const isWindows = typeof process === 'object' &&
  process &&
  process.platform === 'win32'
module.exports = isWindows ? { sep: '\\' } : { sep: '/' }


/***/ }),

/***/ 3:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const minimatch = module.exports = (p, pattern, options = {}) => {
  assertValidPattern(pattern)

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  return new Minimatch(pattern, options).match(p)
}

module.exports = minimatch

const path = __nccwpck_require__(1203)
minimatch.sep = path.sep

const GLOBSTAR = Symbol('globstar **')
minimatch.GLOBSTAR = GLOBSTAR
const expand = __nccwpck_require__(4592)

const plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
const qmark = '[^/]'

// * => any number of characters
const star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
const twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
const twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// "abc" -> { a:true, b:true, c:true }
const charSet = s => s.split('').reduce((set, c) => {
  set[c] = true
  return set
}, {})

// characters that need to be escaped in RegExp.
const reSpecials = charSet('().*{}+?[]^$\\!')

// characters that indicate we have to add the pattern start
const addPatternStartSet = charSet('[.(')

// normalizes slashes.
const slashSplit = /\/+/

minimatch.filter = (pattern, options = {}) =>
  (p, i, list) => minimatch(p, pattern, options)

const ext = (a, b = {}) => {
  const t = {}
  Object.keys(a).forEach(k => t[k] = a[k])
  Object.keys(b).forEach(k => t[k] = b[k])
  return t
}

minimatch.defaults = def => {
  if (!def || typeof def !== 'object' || !Object.keys(def).length) {
    return minimatch
  }

  const orig = minimatch

  const m = (p, pattern, options) => orig(p, pattern, ext(def, options))
  m.Minimatch = class Minimatch extends orig.Minimatch {
    constructor (pattern, options) {
      super(pattern, ext(def, options))
    }
  }
  m.Minimatch.defaults = options => orig.defaults(ext(def, options)).Minimatch
  m.filter = (pattern, options) => orig.filter(pattern, ext(def, options))
  m.defaults = options => orig.defaults(ext(def, options))
  m.makeRe = (pattern, options) => orig.makeRe(pattern, ext(def, options))
  m.braceExpand = (pattern, options) => orig.braceExpand(pattern, ext(def, options))
  m.match = (list, pattern, options) => orig.match(list, pattern, ext(def, options))

  return m
}





// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = (pattern, options) => braceExpand(pattern, options)

const braceExpand = (pattern, options = {}) => {
  assertValidPattern(pattern)

  // Thanks to Yeting Li <https://github.com/yetingli> for
  // improving this regexp to avoid a ReDOS vulnerability.
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

const MAX_PATTERN_LENGTH = 1024 * 64
const assertValidPattern = pattern => {
  if (typeof pattern !== 'string') {
    throw new TypeError('invalid pattern')
  }

  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError('pattern is too long')
  }
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
const SUBPARSE = Symbol('subparse')

minimatch.makeRe = (pattern, options) =>
  new Minimatch(pattern, options || {}).makeRe()

minimatch.match = (list, pattern, options = {}) => {
  const mm = new Minimatch(pattern, options)
  list = list.filter(f => mm.match(f))
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

// replace stuff like \* with *
const globUnescape = s => s.replace(/\\(.)/g, '$1')
const regExpEscape = s => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

class Minimatch {
  constructor (pattern, options) {
    assertValidPattern(pattern)

    if (!options) options = {}

    this.options = options
    this.set = []
    this.pattern = pattern
    this.windowsPathsNoEscape = !!options.windowsPathsNoEscape ||
      options.allowWindowsEscape === false
    if (this.windowsPathsNoEscape) {
      this.pattern = this.pattern.replace(/\\/g, '/')
    }
    this.regexp = null
    this.negate = false
    this.comment = false
    this.empty = false
    this.partial = !!options.partial

    // make the set of regexps etc.
    this.make()
  }

  debug () {}

  make () {
    const pattern = this.pattern
    const options = this.options

    // empty patterns and comments match nothing.
    if (!options.nocomment && pattern.charAt(0) === '#') {
      this.comment = true
      return
    }
    if (!pattern) {
      this.empty = true
      return
    }

    // step 1: figure out negation, etc.
    this.parseNegate()

    // step 2: expand braces
    let set = this.globSet = this.braceExpand()

    if (options.debug) this.debug = (...args) => console.error(...args)

    this.debug(this.pattern, set)

    // step 3: now we have a set, so turn each one into a series of path-portion
    // matching patterns.
    // These will be regexps, except in the case of "**", which is
    // set to the GLOBSTAR object for globstar behavior,
    // and will not contain any / characters
    set = this.globParts = set.map(s => s.split(slashSplit))

    this.debug(this.pattern, set)

    // glob --> regexps
    set = set.map((s, si, set) => s.map(this.parse, this))

    this.debug(this.pattern, set)

    // filter out everything that didn't compile properly.
    set = set.filter(s => s.indexOf(false) === -1)

    this.debug(this.pattern, set)

    this.set = set
  }

  parseNegate () {
    if (this.options.nonegate) return

    const pattern = this.pattern
    let negate = false
    let negateOffset = 0

    for (let i = 0; i < pattern.length && pattern.charAt(i) === '!'; i++) {
      negate = !negate
      negateOffset++
    }

    if (negateOffset) this.pattern = pattern.substr(negateOffset)
    this.negate = negate
  }

  // set partial to true to test if, for example,
  // "/a/b" matches the start of "/*/b/*/d"
  // Partial means, if you run out of file before you run
  // out of pattern, then that's fine, as long as all
  // the parts match.
  matchOne (file, pattern, partial) {
    var options = this.options

    this.debug('matchOne',
      { 'this': this, file: file, pattern: pattern })

    this.debug('matchOne', file.length, pattern.length)

    for (var fi = 0,
        pi = 0,
        fl = file.length,
        pl = pattern.length
        ; (fi < fl) && (pi < pl)
        ; fi++, pi++) {
      this.debug('matchOne loop')
      var p = pattern[pi]
      var f = file[fi]

      this.debug(pattern, p, f)

      // should be impossible.
      // some invalid regexp stuff in the set.
      /* istanbul ignore if */
      if (p === false) return false

      if (p === GLOBSTAR) {
        this.debug('GLOBSTAR', [pattern, p, f])

        // "**"
        // a/**/b/**/c would match the following:
        // a/b/x/y/z/c
        // a/x/y/z/b/c
        // a/b/x/b/x/c
        // a/b/c
        // To do this, take the rest of the pattern after
        // the **, and see if it would match the file remainder.
        // If so, return success.
        // If not, the ** "swallows" a segment, and try again.
        // This is recursively awful.
        //
        // a/**/b/**/c matching a/b/x/y/z/c
        // - a matches a
        // - doublestar
        //   - matchOne(b/x/y/z/c, b/**/c)
        //     - b matches b
        //     - doublestar
        //       - matchOne(x/y/z/c, c) -> no
        //       - matchOne(y/z/c, c) -> no
        //       - matchOne(z/c, c) -> no
        //       - matchOne(c, c) yes, hit
        var fr = fi
        var pr = pi + 1
        if (pr === pl) {
          this.debug('** at the end')
          // a ** at the end will just swallow the rest.
          // We have found a match.
          // however, it will not swallow /.x, unless
          // options.dot is set.
          // . and .. are *never* matched by **, for explosively
          // exponential reasons.
          for (; fi < fl; fi++) {
            if (file[fi] === '.' || file[fi] === '..' ||
              (!options.dot && file[fi].charAt(0) === '.')) return false
          }
          return true
        }

        // ok, let's see if we can swallow whatever we can.
        while (fr < fl) {
          var swallowee = file[fr]

          this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

          // XXX remove this slice.  Just pass the start index.
          if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
            this.debug('globstar found match!', fr, fl, swallowee)
            // found a match.
            return true
          } else {
            // can't swallow "." or ".." ever.
            // can only swallow ".foo" when explicitly asked.
            if (swallowee === '.' || swallowee === '..' ||
              (!options.dot && swallowee.charAt(0) === '.')) {
              this.debug('dot detected!', file, fr, pattern, pr)
              break
            }

            // ** swallows a segment, and continue.
            this.debug('globstar swallow a segment, and continue')
            fr++
          }
        }

        // no match was found.
        // However, in partial mode, we can't say this is necessarily over.
        // If there's more *pattern* left, then
        /* istanbul ignore if */
        if (partial) {
          // ran out of file
          this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
          if (fr === fl) return true
        }
        return false
      }

      // something other than **
      // non-magic patterns just have to match exactly
      // patterns with magic have been turned into regexps.
      var hit
      if (typeof p === 'string') {
        hit = f === p
        this.debug('string match', p, f, hit)
      } else {
        hit = f.match(p)
        this.debug('pattern match', p, f, hit)
      }

      if (!hit) return false
    }

    // Note: ending in / means that we'll get a final ""
    // at the end of the pattern.  This can only match a
    // corresponding "" at the end of the file.
    // If the file ends in /, then it can only match a
    // a pattern that ends in /, unless the pattern just
    // doesn't have any more for it. But, a/b/ should *not*
    // match "a/b/*", even though "" matches against the
    // [^/]*? pattern, except in partial mode, where it might
    // simply not be reached yet.
    // However, a/b/ should still satisfy a/*

    // now either we fell off the end of the pattern, or we're done.
    if (fi === fl && pi === pl) {
      // ran out of pattern and filename at the same time.
      // an exact hit!
      return true
    } else if (fi === fl) {
      // ran out of file, but still had pattern left.
      // this is ok if we're doing the match as part of
      // a glob fs traversal.
      return partial
    } else /* istanbul ignore else */ if (pi === pl) {
      // ran out of pattern, still have file left.
      // this is only acceptable if we're on the very last
      // empty segment of a file with a trailing slash.
      // a/* should match a/b/
      return (fi === fl - 1) && (file[fi] === '')
    }

    // should be unreachable.
    /* istanbul ignore next */
    throw new Error('wtf?')
  }

  braceExpand () {
    return braceExpand(this.pattern, this.options)
  }

  parse (pattern, isSub) {
    assertValidPattern(pattern)

    const options = this.options

    // shortcuts
    if (pattern === '**') {
      if (!options.noglobstar)
        return GLOBSTAR
      else
        pattern = '*'
    }
    if (pattern === '') return ''

    let re = ''
    let hasMagic = !!options.nocase
    let escaping = false
    // ? => one single character
    const patternListStack = []
    const negativeLists = []
    let stateChar
    let inClass = false
    let reClassStart = -1
    let classStart = -1
    let cs
    let pl
    let sp
    // . and .. never match anything that doesn't start with .,
    // even when options.dot is set.
    const patternStart = pattern.charAt(0) === '.' ? '' // anything
    // not (start or / followed by . or .. followed by / or end)
    : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
    : '(?!\\.)'

    const clearStateChar = () => {
      if (stateChar) {
        // we had some state-tracking character
        // that wasn't consumed by this pass.
        switch (stateChar) {
          case '*':
            re += star
            hasMagic = true
          break
          case '?':
            re += qmark
            hasMagic = true
          break
          default:
            re += '\\' + stateChar
          break
        }
        this.debug('clearStateChar %j %j', stateChar, re)
        stateChar = false
      }
    }

    for (let i = 0, c; (i < pattern.length) && (c = pattern.charAt(i)); i++) {
      this.debug('%s\t%s %s %j', pattern, i, re, c)

      // skip over any that are escaped.
      if (escaping) {
        /* istanbul ignore next - completely not allowed, even escaped. */
        if (c === '/') {
          return false
        }

        if (reSpecials[c]) {
          re += '\\'
        }
        re += c
        escaping = false
        continue
      }

      switch (c) {
        /* istanbul ignore next */
        case '/': {
          // Should already be path-split by now.
          return false
        }

        case '\\':
          clearStateChar()
          escaping = true
        continue

        // the various stateChar values
        // for the "extglob" stuff.
        case '?':
        case '*':
        case '+':
        case '@':
        case '!':
          this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

          // all of those are literals inside a class, except that
          // the glob [!a] means [^a] in regexp
          if (inClass) {
            this.debug('  in class')
            if (c === '!' && i === classStart + 1) c = '^'
            re += c
            continue
          }

          // if we already have a stateChar, then it means
          // that there was something like ** or +? in there.
          // Handle the stateChar, then proceed with this one.
          this.debug('call clearStateChar %j', stateChar)
          clearStateChar()
          stateChar = c
          // if extglob is disabled, then +(asdf|foo) isn't a thing.
          // just clear the statechar *now*, rather than even diving into
          // the patternList stuff.
          if (options.noext) clearStateChar()
        continue

        case '(':
          if (inClass) {
            re += '('
            continue
          }

          if (!stateChar) {
            re += '\\('
            continue
          }

          patternListStack.push({
            type: stateChar,
            start: i - 1,
            reStart: re.length,
            open: plTypes[stateChar].open,
            close: plTypes[stateChar].close
          })
          // negation is (?:(?!js)[^/]*)
          re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
          this.debug('plType %j %j', stateChar, re)
          stateChar = false
        continue

        case ')':
          if (inClass || !patternListStack.length) {
            re += '\\)'
            continue
          }

          clearStateChar()
          hasMagic = true
          pl = patternListStack.pop()
          // negation is (?:(?!js)[^/]*)
          // The others are (?:<pattern>)<type>
          re += pl.close
          if (pl.type === '!') {
            negativeLists.push(pl)
          }
          pl.reEnd = re.length
        continue

        case '|':
          if (inClass || !patternListStack.length) {
            re += '\\|'
            continue
          }

          clearStateChar()
          re += '|'
        continue

        // these are mostly the same in regexp and glob
        case '[':
          // swallow any state-tracking char before the [
          clearStateChar()

          if (inClass) {
            re += '\\' + c
            continue
          }

          inClass = true
          classStart = i
          reClassStart = re.length
          re += c
        continue

        case ']':
          //  a right bracket shall lose its special
          //  meaning and represent itself in
          //  a bracket expression if it occurs
          //  first in the list.  -- POSIX.2 2.8.3.2
          if (i === classStart + 1 || !inClass) {
            re += '\\' + c
            continue
          }

          // handle the case where we left a class open.
          // "[z-a]" is valid, equivalent to "\[z-a\]"
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }

          // finish up the class.
          hasMagic = true
          inClass = false
          re += c
        continue

        default:
          // swallow any state char that wasn't consumed
          clearStateChar()

          if (reSpecials[c] && !(c === '^' && inClass)) {
            re += '\\'
          }

          re += c
          break

      } // switch
    } // for

    // handle the case where we left a class open.
    // "[abc" is valid, equivalent to "\[abc"
    if (inClass) {
      // split where the last [ was, and escape it
      // this is a huge pita.  We now have to re-walk
      // the contents of the would-be class to re-translate
      // any characters that were passed through as-is
      cs = pattern.substr(classStart + 1)
      sp = this.parse(cs, SUBPARSE)
      re = re.substr(0, reClassStart) + '\\[' + sp[0]
      hasMagic = hasMagic || sp[1]
    }

    // handle the case where we had a +( thing at the *end*
    // of the pattern.
    // each pattern list stack adds 3 chars, and we need to go through
    // and escape any | chars that were passed through as-is for the regexp.
    // Go through and escape them, taking care not to double-escape any
    // | chars that were already escaped.
    for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
      let tail
      tail = re.slice(pl.reStart + pl.open.length)
      this.debug('setting tail', re, pl)
      // maybe some even number of \, then maybe 1 \, followed by a |
      tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, (_, $1, $2) => {
        /* istanbul ignore else - should already be done */
        if (!$2) {
          // the | isn't already escaped, so escape it.
          $2 = '\\'
        }

        // need to escape all those slashes *again*, without escaping the
        // one that we need for escaping the | character.  As it works out,
        // escaping an even number of slashes can be done by simply repeating
        // it exactly after itself.  That's why this trick works.
        //
        // I am sorry that you have to see this.
        return $1 + $1 + $2 + '|'
      })

      this.debug('tail=%j\n   %s', tail, tail, pl, re)
      const t = pl.type === '*' ? star
        : pl.type === '?' ? qmark
        : '\\' + pl.type

      hasMagic = true
      re = re.slice(0, pl.reStart) + t + '\\(' + tail
    }

    // handle trailing things that only matter at the very end.
    clearStateChar()
    if (escaping) {
      // trailing \\
      re += '\\\\'
    }

    // only need to apply the nodot start if the re starts with
    // something that could conceivably capture a dot
    const addPatternStart = addPatternStartSet[re.charAt(0)]

    // Hack to work around lack of negative lookbehind in JS
    // A pattern like: *.!(x).!(y|z) needs to ensure that a name
    // like 'a.xyz.yz' doesn't match.  So, the first negative
    // lookahead, has to look ALL the way ahead, to the end of
    // the pattern.
    for (let n = negativeLists.length - 1; n > -1; n--) {
      const nl = negativeLists[n]

      const nlBefore = re.slice(0, nl.reStart)
      const nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
      let nlAfter = re.slice(nl.reEnd)
      const nlLast = re.slice(nl.reEnd - 8, nl.reEnd) + nlAfter

      // Handle nested stuff like *(*.js|!(*.json)), where open parens
      // mean that we should *not* include the ) in the bit that is considered
      // "after" the negated section.
      const openParensBefore = nlBefore.split('(').length - 1
      let cleanAfter = nlAfter
      for (let i = 0; i < openParensBefore; i++) {
        cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
      }
      nlAfter = cleanAfter

      const dollar = nlAfter === '' && isSub !== SUBPARSE ? '$' : ''
      re = nlBefore + nlFirst + nlAfter + dollar + nlLast
    }

    // if the re is not "" at this point, then we need to make sure
    // it doesn't match against an empty path part.
    // Otherwise a/* will match a/, which it should not.
    if (re !== '' && hasMagic) {
      re = '(?=.)' + re
    }

    if (addPatternStart) {
      re = patternStart + re
    }

    // parsing just a piece of a larger pattern.
    if (isSub === SUBPARSE) {
      return [re, hasMagic]
    }

    // skip the regexp for non-magical patterns
    // unescape anything in it, though, so that it'll be
    // an exact match against a file etc.
    if (!hasMagic) {
      return globUnescape(pattern)
    }

    const flags = options.nocase ? 'i' : ''
    try {
      return Object.assign(new RegExp('^' + re + '$', flags), {
        _glob: pattern,
        _src: re,
      })
    } catch (er) /* istanbul ignore next - should be impossible */ {
      // If it was an invalid regular expression, then it can't match
      // anything.  This trick looks for a character after the end of
      // the string, which is of course impossible, except in multi-line
      // mode, but it's not a /m regex.
      return new RegExp('$.')
    }
  }

  makeRe () {
    if (this.regexp || this.regexp === false) return this.regexp

    // at this point, this.set is a 2d array of partial
    // pattern strings, or "**".
    //
    // It's better to use .match().  This function shouldn't
    // be used, really, but it's pretty convenient sometimes,
    // when you just want to work with a regex.
    const set = this.set

    if (!set.length) {
      this.regexp = false
      return this.regexp
    }
    const options = this.options

    const twoStar = options.noglobstar ? star
      : options.dot ? twoStarDot
      : twoStarNoDot
    const flags = options.nocase ? 'i' : ''

    // coalesce globstars and regexpify non-globstar patterns
    // if it's the only item, then we just do one twoStar
    // if it's the first, and there are more, prepend (\/|twoStar\/)? to next
    // if it's the last, append (\/twoStar|) to previous
    // if it's in the middle, append (\/|\/twoStar\/) to previous
    // then filter out GLOBSTAR symbols
    let re = set.map(pattern => {
      pattern = pattern.map(p =>
        typeof p === 'string' ? regExpEscape(p)
        : p === GLOBSTAR ? GLOBSTAR
        : p._src
      ).reduce((set, p) => {
        if (!(set[set.length - 1] === GLOBSTAR && p === GLOBSTAR)) {
          set.push(p)
        }
        return set
      }, [])
      pattern.forEach((p, i) => {
        if (p !== GLOBSTAR || pattern[i-1] === GLOBSTAR) {
          return
        }
        if (i === 0) {
          if (pattern.length > 1) {
            pattern[i+1] = '(?:\\\/|' + twoStar + '\\\/)?' + pattern[i+1]
          } else {
            pattern[i] = twoStar
          }
        } else if (i === pattern.length - 1) {
          pattern[i-1] += '(?:\\\/|' + twoStar + ')?'
        } else {
          pattern[i-1] += '(?:\\\/|\\\/' + twoStar + '\\\/)' + pattern[i+1]
          pattern[i+1] = GLOBSTAR
        }
      })
      return pattern.filter(p => p !== GLOBSTAR).join('/')
    }).join('|')

    // must match entire pattern
    // ending in a * or ** will make it less strict.
    re = '^(?:' + re + ')$'

    // can match anything, as long as it's not this.
    if (this.negate) re = '^(?!' + re + ').*$'

    try {
      this.regexp = new RegExp(re, flags)
    } catch (ex) /* istanbul ignore next - should be impossible */ {
      this.regexp = false
    }
    return this.regexp
  }

  match (f, partial = this.partial) {
    this.debug('match', f, this.pattern)
    // short-circuit in the case of busted things.
    // comments, etc.
    if (this.comment) return false
    if (this.empty) return f === ''

    if (f === '/' && partial) return true

    const options = this.options

    // windows: need to use /, not \
    if (path.sep !== '/') {
      f = f.split(path.sep).join('/')
    }

    // treat the test path as a set of pathparts.
    f = f.split(slashSplit)
    this.debug(this.pattern, 'split', f)

    // just ONE of the pattern sets in this.set needs to match
    // in order for it to be valid.  If negating, then just one
    // match means that we have failed.
    // Either way, return on the first hit.

    const set = this.set
    this.debug(this.pattern, 'set', set)

    // Find the basename of the path by looking for the last non-empty segment
    let filename
    for (let i = f.length - 1; i >= 0; i--) {
      filename = f[i]
      if (filename) break
    }

    for (let i = 0; i < set.length; i++) {
      const pattern = set[i]
      let file = f
      if (options.matchBase && pattern.length === 1) {
        file = [filename]
      }
      const hit = this.matchOne(file, pattern, partial)
      if (hit) {
        if (options.flipNegate) return true
        return !this.negate
      }
    }

    // didn't get any hits.  this is success if it's a negative
    // pattern, failure otherwise.
    if (options.flipNegate) return false
    return this.negate
  }

  static defaults (def) {
    return minimatch.defaults(def).Minimatch
  }
}

minimatch.Minimatch = Minimatch


/***/ }),

/***/ 6210:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(262)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 8337:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false,
      }
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    const sameDirectionIncreasing =
      (this.operator === '>=' || this.operator === '>') &&
      (comp.operator === '>=' || comp.operator === '>')
    const sameDirectionDecreasing =
      (this.operator === '<=' || this.operator === '<') &&
      (comp.operator === '<=' || comp.operator === '<')
    const sameSemVer = this.semver.version === comp.semver.version
    const differentDirectionsInclusive =
      (this.operator === '>=' || this.operator === '<=') &&
      (comp.operator === '>=' || comp.operator === '<=')
    const oppositeDirectionsLessThan =
      cmp(this.semver, '<', comp.semver, options) &&
      (this.operator === '>=' || this.operator === '>') &&
        (comp.operator === '<=' || comp.operator === '<')
    const oppositeDirectionsGreaterThan =
      cmp(this.semver, '>', comp.semver, options) &&
      (this.operator === '<=' || this.operator === '<') &&
        (comp.operator === '>=' || comp.operator === '>')

    return (
      sameDirectionIncreasing ||
      sameDirectionDecreasing ||
      (sameSemVer && differentDirectionsInclusive) ||
      oppositeDirectionsLessThan ||
      oppositeDirectionsGreaterThan
    )
  }
}

module.exports = Comparator

const parseOptions = __nccwpck_require__(2177)
const { re, t } = __nccwpck_require__(1547)
const cmp = __nccwpck_require__(6184)
const debug = __nccwpck_require__(4959)
const SemVer = __nccwpck_require__(8650)
const Range = __nccwpck_require__(4043)


/***/ }),

/***/ 4043:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions(options)

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.format()
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First, split based on boolean or ||
    this.raw = range
    this.set = range
      .split('||')
      // map the range to a 2d array of comparators
      .map(r => this.parseRange(r.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${range}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0]
      this.set = this.set.filter(c => !isNullSet(c[0]))
      if (this.set.length === 0) {
        this.set = [first]
      } else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c]
            break
          }
        }
      }
    }

    this.format()
  }

  format () {
    this.range = this.set
      .map((comps) => {
        return comps.join(' ').trim()
      })
      .join('||')
      .trim()
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    range = range.trim()

    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts = Object.keys(this.options).join(',')
    const memoKey = `parseRange:${memoOpts}:${range}`
    const cached = cache.get(memoKey)
    if (cached) {
      return cached
    }

    const loose = this.options.loose
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range)

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)

    // normalize spaces
    range = range.split(/\s+/).join(' ')

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    let rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))

    if (loose) {
      // in loose mode, throw out any that are not valid comparators
      rangeList = rangeList.filter(comp => {
        debug('loose invalid filter', comp, this.options)
        return !!comp.match(re[t.COMPARATORLOOSE])
      })
    }
    debug('range list', rangeList)

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const rangeMap = new Map()
    const comparators = rangeList.map(comp => new Comparator(comp, this.options))
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp]
      }
      rangeMap.set(comp.value, comp)
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
      rangeMap.delete('')
    }

    const result = [...rangeMap.values()]
    cache.set(memoKey, result)
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}
module.exports = Range

const LRU = __nccwpck_require__(4467)
const cache = new LRU({ max: 1000 })

const parseOptions = __nccwpck_require__(2177)
const Comparator = __nccwpck_require__(8337)
const debug = __nccwpck_require__(4959)
const SemVer = __nccwpck_require__(8650)
const {
  re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace,
} = __nccwpck_require__(1547)

const isNullSet = c => c.value === '<0.0.0-0'
const isAny = c => c.value === ''

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
const replaceTildes = (comp, options) =>
  comp.trim().split(/\s+/).map((c) => {
    return replaceTilde(c, options)
  }).join(' ')

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
const replaceCarets = (comp, options) =>
  comp.trim().split(/\s+/).map((c) => {
    return replaceCaret(c, options)
  }).join(' ')

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map((c) => {
    return replaceXRange(c, options)
  }).join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<') {
        pr = '-0'
      }

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp.trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return (`${from} ${to}`).trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}


/***/ }),

/***/ 8650:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const debug = __nccwpck_require__(4959)
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __nccwpck_require__(6387)
const { re, t } = __nccwpck_require__(1547)

const parseOptions = __nccwpck_require__(2177)
const { compareIdentifiers } = __nccwpck_require__(8152)
class SemVer {
  constructor (version, options) {
    options = parseOptions(options)

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier)
        this.inc('pre', identifier)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier)
        }
        this.inc('pre', identifier)
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre':
        if (this.prerelease.length === 0) {
          this.prerelease = [0]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            this.prerelease.push(0)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0]
            }
          } else {
            this.prerelease = [identifier, 0]
          }
        }
        break

      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.format()
    this.raw = this.version
    return this
  }
}

module.exports = SemVer


/***/ }),

/***/ 8958:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(6022)
const clean = (version, options) => {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}
module.exports = clean


/***/ }),

/***/ 6184:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const eq = __nccwpck_require__(9362)
const neq = __nccwpck_require__(4261)
const gt = __nccwpck_require__(9658)
const gte = __nccwpck_require__(5054)
const lt = __nccwpck_require__(5106)
const lte = __nccwpck_require__(649)

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a === b

    case '!==':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp


/***/ }),

/***/ 830:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8650)
const parse = __nccwpck_require__(6022)
const { re, t } = __nccwpck_require__(1547)

const coerce = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  let match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next
    while ((next = re[t.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
}
module.exports = coerce


/***/ }),

/***/ 1559:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8650)
const compareBuild = (a, b, loose) => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
module.exports = compareBuild


/***/ }),

/***/ 4304:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(1935)
const compareLoose = (a, b) => compare(a, b, true)
module.exports = compareLoose


/***/ }),

/***/ 1935:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8650)
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),

/***/ 4942:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(6022)
const eq = __nccwpck_require__(9362)

const diff = (version1, version2) => {
  if (eq(version1, version2)) {
    return null
  } else {
    const v1 = parse(version1)
    const v2 = parse(version2)
    const hasPre = v1.prerelease.length || v2.prerelease.length
    const prefix = hasPre ? 'pre' : ''
    const defaultResult = hasPre ? 'prerelease' : ''
    for (const key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}
module.exports = diff


/***/ }),

/***/ 9362:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(1935)
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq


/***/ }),

/***/ 9658:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(1935)
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt


/***/ }),

/***/ 5054:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(1935)
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte


/***/ }),

/***/ 8062:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8650)

const inc = (version, release, options, identifier) => {
  if (typeof (options) === 'string') {
    identifier = options
    options = undefined
  }

  try {
    return new SemVer(
      version instanceof SemVer ? version.version : version,
      options
    ).inc(release, identifier).version
  } catch (er) {
    return null
  }
}
module.exports = inc


/***/ }),

/***/ 5106:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(1935)
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt


/***/ }),

/***/ 649:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(1935)
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte


/***/ }),

/***/ 6477:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8650)
const major = (a, loose) => new SemVer(a, loose).major
module.exports = major


/***/ }),

/***/ 7973:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8650)
const minor = (a, loose) => new SemVer(a, loose).minor
module.exports = minor


/***/ }),

/***/ 4261:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(1935)
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq


/***/ }),

/***/ 6022:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { MAX_LENGTH } = __nccwpck_require__(6387)
const { re, t } = __nccwpck_require__(1547)
const SemVer = __nccwpck_require__(8650)

const parseOptions = __nccwpck_require__(2177)
const parse = (version, options) => {
  options = parseOptions(options)

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  const r = options.loose ? re[t.LOOSE] : re[t.FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

module.exports = parse


/***/ }),

/***/ 1092:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8650)
const patch = (a, loose) => new SemVer(a, loose).patch
module.exports = patch


/***/ }),

/***/ 654:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(6022)
const prerelease = (version, options) => {
  const parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}
module.exports = prerelease


/***/ }),

/***/ 2653:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(1935)
const rcompare = (a, b, loose) => compare(b, a, loose)
module.exports = rcompare


/***/ }),

/***/ 4366:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compareBuild = __nccwpck_require__(1559)
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
module.exports = rsort


/***/ }),

/***/ 4250:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(4043)
const satisfies = (version, range, options) => {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}
module.exports = satisfies


/***/ }),

/***/ 8430:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compareBuild = __nccwpck_require__(1559)
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
module.exports = sort


/***/ }),

/***/ 4210:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(6022)
const valid = (version, options) => {
  const v = parse(version, options)
  return v ? v.version : null
}
module.exports = valid


/***/ }),

/***/ 1256:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// just pre-load all the stuff that index.js lazily exports
const internalRe = __nccwpck_require__(1547)
module.exports = {
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: (__nccwpck_require__(6387).SEMVER_SPEC_VERSION),
  SemVer: __nccwpck_require__(8650),
  compareIdentifiers: (__nccwpck_require__(8152).compareIdentifiers),
  rcompareIdentifiers: (__nccwpck_require__(8152).rcompareIdentifiers),
  parse: __nccwpck_require__(6022),
  valid: __nccwpck_require__(4210),
  clean: __nccwpck_require__(8958),
  inc: __nccwpck_require__(8062),
  diff: __nccwpck_require__(4942),
  major: __nccwpck_require__(6477),
  minor: __nccwpck_require__(7973),
  patch: __nccwpck_require__(1092),
  prerelease: __nccwpck_require__(654),
  compare: __nccwpck_require__(1935),
  rcompare: __nccwpck_require__(2653),
  compareLoose: __nccwpck_require__(4304),
  compareBuild: __nccwpck_require__(1559),
  sort: __nccwpck_require__(8430),
  rsort: __nccwpck_require__(4366),
  gt: __nccwpck_require__(9658),
  lt: __nccwpck_require__(5106),
  eq: __nccwpck_require__(9362),
  neq: __nccwpck_require__(4261),
  gte: __nccwpck_require__(5054),
  lte: __nccwpck_require__(649),
  cmp: __nccwpck_require__(6184),
  coerce: __nccwpck_require__(830),
  Comparator: __nccwpck_require__(8337),
  Range: __nccwpck_require__(4043),
  satisfies: __nccwpck_require__(4250),
  toComparators: __nccwpck_require__(3782),
  maxSatisfying: __nccwpck_require__(455),
  minSatisfying: __nccwpck_require__(9831),
  minVersion: __nccwpck_require__(273),
  validRange: __nccwpck_require__(4838),
  outside: __nccwpck_require__(3362),
  gtr: __nccwpck_require__(9914),
  ltr: __nccwpck_require__(6903),
  intersects: __nccwpck_require__(7658),
  simplifyRange: __nccwpck_require__(936),
  subset: __nccwpck_require__(473),
}


/***/ }),

/***/ 6387:
/***/ ((module) => {

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

module.exports = {
  SEMVER_SPEC_VERSION,
  MAX_LENGTH,
  MAX_SAFE_INTEGER,
  MAX_SAFE_COMPONENT_LENGTH,
}


/***/ }),

/***/ 4959:
/***/ ((module) => {

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug


/***/ }),

/***/ 8152:
/***/ ((module) => {

const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers,
}


/***/ }),

/***/ 2177:
/***/ ((module) => {

// parse out just the options we care about so we always get a consistent
// obj with keys in a consistent order.
const opts = ['includePrerelease', 'loose', 'rtl']
const parseOptions = options =>
  !options ? {}
  : typeof options !== 'object' ? { loose: true }
  : opts.filter(k => options[k]).reduce((o, k) => {
    o[k] = true
    return o
  }, {})
module.exports = parseOptions


/***/ }),

/***/ 1547:
/***/ ((module, exports, __nccwpck_require__) => {

const { MAX_SAFE_COMPONENT_LENGTH } = __nccwpck_require__(6387)
const debug = __nccwpck_require__(4959)
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const src = exports.src = []
const t = exports.t = {}
let R = 0

const createToken = (name, value, isGlobal) => {
  const index = R++
  debug(name, index, value)
  t[name] = index
  src[index] = value
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*')

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+')

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$')


/***/ }),

/***/ 9914:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Determine if version is greater than all the versions possible in the range.
const outside = __nccwpck_require__(3362)
const gtr = (version, range, options) => outside(version, range, '>', options)
module.exports = gtr


/***/ }),

/***/ 7658:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(4043)
const intersects = (r1, r2, options) => {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}
module.exports = intersects


/***/ }),

/***/ 6903:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const outside = __nccwpck_require__(3362)
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside(version, range, '<', options)
module.exports = ltr


/***/ }),

/***/ 455:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8650)
const Range = __nccwpck_require__(4043)

const maxSatisfying = (versions, range, options) => {
  let max = null
  let maxSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}
module.exports = maxSatisfying


/***/ }),

/***/ 9831:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8650)
const Range = __nccwpck_require__(4043)
const minSatisfying = (versions, range, options) => {
  let min = null
  let minSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}
module.exports = minSatisfying


/***/ }),

/***/ 273:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8650)
const Range = __nccwpck_require__(4043)
const gt = __nccwpck_require__(9658)

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let setMin = null
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt(compver, setMin)) {
            setMin = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    })
    if (setMin && (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}
module.exports = minVersion


/***/ }),

/***/ 3362:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8650)
const Comparator = __nccwpck_require__(8337)
const { ANY } = Comparator
const Range = __nccwpck_require__(4043)
const satisfies = __nccwpck_require__(4250)
const gt = __nccwpck_require__(9658)
const lt = __nccwpck_require__(5106)
const lte = __nccwpck_require__(649)
const gte = __nccwpck_require__(5054)

const outside = (version, range, hilo, options) => {
  version = new SemVer(version, options)
  range = new Range(range, options)

  let gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisfies the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let high = null
    let low = null

    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

module.exports = outside


/***/ }),

/***/ 936:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __nccwpck_require__(4250)
const compare = __nccwpck_require__(1935)
module.exports = (versions, range, options) => {
  const set = []
  let first = null
  let prev = null
  const v = versions.sort((a, b) => compare(a, b, options))
  for (const version of v) {
    const included = satisfies(version, range, options)
    if (included) {
      prev = version
      if (!first) {
        first = version
      }
    } else {
      if (prev) {
        set.push([first, prev])
      }
      prev = null
      first = null
    }
  }
  if (first) {
    set.push([first, null])
  }

  const ranges = []
  for (const [min, max] of set) {
    if (min === max) {
      ranges.push(min)
    } else if (!max && min === v[0]) {
      ranges.push('*')
    } else if (!max) {
      ranges.push(`>=${min}`)
    } else if (min === v[0]) {
      ranges.push(`<=${max}`)
    } else {
      ranges.push(`${min} - ${max}`)
    }
  }
  const simplified = ranges.join(' || ')
  const original = typeof range.raw === 'string' ? range.raw : String(range)
  return simplified.length < original.length ? simplified : range
}


/***/ }),

/***/ 473:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(4043)
const Comparator = __nccwpck_require__(8337)
const { ANY } = Comparator
const satisfies = __nccwpck_require__(4250)
const compare = __nccwpck_require__(1935)

// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true

const subset = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true
  }

  sub = new Range(sub, options)
  dom = new Range(dom, options)
  let sawNonNull = false

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options)
      sawNonNull = sawNonNull || isSub !== null
      if (isSub) {
        continue OUTER
      }
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull) {
      return false
    }
  }
  return true
}

const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true
  }

  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true
    } else if (options.includePrerelease) {
      sub = [new Comparator('>=0.0.0-0')]
    } else {
      sub = [new Comparator('>=0.0.0')]
    }
  }

  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true
    } else {
      dom = [new Comparator('>=0.0.0')]
    }
  }

  const eqSet = new Set()
  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      eqSet.add(c.semver)
    }
  }

  if (eqSet.size > 1) {
    return null
  }

  let gtltComp
  if (gt && lt) {
    gtltComp = compare(gt.semver, lt.semver, options)
    if (gtltComp > 0) {
      return null
    } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
      return null
    }
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies(eq, String(gt), options)) {
      return null
    }

    if (lt && !satisfies(eq, String(lt), options)) {
      return null
    }

    for (const c of dom) {
      if (!satisfies(eq, String(c), options)) {
        return false
      }
    }

    return true
  }

  let higher, lower
  let hasDomLT, hasDomGT
  // if the subset has a prerelease, we need a comparator in the superset
  // with the same tuple and a prerelease, or it's not a subset
  let needDomLTPre = lt &&
    !options.includePrerelease &&
    lt.semver.prerelease.length ? lt.semver : false
  let needDomGTPre = gt &&
    !options.includePrerelease &&
    gt.semver.prerelease.length ? gt.semver : false
  // exception: <1.2.3-0 is the same as <1.2.3
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
      lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false
  }

  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomGTPre.major &&
            c.semver.minor === needDomGTPre.minor &&
            c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false
        }
      }
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options)
        if (higher === c && higher !== gt) {
          return false
        }
      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
        return false
      }
    }
    if (lt) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomLTPre.major &&
            c.semver.minor === needDomLTPre.minor &&
            c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false
        }
      }
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options)
        if (lower === c && lower !== lt) {
          return false
        }
      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
        return false
      }
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0) {
      return false
    }
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0) {
    return false
  }

  if (lt && hasDomGT && !gt && gtltComp !== 0) {
    return false
  }

  // we needed a prerelease range in a specific tuple, but didn't get one
  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
  // because it includes prereleases in the 1.2.3 tuple
  if (needDomGTPre || needDomLTPre) {
    return false
  }

  return true
}

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
}

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
}

module.exports = subset


/***/ }),

/***/ 3782:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(4043)

// Mostly just for testing and legacy API reasons
const toComparators = (range, options) =>
  new Range(range, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '))

module.exports = toComparators


/***/ }),

/***/ 4838:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(4043)
const validRange = (range, options) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}
module.exports = validRange


/***/ }),

/***/ 8125:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(5680);


/***/ }),

/***/ 5680:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 262:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 5110:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.build = exports.parse = void 0;
const parser = __importStar(__nccwpck_require__(4140));
const contextVisitor_1 = __nccwpck_require__(5198);
const writer_1 = __nccwpck_require__(1368);
/** @returns a JSON representation of the given `pbxproj` file in string format. */
function parse(text) {
    const cst = parser.parse(text);
    const visitor = new contextVisitor_1.ContextVisitor();
    visitor.visit(cst);
    return visitor.context;
}
exports.parse = parse;
/** @returns a string representation of the given `pbxproj` in Apple's [Old-Style Plist](http://www.opensource.apple.com/source/CF/CF-744.19/CFOldStylePList.c) `string` format. */
function build(project) {
    return new writer_1.Writer(project).getResults();
}
exports.build = build;
__exportStar(__nccwpck_require__(1086), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8613:
/***/ (function(module) {

"use strict";

/*! For license information please see chevrotain.min.js.LICENSE.txt */
!function (t, e) {  true ? module.exports = e() : 0; }("undefined" != typeof self ? self : this, (function () { return (() => { var t = { 9515: (t, e, r) => { var n = r(8761)(r(7772), "DataView"); t.exports = n; }, 9612: (t, e, r) => { var n = r(2118), o = r(6909), i = r(8138), a = r(4174), s = r(7942); function u(t) { var e = -1, r = null == t ? 0 : t.length; for (this.clear(); ++e < r;) {
        var n = t[e];
        this.set(n[0], n[1]);
    } } u.prototype.clear = n, u.prototype.delete = o, u.prototype.get = i, u.prototype.has = a, u.prototype.set = s, t.exports = u; }, 235: (t, e, r) => { var n = r(3945), o = r(1846), i = r(8028), a = r(2344), s = r(4769); function u(t) { var e = -1, r = null == t ? 0 : t.length; for (this.clear(); ++e < r;) {
        var n = t[e];
        this.set(n[0], n[1]);
    } } u.prototype.clear = n, u.prototype.delete = o, u.prototype.get = i, u.prototype.has = a, u.prototype.set = s, t.exports = u; }, 326: (t, e, r) => { var n = r(8761)(r(7772), "Map"); t.exports = n; }, 6738: (t, e, r) => { var n = r(2411), o = r(6417), i = r(6928), a = r(9493), s = r(4150); function u(t) { var e = -1, r = null == t ? 0 : t.length; for (this.clear(); ++e < r;) {
        var n = t[e];
        this.set(n[0], n[1]);
    } } u.prototype.clear = n, u.prototype.delete = o, u.prototype.get = i, u.prototype.has = a, u.prototype.set = s, t.exports = u; }, 2760: (t, e, r) => { var n = r(8761)(r(7772), "Promise"); t.exports = n; }, 2143: (t, e, r) => { var n = r(8761)(r(7772), "Set"); t.exports = n; }, 5386: (t, e, r) => { var n = r(6738), o = r(2842), i = r(2482); function a(t) { var e = -1, r = null == t ? 0 : t.length; for (this.__data__ = new n; ++e < r;)
        this.add(t[e]); } a.prototype.add = a.prototype.push = o, a.prototype.has = i, t.exports = a; }, 6571: (t, e, r) => { var n = r(235), o = r(5243), i = r(2858), a = r(4417), s = r(8605), u = r(1418); function c(t) { var e = this.__data__ = new n(t); this.size = e.size; } c.prototype.clear = o, c.prototype.delete = i, c.prototype.get = a, c.prototype.has = s, c.prototype.set = u, t.exports = c; }, 857: (t, e, r) => { var n = r(7772).Symbol; t.exports = n; }, 9162: (t, e, r) => { var n = r(7772).Uint8Array; t.exports = n; }, 3215: (t, e, r) => { var n = r(8761)(r(7772), "WeakMap"); t.exports = n; }, 9432: t => { t.exports = function (t, e, r) { switch (r.length) {
        case 0: return t.call(e);
        case 1: return t.call(e, r[0]);
        case 2: return t.call(e, r[0], r[1]);
        case 3: return t.call(e, r[0], r[1], r[2]);
    } return t.apply(e, r); }; }, 5338: t => { t.exports = function (t, e, r, n) { for (var o = -1, i = null == t ? 0 : t.length; ++o < i;) {
        var a = t[o];
        e(n, a, r(a), t);
    } return n; }; }, 2517: t => { t.exports = function (t, e) { for (var r = -1, n = null == t ? 0 : t.length; ++r < n && !1 !== e(t[r], r, t);)
        ; return t; }; }, 7603: t => { t.exports = function (t, e) { for (var r = -1, n = null == t ? 0 : t.length; ++r < n;)
        if (!e(t[r], r, t))
            return !1; return !0; }; }, 7552: t => { t.exports = function (t, e) { for (var r = -1, n = null == t ? 0 : t.length, o = 0, i = []; ++r < n;) {
        var a = t[r];
        e(a, r, t) && (i[o++] = a);
    } return i; }; }, 8333: (t, e, r) => { var n = r(7832); t.exports = function (t, e) { return !(null == t || !t.length) && n(t, e, 0) > -1; }; }, 4893: t => { t.exports = function (t, e, r) { for (var n = -1, o = null == t ? 0 : t.length; ++n < o;)
        if (r(e, t[n]))
            return !0; return !1; }; }, 1634: (t, e, r) => { var n = r(6473), o = r(9631), i = r(6152), a = r(3226), s = r(9045), u = r(7598), c = Object.prototype.hasOwnProperty; t.exports = function (t, e) { var r = i(t), l = !r && o(t), f = !r && !l && a(t), p = !r && !l && !f && u(t), d = r || l || f || p, h = d ? n(t.length, String) : [], v = h.length; for (var y in t)
        !e && !c.call(t, y) || d && ("length" == y || f && ("offset" == y || "parent" == y) || p && ("buffer" == y || "byteLength" == y || "byteOffset" == y) || s(y, v)) || h.push(y); return h; }; }, 343: t => { t.exports = function (t, e) { for (var r = -1, n = null == t ? 0 : t.length, o = Array(n); ++r < n;)
        o[r] = e(t[r], r, t); return o; }; }, 5067: t => { t.exports = function (t, e) { for (var r = -1, n = e.length, o = t.length; ++r < n;)
        t[o + r] = e[r]; return t; }; }, 1207: t => { t.exports = function (t, e, r, n) { var o = -1, i = null == t ? 0 : t.length; for (n && i && (r = t[++o]); ++o < i;)
        r = e(r, t[o], o, t); return r; }; }, 7064: t => { t.exports = function (t, e) { for (var r = -1, n = null == t ? 0 : t.length; ++r < n;)
        if (e(t[r], r, t))
            return !0; return !1; }; }, 217: t => { t.exports = function (t) { return t.split(""); }; }, 91: (t, e, r) => { var n = r(3940), o = r(1225), i = Object.prototype.hasOwnProperty; t.exports = function (t, e, r) { var a = t[e]; i.call(t, e) && o(a, r) && (void 0 !== r || e in t) || n(t, e, r); }; }, 2218: (t, e, r) => { var n = r(1225); t.exports = function (t, e) { for (var r = t.length; r--;)
        if (n(t[r][0], e))
            return r; return -1; }; }, 2825: (t, e, r) => { var n = r(4303); t.exports = function (t, e, r, o) { return n(t, (function (t, n, i) { e(o, t, r(t), i); })), o; }; }, 7993: (t, e, r) => { var n = r(752), o = r(249); t.exports = function (t, e) { return t && n(e, o(e), t); }; }, 5906: (t, e, r) => { var n = r(752), o = r(8582); t.exports = function (t, e) { return t && n(e, o(e), t); }; }, 3940: (t, e, r) => { var n = r(3043); t.exports = function (t, e, r) { "__proto__" == e && n ? n(t, e, { configurable: !0, enumerable: !0, value: r, writable: !0 }) : t[e] = r; }; }, 8874: (t, e, r) => { var n = r(6571), o = r(2517), i = r(91), a = r(7993), s = r(5906), u = r(2175), c = r(1522), l = r(7680), f = r(9987), p = r(3483), d = r(6939), h = r(940), v = r(9917), y = r(8222), m = r(8725), T = r(6152), E = r(3226), _ = r(4714), g = r(9259), O = r(3679), R = r(249), A = r(8582), I = "[object Arguments]", x = "[object Function]", N = "[object Object]", P = {}; P[I] = P["[object Array]"] = P["[object ArrayBuffer]"] = P["[object DataView]"] = P["[object Boolean]"] = P["[object Date]"] = P["[object Float32Array]"] = P["[object Float64Array]"] = P["[object Int8Array]"] = P["[object Int16Array]"] = P["[object Int32Array]"] = P["[object Map]"] = P["[object Number]"] = P[N] = P["[object RegExp]"] = P["[object Set]"] = P["[object String]"] = P["[object Symbol]"] = P["[object Uint8Array]"] = P["[object Uint8ClampedArray]"] = P["[object Uint16Array]"] = P["[object Uint32Array]"] = !0, P["[object Error]"] = P[x] = P["[object WeakMap]"] = !1, t.exports = function t(e, r, S, b, k, L) { var C, M = 1 & r, D = 2 & r, w = 4 & r; if (S && (C = k ? S(e, b, k, L) : S(e)), void 0 !== C)
        return C; if (!g(e))
        return e; var F = T(e); if (F) {
        if (C = v(e), !M)
            return c(e, C);
    }
    else {
        var j = h(e), U = j == x || "[object GeneratorFunction]" == j;
        if (E(e))
            return u(e, M);
        if (j == N || j == I || U && !k) {
            if (C = D || U ? {} : m(e), !M)
                return D ? f(e, s(C, e)) : l(e, a(C, e));
        }
        else {
            if (!P[j])
                return k ? e : {};
            C = y(e, j, M);
        }
    } L || (L = new n); var B = L.get(e); if (B)
        return B; L.set(e, C), O(e) ? e.forEach((function (n) { C.add(t(n, r, S, n, e, L)); })) : _(e) && e.forEach((function (n, o) { C.set(o, t(n, r, S, o, e, L)); })); var G = F ? void 0 : (w ? D ? d : p : D ? A : R)(e); return o(G || e, (function (n, o) { G && (n = e[o = n]), i(C, o, t(n, r, S, o, e, L)); })), C; }; }, 9413: (t, e, r) => { var n = r(9259), o = Object.create, i = function () { function t() { } return function (e) { if (!n(e))
        return {}; if (o)
        return o(e); t.prototype = e; var r = new t; return t.prototype = void 0, r; }; }(); t.exports = i; }, 5246: (t, e, r) => { var n = r(5386), o = r(8333), i = r(4893), a = r(343), s = r(7826), u = r(9950); t.exports = function (t, e, r, c) { var l = -1, f = o, p = !0, d = t.length, h = [], v = e.length; if (!d)
        return h; r && (e = a(e, s(r))), c ? (f = i, p = !1) : e.length >= 200 && (f = u, p = !1, e = new n(e)); t: for (; ++l < d;) {
        var y = t[l], m = null == r ? y : r(y);
        if (y = c || 0 !== y ? y : 0, p && m == m) {
            for (var T = v; T--;)
                if (e[T] === m)
                    continue t;
            h.push(y);
        }
        else
            f(e, m, c) || h.push(y);
    } return h; }; }, 4303: (t, e, r) => { var n = r(6548), o = r(2019)(n); t.exports = o; }, 80: (t, e, r) => { var n = r(4303); t.exports = function (t, e) { var r = !0; return n(t, (function (t, n, o) { return r = !!e(t, n, o); })), r; }; }, 8043: (t, e, r) => { var n = r(4303); t.exports = function (t, e) { var r = []; return n(t, (function (t, n, o) { e(t, n, o) && r.push(t); })), r; }; }, 1359: t => { t.exports = function (t, e, r, n) { for (var o = t.length, i = r + (n ? 1 : -1); n ? i-- : ++i < o;)
        if (e(t[i], i, t))
            return i; return -1; }; }, 2034: (t, e, r) => { var n = r(5067), o = r(5882); t.exports = function t(e, r, i, a, s) { var u = -1, c = e.length; for (i || (i = o), s || (s = []); ++u < c;) {
        var l = e[u];
        r > 0 && i(l) ? r > 1 ? t(l, r - 1, i, a, s) : n(s, l) : a || (s[s.length] = l);
    } return s; }; }, 5308: (t, e, r) => { var n = r(5463)(); t.exports = n; }, 6548: (t, e, r) => { var n = r(5308), o = r(249); t.exports = function (t, e) { return t && n(t, e, o); }; }, 3324: (t, e, r) => { var n = r(7297), o = r(3812); t.exports = function (t, e) { for (var r = 0, i = (e = n(e, t)).length; null != t && r < i;)
        t = t[o(e[r++])]; return r && r == i ? t : void 0; }; }, 1897: (t, e, r) => { var n = r(5067), o = r(6152); t.exports = function (t, e, r) { var i = e(t); return o(t) ? i : n(i, r(t)); }; }, 3366: (t, e, r) => { var n = r(857), o = r(2107), i = r(7157), a = n ? n.toStringTag : void 0; t.exports = function (t) { return null == t ? void 0 === t ? "[object Undefined]" : "[object Null]" : a && a in Object(t) ? o(t) : i(t); }; }, 2726: t => { var e = Object.prototype.hasOwnProperty; t.exports = function (t, r) { return null != t && e.call(t, r); }; }, 187: t => { t.exports = function (t, e) { return null != t && e in Object(t); }; }, 7832: (t, e, r) => { var n = r(1359), o = r(2195), i = r(6024); t.exports = function (t, e, r) { return e == e ? i(t, e, r) : n(t, o, r); }; }, 5183: (t, e, r) => { var n = r(3366), o = r(5125); t.exports = function (t) { return o(t) && "[object Arguments]" == n(t); }; }, 8746: (t, e, r) => { var n = r(1952), o = r(5125); t.exports = function t(e, r, i, a, s) { return e === r || (null == e || null == r || !o(e) && !o(r) ? e != e && r != r : n(e, r, i, a, t, s)); }; }, 1952: (t, e, r) => { var n = r(6571), o = r(4871), i = r(1491), a = r(7416), s = r(940), u = r(6152), c = r(3226), l = r(7598), f = "[object Arguments]", p = "[object Array]", d = "[object Object]", h = Object.prototype.hasOwnProperty; t.exports = function (t, e, r, v, y, m) { var T = u(t), E = u(e), _ = T ? p : s(t), g = E ? p : s(e), O = (_ = _ == f ? d : _) == d, R = (g = g == f ? d : g) == d, A = _ == g; if (A && c(t)) {
        if (!c(e))
            return !1;
        T = !0, O = !1;
    } if (A && !O)
        return m || (m = new n), T || l(t) ? o(t, e, r, v, y, m) : i(t, e, _, r, v, y, m); if (!(1 & r)) {
        var I = O && h.call(t, "__wrapped__"), x = R && h.call(e, "__wrapped__");
        if (I || x) {
            var N = I ? t.value() : t, P = x ? e.value() : e;
            return m || (m = new n), y(N, P, r, v, m);
        }
    } return !!A && (m || (m = new n), a(t, e, r, v, y, m)); }; }, 4511: (t, e, r) => { var n = r(940), o = r(5125); t.exports = function (t) { return o(t) && "[object Map]" == n(t); }; }, 7036: (t, e, r) => { var n = r(6571), o = r(8746); t.exports = function (t, e, r, i) { var a = r.length, s = a, u = !i; if (null == t)
        return !s; for (t = Object(t); a--;) {
        var c = r[a];
        if (u && c[2] ? c[1] !== t[c[0]] : !(c[0] in t))
            return !1;
    } for (; ++a < s;) {
        var l = (c = r[a])[0], f = t[l], p = c[1];
        if (u && c[2]) {
            if (void 0 === f && !(l in t))
                return !1;
        }
        else {
            var d = new n;
            if (i)
                var h = i(f, p, l, t, e, d);
            if (!(void 0 === h ? o(p, f, 3, i, d) : h))
                return !1;
        }
    } return !0; }; }, 2195: t => { t.exports = function (t) { return t != t; }; }, 6840: (t, e, r) => { var n = r(1049), o = r(7394), i = r(9259), a = r(7035), s = /^\[object .+?Constructor\]$/, u = Function.prototype, c = Object.prototype, l = u.toString, f = c.hasOwnProperty, p = RegExp("^" + l.call(f).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"); t.exports = function (t) { return !(!i(t) || o(t)) && (n(t) ? p : s).test(a(t)); }; }, 4333: (t, e, r) => { var n = r(3366), o = r(5125); t.exports = function (t) { return o(t) && "[object RegExp]" == n(t); }; }, 8436: (t, e, r) => { var n = r(940), o = r(5125); t.exports = function (t) { return o(t) && "[object Set]" == n(t); }; }, 5522: (t, e, r) => { var n = r(3366), o = r(1158), i = r(5125), a = {}; a["[object Float32Array]"] = a["[object Float64Array]"] = a["[object Int8Array]"] = a["[object Int16Array]"] = a["[object Int32Array]"] = a["[object Uint8Array]"] = a["[object Uint8ClampedArray]"] = a["[object Uint16Array]"] = a["[object Uint32Array]"] = !0, a["[object Arguments]"] = a["[object Array]"] = a["[object ArrayBuffer]"] = a["[object Boolean]"] = a["[object DataView]"] = a["[object Date]"] = a["[object Error]"] = a["[object Function]"] = a["[object Map]"] = a["[object Number]"] = a["[object Object]"] = a["[object RegExp]"] = a["[object Set]"] = a["[object String]"] = a["[object WeakMap]"] = !1, t.exports = function (t) { return i(t) && o(t.length) && !!a[n(t)]; }; }, 8286: (t, e, r) => { var n = r(6423), o = r(4716), i = r(3059), a = r(6152), s = r(5798); t.exports = function (t) { return "function" == typeof t ? t : null == t ? i : "object" == typeof t ? a(t) ? o(t[0], t[1]) : n(t) : s(t); }; }, 6411: (t, e, r) => { var n = r(6001), o = r(4248), i = Object.prototype.hasOwnProperty; t.exports = function (t) { if (!n(t))
        return o(t); var e = []; for (var r in Object(t))
        i.call(t, r) && "constructor" != r && e.push(r); return e; }; }, 8390: (t, e, r) => { var n = r(9259), o = r(6001), i = r(2966), a = Object.prototype.hasOwnProperty; t.exports = function (t) { if (!n(t))
        return i(t); var e = o(t), r = []; for (var s in t)
        ("constructor" != s || !e && a.call(t, s)) && r.push(s); return r; }; }, 3401: (t, e, r) => { var n = r(4303), o = r(7878); t.exports = function (t, e) { var r = -1, i = o(t) ? Array(t.length) : []; return n(t, (function (t, n, o) { i[++r] = e(t, n, o); })), i; }; }, 6423: (t, e, r) => { var n = r(7036), o = r(9882), i = r(3477); t.exports = function (t) { var e = o(t); return 1 == e.length && e[0][2] ? i(e[0][0], e[0][1]) : function (r) { return r === t || n(r, t, e); }; }; }, 4716: (t, e, r) => { var n = r(8746), o = r(2579), i = r(5041), a = r(1401), s = r(8792), u = r(3477), c = r(3812); t.exports = function (t, e) { return a(t) && s(e) ? u(c(t), e) : function (r) { var a = o(r, t); return void 0 === a && a === e ? i(r, t) : n(e, a, 3); }; }; }, 3759: (t, e, r) => { var n = r(3324), o = r(2857), i = r(7297); t.exports = function (t, e, r) { for (var a = -1, s = e.length, u = {}; ++a < s;) {
        var c = e[a], l = n(t, c);
        r(l, c) && o(u, i(c, t), l);
    } return u; }; }, 256: t => { t.exports = function (t) { return function (e) { return null == e ? void 0 : e[t]; }; }; }, 2952: (t, e, r) => { var n = r(3324); t.exports = function (t) { return function (e) { return n(e, t); }; }; }, 5877: t => { t.exports = function (t, e, r, n, o) { return o(t, (function (t, o, i) { r = n ? (n = !1, t) : e(r, t, o, i); })), r; }; }, 6060: (t, e, r) => { var n = r(3059), o = r(3114), i = r(5251); t.exports = function (t, e) { return i(o(t, e, n), t + ""); }; }, 2857: (t, e, r) => { var n = r(91), o = r(7297), i = r(9045), a = r(9259), s = r(3812); t.exports = function (t, e, r, u) { if (!a(t))
        return t; for (var c = -1, l = (e = o(e, t)).length, f = l - 1, p = t; null != p && ++c < l;) {
        var d = s(e[c]), h = r;
        if ("__proto__" === d || "constructor" === d || "prototype" === d)
            return t;
        if (c != f) {
            var v = p[d];
            void 0 === (h = u ? u(v, d, p) : void 0) && (h = a(v) ? v : i(e[c + 1]) ? [] : {});
        }
        n(p, d, h), p = p[d];
    } return t; }; }, 6532: (t, e, r) => { var n = r(6874), o = r(3043), i = r(3059), a = o ? function (t, e) { return o(t, "toString", { configurable: !0, enumerable: !1, value: n(e), writable: !0 }); } : i; t.exports = a; }, 9872: t => { t.exports = function (t, e, r) { var n = -1, o = t.length; e < 0 && (e = -e > o ? 0 : o + e), (r = r > o ? o : r) < 0 && (r += o), o = e > r ? 0 : r - e >>> 0, e >>>= 0; for (var i = Array(o); ++n < o;)
        i[n] = t[n + e]; return i; }; }, 4751: (t, e, r) => { var n = r(4303); t.exports = function (t, e) { var r; return n(t, (function (t, n, o) { return !(r = e(t, n, o)); })), !!r; }; }, 6473: t => { t.exports = function (t, e) { for (var r = -1, n = Array(t); ++r < t;)
        n[r] = e(r); return n; }; }, 1054: (t, e, r) => { var n = r(857), o = r(343), i = r(6152), a = r(4795), s = n ? n.prototype : void 0, u = s ? s.toString : void 0; t.exports = function t(e) { if ("string" == typeof e)
        return e; if (i(e))
        return o(e, t) + ""; if (a(e))
        return u ? u.call(e) : ""; var r = e + ""; return "0" == r && 1 / e == -1 / 0 ? "-0" : r; }; }, 1704: (t, e, r) => { var n = r(2153), o = /^\s+/; t.exports = function (t) { return t ? t.slice(0, n(t) + 1).replace(o, "") : t; }; }, 7826: t => { t.exports = function (t) { return function (e) { return t(e); }; }; }, 7326: (t, e, r) => { var n = r(5386), o = r(8333), i = r(4893), a = r(9950), s = r(8803), u = r(4207); t.exports = function (t, e, r) { var c = -1, l = o, f = t.length, p = !0, d = [], h = d; if (r)
        p = !1, l = i;
    else if (f >= 200) {
        var v = e ? null : s(t);
        if (v)
            return u(v);
        p = !1, l = a, h = new n;
    }
    else
        h = e ? [] : d; t: for (; ++c < f;) {
        var y = t[c], m = e ? e(y) : y;
        if (y = r || 0 !== y ? y : 0, p && m == m) {
            for (var T = h.length; T--;)
                if (h[T] === m)
                    continue t;
            e && h.push(m), d.push(y);
        }
        else
            l(h, m, r) || (h !== d && h.push(m), d.push(y));
    } return d; }; }, 753: (t, e, r) => { var n = r(343); t.exports = function (t, e) { return n(e, (function (e) { return t[e]; })); }; }, 9950: t => { t.exports = function (t, e) { return t.has(e); }; }, 9419: (t, e, r) => { var n = r(3059); t.exports = function (t) { return "function" == typeof t ? t : n; }; }, 7297: (t, e, r) => { var n = r(6152), o = r(1401), i = r(4452), a = r(6188); t.exports = function (t, e) { return n(t) ? t : o(t, e) ? [t] : i(a(t)); }; }, 3895: (t, e, r) => { var n = r(9872); t.exports = function (t, e, r) { var o = t.length; return r = void 0 === r ? o : r, !e && r >= o ? t : n(t, e, r); }; }, 897: (t, e, r) => { var n = r(9162); t.exports = function (t) { var e = new t.constructor(t.byteLength); return new n(e).set(new n(t)), e; }; }, 2175: (t, e, r) => { t = r.nmd(t); var n = r(7772), o = e && !e.nodeType && e, i = o && t && !t.nodeType && t, a = i && i.exports === o ? n.Buffer : void 0, s = a ? a.allocUnsafe : void 0; t.exports = function (t, e) { if (e)
        return t.slice(); var r = t.length, n = s ? s(r) : new t.constructor(r); return t.copy(n), n; }; }, 4727: (t, e, r) => { var n = r(897); t.exports = function (t, e) { var r = e ? n(t.buffer) : t.buffer; return new t.constructor(r, t.byteOffset, t.byteLength); }; }, 6058: t => { var e = /\w*$/; t.exports = function (t) { var r = new t.constructor(t.source, e.exec(t)); return r.lastIndex = t.lastIndex, r; }; }, 169: (t, e, r) => { var n = r(857), o = n ? n.prototype : void 0, i = o ? o.valueOf : void 0; t.exports = function (t) { return i ? Object(i.call(t)) : {}; }; }, 6190: (t, e, r) => { var n = r(897); t.exports = function (t, e) { var r = e ? n(t.buffer) : t.buffer; return new t.constructor(r, t.byteOffset, t.length); }; }, 1522: t => { t.exports = function (t, e) { var r = -1, n = t.length; for (e || (e = Array(n)); ++r < n;)
        e[r] = t[r]; return e; }; }, 752: (t, e, r) => { var n = r(91), o = r(3940); t.exports = function (t, e, r, i) { var a = !r; r || (r = {}); for (var s = -1, u = e.length; ++s < u;) {
        var c = e[s], l = i ? i(r[c], t[c], c, r, t) : void 0;
        void 0 === l && (l = t[c]), a ? o(r, c, l) : n(r, c, l);
    } return r; }; }, 7680: (t, e, r) => { var n = r(752), o = r(633); t.exports = function (t, e) { return n(t, o(t), e); }; }, 9987: (t, e, r) => { var n = r(752), o = r(2680); t.exports = function (t, e) { return n(t, o(t), e); }; }, 4019: (t, e, r) => { var n = r(7772)["__core-js_shared__"]; t.exports = n; }, 6740: (t, e, r) => { var n = r(5338), o = r(2825), i = r(8286), a = r(6152); t.exports = function (t, e) { return function (r, s) { var u = a(r) ? n : o, c = e ? e() : {}; return u(r, t, i(s, 2), c); }; }; }, 7263: (t, e, r) => { var n = r(6060), o = r(2406); t.exports = function (t) { return n((function (e, r) { var n = -1, i = r.length, a = i > 1 ? r[i - 1] : void 0, s = i > 2 ? r[2] : void 0; for (a = t.length > 3 && "function" == typeof a ? (i--, a) : void 0, s && o(r[0], r[1], s) && (a = i < 3 ? void 0 : a, i = 1), e = Object(e); ++n < i;) {
        var u = r[n];
        u && t(e, u, n, a);
    } return e; })); }; }, 2019: (t, e, r) => { var n = r(7878); t.exports = function (t, e) { return function (r, o) { if (null == r)
        return r; if (!n(r))
        return t(r, o); for (var i = r.length, a = e ? i : -1, s = Object(r); (e ? a-- : ++a < i) && !1 !== o(s[a], a, s);)
        ; return r; }; }; }, 5463: t => { t.exports = function (t) { return function (e, r, n) { for (var o = -1, i = Object(e), a = n(e), s = a.length; s--;) {
        var u = a[t ? s : ++o];
        if (!1 === r(i[u], u, i))
            break;
    } return e; }; }; }, 3126: (t, e, r) => { var n = r(3895), o = r(3880), i = r(8435), a = r(6188); t.exports = function (t) { return function (e) { e = a(e); var r = o(e) ? i(e) : void 0, s = r ? r[0] : e.charAt(0), u = r ? n(r, 1).join("") : e.slice(1); return s[t]() + u; }; }; }, 8776: (t, e, r) => { var n = r(8286), o = r(7878), i = r(249); t.exports = function (t) { return function (e, r, a) { var s = Object(e); if (!o(e)) {
        var u = n(r, 3);
        e = i(e), r = function (t) { return u(s[t], t, s); };
    } var c = t(e, r, a); return c > -1 ? s[u ? e[c] : c] : void 0; }; }; }, 8803: (t, e, r) => { var n = r(2143), o = r(4291), i = r(4207), a = n && 1 / i(new n([, -0]))[1] == 1 / 0 ? function (t) { return new n(t); } : o; t.exports = a; }, 3043: (t, e, r) => { var n = r(8761), o = function () { try {
        var t = n(Object, "defineProperty");
        return t({}, "", {}), t;
    }
    catch (t) { } }(); t.exports = o; }, 4871: (t, e, r) => { var n = r(5386), o = r(7064), i = r(9950); t.exports = function (t, e, r, a, s, u) { var c = 1 & r, l = t.length, f = e.length; if (l != f && !(c && f > l))
        return !1; var p = u.get(t), d = u.get(e); if (p && d)
        return p == e && d == t; var h = -1, v = !0, y = 2 & r ? new n : void 0; for (u.set(t, e), u.set(e, t); ++h < l;) {
        var m = t[h], T = e[h];
        if (a)
            var E = c ? a(T, m, h, e, t, u) : a(m, T, h, t, e, u);
        if (void 0 !== E) {
            if (E)
                continue;
            v = !1;
            break;
        }
        if (y) {
            if (!o(e, (function (t, e) { if (!i(y, e) && (m === t || s(m, t, r, a, u)))
                return y.push(e); }))) {
                v = !1;
                break;
            }
        }
        else if (m !== T && !s(m, T, r, a, u)) {
            v = !1;
            break;
        }
    } return u.delete(t), u.delete(e), v; }; }, 1491: (t, e, r) => { var n = r(857), o = r(9162), i = r(1225), a = r(4871), s = r(5179), u = r(4207), c = n ? n.prototype : void 0, l = c ? c.valueOf : void 0; t.exports = function (t, e, r, n, c, f, p) { switch (r) {
        case "[object DataView]":
            if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset)
                return !1;
            t = t.buffer, e = e.buffer;
        case "[object ArrayBuffer]": return !(t.byteLength != e.byteLength || !f(new o(t), new o(e)));
        case "[object Boolean]":
        case "[object Date]":
        case "[object Number]": return i(+t, +e);
        case "[object Error]": return t.name == e.name && t.message == e.message;
        case "[object RegExp]":
        case "[object String]": return t == e + "";
        case "[object Map]": var d = s;
        case "[object Set]":
            var h = 1 & n;
            if (d || (d = u), t.size != e.size && !h)
                return !1;
            var v = p.get(t);
            if (v)
                return v == e;
            n |= 2, p.set(t, e);
            var y = a(d(t), d(e), n, c, f, p);
            return p.delete(t), y;
        case "[object Symbol]": if (l)
            return l.call(t) == l.call(e);
    } return !1; }; }, 7416: (t, e, r) => { var n = r(3483), o = Object.prototype.hasOwnProperty; t.exports = function (t, e, r, i, a, s) { var u = 1 & r, c = n(t), l = c.length; if (l != n(e).length && !u)
        return !1; for (var f = l; f--;) {
        var p = c[f];
        if (!(u ? p in e : o.call(e, p)))
            return !1;
    } var d = s.get(t), h = s.get(e); if (d && h)
        return d == e && h == t; var v = !0; s.set(t, e), s.set(e, t); for (var y = u; ++f < l;) {
        var m = t[p = c[f]], T = e[p];
        if (i)
            var E = u ? i(T, m, p, e, t, s) : i(m, T, p, t, e, s);
        if (!(void 0 === E ? m === T || a(m, T, r, i, s) : E)) {
            v = !1;
            break;
        }
        y || (y = "constructor" == p);
    } if (v && !y) {
        var _ = t.constructor, g = e.constructor;
        _ == g || !("constructor" in t) || !("constructor" in e) || "function" == typeof _ && _ instanceof _ && "function" == typeof g && g instanceof g || (v = !1);
    } return s.delete(t), s.delete(e), v; }; }, 1242: (t, e, r) => { var n = "object" == typeof r.g && r.g && r.g.Object === Object && r.g; t.exports = n; }, 3483: (t, e, r) => { var n = r(1897), o = r(633), i = r(249); t.exports = function (t) { return n(t, i, o); }; }, 6939: (t, e, r) => { var n = r(1897), o = r(2680), i = r(8582); t.exports = function (t) { return n(t, i, o); }; }, 7937: (t, e, r) => { var n = r(8304); t.exports = function (t, e) { var r = t.__data__; return n(e) ? r["string" == typeof e ? "string" : "hash"] : r.map; }; }, 9882: (t, e, r) => { var n = r(8792), o = r(249); t.exports = function (t) { for (var e = o(t), r = e.length; r--;) {
        var i = e[r], a = t[i];
        e[r] = [i, a, n(a)];
    } return e; }; }, 8761: (t, e, r) => { var n = r(6840), o = r(8109); t.exports = function (t, e) { var r = o(t, e); return n(r) ? r : void 0; }; }, 7353: (t, e, r) => { var n = r(241)(Object.getPrototypeOf, Object); t.exports = n; }, 2107: (t, e, r) => { var n = r(857), o = Object.prototype, i = o.hasOwnProperty, a = o.toString, s = n ? n.toStringTag : void 0; t.exports = function (t) { var e = i.call(t, s), r = t[s]; try {
        t[s] = void 0;
        var n = !0;
    }
    catch (t) { } var o = a.call(t); return n && (e ? t[s] = r : delete t[s]), o; }; }, 633: (t, e, r) => { var n = r(7552), o = r(981), i = Object.prototype.propertyIsEnumerable, a = Object.getOwnPropertySymbols, s = a ? function (t) { return null == t ? [] : (t = Object(t), n(a(t), (function (e) { return i.call(t, e); }))); } : o; t.exports = s; }, 2680: (t, e, r) => { var n = r(5067), o = r(7353), i = r(633), a = r(981), s = Object.getOwnPropertySymbols ? function (t) { for (var e = []; t;)
        n(e, i(t)), t = o(t); return e; } : a; t.exports = s; }, 940: (t, e, r) => { var n = r(9515), o = r(326), i = r(2760), a = r(2143), s = r(3215), u = r(3366), c = r(7035), l = "[object Map]", f = "[object Promise]", p = "[object Set]", d = "[object WeakMap]", h = "[object DataView]", v = c(n), y = c(o), m = c(i), T = c(a), E = c(s), _ = u; (n && _(new n(new ArrayBuffer(1))) != h || o && _(new o) != l || i && _(i.resolve()) != f || a && _(new a) != p || s && _(new s) != d) && (_ = function (t) { var e = u(t), r = "[object Object]" == e ? t.constructor : void 0, n = r ? c(r) : ""; if (n)
        switch (n) {
            case v: return h;
            case y: return l;
            case m: return f;
            case T: return p;
            case E: return d;
        } return e; }), t.exports = _; }, 8109: t => { t.exports = function (t, e) { return null == t ? void 0 : t[e]; }; }, 1369: (t, e, r) => { var n = r(7297), o = r(9631), i = r(6152), a = r(9045), s = r(1158), u = r(3812); t.exports = function (t, e, r) { for (var c = -1, l = (e = n(e, t)).length, f = !1; ++c < l;) {
        var p = u(e[c]);
        if (!(f = null != t && r(t, p)))
            break;
        t = t[p];
    } return f || ++c != l ? f : !!(l = null == t ? 0 : t.length) && s(l) && a(p, l) && (i(t) || o(t)); }; }, 3880: t => { var e = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]"); t.exports = function (t) { return e.test(t); }; }, 2118: (t, e, r) => { var n = r(9191); t.exports = function () { this.__data__ = n ? n(null) : {}, this.size = 0; }; }, 6909: t => { t.exports = function (t) { var e = this.has(t) && delete this.__data__[t]; return this.size -= e ? 1 : 0, e; }; }, 8138: (t, e, r) => { var n = r(9191), o = Object.prototype.hasOwnProperty; t.exports = function (t) { var e = this.__data__; if (n) {
        var r = e[t];
        return "__lodash_hash_undefined__" === r ? void 0 : r;
    } return o.call(e, t) ? e[t] : void 0; }; }, 4174: (t, e, r) => { var n = r(9191), o = Object.prototype.hasOwnProperty; t.exports = function (t) { var e = this.__data__; return n ? void 0 !== e[t] : o.call(e, t); }; }, 7942: (t, e, r) => { var n = r(9191); t.exports = function (t, e) { var r = this.__data__; return this.size += this.has(t) ? 0 : 1, r[t] = n && void 0 === e ? "__lodash_hash_undefined__" : e, this; }; }, 9917: t => { var e = Object.prototype.hasOwnProperty; t.exports = function (t) { var r = t.length, n = new t.constructor(r); return r && "string" == typeof t[0] && e.call(t, "index") && (n.index = t.index, n.input = t.input), n; }; }, 8222: (t, e, r) => { var n = r(897), o = r(4727), i = r(6058), a = r(169), s = r(6190); t.exports = function (t, e, r) { var u = t.constructor; switch (e) {
        case "[object ArrayBuffer]": return n(t);
        case "[object Boolean]":
        case "[object Date]": return new u(+t);
        case "[object DataView]": return o(t, r);
        case "[object Float32Array]":
        case "[object Float64Array]":
        case "[object Int8Array]":
        case "[object Int16Array]":
        case "[object Int32Array]":
        case "[object Uint8Array]":
        case "[object Uint8ClampedArray]":
        case "[object Uint16Array]":
        case "[object Uint32Array]": return s(t, r);
        case "[object Map]": return new u;
        case "[object Number]":
        case "[object String]": return new u(t);
        case "[object RegExp]": return i(t);
        case "[object Set]": return new u;
        case "[object Symbol]": return a(t);
    } }; }, 8725: (t, e, r) => { var n = r(9413), o = r(7353), i = r(6001); t.exports = function (t) { return "function" != typeof t.constructor || i(t) ? {} : n(o(t)); }; }, 5882: (t, e, r) => { var n = r(857), o = r(9631), i = r(6152), a = n ? n.isConcatSpreadable : void 0; t.exports = function (t) { return i(t) || o(t) || !!(a && t && t[a]); }; }, 9045: t => { var e = /^(?:0|[1-9]\d*)$/; t.exports = function (t, r) { var n = typeof t; return !!(r = null == r ? 9007199254740991 : r) && ("number" == n || "symbol" != n && e.test(t)) && t > -1 && t % 1 == 0 && t < r; }; }, 2406: (t, e, r) => { var n = r(1225), o = r(7878), i = r(9045), a = r(9259); t.exports = function (t, e, r) { if (!a(r))
        return !1; var s = typeof e; return !!("number" == s ? o(r) && i(e, r.length) : "string" == s && e in r) && n(r[e], t); }; }, 1401: (t, e, r) => { var n = r(6152), o = r(4795), i = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, a = /^\w*$/; t.exports = function (t, e) { if (n(t))
        return !1; var r = typeof t; return !("number" != r && "symbol" != r && "boolean" != r && null != t && !o(t)) || a.test(t) || !i.test(t) || null != e && t in Object(e); }; }, 8304: t => { t.exports = function (t) { var e = typeof t; return "string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t; }; }, 7394: (t, e, r) => { var n, o = r(4019), i = (n = /[^.]+$/.exec(o && o.keys && o.keys.IE_PROTO || "")) ? "Symbol(src)_1." + n : ""; t.exports = function (t) { return !!i && i in t; }; }, 6001: t => { var e = Object.prototype; t.exports = function (t) { var r = t && t.constructor; return t === ("function" == typeof r && r.prototype || e); }; }, 8792: (t, e, r) => { var n = r(9259); t.exports = function (t) { return t == t && !n(t); }; }, 3945: t => { t.exports = function () { this.__data__ = [], this.size = 0; }; }, 1846: (t, e, r) => { var n = r(2218), o = Array.prototype.splice; t.exports = function (t) { var e = this.__data__, r = n(e, t); return !(r < 0 || (r == e.length - 1 ? e.pop() : o.call(e, r, 1), --this.size, 0)); }; }, 8028: (t, e, r) => { var n = r(2218); t.exports = function (t) { var e = this.__data__, r = n(e, t); return r < 0 ? void 0 : e[r][1]; }; }, 2344: (t, e, r) => { var n = r(2218); t.exports = function (t) { return n(this.__data__, t) > -1; }; }, 4769: (t, e, r) => { var n = r(2218); t.exports = function (t, e) { var r = this.__data__, o = n(r, t); return o < 0 ? (++this.size, r.push([t, e])) : r[o][1] = e, this; }; }, 2411: (t, e, r) => { var n = r(9612), o = r(235), i = r(326); t.exports = function () { this.size = 0, this.__data__ = { hash: new n, map: new (i || o), string: new n }; }; }, 6417: (t, e, r) => { var n = r(7937); t.exports = function (t) { var e = n(this, t).delete(t); return this.size -= e ? 1 : 0, e; }; }, 6928: (t, e, r) => { var n = r(7937); t.exports = function (t) { return n(this, t).get(t); }; }, 9493: (t, e, r) => { var n = r(7937); t.exports = function (t) { return n(this, t).has(t); }; }, 4150: (t, e, r) => { var n = r(7937); t.exports = function (t, e) { var r = n(this, t), o = r.size; return r.set(t, e), this.size += r.size == o ? 0 : 1, this; }; }, 5179: t => { t.exports = function (t) { var e = -1, r = Array(t.size); return t.forEach((function (t, n) { r[++e] = [n, t]; })), r; }; }, 3477: t => { t.exports = function (t, e) { return function (r) { return null != r && r[t] === e && (void 0 !== e || t in Object(r)); }; }; }, 7777: (t, e, r) => { var n = r(733); t.exports = function (t) { var e = n(t, (function (t) { return 500 === r.size && r.clear(), t; })), r = e.cache; return e; }; }, 9191: (t, e, r) => { var n = r(8761)(Object, "create"); t.exports = n; }, 4248: (t, e, r) => { var n = r(241)(Object.keys, Object); t.exports = n; }, 2966: t => { t.exports = function (t) { var e = []; if (null != t)
        for (var r in Object(t))
            e.push(r); return e; }; }, 4146: (t, e, r) => { t = r.nmd(t); var n = r(1242), o = e && !e.nodeType && e, i = o && t && !t.nodeType && t, a = i && i.exports === o && n.process, s = function () { try {
        return i && i.require && i.require("util").types || a && a.binding && a.binding("util");
    }
    catch (t) { } }(); t.exports = s; }, 7157: t => { var e = Object.prototype.toString; t.exports = function (t) { return e.call(t); }; }, 241: t => { t.exports = function (t, e) { return function (r) { return t(e(r)); }; }; }, 3114: (t, e, r) => { var n = r(9432), o = Math.max; t.exports = function (t, e, r) { return e = o(void 0 === e ? t.length - 1 : e, 0), function () { for (var i = arguments, a = -1, s = o(i.length - e, 0), u = Array(s); ++a < s;)
        u[a] = i[e + a]; a = -1; for (var c = Array(e + 1); ++a < e;)
        c[a] = i[a]; return c[e] = r(u), n(t, this, c); }; }; }, 7772: (t, e, r) => { var n = r(1242), o = "object" == typeof self && self && self.Object === Object && self, i = n || o || Function("return this")(); t.exports = i; }, 2842: t => { t.exports = function (t) { return this.__data__.set(t, "__lodash_hash_undefined__"), this; }; }, 2482: t => { t.exports = function (t) { return this.__data__.has(t); }; }, 4207: t => { t.exports = function (t) { var e = -1, r = Array(t.size); return t.forEach((function (t) { r[++e] = t; })), r; }; }, 5251: (t, e, r) => { var n = r(6532), o = r(7787)(n); t.exports = o; }, 7787: t => { var e = Date.now; t.exports = function (t) { var r = 0, n = 0; return function () { var o = e(), i = 16 - (o - n); if (n = o, i > 0) {
        if (++r >= 800)
            return arguments[0];
    }
    else
        r = 0; return t.apply(void 0, arguments); }; }; }, 5243: (t, e, r) => { var n = r(235); t.exports = function () { this.__data__ = new n, this.size = 0; }; }, 2858: t => { t.exports = function (t) { var e = this.__data__, r = e.delete(t); return this.size = e.size, r; }; }, 4417: t => { t.exports = function (t) { return this.__data__.get(t); }; }, 8605: t => { t.exports = function (t) { return this.__data__.has(t); }; }, 1418: (t, e, r) => { var n = r(235), o = r(326), i = r(6738); t.exports = function (t, e) { var r = this.__data__; if (r instanceof n) {
        var a = r.__data__;
        if (!o || a.length < 199)
            return a.push([t, e]), this.size = ++r.size, this;
        r = this.__data__ = new i(a);
    } return r.set(t, e), this.size = r.size, this; }; }, 6024: t => { t.exports = function (t, e, r) { for (var n = r - 1, o = t.length; ++n < o;)
        if (t[n] === e)
            return n; return -1; }; }, 8435: (t, e, r) => { var n = r(217), o = r(3880), i = r(3344); t.exports = function (t) { return o(t) ? i(t) : n(t); }; }, 4452: (t, e, r) => { var n = r(7777), o = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, i = /\\(\\)?/g, a = n((function (t) { var e = []; return 46 === t.charCodeAt(0) && e.push(""), t.replace(o, (function (t, r, n, o) { e.push(n ? o.replace(i, "$1") : r || t); })), e; })); t.exports = a; }, 3812: (t, e, r) => { var n = r(4795); t.exports = function (t) { if ("string" == typeof t || n(t))
        return t; var e = t + ""; return "0" == e && 1 / t == -1 / 0 ? "-0" : e; }; }, 7035: t => { var e = Function.prototype.toString; t.exports = function (t) { if (null != t) {
        try {
            return e.call(t);
        }
        catch (t) { }
        try {
            return t + "";
        }
        catch (t) { }
    } return ""; }; }, 2153: t => { var e = /\s/; t.exports = function (t) { for (var r = t.length; r-- && e.test(t.charAt(r));)
        ; return r; }; }, 3344: t => { var e = "[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]", r = "\\ud83c[\\udffb-\\udfff]", n = "[^\\ud800-\\udfff]", o = "(?:\\ud83c[\\udde6-\\uddff]){2}", i = "[\\ud800-\\udbff][\\udc00-\\udfff]", a = "(?:" + e + "|" + r + ")?", s = "[\\ufe0e\\ufe0f]?", u = s + a + "(?:\\u200d(?:" + [n, o, i].join("|") + ")" + s + a + ")*", c = "(?:" + [n + e + "?", e, o, i, "[\\ud800-\\udfff]"].join("|") + ")", l = RegExp(r + "(?=" + r + ")|" + c + u, "g"); t.exports = function (t) { return t.match(l) || []; }; }, 19: (t, e, r) => { var n = r(91), o = r(752), i = r(7263), a = r(7878), s = r(6001), u = r(249), c = Object.prototype.hasOwnProperty, l = i((function (t, e) { if (s(e) || a(e))
        o(e, u(e), t);
    else
        for (var r in e)
            c.call(e, r) && n(t, r, e[r]); })); t.exports = l; }, 4004: (t, e, r) => { var n = r(8874); t.exports = function (t) { return n(t, 4); }; }, 417: t => { t.exports = function (t) { for (var e = -1, r = null == t ? 0 : t.length, n = 0, o = []; ++e < r;) {
        var i = t[e];
        i && (o[n++] = i);
    } return o; }; }, 6874: t => { t.exports = function (t) { return function () { return t; }; }; }, 4573: (t, e, r) => { var n = r(6060), o = r(1225), i = r(2406), a = r(8582), s = Object.prototype, u = s.hasOwnProperty, c = n((function (t, e) { t = Object(t); var r = -1, n = e.length, c = n > 2 ? e[2] : void 0; for (c && i(e[0], e[1], c) && (n = 1); ++r < n;)
        for (var l = e[r], f = a(l), p = -1, d = f.length; ++p < d;) {
            var h = f[p], v = t[h];
            (void 0 === v || o(v, s[h]) && !u.call(t, h)) && (t[h] = l[h]);
        } return t; })); t.exports = c; }, 7335: (t, e, r) => { var n = r(5246), o = r(2034), i = r(6060), a = r(3746), s = i((function (t, e) { return a(t) ? n(t, o(e, 1, a, !0)) : []; })); t.exports = s; }, 7264: (t, e, r) => { var n = r(9872), o = r(8101); t.exports = function (t, e, r) { var i = null == t ? 0 : t.length; return i ? (e = r || void 0 === e ? 1 : o(e), n(t, e < 0 ? 0 : e, i)) : []; }; }, 4934: (t, e, r) => { var n = r(9872), o = r(8101); t.exports = function (t, e, r) { var i = null == t ? 0 : t.length; return i ? (e = r || void 0 === e ? 1 : o(e), n(t, 0, (e = i - e) < 0 ? 0 : e)) : []; }; }, 1225: t => { t.exports = function (t, e) { return t === e || t != t && e != e; }; }, 9794: (t, e, r) => { var n = r(7603), o = r(80), i = r(8286), a = r(6152), s = r(2406); t.exports = function (t, e, r) { var u = a(t) ? n : o; return r && s(t, e, r) && (e = void 0), u(t, i(e, 3)); }; }, 882: (t, e, r) => { var n = r(7552), o = r(8043), i = r(8286), a = r(6152); t.exports = function (t, e) { return (a(t) ? n : o)(t, i(e, 3)); }; }, 5281: (t, e, r) => { var n = r(8776)(r(2982)); t.exports = n; }, 2982: (t, e, r) => { var n = r(1359), o = r(8286), i = r(8101), a = Math.max; t.exports = function (t, e, r) { var s = null == t ? 0 : t.length; if (!s)
        return -1; var u = null == r ? 0 : i(r); return u < 0 && (u = a(s + u, 0)), n(t, o(e, 3), u); }; }, 3237: (t, e, r) => { t.exports = r(1092); }, 5838: (t, e, r) => { var n = r(2034), o = r(6760); t.exports = function (t, e) { return n(o(t, e), 1); }; }, 5676: (t, e, r) => { var n = r(2034); t.exports = function (t) { return null != t && t.length ? n(t, 1) : []; }; }, 9756: (t, e, r) => { var n = r(2517), o = r(4303), i = r(9419), a = r(6152); t.exports = function (t, e) { return (a(t) ? n : o)(t, i(e)); }; }, 2579: (t, e, r) => { var n = r(3324); t.exports = function (t, e, r) { var o = null == t ? void 0 : n(t, e); return void 0 === o ? r : o; }; }, 3440: (t, e, r) => { var n = r(3940), o = r(6740), i = Object.prototype.hasOwnProperty, a = o((function (t, e, r) { i.call(t, r) ? t[r].push(e) : n(t, r, [e]); })); t.exports = a; }, 3352: (t, e, r) => { var n = r(2726), o = r(1369); t.exports = function (t, e) { return null != t && o(t, e, n); }; }, 5041: (t, e, r) => { var n = r(187), o = r(1369); t.exports = function (t, e) { return null != t && o(t, e, n); }; }, 1092: t => { t.exports = function (t) { return t && t.length ? t[0] : void 0; }; }, 3059: t => { t.exports = function (t) { return t; }; }, 1886: (t, e, r) => { var n = r(7832), o = r(7878), i = r(5505), a = r(8101), s = r(8346), u = Math.max; t.exports = function (t, e, r, c) { t = o(t) ? t : s(t), r = r && !c ? a(r) : 0; var l = t.length; return r < 0 && (r = u(l + r, 0)), i(t) ? r <= l && t.indexOf(e, r) > -1 : !!l && n(t, e, r) > -1; }; }, 3493: (t, e, r) => { var n = r(7832), o = r(8101), i = Math.max; t.exports = function (t, e, r) { var a = null == t ? 0 : t.length; if (!a)
        return -1; var s = null == r ? 0 : o(r); return s < 0 && (s = i(a + s, 0)), n(t, e, s); }; }, 9631: (t, e, r) => { var n = r(5183), o = r(5125), i = Object.prototype, a = i.hasOwnProperty, s = i.propertyIsEnumerable, u = n(function () { return arguments; }()) ? n : function (t) { return o(t) && a.call(t, "callee") && !s.call(t, "callee"); }; t.exports = u; }, 6152: t => { var e = Array.isArray; t.exports = e; }, 7878: (t, e, r) => { var n = r(1049), o = r(1158); t.exports = function (t) { return null != t && o(t.length) && !n(t); }; }, 3746: (t, e, r) => { var n = r(7878), o = r(5125); t.exports = function (t) { return o(t) && n(t); }; }, 3226: (t, e, r) => { t = r.nmd(t); var n = r(7772), o = r(6330), i = e && !e.nodeType && e, a = i && t && !t.nodeType && t, s = a && a.exports === i ? n.Buffer : void 0, u = (s ? s.isBuffer : void 0) || o; t.exports = u; }, 5455: (t, e, r) => { var n = r(6411), o = r(940), i = r(9631), a = r(6152), s = r(7878), u = r(3226), c = r(6001), l = r(7598), f = Object.prototype.hasOwnProperty; t.exports = function (t) { if (null == t)
        return !0; if (s(t) && (a(t) || "string" == typeof t || "function" == typeof t.splice || u(t) || l(t) || i(t)))
        return !t.length; var e = o(t); if ("[object Map]" == e || "[object Set]" == e)
        return !t.size; if (c(t))
        return !n(t).length; for (var r in t)
        if (f.call(t, r))
            return !1; return !0; }; }, 1049: (t, e, r) => { var n = r(3366), o = r(9259); t.exports = function (t) { if (!o(t))
        return !1; var e = n(t); return "[object Function]" == e || "[object GeneratorFunction]" == e || "[object AsyncFunction]" == e || "[object Proxy]" == e; }; }, 1158: t => { t.exports = function (t) { return "number" == typeof t && t > -1 && t % 1 == 0 && t <= 9007199254740991; }; }, 4714: (t, e, r) => { var n = r(4511), o = r(7826), i = r(4146), a = i && i.isMap, s = a ? o(a) : n; t.exports = s; }, 9259: t => { t.exports = function (t) { var e = typeof t; return null != t && ("object" == e || "function" == e); }; }, 5125: t => { t.exports = function (t) { return null != t && "object" == typeof t; }; }, 859: (t, e, r) => { var n = r(4333), o = r(7826), i = r(4146), a = i && i.isRegExp, s = a ? o(a) : n; t.exports = s; }, 3679: (t, e, r) => { var n = r(8436), o = r(7826), i = r(4146), a = i && i.isSet, s = a ? o(a) : n; t.exports = s; }, 5505: (t, e, r) => { var n = r(3366), o = r(6152), i = r(5125); t.exports = function (t) { return "string" == typeof t || !o(t) && i(t) && "[object String]" == n(t); }; }, 4795: (t, e, r) => { var n = r(3366), o = r(5125); t.exports = function (t) { return "symbol" == typeof t || o(t) && "[object Symbol]" == n(t); }; }, 7598: (t, e, r) => { var n = r(5522), o = r(7826), i = r(4146), a = i && i.isTypedArray, s = a ? o(a) : n; t.exports = s; }, 4336: t => { t.exports = function (t) { return void 0 === t; }; }, 249: (t, e, r) => { var n = r(1634), o = r(6411), i = r(7878); t.exports = function (t) { return i(t) ? n(t) : o(t); }; }, 8582: (t, e, r) => { var n = r(1634), o = r(8390), i = r(7878); t.exports = function (t) { return i(t) ? n(t, !0) : o(t); }; }, 6974: t => { t.exports = function (t) { var e = null == t ? 0 : t.length; return e ? t[e - 1] : void 0; }; }, 6760: (t, e, r) => { var n = r(343), o = r(8286), i = r(3401), a = r(6152); t.exports = function (t, e) { return (a(t) ? n : i)(t, o(e, 3)); }; }, 733: (t, e, r) => { var n = r(6738); function o(t, e) { if ("function" != typeof t || null != e && "function" != typeof e)
        throw new TypeError("Expected a function"); var r = function () { var n = arguments, o = e ? e.apply(this, n) : n[0], i = r.cache; if (i.has(o))
        return i.get(o); var a = t.apply(this, n); return r.cache = i.set(o, a) || i, a; }; return r.cache = new (o.Cache || n), r; } o.Cache = n, t.exports = o; }, 1570: t => { t.exports = function (t) { if ("function" != typeof t)
        throw new TypeError("Expected a function"); return function () { var e = arguments; switch (e.length) {
        case 0: return !t.call(this);
        case 1: return !t.call(this, e[0]);
        case 2: return !t.call(this, e[0], e[1]);
        case 3: return !t.call(this, e[0], e[1], e[2]);
    } return !t.apply(this, e); }; }; }, 4291: t => { t.exports = function () { }; }, 2208: (t, e, r) => { var n = r(343), o = r(8286), i = r(3759), a = r(6939); t.exports = function (t, e) { if (null == t)
        return {}; var r = n(a(t), (function (t) { return [t]; })); return e = o(e), i(t, r, (function (t, r) { return e(t, r[0]); })); }; }, 5798: (t, e, r) => { var n = r(256), o = r(2952), i = r(1401), a = r(3812); t.exports = function (t) { return i(t) ? n(a(t)) : o(t); }; }, 8215: (t, e, r) => { var n = r(1207), o = r(4303), i = r(8286), a = r(5877), s = r(6152); t.exports = function (t, e, r) { var u = s(t) ? n : a, c = arguments.length < 3; return u(t, i(e, 4), r, c, o); }; }, 2070: (t, e, r) => { var n = r(7552), o = r(8043), i = r(8286), a = r(6152), s = r(1570); t.exports = function (t, e) { return (a(t) ? n : o)(t, s(i(e, 3))); }; }, 1525: (t, e, r) => { var n = r(7064), o = r(8286), i = r(4751), a = r(6152), s = r(2406); t.exports = function (t, e, r) { var u = a(t) ? n : i; return r && s(t, e, r) && (e = void 0), u(t, o(e, 3)); }; }, 981: t => { t.exports = function () { return []; }; }, 6330: t => { t.exports = function () { return !1; }; }, 5707: (t, e, r) => { var n = r(7642); t.exports = function (t) { return t ? Infinity === (t = n(t)) || t === -1 / 0 ? 17976931348623157e292 * (t < 0 ? -1 : 1) : t == t ? t : 0 : 0 === t ? t : 0; }; }, 8101: (t, e, r) => { var n = r(5707); t.exports = function (t) { var e = n(t), r = e % 1; return e == e ? r ? e - r : e : 0; }; }, 7642: (t, e, r) => { var n = r(1704), o = r(9259), i = r(4795), a = /^[-+]0x[0-9a-f]+$/i, s = /^0b[01]+$/i, u = /^0o[0-7]+$/i, c = parseInt; t.exports = function (t) { if ("number" == typeof t)
        return t; if (i(t))
        return NaN; if (o(t)) {
        var e = "function" == typeof t.valueOf ? t.valueOf() : t;
        t = o(e) ? e + "" : e;
    } if ("string" != typeof t)
        return 0 === t ? t : +t; t = n(t); var r = s.test(t); return r || u.test(t) ? c(t.slice(2), r ? 2 : 8) : a.test(t) ? NaN : +t; }; }, 6188: (t, e, r) => { var n = r(1054); t.exports = function (t) { return null == t ? "" : n(t); }; }, 5652: (t, e, r) => { var n = r(7326); t.exports = function (t) { return t && t.length ? n(t) : []; }; }, 3779: (t, e, r) => { var n = r(3126)("toUpperCase"); t.exports = n; }, 8346: (t, e, r) => { var n = r(753), o = r(249); t.exports = function (t) { return null == t ? [] : n(t, o(t)); }; }, 4844: function (t, e) { var r, n; "undefined" != typeof self && self, void 0 === (n = "function" == typeof (r = function () { function t() { } t.prototype.saveState = function () { return { idx: this.idx, input: this.input, groupIdx: this.groupIdx }; }, t.prototype.restoreState = function (t) { this.idx = t.idx, this.input = t.input, this.groupIdx = t.groupIdx; }, t.prototype.pattern = function (t) { this.idx = 0, this.input = t, this.groupIdx = 0, this.consumeChar("/"); var e = this.disjunction(); this.consumeChar("/"); for (var r = { type: "Flags", loc: { begin: this.idx, end: t.length }, global: !1, ignoreCase: !1, multiLine: !1, unicode: !1, sticky: !1 }; this.isRegExpFlag();)
        switch (this.popChar()) {
            case "g":
                s(r, "global");
                break;
            case "i":
                s(r, "ignoreCase");
                break;
            case "m":
                s(r, "multiLine");
                break;
            case "u":
                s(r, "unicode");
                break;
            case "y": s(r, "sticky");
        } if (this.idx !== this.input.length)
        throw Error("Redundant input: " + this.input.substring(this.idx)); return { type: "Pattern", flags: r, value: e, loc: this.loc(0) }; }, t.prototype.disjunction = function () { var t = [], e = this.idx; for (t.push(this.alternative()); "|" === this.peekChar();)
        this.consumeChar("|"), t.push(this.alternative()); return { type: "Disjunction", value: t, loc: this.loc(e) }; }, t.prototype.alternative = function () { for (var t = [], e = this.idx; this.isTerm();)
        t.push(this.term()); return { type: "Alternative", value: t, loc: this.loc(e) }; }, t.prototype.term = function () { return this.isAssertion() ? this.assertion() : this.atom(); }, t.prototype.assertion = function () { var t = this.idx; switch (this.popChar()) {
        case "^": return { type: "StartAnchor", loc: this.loc(t) };
        case "$": return { type: "EndAnchor", loc: this.loc(t) };
        case "\\":
            switch (this.popChar()) {
                case "b": return { type: "WordBoundary", loc: this.loc(t) };
                case "B": return { type: "NonWordBoundary", loc: this.loc(t) };
            }
            throw Error("Invalid Assertion Escape");
        case "(":
            var e;
            switch (this.consumeChar("?"), this.popChar()) {
                case "=":
                    e = "Lookahead";
                    break;
                case "!": e = "NegativeLookahead";
            }
            u(e);
            var r = this.disjunction();
            return this.consumeChar(")"), { type: e, value: r, loc: this.loc(t) };
    } !function () { throw Error("Internal Error - Should never get here!"); }(); }, t.prototype.quantifier = function (t) { var e, r = this.idx; switch (this.popChar()) {
        case "*":
            e = { atLeast: 0, atMost: 1 / 0 };
            break;
        case "+":
            e = { atLeast: 1, atMost: 1 / 0 };
            break;
        case "?":
            e = { atLeast: 0, atMost: 1 };
            break;
        case "{":
            var n = this.integerIncludingZero();
            switch (this.popChar()) {
                case "}":
                    e = { atLeast: n, atMost: n };
                    break;
                case ",": e = this.isDigit() ? { atLeast: n, atMost: this.integerIncludingZero() } : { atLeast: n, atMost: 1 / 0 }, this.consumeChar("}");
            }
            if (!0 === t && void 0 === e)
                return;
            u(e);
    } if (!0 !== t || void 0 !== e)
        return u(e), "?" === this.peekChar(0) ? (this.consumeChar("?"), e.greedy = !1) : e.greedy = !0, e.type = "Quantifier", e.loc = this.loc(r), e; }, t.prototype.atom = function () { var t, e = this.idx; switch (this.peekChar()) {
        case ".":
            t = this.dotAll();
            break;
        case "\\":
            t = this.atomEscape();
            break;
        case "[":
            t = this.characterClass();
            break;
        case "(": t = this.group();
    } return void 0 === t && this.isPatternCharacter() && (t = this.patternCharacter()), u(t), t.loc = this.loc(e), this.isQuantifier() && (t.quantifier = this.quantifier()), t; }, t.prototype.dotAll = function () { return this.consumeChar("."), { type: "Set", complement: !0, value: [i("\n"), i("\r"), i("\u2028"), i("\u2029")] }; }, t.prototype.atomEscape = function () { switch (this.consumeChar("\\"), this.peekChar()) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": return this.decimalEscapeAtom();
        case "d":
        case "D":
        case "s":
        case "S":
        case "w":
        case "W": return this.characterClassEscape();
        case "f":
        case "n":
        case "r":
        case "t":
        case "v": return this.controlEscapeAtom();
        case "c": return this.controlLetterEscapeAtom();
        case "0": return this.nulCharacterAtom();
        case "x": return this.hexEscapeSequenceAtom();
        case "u": return this.regExpUnicodeEscapeSequenceAtom();
        default: return this.identityEscapeAtom();
    } }, t.prototype.decimalEscapeAtom = function () { return { type: "GroupBackReference", value: this.positiveInteger() }; }, t.prototype.characterClassEscape = function () { var t, e = !1; switch (this.popChar()) {
        case "d":
            t = c;
            break;
        case "D":
            t = c, e = !0;
            break;
        case "s":
            t = f;
            break;
        case "S":
            t = f, e = !0;
            break;
        case "w":
            t = l;
            break;
        case "W": t = l, e = !0;
    } return u(t), { type: "Set", value: t, complement: e }; }, t.prototype.controlEscapeAtom = function () { var t; switch (this.popChar()) {
        case "f":
            t = i("\f");
            break;
        case "n":
            t = i("\n");
            break;
        case "r":
            t = i("\r");
            break;
        case "t":
            t = i("\t");
            break;
        case "v": t = i("\v");
    } return u(t), { type: "Character", value: t }; }, t.prototype.controlLetterEscapeAtom = function () { this.consumeChar("c"); var t = this.popChar(); if (!1 === /[a-zA-Z]/.test(t))
        throw Error("Invalid "); return { type: "Character", value: t.toUpperCase().charCodeAt(0) - 64 }; }, t.prototype.nulCharacterAtom = function () { return this.consumeChar("0"), { type: "Character", value: i("\0") }; }, t.prototype.hexEscapeSequenceAtom = function () { return this.consumeChar("x"), this.parseHexDigits(2); }, t.prototype.regExpUnicodeEscapeSequenceAtom = function () { return this.consumeChar("u"), this.parseHexDigits(4); }, t.prototype.identityEscapeAtom = function () { return { type: "Character", value: i(this.popChar()) }; }, t.prototype.classPatternCharacterAtom = function () { switch (this.peekChar()) {
        case "\n":
        case "\r":
        case "\u2028":
        case "\u2029":
        case "\\":
        case "]": throw Error("TBD");
        default: return { type: "Character", value: i(this.popChar()) };
    } }, t.prototype.characterClass = function () { var t = [], e = !1; for (this.consumeChar("["), "^" === this.peekChar(0) && (this.consumeChar("^"), e = !0); this.isClassAtom();) {
        var r = this.classAtom();
        if ("Character" === r.type && this.isRangeDash()) {
            this.consumeChar("-");
            var n = this.classAtom();
            if ("Character" === n.type) {
                if (n.value < r.value)
                    throw Error("Range out of order in character class");
                t.push({ from: r.value, to: n.value });
            }
            else
                a(r.value, t), t.push(i("-")), a(n.value, t);
        }
        else
            a(r.value, t);
    } return this.consumeChar("]"), { type: "Set", complement: e, value: t }; }, t.prototype.classAtom = function () { switch (this.peekChar()) {
        case "]":
        case "\n":
        case "\r":
        case "\u2028":
        case "\u2029": throw Error("TBD");
        case "\\": return this.classEscape();
        default: return this.classPatternCharacterAtom();
    } }, t.prototype.classEscape = function () { switch (this.consumeChar("\\"), this.peekChar()) {
        case "b": return this.consumeChar("b"), { type: "Character", value: i("\b") };
        case "d":
        case "D":
        case "s":
        case "S":
        case "w":
        case "W": return this.characterClassEscape();
        case "f":
        case "n":
        case "r":
        case "t":
        case "v": return this.controlEscapeAtom();
        case "c": return this.controlLetterEscapeAtom();
        case "0": return this.nulCharacterAtom();
        case "x": return this.hexEscapeSequenceAtom();
        case "u": return this.regExpUnicodeEscapeSequenceAtom();
        default: return this.identityEscapeAtom();
    } }, t.prototype.group = function () { var t = !0; switch (this.consumeChar("("), this.peekChar(0)) {
        case "?":
            this.consumeChar("?"), this.consumeChar(":"), t = !1;
            break;
        default: this.groupIdx++;
    } var e = this.disjunction(); this.consumeChar(")"); var r = { type: "Group", capturing: t, value: e }; return t && (r.idx = this.groupIdx), r; }, t.prototype.positiveInteger = function () { var t = this.popChar(); if (!1 === o.test(t))
        throw Error("Expecting a positive integer"); for (; n.test(this.peekChar(0));)
        t += this.popChar(); return parseInt(t, 10); }, t.prototype.integerIncludingZero = function () { var t = this.popChar(); if (!1 === n.test(t))
        throw Error("Expecting an integer"); for (; n.test(this.peekChar(0));)
        t += this.popChar(); return parseInt(t, 10); }, t.prototype.patternCharacter = function () { var t = this.popChar(); switch (t) {
        case "\n":
        case "\r":
        case "\u2028":
        case "\u2029":
        case "^":
        case "$":
        case "\\":
        case ".":
        case "*":
        case "+":
        case "?":
        case "(":
        case ")":
        case "[":
        case "|": throw Error("TBD");
        default: return { type: "Character", value: i(t) };
    } }, t.prototype.isRegExpFlag = function () { switch (this.peekChar(0)) {
        case "g":
        case "i":
        case "m":
        case "u":
        case "y": return !0;
        default: return !1;
    } }, t.prototype.isRangeDash = function () { return "-" === this.peekChar() && this.isClassAtom(1); }, t.prototype.isDigit = function () { return n.test(this.peekChar(0)); }, t.prototype.isClassAtom = function (t) { switch (void 0 === t && (t = 0), this.peekChar(t)) {
        case "]":
        case "\n":
        case "\r":
        case "\u2028":
        case "\u2029": return !1;
        default: return !0;
    } }, t.prototype.isTerm = function () { return this.isAtom() || this.isAssertion(); }, t.prototype.isAtom = function () { if (this.isPatternCharacter())
        return !0; switch (this.peekChar(0)) {
        case ".":
        case "\\":
        case "[":
        case "(": return !0;
        default: return !1;
    } }, t.prototype.isAssertion = function () { switch (this.peekChar(0)) {
        case "^":
        case "$": return !0;
        case "\\": switch (this.peekChar(1)) {
            case "b":
            case "B": return !0;
            default: return !1;
        }
        case "(": return "?" === this.peekChar(1) && ("=" === this.peekChar(2) || "!" === this.peekChar(2));
        default: return !1;
    } }, t.prototype.isQuantifier = function () { var t = this.saveState(); try {
        return void 0 !== this.quantifier(!0);
    }
    catch (t) {
        return !1;
    }
    finally {
        this.restoreState(t);
    } }, t.prototype.isPatternCharacter = function () { switch (this.peekChar()) {
        case "^":
        case "$":
        case "\\":
        case ".":
        case "*":
        case "+":
        case "?":
        case "(":
        case ")":
        case "[":
        case "|":
        case "/":
        case "\n":
        case "\r":
        case "\u2028":
        case "\u2029": return !1;
        default: return !0;
    } }, t.prototype.parseHexDigits = function (t) { for (var e = "", n = 0; n < t; n++) {
        var o = this.popChar();
        if (!1 === r.test(o))
            throw Error("Expecting a HexDecimal digits");
        e += o;
    } return { type: "Character", value: parseInt(e, 16) }; }, t.prototype.peekChar = function (t) { return void 0 === t && (t = 0), this.input[this.idx + t]; }, t.prototype.popChar = function () { var t = this.peekChar(0); return this.consumeChar(), t; }, t.prototype.consumeChar = function (t) { if (void 0 !== t && this.input[this.idx] !== t)
        throw Error("Expected: '" + t + "' but found: '" + this.input[this.idx] + "' at offset: " + this.idx); if (this.idx >= this.input.length)
        throw Error("Unexpected end of input"); this.idx++; }, t.prototype.loc = function (t) { return { begin: t, end: this.idx }; }; var e, r = /[0-9a-fA-F]/, n = /[0-9]/, o = /[1-9]/; function i(t) { return t.charCodeAt(0); } function a(t, e) { void 0 !== t.length ? t.forEach((function (t) { e.push(t); })) : e.push(t); } function s(t, e) { if (!0 === t[e])
        throw "duplicate flag " + e; t[e] = !0; } function u(t) { if (void 0 === t)
        throw Error("Internal Error - Should never get here!"); } var c = []; for (e = i("0"); e <= i("9"); e++)
        c.push(e); var l = [i("_")].concat(c); for (e = i("a"); e <= i("z"); e++)
        l.push(e); for (e = i("A"); e <= i("Z"); e++)
        l.push(e); var f = [i(" "), i("\f"), i("\n"), i("\r"), i("\t"), i("\v"), i("\t"), i(" "), i(" "), i(" "), i(" "), i(" "), i(" "), i(" "), i(" "), i(" "), i(" "), i(" "), i(" "), i(" "), i("\u2028"), i("\u2029"), i(" "), i(" "), i("　"), i("\ufeff")]; function p() { } return p.prototype.visitChildren = function (t) { for (var e in t) {
        var r = t[e];
        t.hasOwnProperty(e) && (void 0 !== r.type ? this.visit(r) : Array.isArray(r) && r.forEach((function (t) { this.visit(t); }), this));
    } }, p.prototype.visit = function (t) { switch (t.type) {
        case "Pattern":
            this.visitPattern(t);
            break;
        case "Flags":
            this.visitFlags(t);
            break;
        case "Disjunction":
            this.visitDisjunction(t);
            break;
        case "Alternative":
            this.visitAlternative(t);
            break;
        case "StartAnchor":
            this.visitStartAnchor(t);
            break;
        case "EndAnchor":
            this.visitEndAnchor(t);
            break;
        case "WordBoundary":
            this.visitWordBoundary(t);
            break;
        case "NonWordBoundary":
            this.visitNonWordBoundary(t);
            break;
        case "Lookahead":
            this.visitLookahead(t);
            break;
        case "NegativeLookahead":
            this.visitNegativeLookahead(t);
            break;
        case "Character":
            this.visitCharacter(t);
            break;
        case "Set":
            this.visitSet(t);
            break;
        case "Group":
            this.visitGroup(t);
            break;
        case "GroupBackReference":
            this.visitGroupBackReference(t);
            break;
        case "Quantifier": this.visitQuantifier(t);
    } this.visitChildren(t); }, p.prototype.visitPattern = function (t) { }, p.prototype.visitFlags = function (t) { }, p.prototype.visitDisjunction = function (t) { }, p.prototype.visitAlternative = function (t) { }, p.prototype.visitStartAnchor = function (t) { }, p.prototype.visitEndAnchor = function (t) { }, p.prototype.visitWordBoundary = function (t) { }, p.prototype.visitNonWordBoundary = function (t) { }, p.prototype.visitLookahead = function (t) { }, p.prototype.visitNegativeLookahead = function (t) { }, p.prototype.visitCharacter = function (t) { }, p.prototype.visitSet = function (t) { }, p.prototype.visitGroup = function (t) { }, p.prototype.visitGroupBackReference = function (t) { }, p.prototype.visitQuantifier = function (t) { }, { RegExpParser: t, BaseRegExpVisitor: p, VERSION: "0.5.0" }; }) ? r.apply(e, []) : r) || (t.exports = n); }, 5781: (t, e, r) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.createSyntaxDiagramsCode = void 0;
        var n = r(7979);
        e.createSyntaxDiagramsCode = function (t, e) { var r = void 0 === e ? {} : e, o = r.resourceBase, i = void 0 === o ? "https://unpkg.com/chevrotain@".concat(n.VERSION, "/diagrams/") : o, a = r.css, s = void 0 === a ? "https://unpkg.com/chevrotain@".concat(n.VERSION, "/diagrams/diagrams.css") : a; return '\n\x3c!-- This is a generated file --\x3e\n<!DOCTYPE html>\n<meta charset="utf-8">\n<style>\n  body {\n    background-color: hsl(30, 20%, 95%)\n  }\n</style>\n\n' + "\n<link rel='stylesheet' href='".concat(s, "'>\n") + "\n<script src='".concat(i, "vendor/railroad-diagrams.js'><\/script>\n<script src='").concat(i, "src/diagrams_builder.js'><\/script>\n<script src='").concat(i, "src/diagrams_behavior.js'><\/script>\n<script src='").concat(i, "src/main.js'><\/script>\n") + '\n<div id="diagrams" align="center"></div>    \n' + "\n<script>\n    window.serializedGrammar = ".concat(JSON.stringify(t, null, "  "), ";\n<\/script>\n") + '\n<script>\n    var diagramsDiv = document.getElementById("diagrams");\n    main.drawDiagramsFromSerializedGrammar(serializedGrammar, diagramsDiv);\n<\/script>\n'; };
    }, 4105: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.defineNameProp = void 0, e.defineNameProp = function (t, e) { Object.defineProperty(t, "name", { enumerable: !1, configurable: !0, writable: !1, value: e }); };
    }, 3710: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.IN = void 0, e.IN = "_~IN~_";
    }, 7485: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.addNoneTerminalToCst = e.addTerminalToCst = e.setNodeLocationFull = e.setNodeLocationOnlyOffset = void 0, e.setNodeLocationOnlyOffset = function (t, e) { !0 === isNaN(t.startOffset) ? (t.startOffset = e.startOffset, t.endOffset = e.endOffset) : t.endOffset < e.endOffset == 1 && (t.endOffset = e.endOffset); }, e.setNodeLocationFull = function (t, e) { !0 === isNaN(t.startOffset) ? (t.startOffset = e.startOffset, t.startColumn = e.startColumn, t.startLine = e.startLine, t.endOffset = e.endOffset, t.endColumn = e.endColumn, t.endLine = e.endLine) : t.endOffset < e.endOffset == 1 && (t.endOffset = e.endOffset, t.endColumn = e.endColumn, t.endLine = e.endLine); }, e.addTerminalToCst = function (t, e, r) { void 0 === t.children[r] ? t.children[r] = [e] : t.children[r].push(e); }, e.addNoneTerminalToCst = function (t, e, r) { void 0 === t.children[e] ? t.children[e] = [r] : t.children[e].push(r); };
    }, 8169: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.validateRedundantMethods = e.validateMissingCstMethods = e.validateVisitor = e.CstVisitorDefinitionError = e.createBaseVisitorConstructorWithDefaults = e.createBaseSemanticVisitorConstructor = e.defaultVisit = void 0;
        var o, i = n(r(5455)), a = n(r(417)), s = n(r(6152)), u = n(r(6760)), c = n(r(9756)), l = n(r(882)), f = n(r(249)), p = n(r(1049)), d = n(r(4336)), h = n(r(1886)), v = r(4105);
        function y(t, e) { for (var r = (0, f.default)(t), n = r.length, o = 0; o < n; o++)
            for (var i = t[r[o]], a = i.length, s = 0; s < a; s++) {
                var u = i[s];
                void 0 === u.tokenTypeIdx && this[u.name](u.children, e);
            } }
        function m(t, e) { var r = T(t, e), n = _(t, e); return r.concat(n); }
        function T(t, e) { var r = (0, l.default)(e, (function (e) { return !1 === (0, p.default)(t[e]); })), n = (0, u.default)(r, (function (e) { return { msg: "Missing visitor method: <".concat(e, "> on ").concat(t.constructor.name, " CST Visitor."), type: o.MISSING_METHOD, methodName: e }; })); return (0, a.default)(n); }
        e.defaultVisit = y, e.createBaseSemanticVisitorConstructor = function (t, e) { var r = function () { }; return (0, v.defineNameProp)(r, t + "BaseSemantics"), (r.prototype = { visit: function (t, e) { if ((0, s.default)(t) && (t = t[0]), !(0, d.default)(t))
                return this[t.name](t.children, e); }, validateVisitor: function () { var t = m(this, e); if (!(0, i.default)(t)) {
                var r = (0, u.default)(t, (function (t) { return t.msg; }));
                throw Error("Errors Detected in CST Visitor <".concat(this.constructor.name, ">:\n\t") + "".concat(r.join("\n\n").replace(/\n/g, "\n\t")));
            } } }).constructor = r, r._RULE_NAMES = e, r; }, e.createBaseVisitorConstructorWithDefaults = function (t, e, r) { var n = function () { }; (0, v.defineNameProp)(n, t + "BaseSemanticsWithDefaults"); var o = Object.create(r.prototype); return (0, c.default)(e, (function (t) { o[t] = y; })), (n.prototype = o).constructor = n, n; }, function (t) { t[t.REDUNDANT_METHOD = 0] = "REDUNDANT_METHOD", t[t.MISSING_METHOD = 1] = "MISSING_METHOD"; }(o = e.CstVisitorDefinitionError || (e.CstVisitorDefinitionError = {})), e.validateVisitor = m, e.validateMissingCstMethods = T;
        var E = ["constructor", "visit", "validateVisitor"];
        function _(t, e) { var r = []; for (var n in t)
            !(0, p.default)(t[n]) || (0, h.default)(E, n) || (0, h.default)(e, n) || r.push({ msg: "Redundant visitor method: <".concat(n, "> on ").concat(t.constructor.name, " CST Visitor\n") + "There is no Grammar Rule corresponding to this method's name.\n", type: o.REDUNDANT_METHOD, methodName: n }); return r; }
        e.validateRedundantMethods = _;
    }, 1007: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.defaultGrammarValidatorErrorProvider = e.defaultGrammarResolverErrorProvider = e.defaultParserErrorProvider = void 0;
        var o = r(6736), i = n(r(3237)), a = n(r(6760)), s = n(r(8215)), u = r(7729), c = r(7729);
        e.defaultParserErrorProvider = { buildMismatchTokenMessage: function (t) { var e = t.expected, r = t.actual, n = (t.previous, t.ruleName, (0, o.hasTokenLabel)(e) ? "--\x3e ".concat((0, o.tokenLabel)(e), " <--") : "token of type --\x3e ".concat(e.name, " <--")); return "Expecting ".concat(n, " but found --\x3e '").concat(r.image, "' <--"); }, buildNotAllInputParsedMessage: function (t) { var e = t.firstRedundant; return t.ruleName, "Redundant input, expecting EOF but found: " + e.image; }, buildNoViableAltMessage: function (t) { var e = t.expectedPathsPerAlt, r = t.actual, n = (t.previous, t.customUserDescription), u = (t.ruleName, "Expecting: "), c = "\nbut found: '" + (0, i.default)(r).image + "'"; if (n)
                return u + n + c; var l = (0, s.default)(e, (function (t, e) { return t.concat(e); }), []), f = (0, a.default)(l, (function (t) { return "[".concat((0, a.default)(t, (function (t) { return (0, o.tokenLabel)(t); })).join(", "), "]"); })), p = (0, a.default)(f, (function (t, e) { return "  ".concat(e + 1, ". ").concat(t); })); return u + "one of these possible Token sequences:\n".concat(p.join("\n")) + c; }, buildEarlyExitMessage: function (t) { var e = t.expectedIterationPaths, r = t.actual, n = t.customUserDescription, s = (t.ruleName, "Expecting: "), u = "\nbut found: '" + (0, i.default)(r).image + "'"; if (n)
                return s + n + u; var c = (0, a.default)(e, (function (t) { return "[".concat((0, a.default)(t, (function (t) { return (0, o.tokenLabel)(t); })).join(","), "]"); })); return s + "expecting at least one iteration which starts with one of these possible Token sequences::\n  " + "<".concat(c.join(" ,"), ">") + u; } }, Object.freeze(e.defaultParserErrorProvider), e.defaultGrammarResolverErrorProvider = { buildRuleNotFoundError: function (t, e) { return "Invalid grammar, reference to a rule which is not defined: ->" + e.nonTerminalName + "<-\ninside top level rule: ->" + t.name + "<-"; } }, e.defaultGrammarValidatorErrorProvider = { buildDuplicateFoundError: function (t, e) { var r, n = t.name, o = (0, i.default)(e), a = o.idx, s = (0, c.getProductionDslName)(o), l = (r = o) instanceof u.Terminal ? r.terminalType.name : r instanceof u.NonTerminal ? r.nonTerminalName : "", f = a > 0, p = "->".concat(s).concat(f ? a : "", "<- ").concat(l ? "with argument: ->".concat(l, "<-") : "", "\n                  appears more than once (").concat(e.length, " times) in the top level rule: ->").concat(n, "<-.                  \n                  For further details see: https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES \n                  "); return (p = p.replace(/[ \t]+/g, " ")).replace(/\s\s+/g, "\n"); }, buildNamespaceConflictError: function (t) { return "Namespace conflict found in grammar.\n" + "The grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <".concat(t.name, ">.\n") + "To resolve this make sure each Terminal and Non-Terminal names are unique\nThis is easy to accomplish by using the convention that Terminal names start with an uppercase letter\nand Non-Terminal names start with a lower case letter."; }, buildAlternationPrefixAmbiguityError: function (t) { var e = (0, a.default)(t.prefixPath, (function (t) { return (0, o.tokenLabel)(t); })).join(", "), r = 0 === t.alternation.idx ? "" : t.alternation.idx; return "Ambiguous alternatives: <".concat(t.ambiguityIndices.join(" ,"), "> due to common lookahead prefix\n") + "in <OR".concat(r, "> inside <").concat(t.topLevelRule.name, "> Rule,\n") + "<".concat(e, "> may appears as a prefix path in all these alternatives.\n") + "See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX\nFor Further details."; }, buildAlternationAmbiguityError: function (t) { var e = (0, a.default)(t.prefixPath, (function (t) { return (0, o.tokenLabel)(t); })).join(", "), r = 0 === t.alternation.idx ? "" : t.alternation.idx; return "Ambiguous Alternatives Detected: <".concat(t.ambiguityIndices.join(" ,"), "> in <OR").concat(r, ">") + " inside <".concat(t.topLevelRule.name, "> Rule,\n") + "<".concat(e, "> may appears as a prefix path in all these alternatives.\n") + "See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES\nFor Further details."; }, buildEmptyRepetitionError: function (t) { var e = (0, c.getProductionDslName)(t.repetition); return 0 !== t.repetition.idx && (e += t.repetition.idx), "The repetition <".concat(e, "> within Rule <").concat(t.topLevelRule.name, "> can never consume any tokens.\n") + "This could lead to an infinite loop."; }, buildTokenNameError: function (t) { return "deprecated"; }, buildEmptyAlternationError: function (t) { return "Ambiguous empty alternative: <".concat(t.emptyChoiceIdx + 1, ">") + " in <OR".concat(t.alternation.idx, "> inside <").concat(t.topLevelRule.name, "> Rule.\n") + "Only the last alternative may be an empty alternative."; }, buildTooManyAlternativesError: function (t) { return "An Alternation cannot have more than 256 alternatives:\n" + "<OR".concat(t.alternation.idx, "> inside <").concat(t.topLevelRule.name, "> Rule.\n has ").concat(t.alternation.definition.length + 1, " alternatives."); }, buildLeftRecursionError: function (t) { var e = t.topLevelRule.name, r = (0, a.default)(t.leftRecursionPath, (function (t) { return t.name; })), n = "".concat(e, " --\x3e ").concat(r.concat([e]).join(" --\x3e ")); return "Left Recursion found in grammar.\n" + "rule: <".concat(e, "> can be invoked from itself (directly or indirectly)\n") + "without consuming any Tokens. The grammar path that causes this is: \n ".concat(n, "\n") + " To fix this refactor your grammar to remove the left recursion.\nsee: https://en.wikipedia.org/wiki/LL_parser#Left_factoring."; }, buildInvalidRuleNameError: function (t) { return "deprecated"; }, buildDuplicateRuleNameError: function (t) { var e; return e = t.topLevelRule instanceof u.Rule ? t.topLevelRule.name : t.topLevelRule, "Duplicate definition, rule: ->".concat(e, "<- is already defined in the grammar: ->").concat(t.grammarName, "<-"); } };
    }, 643: function (t, e, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function (t, e) { return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]); })(t, e); }, function (t, e) { if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null"); function r() { this.constructor = t; } n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }), i = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.EarlyExitException = e.NotAllInputParsedException = e.NoViableAltException = e.MismatchedTokenException = e.isRecognitionException = void 0;
        var a = i(r(1886)), s = "MismatchedTokenException", u = "NoViableAltException", c = "EarlyExitException", l = "NotAllInputParsedException", f = [s, u, c, l];
        Object.freeze(f), e.isRecognitionException = function (t) { return (0, a.default)(f, t.name); };
        var p = function (t) { function e(e, r) { var n = this.constructor, o = t.call(this, e) || this; return o.token = r, o.resyncedTokens = [], Object.setPrototypeOf(o, n.prototype), Error.captureStackTrace && Error.captureStackTrace(o, o.constructor), o; } return o(e, t), e; }(Error), d = function (t) { function e(e, r, n) { var o = t.call(this, e, r) || this; return o.previousToken = n, o.name = s, o; } return o(e, t), e; }(p);
        e.MismatchedTokenException = d;
        var h = function (t) { function e(e, r, n) { var o = t.call(this, e, r) || this; return o.previousToken = n, o.name = u, o; } return o(e, t), e; }(p);
        e.NoViableAltException = h;
        var v = function (t) { function e(e, r) { var n = t.call(this, e, r) || this; return n.name = l, n; } return o(e, t), e; }(p);
        e.NotAllInputParsedException = v;
        var y = function (t) { function e(e, r, n) { var o = t.call(this, e, r) || this; return o.previousToken = n, o.name = c, o; } return o(e, t), e; }(p);
        e.EarlyExitException = y;
    }, 3870: function (t, e, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function (t, e) { return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]); })(t, e); }, function (t, e) { if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null"); function r() { this.constructor = t; } n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }), i = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.checkPrefixAlternativesAmbiguities = e.validateSomeNonEmptyLookaheadPath = e.validateTooManyAlts = e.RepetitionCollector = e.validateAmbiguousAlternationAlternatives = e.validateEmptyOrAlternative = e.getFirstNoneTerminal = e.validateNoLeftRecursion = e.validateRuleIsOverridden = e.validateRuleDoesNotAlreadyExist = e.OccurrenceValidationCollector = e.identifyProductionForDuplicates = e.validateGrammar = void 0;
        var a = i(r(3237)), s = i(r(5455)), u = i(r(7264)), c = i(r(5676)), l = i(r(882)), f = i(r(2070)), p = i(r(7335)), d = i(r(6760)), h = i(r(9756)), v = i(r(3440)), y = i(r(8215)), m = i(r(2208)), T = i(r(8346)), E = i(r(1886)), _ = i(r(5838)), g = i(r(4004)), O = r(2941), R = r(7729), A = r(4677), I = r(9985), x = r(7729), N = r(7729), P = i(r(4934)), S = i(r(417)), b = r(1201);
        function k(t) { return "".concat((0, R.getProductionDslName)(t), "_#_").concat(t.idx, "_#_").concat(L(t)); }
        function L(t) { return t instanceof x.Terminal ? t.terminalType.name : t instanceof x.NonTerminal ? t.nonTerminalName : ""; }
        e.validateGrammar = function (t, e, r, n, o) { var i = (0, _.default)(t, (function (t) { return function (t, e) { var r = new C; t.accept(r); var n = r.allProductions, o = (0, v.default)(n, k), i = (0, m.default)(o, (function (t) { return t.length > 1; })); return (0, d.default)((0, T.default)(i), (function (r) { var n = (0, a.default)(r), o = e.buildDuplicateFoundError(t, r), i = (0, R.getProductionDslName)(n), s = { message: o, type: O.ParserDefinitionErrorType.DUPLICATE_PRODUCTIONS, ruleName: t.name, dslName: i, occurrence: n.idx }, u = L(n); return u && (s.parameter = u), s; })); }(t, n); })), u = (0, _.default)(t, (function (t) { return D(t, t, n); })), c = [], l = [], f = []; (0, s.default)(u) && (c = (0, _.default)(t, (function (t) { return j(t, n); })), l = (0, _.default)(t, (function (t) { return U(t, e, n); })), f = W(t, e, n)); var p = function (t, e, r) { var n = [], o = (0, d.default)(e, (function (t) { return t.name; })); return (0, h.default)(t, (function (t) { var e = t.name; if ((0, E.default)(o, e)) {
            var i = r.buildNamespaceConflictError(t);
            n.push({ message: i, type: O.ParserDefinitionErrorType.CONFLICT_TOKENS_RULES_NAMESPACE, ruleName: e });
        } })), n; }(t, r, n), y = (0, _.default)(t, (function (t) { return G(t, n); })), g = (0, _.default)(t, (function (e) { return M(e, t, o, n); })); return i.concat(f, u, c, l, p, y, g); }, e.identifyProductionForDuplicates = k;
        var C = function (t) { function e() { var e = null !== t && t.apply(this, arguments) || this; return e.allProductions = [], e; } return o(e, t), e.prototype.visitNonTerminal = function (t) { this.allProductions.push(t); }, e.prototype.visitOption = function (t) { this.allProductions.push(t); }, e.prototype.visitRepetitionWithSeparator = function (t) { this.allProductions.push(t); }, e.prototype.visitRepetitionMandatory = function (t) { this.allProductions.push(t); }, e.prototype.visitRepetitionMandatoryWithSeparator = function (t) { this.allProductions.push(t); }, e.prototype.visitRepetition = function (t) { this.allProductions.push(t); }, e.prototype.visitAlternation = function (t) { this.allProductions.push(t); }, e.prototype.visitTerminal = function (t) { this.allProductions.push(t); }, e; }(N.GAstVisitor);
        function M(t, e, r, n) { var o = []; if ((0, y.default)(e, (function (e, r) { return r.name === t.name ? e + 1 : e; }), 0) > 1) {
            var i = n.buildDuplicateRuleNameError({ topLevelRule: t, grammarName: r });
            o.push({ message: i, type: O.ParserDefinitionErrorType.DUPLICATE_RULE_NAME, ruleName: t.name });
        } return o; }
        function D(t, e, r, n) { void 0 === n && (n = []); var o = [], i = w(e.definition); if ((0, s.default)(i))
            return []; var a = t.name; (0, E.default)(i, t) && o.push({ message: r.buildLeftRecursionError({ topLevelRule: t, leftRecursionPath: n }), type: O.ParserDefinitionErrorType.LEFT_RECURSION, ruleName: a }); var u = (0, p.default)(i, n.concat([t])), c = (0, _.default)(u, (function (e) { var o = (0, g.default)(n); return o.push(e), D(t, e, r, o); })); return o.concat(c); }
        function w(t) { var e = []; if ((0, s.default)(t))
            return e; var r = (0, a.default)(t); if (r instanceof x.NonTerminal)
            e.push(r.referencedRule);
        else if (r instanceof x.Alternative || r instanceof x.Option || r instanceof x.RepetitionMandatory || r instanceof x.RepetitionMandatoryWithSeparator || r instanceof x.RepetitionWithSeparator || r instanceof x.Repetition)
            e = e.concat(w(r.definition));
        else if (r instanceof x.Alternation)
            e = (0, c.default)((0, d.default)(r.definition, (function (t) { return w(t.definition); })));
        else if (!(r instanceof x.Terminal))
            throw Error("non exhaustive match"); var n = (0, R.isOptionalProd)(r), o = t.length > 1; if (n && o) {
            var i = (0, u.default)(t);
            return e.concat(w(i));
        } return e; }
        e.OccurrenceValidationCollector = C, e.validateRuleDoesNotAlreadyExist = M, e.validateRuleIsOverridden = function (t, e, r) { var n, o = []; return (0, E.default)(e, t) || (n = "Invalid rule override, rule: ->".concat(t, "<- cannot be overridden in the grammar: ->").concat(r, "<-") + "as it is not defined in any of the super grammars ", o.push({ message: n, type: O.ParserDefinitionErrorType.INVALID_RULE_OVERRIDE, ruleName: t })), o; }, e.validateNoLeftRecursion = D, e.getFirstNoneTerminal = w;
        var F = function (t) { function e() { var e = null !== t && t.apply(this, arguments) || this; return e.alternations = [], e; } return o(e, t), e.prototype.visitAlternation = function (t) { this.alternations.push(t); }, e; }(N.GAstVisitor);
        function j(t, e) { var r = new F; t.accept(r); var n = r.alternations; return (0, _.default)(n, (function (r) { var n = (0, P.default)(r.definition); return (0, _.default)(n, (function (n, o) { var i = (0, I.nextPossibleTokensAfter)([n], [], b.tokenStructuredMatcher, 1); return (0, s.default)(i) ? [{ message: e.buildEmptyAlternationError({ topLevelRule: t, alternation: r, emptyChoiceIdx: o }), type: O.ParserDefinitionErrorType.NONE_LAST_EMPTY_ALT, ruleName: t.name, occurrence: r.idx, alternative: o + 1 }] : []; })); })); }
        function U(t, e, r) { var n = new F; t.accept(n); var o = n.alternations; return o = (0, f.default)(o, (function (t) { return !0 === t.ignoreAmbiguities; })), (0, _.default)(o, (function (n) { var o = n.idx, i = n.maxLookahead || e, a = (0, A.getLookaheadPathsForOr)(o, t, i, n), s = function (t, e, r, n) { var o = [], i = (0, y.default)(t, (function (r, n, i) { return !0 === e.definition[i].ignoreAmbiguities || (0, h.default)(n, (function (n) { var a = [i]; (0, h.default)(t, (function (t, r) { i !== r && (0, A.containsPath)(t, n) && !0 !== e.definition[r].ignoreAmbiguities && a.push(r); })), a.length > 1 && !(0, A.containsPath)(o, n) && (o.push(n), r.push({ alts: a, path: n })); })), r; }), []); return (0, d.default)(i, (function (t) { var o = (0, d.default)(t.alts, (function (t) { return t + 1; })); return { message: n.buildAlternationAmbiguityError({ topLevelRule: r, alternation: e, ambiguityIndices: o, prefixPath: t.path }), type: O.ParserDefinitionErrorType.AMBIGUOUS_ALTS, ruleName: r.name, occurrence: e.idx, alternatives: t.alts }; })); }(a, n, t, r), u = V(a, n, t, r); return s.concat(u); })); }
        e.validateEmptyOrAlternative = j, e.validateAmbiguousAlternationAlternatives = U;
        var B = function (t) { function e() { var e = null !== t && t.apply(this, arguments) || this; return e.allProductions = [], e; } return o(e, t), e.prototype.visitRepetitionWithSeparator = function (t) { this.allProductions.push(t); }, e.prototype.visitRepetitionMandatory = function (t) { this.allProductions.push(t); }, e.prototype.visitRepetitionMandatoryWithSeparator = function (t) { this.allProductions.push(t); }, e.prototype.visitRepetition = function (t) { this.allProductions.push(t); }, e; }(N.GAstVisitor);
        function G(t, e) { var r = new F; t.accept(r); var n = r.alternations; return (0, _.default)(n, (function (r) { return r.definition.length > 255 ? [{ message: e.buildTooManyAlternativesError({ topLevelRule: t, alternation: r }), type: O.ParserDefinitionErrorType.TOO_MANY_ALTS, ruleName: t.name, occurrence: r.idx }] : []; })); }
        function W(t, e, r) { var n = []; return (0, h.default)(t, (function (t) { var o = new B; t.accept(o); var i = o.allProductions; (0, h.default)(i, (function (o) { var i = (0, A.getProdType)(o), a = o.maxLookahead || e, u = o.idx, l = (0, A.getLookaheadPathsForOptionalProd)(u, t, i, a)[0]; if ((0, s.default)((0, c.default)(l))) {
            var f = r.buildEmptyRepetitionError({ topLevelRule: t, repetition: o });
            n.push({ message: f, type: O.ParserDefinitionErrorType.NO_NON_EMPTY_LOOKAHEAD, ruleName: t.name });
        } })); })), n; }
        function V(t, e, r, n) { var o = (0, y.default)(t, (function (t, e, r) { var n = (0, d.default)(e, (function (t) { return { idx: r, path: t }; })); return t.concat(n); }), []); return (0, S.default)((0, _.default)(o, (function (t) { if (!0 === e.definition[t.idx].ignoreAmbiguities)
            return []; var i = t.idx, a = t.path, s = (0, l.default)(o, (function (t) { return !0 !== e.definition[t.idx].ignoreAmbiguities && t.idx < i && (0, A.isStrictPrefixOfPath)(t.path, a); })); return (0, d.default)(s, (function (t) { var o = [t.idx + 1, i + 1], a = 0 === e.idx ? "" : e.idx; return { message: n.buildAlternationPrefixAmbiguityError({ topLevelRule: r, alternation: e, ambiguityIndices: o, prefixPath: t.path }), type: O.ParserDefinitionErrorType.AMBIGUOUS_PREFIX_ALTS, ruleName: r.name, occurrence: a, alternatives: o }; })); }))); }
        e.RepetitionCollector = B, e.validateTooManyAlts = G, e.validateSomeNonEmptyLookaheadPath = W, e.checkPrefixAlternativesAmbiguities = V;
    }, 8052: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.firstForTerminal = e.firstForBranching = e.firstForSequence = e.first = void 0;
        var o = n(r(5676)), i = n(r(5652)), a = n(r(6760)), s = r(7729), u = r(7729);
        function c(t) { if (t instanceof s.NonTerminal)
            return c(t.referencedRule); if (t instanceof s.Terminal)
            return p(t); if ((0, u.isSequenceProd)(t))
            return l(t); if ((0, u.isBranchingProd)(t))
            return f(t); throw Error("non exhaustive match"); }
        function l(t) { for (var e, r = [], n = t.definition, o = 0, a = n.length > o, s = !0; a && s;)
            e = n[o], s = (0, u.isOptionalProd)(e), r = r.concat(c(e)), o += 1, a = n.length > o; return (0, i.default)(r); }
        function f(t) { var e = (0, a.default)(t.definition, (function (t) { return c(t); })); return (0, i.default)((0, o.default)(e)); }
        function p(t) { return [t.terminalType]; }
        e.first = c, e.firstForSequence = l, e.firstForBranching = f, e.firstForTerminal = p;
    }, 4917: function (t, e, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function (t, e) { return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]); })(t, e); }, function (t, e) { if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null"); function r() { this.constructor = t; } n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }), i = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.buildInProdFollowPrefix = e.buildBetweenProdsFollowPrefix = e.computeAllProdsFollows = e.ResyncFollowsWalker = void 0;
        var a = r(8567), s = r(8052), u = i(r(9756)), c = i(r(19)), l = r(3710), f = r(7729), p = function (t) { function e(e) { var r = t.call(this) || this; return r.topProd = e, r.follows = {}, r; } return o(e, t), e.prototype.startWalking = function () { return this.walk(this.topProd), this.follows; }, e.prototype.walkTerminal = function (t, e, r) { }, e.prototype.walkProdRef = function (t, e, r) { var n = d(t.referencedRule, t.idx) + this.topProd.name, o = e.concat(r), i = new f.Alternative({ definition: o }), a = (0, s.first)(i); this.follows[n] = a; }, e; }(a.RestWalker);
        function d(t, e) { return t.name + e + l.IN; }
        e.ResyncFollowsWalker = p, e.computeAllProdsFollows = function (t) { var e = {}; return (0, u.default)(t, (function (t) { var r = new p(t).startWalking(); (0, c.default)(e, r); })), e; }, e.buildBetweenProdsFollowPrefix = d, e.buildInProdFollowPrefix = function (t) { return t.terminalType.name + t.idx + l.IN; };
    }, 1665: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.validateGrammar = e.resolveGrammar = void 0;
        var o = n(r(9756)), i = n(r(4573)), a = r(6304), s = r(3870), u = r(1007);
        e.resolveGrammar = function (t) { var e = (0, i.default)(t, { errMsgProvider: u.defaultGrammarResolverErrorProvider }), r = {}; return (0, o.default)(t.rules, (function (t) { r[t.name] = t; })), (0, a.resolveGrammar)(r, e.errMsgProvider); }, e.validateGrammar = function (t) { return t = (0, i.default)(t, { errMsgProvider: u.defaultGrammarValidatorErrorProvider }), (0, s.validateGrammar)(t.rules, t.maxLookahead, t.tokenTypes, t.errMsgProvider, t.grammarName); };
    }, 9985: function (t, e, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function (t, e) { return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]); })(t, e); }, function (t, e) { if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null"); function r() { this.constructor = t; } n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }), i = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.nextPossibleTokensAfter = e.possiblePathsFrom = e.NextTerminalAfterAtLeastOneSepWalker = e.NextTerminalAfterAtLeastOneWalker = e.NextTerminalAfterManySepWalker = e.NextTerminalAfterManyWalker = e.AbstractNextTerminalAfterProductionWalker = e.NextAfterTokenWalker = e.AbstractNextPossibleTokensWalker = void 0;
        var a = r(8567), s = i(r(3237)), u = i(r(5455)), c = i(r(4934)), l = i(r(7264)), f = i(r(6974)), p = i(r(9756)), d = i(r(4004)), h = r(8052), v = r(7729), y = function (t) { function e(e, r) { var n = t.call(this) || this; return n.topProd = e, n.path = r, n.possibleTokTypes = [], n.nextProductionName = "", n.nextProductionOccurrence = 0, n.found = !1, n.isAtEndOfPath = !1, n; } return o(e, t), e.prototype.startWalking = function () { if (this.found = !1, this.path.ruleStack[0] !== this.topProd.name)
            throw Error("The path does not start with the walker's top Rule!"); return this.ruleStack = (0, d.default)(this.path.ruleStack).reverse(), this.occurrenceStack = (0, d.default)(this.path.occurrenceStack).reverse(), this.ruleStack.pop(), this.occurrenceStack.pop(), this.updateExpectedNext(), this.walk(this.topProd), this.possibleTokTypes; }, e.prototype.walk = function (e, r) { void 0 === r && (r = []), this.found || t.prototype.walk.call(this, e, r); }, e.prototype.walkProdRef = function (t, e, r) { if (t.referencedRule.name === this.nextProductionName && t.idx === this.nextProductionOccurrence) {
            var n = e.concat(r);
            this.updateExpectedNext(), this.walk(t.referencedRule, n);
        } }, e.prototype.updateExpectedNext = function () { (0, u.default)(this.ruleStack) ? (this.nextProductionName = "", this.nextProductionOccurrence = 0, this.isAtEndOfPath = !0) : (this.nextProductionName = this.ruleStack.pop(), this.nextProductionOccurrence = this.occurrenceStack.pop()); }, e; }(a.RestWalker);
        e.AbstractNextPossibleTokensWalker = y;
        var m = function (t) { function e(e, r) { var n = t.call(this, e, r) || this; return n.path = r, n.nextTerminalName = "", n.nextTerminalOccurrence = 0, n.nextTerminalName = n.path.lastTok.name, n.nextTerminalOccurrence = n.path.lastTokOccurrence, n; } return o(e, t), e.prototype.walkTerminal = function (t, e, r) { if (this.isAtEndOfPath && t.terminalType.name === this.nextTerminalName && t.idx === this.nextTerminalOccurrence && !this.found) {
            var n = e.concat(r), o = new v.Alternative({ definition: n });
            this.possibleTokTypes = (0, h.first)(o), this.found = !0;
        } }, e; }(y);
        e.NextAfterTokenWalker = m;
        var T = function (t) { function e(e, r) { var n = t.call(this) || this; return n.topRule = e, n.occurrence = r, n.result = { token: void 0, occurrence: void 0, isEndOfRule: void 0 }, n; } return o(e, t), e.prototype.startWalking = function () { return this.walk(this.topRule), this.result; }, e; }(a.RestWalker);
        e.AbstractNextTerminalAfterProductionWalker = T;
        var E = function (t) { function e() { return null !== t && t.apply(this, arguments) || this; } return o(e, t), e.prototype.walkMany = function (e, r, n) { if (e.idx === this.occurrence) {
            var o = (0, s.default)(r.concat(n));
            this.result.isEndOfRule = void 0 === o, o instanceof v.Terminal && (this.result.token = o.terminalType, this.result.occurrence = o.idx);
        }
        else
            t.prototype.walkMany.call(this, e, r, n); }, e; }(T);
        e.NextTerminalAfterManyWalker = E;
        var _ = function (t) { function e() { return null !== t && t.apply(this, arguments) || this; } return o(e, t), e.prototype.walkManySep = function (e, r, n) { if (e.idx === this.occurrence) {
            var o = (0, s.default)(r.concat(n));
            this.result.isEndOfRule = void 0 === o, o instanceof v.Terminal && (this.result.token = o.terminalType, this.result.occurrence = o.idx);
        }
        else
            t.prototype.walkManySep.call(this, e, r, n); }, e; }(T);
        e.NextTerminalAfterManySepWalker = _;
        var g = function (t) { function e() { return null !== t && t.apply(this, arguments) || this; } return o(e, t), e.prototype.walkAtLeastOne = function (e, r, n) { if (e.idx === this.occurrence) {
            var o = (0, s.default)(r.concat(n));
            this.result.isEndOfRule = void 0 === o, o instanceof v.Terminal && (this.result.token = o.terminalType, this.result.occurrence = o.idx);
        }
        else
            t.prototype.walkAtLeastOne.call(this, e, r, n); }, e; }(T);
        e.NextTerminalAfterAtLeastOneWalker = g;
        var O = function (t) { function e() { return null !== t && t.apply(this, arguments) || this; } return o(e, t), e.prototype.walkAtLeastOneSep = function (e, r, n) { if (e.idx === this.occurrence) {
            var o = (0, s.default)(r.concat(n));
            this.result.isEndOfRule = void 0 === o, o instanceof v.Terminal && (this.result.token = o.terminalType, this.result.occurrence = o.idx);
        }
        else
            t.prototype.walkAtLeastOneSep.call(this, e, r, n); }, e; }(T);
        function R(t, e, r, n) { var o = (0, d.default)(r); o.push(t.name); var i = (0, d.default)(n); return i.push(1), { idx: e, def: t.definition, ruleStack: o, occurrenceStack: i }; }
        e.NextTerminalAfterAtLeastOneSepWalker = O, e.possiblePathsFrom = function t(e, r, n) { void 0 === n && (n = []), n = (0, d.default)(n); var o = [], i = 0; function a(a) { var s = t(a.concat((0, l.default)(e, i + 1)), r, n); return o.concat(s); } for (; n.length < r && i < e.length;) {
            var s = e[i];
            if (s instanceof v.Alternative)
                return a(s.definition);
            if (s instanceof v.NonTerminal)
                return a(s.definition);
            if (s instanceof v.Option)
                o = a(s.definition);
            else {
                if (s instanceof v.RepetitionMandatory)
                    return a(c = s.definition.concat([new v.Repetition({ definition: s.definition })]));
                if (s instanceof v.RepetitionMandatoryWithSeparator)
                    return a(c = [new v.Alternative({ definition: s.definition }), new v.Repetition({ definition: [new v.Terminal({ terminalType: s.separator })].concat(s.definition) })]);
                if (s instanceof v.RepetitionWithSeparator) {
                    var c = s.definition.concat([new v.Repetition({ definition: [new v.Terminal({ terminalType: s.separator })].concat(s.definition) })]);
                    o = a(c);
                }
                else if (s instanceof v.Repetition)
                    c = s.definition.concat([new v.Repetition({ definition: s.definition })]), o = a(c);
                else {
                    if (s instanceof v.Alternation)
                        return (0, p.default)(s.definition, (function (t) { !1 === (0, u.default)(t.definition) && (o = a(t.definition)); })), o;
                    if (!(s instanceof v.Terminal))
                        throw Error("non exhaustive match");
                    n.push(s.terminalType);
                }
            }
            i++;
        } return o.push({ partialPath: n, suffixDef: (0, l.default)(e, i) }), o; }, e.nextPossibleTokensAfter = function (t, e, r, n) { var o = "EXIT_NONE_TERMINAL", i = [o], a = "EXIT_ALTERNATIVE", s = !1, p = e.length, h = p - n - 1, y = [], m = []; for (m.push({ idx: -1, def: t, ruleStack: [], occurrenceStack: [] }); !(0, u.default)(m);) {
            var T = m.pop();
            if (T !== a) {
                var E = T.def, _ = T.idx, g = T.ruleStack, O = T.occurrenceStack;
                if (!(0, u.default)(E)) {
                    var A = E[0];
                    if (A === o) {
                        var I = { idx: _, def: (0, l.default)(E), ruleStack: (0, c.default)(g), occurrenceStack: (0, c.default)(O) };
                        m.push(I);
                    }
                    else if (A instanceof v.Terminal)
                        if (_ < p - 1) {
                            var x = _ + 1;
                            r(e[x], A.terminalType) && (I = { idx: x, def: (0, l.default)(E), ruleStack: g, occurrenceStack: O }, m.push(I));
                        }
                        else {
                            if (_ !== p - 1)
                                throw Error("non exhaustive match");
                            y.push({ nextTokenType: A.terminalType, nextTokenOccurrence: A.idx, ruleStack: g, occurrenceStack: O }), s = !0;
                        }
                    else if (A instanceof v.NonTerminal) {
                        var N = (0, d.default)(g);
                        N.push(A.nonTerminalName);
                        var P = (0, d.default)(O);
                        P.push(A.idx), I = { idx: _, def: A.definition.concat(i, (0, l.default)(E)), ruleStack: N, occurrenceStack: P }, m.push(I);
                    }
                    else if (A instanceof v.Option) {
                        var S = { idx: _, def: (0, l.default)(E), ruleStack: g, occurrenceStack: O };
                        m.push(S), m.push(a);
                        var b = { idx: _, def: A.definition.concat((0, l.default)(E)), ruleStack: g, occurrenceStack: O };
                        m.push(b);
                    }
                    else if (A instanceof v.RepetitionMandatory) {
                        var k = new v.Repetition({ definition: A.definition, idx: A.idx });
                        I = { idx: _, def: A.definition.concat([k], (0, l.default)(E)), ruleStack: g, occurrenceStack: O }, m.push(I);
                    }
                    else if (A instanceof v.RepetitionMandatoryWithSeparator) {
                        var L = new v.Terminal({ terminalType: A.separator });
                        k = new v.Repetition({ definition: [L].concat(A.definition), idx: A.idx }), I = { idx: _, def: A.definition.concat([k], (0, l.default)(E)), ruleStack: g, occurrenceStack: O }, m.push(I);
                    }
                    else if (A instanceof v.RepetitionWithSeparator) {
                        S = { idx: _, def: (0, l.default)(E), ruleStack: g, occurrenceStack: O }, m.push(S), m.push(a), L = new v.Terminal({ terminalType: A.separator });
                        var C = new v.Repetition({ definition: [L].concat(A.definition), idx: A.idx });
                        b = { idx: _, def: A.definition.concat([C], (0, l.default)(E)), ruleStack: g, occurrenceStack: O }, m.push(b);
                    }
                    else if (A instanceof v.Repetition)
                        S = { idx: _, def: (0, l.default)(E), ruleStack: g, occurrenceStack: O }, m.push(S), m.push(a), C = new v.Repetition({ definition: A.definition, idx: A.idx }), b = { idx: _, def: A.definition.concat([C], (0, l.default)(E)), ruleStack: g, occurrenceStack: O }, m.push(b);
                    else if (A instanceof v.Alternation)
                        for (var M = A.definition.length - 1; M >= 0; M--) {
                            var D = { idx: _, def: A.definition[M].definition.concat((0, l.default)(E)), ruleStack: g, occurrenceStack: O };
                            m.push(D), m.push(a);
                        }
                    else if (A instanceof v.Alternative)
                        m.push({ idx: _, def: A.definition.concat((0, l.default)(E)), ruleStack: g, occurrenceStack: O });
                    else {
                        if (!(A instanceof v.Rule))
                            throw Error("non exhaustive match");
                        m.push(R(A, _, g, O));
                    }
                }
            }
            else
                s && (0, f.default)(m).idx <= h && m.pop();
        } return y; };
    }, 8209: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.getKeyForAutomaticLookahead = e.AT_LEAST_ONE_SEP_IDX = e.MANY_SEP_IDX = e.AT_LEAST_ONE_IDX = e.MANY_IDX = e.OPTION_IDX = e.OR_IDX = e.BITS_FOR_ALT_IDX = e.BITS_FOR_RULE_IDX = e.BITS_FOR_OCCURRENCE_IDX = e.BITS_FOR_METHOD_TYPE = void 0, e.BITS_FOR_METHOD_TYPE = 4, e.BITS_FOR_OCCURRENCE_IDX = 8, e.BITS_FOR_RULE_IDX = 12, e.BITS_FOR_ALT_IDX = 8, e.OR_IDX = 1 << e.BITS_FOR_OCCURRENCE_IDX, e.OPTION_IDX = 2 << e.BITS_FOR_OCCURRENCE_IDX, e.MANY_IDX = 3 << e.BITS_FOR_OCCURRENCE_IDX, e.AT_LEAST_ONE_IDX = 4 << e.BITS_FOR_OCCURRENCE_IDX, e.MANY_SEP_IDX = 5 << e.BITS_FOR_OCCURRENCE_IDX, e.AT_LEAST_ONE_SEP_IDX = 6 << e.BITS_FOR_OCCURRENCE_IDX, e.getKeyForAutomaticLookahead = function (t, e, r) { return r | e | t; }, e.BITS_FOR_ALT_IDX;
    }, 4677: function (t, e, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function (t, e) { return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]); })(t, e); }, function (t, e) { if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null"); function r() { this.constructor = t; } n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }), i = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.areTokenCategoriesNotUsed = e.isStrictPrefixOfPath = e.containsPath = e.getLookaheadPathsForOptionalProd = e.getLookaheadPathsForOr = e.lookAheadSequenceFromAlternatives = e.buildSingleAlternativeLookaheadFunction = e.buildAlternativesLookAheadFunc = e.buildLookaheadFuncForOptionalProd = e.buildLookaheadFuncForOr = e.getProdType = e.PROD_TYPE = void 0;
        var a, s = i(r(5455)), u = i(r(5676)), c = i(r(9794)), l = i(r(6760)), f = i(r(9756)), p = i(r(3352)), d = i(r(8215)), h = r(9985), v = r(8567), y = r(1201), m = r(7729), T = r(7729);
        !function (t) { t[t.OPTION = 0] = "OPTION", t[t.REPETITION = 1] = "REPETITION", t[t.REPETITION_MANDATORY = 2] = "REPETITION_MANDATORY", t[t.REPETITION_MANDATORY_WITH_SEPARATOR = 3] = "REPETITION_MANDATORY_WITH_SEPARATOR", t[t.REPETITION_WITH_SEPARATOR = 4] = "REPETITION_WITH_SEPARATOR", t[t.ALTERNATION = 5] = "ALTERNATION"; }(a = e.PROD_TYPE || (e.PROD_TYPE = {})), e.getProdType = function (t) { if (t instanceof m.Option)
            return a.OPTION; if (t instanceof m.Repetition)
            return a.REPETITION; if (t instanceof m.RepetitionMandatory)
            return a.REPETITION_MANDATORY; if (t instanceof m.RepetitionMandatoryWithSeparator)
            return a.REPETITION_MANDATORY_WITH_SEPARATOR; if (t instanceof m.RepetitionWithSeparator)
            return a.REPETITION_WITH_SEPARATOR; if (t instanceof m.Alternation)
            return a.ALTERNATION; throw Error("non exhaustive match"); }, e.buildLookaheadFuncForOr = function (t, e, r, n, o, i) { var a = I(t, e, r); return i(a, n, P(a) ? y.tokenStructuredMatcherNoCategories : y.tokenStructuredMatcher, o); }, e.buildLookaheadFuncForOptionalProd = function (t, e, r, n, o, i) { var a = x(t, e, o, r), s = P(a) ? y.tokenStructuredMatcherNoCategories : y.tokenStructuredMatcher; return i(a[0], s, n); }, e.buildAlternativesLookAheadFunc = function (t, e, r, n) { var o = t.length, i = (0, c.default)(t, (function (t) { return (0, c.default)(t, (function (t) { return 1 === t.length; })); })); if (e)
            return function (e) { for (var n = (0, l.default)(e, (function (t) { return t.GATE; })), i = 0; i < o; i++) {
                var a = t[i], s = a.length, u = n[i];
                if (void 0 === u || !1 !== u.call(this))
                    t: for (var c = 0; c < s; c++) {
                        for (var f = a[c], p = f.length, d = 0; d < p; d++) {
                            var h = this.LA(d + 1);
                            if (!1 === r(h, f[d]))
                                continue t;
                        }
                        return i;
                    }
            } }; if (i && !n) {
            var a = (0, l.default)(t, (function (t) { return (0, u.default)(t); })), s = (0, d.default)(a, (function (t, e, r) { return (0, f.default)(e, (function (e) { (0, p.default)(t, e.tokenTypeIdx) || (t[e.tokenTypeIdx] = r), (0, f.default)(e.categoryMatches, (function (e) { (0, p.default)(t, e) || (t[e] = r); })); })), t; }), {});
            return function () { var t = this.LA(1); return s[t.tokenTypeIdx]; };
        } return function () { for (var e = 0; e < o; e++) {
            var n = t[e], i = n.length;
            t: for (var a = 0; a < i; a++) {
                for (var s = n[a], u = s.length, c = 0; c < u; c++) {
                    var l = this.LA(c + 1);
                    if (!1 === r(l, s[c]))
                        continue t;
                }
                return e;
            }
        } }; }, e.buildSingleAlternativeLookaheadFunction = function (t, e, r) { var n = (0, c.default)(t, (function (t) { return 1 === t.length; })), o = t.length; if (n && !r) {
            var i = (0, u.default)(t);
            if (1 === i.length && (0, s.default)(i[0].categoryMatches)) {
                var a = i[0].tokenTypeIdx;
                return function () { return this.LA(1).tokenTypeIdx === a; };
            }
            var l = (0, d.default)(i, (function (t, e, r) { return t[e.tokenTypeIdx] = !0, (0, f.default)(e.categoryMatches, (function (e) { t[e] = !0; })), t; }), []);
            return function () { var t = this.LA(1); return !0 === l[t.tokenTypeIdx]; };
        } return function () { t: for (var r = 0; r < o; r++) {
            for (var n = t[r], i = n.length, a = 0; a < i; a++) {
                var s = this.LA(a + 1);
                if (!1 === e(s, n[a]))
                    continue t;
            }
            return !0;
        } return !1; }; };
        var E = function (t) { function e(e, r, n) { var o = t.call(this) || this; return o.topProd = e, o.targetOccurrence = r, o.targetProdType = n, o; } return o(e, t), e.prototype.startWalking = function () { return this.walk(this.topProd), this.restDef; }, e.prototype.checkIsTarget = function (t, e, r, n) { return t.idx === this.targetOccurrence && this.targetProdType === e && (this.restDef = r.concat(n), !0); }, e.prototype.walkOption = function (e, r, n) { this.checkIsTarget(e, a.OPTION, r, n) || t.prototype.walkOption.call(this, e, r, n); }, e.prototype.walkAtLeastOne = function (e, r, n) { this.checkIsTarget(e, a.REPETITION_MANDATORY, r, n) || t.prototype.walkOption.call(this, e, r, n); }, e.prototype.walkAtLeastOneSep = function (e, r, n) { this.checkIsTarget(e, a.REPETITION_MANDATORY_WITH_SEPARATOR, r, n) || t.prototype.walkOption.call(this, e, r, n); }, e.prototype.walkMany = function (e, r, n) { this.checkIsTarget(e, a.REPETITION, r, n) || t.prototype.walkOption.call(this, e, r, n); }, e.prototype.walkManySep = function (e, r, n) { this.checkIsTarget(e, a.REPETITION_WITH_SEPARATOR, r, n) || t.prototype.walkOption.call(this, e, r, n); }, e; }(v.RestWalker), _ = function (t) { function e(e, r, n) { var o = t.call(this) || this; return o.targetOccurrence = e, o.targetProdType = r, o.targetRef = n, o.result = [], o; } return o(e, t), e.prototype.checkIsTarget = function (t, e) { t.idx !== this.targetOccurrence || this.targetProdType !== e || void 0 !== this.targetRef && t !== this.targetRef || (this.result = t.definition); }, e.prototype.visitOption = function (t) { this.checkIsTarget(t, a.OPTION); }, e.prototype.visitRepetition = function (t) { this.checkIsTarget(t, a.REPETITION); }, e.prototype.visitRepetitionMandatory = function (t) { this.checkIsTarget(t, a.REPETITION_MANDATORY); }, e.prototype.visitRepetitionMandatoryWithSeparator = function (t) { this.checkIsTarget(t, a.REPETITION_MANDATORY_WITH_SEPARATOR); }, e.prototype.visitRepetitionWithSeparator = function (t) { this.checkIsTarget(t, a.REPETITION_WITH_SEPARATOR); }, e.prototype.visitAlternation = function (t) { this.checkIsTarget(t, a.ALTERNATION); }, e; }(T.GAstVisitor);
        function g(t) { for (var e = new Array(t), r = 0; r < t; r++)
            e[r] = []; return e; }
        function O(t) { for (var e = [""], r = 0; r < t.length; r++) {
            for (var n = t[r], o = [], i = 0; i < e.length; i++) {
                var a = e[i];
                o.push(a + "_" + n.tokenTypeIdx);
                for (var s = 0; s < n.categoryMatches.length; s++) {
                    var u = "_" + n.categoryMatches[s];
                    o.push(a + u);
                }
            }
            e = o;
        } return e; }
        function R(t, e, r) { for (var n = 0; n < t.length; n++)
            if (n !== r)
                for (var o = t[n], i = 0; i < e.length; i++)
                    if (!0 === o[e[i]])
                        return !1; return !0; }
        function A(t, e) { for (var r = (0, l.default)(t, (function (t) { return (0, h.possiblePathsFrom)([t], 1); })), n = g(r.length), o = (0, l.default)(r, (function (t) { var e = {}; return (0, f.default)(t, (function (t) { var r = O(t.partialPath); (0, f.default)(r, (function (t) { e[t] = !0; })); })), e; })), i = r, a = 1; a <= e; a++) {
            var u = i;
            i = g(u.length);
            for (var c = function (t) { for (var r = u[t], c = 0; c < r.length; c++) {
                var l = r[c].partialPath, p = r[c].suffixDef, d = O(l);
                if (R(o, d, t) || (0, s.default)(p) || l.length === e) {
                    var v = n[t];
                    if (!1 === N(v, l)) {
                        v.push(l);
                        for (var y = 0; y < d.length; y++) {
                            var m = d[y];
                            o[t][m] = !0;
                        }
                    }
                }
                else {
                    var T = (0, h.possiblePathsFrom)(p, a + 1, l);
                    i[t] = i[t].concat(T), (0, f.default)(T, (function (e) { var r = O(e.partialPath); (0, f.default)(r, (function (e) { o[t][e] = !0; })); }));
                }
            } }, p = 0; p < u.length; p++)
                c(p);
        } return n; }
        function I(t, e, r, n) { var o = new _(t, a.ALTERNATION, n); return e.accept(o), A(o.result, r); }
        function x(t, e, r, n) { var o = new _(t, r); e.accept(o); var i = o.result, a = new E(e, t, r).startWalking(); return A([new m.Alternative({ definition: i }), new m.Alternative({ definition: a })], n); }
        function N(t, e) { t: for (var r = 0; r < t.length; r++) {
            var n = t[r];
            if (n.length === e.length) {
                for (var o = 0; o < n.length; o++) {
                    var i = e[o], a = n[o];
                    if (!1 == (i === a || void 0 !== a.categoryMatchesMap[i.tokenTypeIdx]))
                        continue t;
                }
                return !0;
            }
        } return !1; }
        function P(t) { return (0, c.default)(t, (function (t) { return (0, c.default)(t, (function (t) { return (0, c.default)(t, (function (t) { return (0, s.default)(t.categoryMatches); })); })); })); }
        e.lookAheadSequenceFromAlternatives = A, e.getLookaheadPathsForOr = I, e.getLookaheadPathsForOptionalProd = x, e.containsPath = N, e.isStrictPrefixOfPath = function (t, e) { return t.length < e.length && (0, c.default)(t, (function (t, r) { var n = e[r]; return t === n || n.categoryMatchesMap[t.tokenTypeIdx]; })); }, e.areTokenCategoriesNotUsed = P;
    }, 6304: function (t, e, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function (t, e) { return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]); })(t, e); }, function (t, e) { if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null"); function r() { this.constructor = t; } n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }), i = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.GastRefResolverVisitor = e.resolveGrammar = void 0;
        var a = r(2941), s = i(r(9756)), u = i(r(8346)), c = r(7729);
        e.resolveGrammar = function (t, e) { var r = new l(t, e); return r.resolveRefs(), r.errors; };
        var l = function (t) { function e(e, r) { var n = t.call(this) || this; return n.nameToTopRule = e, n.errMsgProvider = r, n.errors = [], n; } return o(e, t), e.prototype.resolveRefs = function () { var t = this; (0, s.default)((0, u.default)(this.nameToTopRule), (function (e) { t.currTopLevel = e, e.accept(t); })); }, e.prototype.visitNonTerminal = function (t) { var e = this.nameToTopRule[t.nonTerminalName]; if (e)
            t.referencedRule = e;
        else {
            var r = this.errMsgProvider.buildRuleNotFoundError(this.currTopLevel, t);
            this.errors.push({ message: r, type: a.ParserDefinitionErrorType.UNRESOLVED_SUBRULE_REF, ruleName: this.currTopLevel.name, unresolvedRefName: t.nonTerminalName });
        } }, e; }(c.GAstVisitor);
        e.GastRefResolverVisitor = l;
    }, 8567: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.RestWalker = void 0;
        var o = n(r(7264)), i = n(r(9756)), a = r(7729), s = function () { function t() { } return t.prototype.walk = function (t, e) { var r = this; void 0 === e && (e = []), (0, i.default)(t.definition, (function (n, i) { var s = (0, o.default)(t.definition, i + 1); if (n instanceof a.NonTerminal)
            r.walkProdRef(n, s, e);
        else if (n instanceof a.Terminal)
            r.walkTerminal(n, s, e);
        else if (n instanceof a.Alternative)
            r.walkFlat(n, s, e);
        else if (n instanceof a.Option)
            r.walkOption(n, s, e);
        else if (n instanceof a.RepetitionMandatory)
            r.walkAtLeastOne(n, s, e);
        else if (n instanceof a.RepetitionMandatoryWithSeparator)
            r.walkAtLeastOneSep(n, s, e);
        else if (n instanceof a.RepetitionWithSeparator)
            r.walkManySep(n, s, e);
        else if (n instanceof a.Repetition)
            r.walkMany(n, s, e);
        else {
            if (!(n instanceof a.Alternation))
                throw Error("non exhaustive match");
            r.walkOr(n, s, e);
        } })); }, t.prototype.walkTerminal = function (t, e, r) { }, t.prototype.walkProdRef = function (t, e, r) { }, t.prototype.walkFlat = function (t, e, r) { var n = e.concat(r); this.walk(t, n); }, t.prototype.walkOption = function (t, e, r) { var n = e.concat(r); this.walk(t, n); }, t.prototype.walkAtLeastOne = function (t, e, r) { var n = [new a.Option({ definition: t.definition })].concat(e, r); this.walk(t, n); }, t.prototype.walkAtLeastOneSep = function (t, e, r) { var n = u(t, e, r); this.walk(t, n); }, t.prototype.walkMany = function (t, e, r) { var n = [new a.Option({ definition: t.definition })].concat(e, r); this.walk(t, n); }, t.prototype.walkManySep = function (t, e, r) { var n = u(t, e, r); this.walk(t, n); }, t.prototype.walkOr = function (t, e, r) { var n = this, o = e.concat(r); (0, i.default)(t.definition, (function (t) { var e = new a.Alternative({ definition: [t] }); n.walk(e, o); })); }, t; }();
        function u(t, e, r) { return [new a.Option({ definition: [new a.Terminal({ terminalType: t.separator })].concat(t.definition) })].concat(e, r); }
        e.RestWalker = s;
    }, 2941: function (t, e, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function (t, e) { return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]); })(t, e); }, function (t, e) { if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null"); function r() { this.constructor = t; } n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }), i = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.EmbeddedActionsParser = e.CstParser = e.Parser = e.EMPTY_ALT = e.ParserDefinitionErrorType = e.DEFAULT_RULE_CONFIG = e.DEFAULT_PARSER_CONFIG = e.END_OF_FILE = void 0;
        var a, s = i(r(5455)), u = i(r(6760)), c = i(r(9756)), l = i(r(8346)), f = i(r(3352)), p = i(r(4004)), d = r(7146), h = r(4917), v = r(6736), y = r(1007), m = r(1665), T = r(9992), E = r(161), _ = r(3225), g = r(598), O = r(8503), R = r(3273), A = r(9464), I = r(1625), x = r(6688), N = r(146), P = r(4803);
        e.END_OF_FILE = (0, v.createTokenInstance)(v.EOF, "", NaN, NaN, NaN, NaN, NaN, NaN), Object.freeze(e.END_OF_FILE), e.DEFAULT_PARSER_CONFIG = Object.freeze({ recoveryEnabled: !1, maxLookahead: 3, dynamicTokensEnabled: !1, outputCst: !0, errorMessageProvider: y.defaultParserErrorProvider, nodeLocationTracking: "none", traceInitPerf: !1, skipValidations: !1 }), e.DEFAULT_RULE_CONFIG = Object.freeze({ recoveryValueFunc: function () { }, resyncEnabled: !0 }), (a = e.ParserDefinitionErrorType || (e.ParserDefinitionErrorType = {}))[a.INVALID_RULE_NAME = 0] = "INVALID_RULE_NAME", a[a.DUPLICATE_RULE_NAME = 1] = "DUPLICATE_RULE_NAME", a[a.INVALID_RULE_OVERRIDE = 2] = "INVALID_RULE_OVERRIDE", a[a.DUPLICATE_PRODUCTIONS = 3] = "DUPLICATE_PRODUCTIONS", a[a.UNRESOLVED_SUBRULE_REF = 4] = "UNRESOLVED_SUBRULE_REF", a[a.LEFT_RECURSION = 5] = "LEFT_RECURSION", a[a.NONE_LAST_EMPTY_ALT = 6] = "NONE_LAST_EMPTY_ALT", a[a.AMBIGUOUS_ALTS = 7] = "AMBIGUOUS_ALTS", a[a.CONFLICT_TOKENS_RULES_NAMESPACE = 8] = "CONFLICT_TOKENS_RULES_NAMESPACE", a[a.INVALID_TOKEN_NAME = 9] = "INVALID_TOKEN_NAME", a[a.NO_NON_EMPTY_LOOKAHEAD = 10] = "NO_NON_EMPTY_LOOKAHEAD", a[a.AMBIGUOUS_PREFIX_ALTS = 11] = "AMBIGUOUS_PREFIX_ALTS", a[a.TOO_MANY_ALTS = 12] = "TOO_MANY_ALTS", e.EMPTY_ALT = function (t) { return void 0 === t && (t = void 0), function () { return t; }; };
        var S = function () { function t(t, r) { this.definitionErrors = [], this.selfAnalysisDone = !1; var n = this; if (n.initErrorHandler(r), n.initLexerAdapter(), n.initLooksAhead(r), n.initRecognizerEngine(t, r), n.initRecoverable(r), n.initTreeBuilder(r), n.initContentAssist(), n.initGastRecorder(r), n.initPerformanceTracer(r), (0, f.default)(r, "ignoredIssues"))
            throw new Error("The <ignoredIssues> IParserConfig property has been deprecated.\n\tPlease use the <IGNORE_AMBIGUITIES> flag on the relevant DSL method instead.\n\tSee: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#IGNORING_AMBIGUITIES\n\tFor further details."); this.skipValidations = (0, f.default)(r, "skipValidations") ? r.skipValidations : e.DEFAULT_PARSER_CONFIG.skipValidations; } return t.performSelfAnalysis = function (t) { throw Error("The **static** `performSelfAnalysis` method has been deprecated.\t\nUse the **instance** method with the same name instead."); }, t.prototype.performSelfAnalysis = function () { var e = this; this.TRACE_INIT("performSelfAnalysis", (function () { var r; e.selfAnalysisDone = !0; var n = e.className; e.TRACE_INIT("toFastProps", (function () { (0, d.toFastProperties)(e); })), e.TRACE_INIT("Grammar Recording", (function () { try {
            e.enableRecording(), (0, c.default)(e.definedRulesNames, (function (t) { var r, n = e[t].originalGrammarAction; e.TRACE_INIT("".concat(t, " Rule"), (function () { r = e.topLevelRuleRecord(t, n); })), e.gastProductionsCache[t] = r; }));
        }
        finally {
            e.disableRecording();
        } })); var o = []; if (e.TRACE_INIT("Grammar Resolving", (function () { o = (0, m.resolveGrammar)({ rules: (0, l.default)(e.gastProductionsCache) }), e.definitionErrors = e.definitionErrors.concat(o); })), e.TRACE_INIT("Grammar Validations", (function () { if ((0, s.default)(o) && !1 === e.skipValidations) {
            var t = (0, m.validateGrammar)({ rules: (0, l.default)(e.gastProductionsCache), maxLookahead: e.maxLookahead, tokenTypes: (0, l.default)(e.tokensMap), errMsgProvider: y.defaultGrammarValidatorErrorProvider, grammarName: n });
            e.definitionErrors = e.definitionErrors.concat(t);
        } })), (0, s.default)(e.definitionErrors) && (e.recoveryEnabled && e.TRACE_INIT("computeAllProdsFollows", (function () { var t = (0, h.computeAllProdsFollows)((0, l.default)(e.gastProductionsCache)); e.resyncFollows = t; })), e.TRACE_INIT("ComputeLookaheadFunctions", (function () { e.preComputeLookaheadFunctions((0, l.default)(e.gastProductionsCache)); }))), !t.DEFER_DEFINITION_ERRORS_HANDLING && !(0, s.default)(e.definitionErrors))
            throw r = (0, u.default)(e.definitionErrors, (function (t) { return t.message; })), new Error("Parser Definition Errors detected:\n ".concat(r.join("\n-------------------------------\n"))); })); }, t.DEFER_DEFINITION_ERRORS_HANDLING = !1, t; }();
        e.Parser = S, (0, P.applyMixins)(S, [T.Recoverable, E.LooksAhead, _.TreeBuilder, g.LexerAdapter, R.RecognizerEngine, O.RecognizerApi, A.ErrorHandler, I.ContentAssist, x.GastRecorder, N.PerformanceTracer]);
        var b = function (t) { function r(r, n) { void 0 === n && (n = e.DEFAULT_PARSER_CONFIG); var o = (0, p.default)(n); return o.outputCst = !0, t.call(this, r, o) || this; } return o(r, t), r; }(S);
        e.CstParser = b;
        var k = function (t) { function r(r, n) { void 0 === n && (n = e.DEFAULT_PARSER_CONFIG); var o = (0, p.default)(n); return o.outputCst = !1, t.call(this, r, o) || this; } return o(r, t), r; }(S);
        e.EmbeddedActionsParser = k;
    }, 1625: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.ContentAssist = void 0;
        var o = r(9985), i = n(r(3237)), a = n(r(4336)), s = function () { function t() { } return t.prototype.initContentAssist = function () { }, t.prototype.computeContentAssist = function (t, e) { var r = this.gastProductionsCache[t]; if ((0, a.default)(r))
            throw Error("Rule ->".concat(t, "<- does not exist in this grammar.")); return (0, o.nextPossibleTokensAfter)([r], e, this.tokenMatcher, this.maxLookahead); }, t.prototype.getNextPossibleTokenTypes = function (t) { var e = (0, i.default)(t.ruleStack), r = this.getGAstProductions()[e]; return new o.NextAfterTokenWalker(r, t).startWalking(); }, t; }();
        e.ContentAssist = s;
    }, 9464: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.ErrorHandler = void 0;
        var o = r(643), i = n(r(3352)), a = n(r(4004)), s = r(4677), u = r(2941), c = function () { function t() { } return t.prototype.initErrorHandler = function (t) { this._errors = [], this.errorMessageProvider = (0, i.default)(t, "errorMessageProvider") ? t.errorMessageProvider : u.DEFAULT_PARSER_CONFIG.errorMessageProvider; }, t.prototype.SAVE_ERROR = function (t) { if ((0, o.isRecognitionException)(t))
            return t.context = { ruleStack: this.getHumanReadableRuleStack(), ruleOccurrenceStack: (0, a.default)(this.RULE_OCCURRENCE_STACK) }, this._errors.push(t), t; throw Error("Trying to save an Error which is not a RecognitionException"); }, Object.defineProperty(t.prototype, "errors", { get: function () { return (0, a.default)(this._errors); }, set: function (t) { this._errors = t; }, enumerable: !1, configurable: !0 }), t.prototype.raiseEarlyExitException = function (t, e, r) { for (var n = this.getCurrRuleFullName(), i = this.getGAstProductions()[n], a = (0, s.getLookaheadPathsForOptionalProd)(t, i, e, this.maxLookahead)[0], u = [], c = 1; c <= this.maxLookahead; c++)
            u.push(this.LA(c)); var l = this.errorMessageProvider.buildEarlyExitMessage({ expectedIterationPaths: a, actual: u, previous: this.LA(0), customUserDescription: r, ruleName: n }); throw this.SAVE_ERROR(new o.EarlyExitException(l, this.LA(1), this.LA(0))); }, t.prototype.raiseNoAltException = function (t, e) { for (var r = this.getCurrRuleFullName(), n = this.getGAstProductions()[r], i = (0, s.getLookaheadPathsForOr)(t, n, this.maxLookahead), a = [], u = 1; u <= this.maxLookahead; u++)
            a.push(this.LA(u)); var c = this.LA(0), l = this.errorMessageProvider.buildNoViableAltMessage({ expectedPathsPerAlt: i, actual: a, previous: c, customUserDescription: e, ruleName: this.getCurrRuleFullName() }); throw this.SAVE_ERROR(new o.NoViableAltException(l, this.LA(1), c)); }, t; }();
        e.ErrorHandler = c;
    }, 6688: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.GastRecorder = void 0;
        var o = n(r(6974)), i = n(r(6152)), a = n(r(1525)), s = n(r(9756)), u = n(r(1049)), c = n(r(3352)), l = r(7729), f = r(9027), p = r(1201), d = r(6736), h = r(2941), v = r(8209), y = { description: "This Object indicates the Parser is during Recording Phase" };
        Object.freeze(y);
        var m = Math.pow(2, v.BITS_FOR_OCCURRENCE_IDX) - 1, T = (0, d.createToken)({ name: "RECORDING_PHASE_TOKEN", pattern: f.Lexer.NA });
        (0, p.augmentTokenTypes)([T]);
        var E = (0, d.createTokenInstance)(T, "This IToken indicates the Parser is in Recording Phase\n\tSee: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details", -1, -1, -1, -1, -1, -1);
        Object.freeze(E);
        var _ = { name: "This CSTNode indicates the Parser is in Recording Phase\n\tSee: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details", children: {} }, g = function () { function t() { } return t.prototype.initGastRecorder = function (t) { this.recordingProdStack = [], this.RECORDING_PHASE = !1; }, t.prototype.enableRecording = function () { var t = this; this.RECORDING_PHASE = !0, this.TRACE_INIT("Enable Recording", (function () { for (var e = function (e) { var r = e > 0 ? e : ""; t["CONSUME".concat(r)] = function (t, r) { return this.consumeInternalRecord(t, e, r); }, t["SUBRULE".concat(r)] = function (t, r) { return this.subruleInternalRecord(t, e, r); }, t["OPTION".concat(r)] = function (t) { return this.optionInternalRecord(t, e); }, t["OR".concat(r)] = function (t) { return this.orInternalRecord(t, e); }, t["MANY".concat(r)] = function (t) { this.manyInternalRecord(e, t); }, t["MANY_SEP".concat(r)] = function (t) { this.manySepFirstInternalRecord(e, t); }, t["AT_LEAST_ONE".concat(r)] = function (t) { this.atLeastOneInternalRecord(e, t); }, t["AT_LEAST_ONE_SEP".concat(r)] = function (t) { this.atLeastOneSepFirstInternalRecord(e, t); }; }, r = 0; r < 10; r++)
            e(r); t.consume = function (t, e, r) { return this.consumeInternalRecord(e, t, r); }, t.subrule = function (t, e, r) { return this.subruleInternalRecord(e, t, r); }, t.option = function (t, e) { return this.optionInternalRecord(e, t); }, t.or = function (t, e) { return this.orInternalRecord(e, t); }, t.many = function (t, e) { this.manyInternalRecord(t, e); }, t.atLeastOne = function (t, e) { this.atLeastOneInternalRecord(t, e); }, t.ACTION = t.ACTION_RECORD, t.BACKTRACK = t.BACKTRACK_RECORD, t.LA = t.LA_RECORD; })); }, t.prototype.disableRecording = function () { var t = this; this.RECORDING_PHASE = !1, this.TRACE_INIT("Deleting Recording methods", (function () { for (var e = t, r = 0; r < 10; r++) {
            var n = r > 0 ? r : "";
            delete e["CONSUME".concat(n)], delete e["SUBRULE".concat(n)], delete e["OPTION".concat(n)], delete e["OR".concat(n)], delete e["MANY".concat(n)], delete e["MANY_SEP".concat(n)], delete e["AT_LEAST_ONE".concat(n)], delete e["AT_LEAST_ONE_SEP".concat(n)];
        } delete e.consume, delete e.subrule, delete e.option, delete e.or, delete e.many, delete e.atLeastOne, delete e.ACTION, delete e.BACKTRACK, delete e.LA; })); }, t.prototype.ACTION_RECORD = function (t) { }, t.prototype.BACKTRACK_RECORD = function (t, e) { return function () { return !0; }; }, t.prototype.LA_RECORD = function (t) { return h.END_OF_FILE; }, t.prototype.topLevelRuleRecord = function (t, e) { try {
            var r = new l.Rule({ definition: [], name: t });
            return r.name = t, this.recordingProdStack.push(r), e.call(this), this.recordingProdStack.pop(), r;
        }
        catch (t) {
            if (!0 !== t.KNOWN_RECORDER_ERROR)
                try {
                    t.message = t.message + '\n\t This error was thrown during the "grammar recording phase" For more info see:\n\thttps://chevrotain.io/docs/guide/internals.html#grammar-recording';
                }
                catch (e) {
                    throw t;
                }
            throw t;
        } }, t.prototype.optionInternalRecord = function (t, e) { return O.call(this, l.Option, t, e); }, t.prototype.atLeastOneInternalRecord = function (t, e) { O.call(this, l.RepetitionMandatory, e, t); }, t.prototype.atLeastOneSepFirstInternalRecord = function (t, e) { O.call(this, l.RepetitionMandatoryWithSeparator, e, t, !0); }, t.prototype.manyInternalRecord = function (t, e) { O.call(this, l.Repetition, e, t); }, t.prototype.manySepFirstInternalRecord = function (t, e) { O.call(this, l.RepetitionWithSeparator, e, t, !0); }, t.prototype.orInternalRecord = function (t, e) { return R.call(this, t, e); }, t.prototype.subruleInternalRecord = function (t, e, r) { if (I(e), !t || !1 === (0, c.default)(t, "ruleName")) {
            var n = new Error("<SUBRULE".concat(A(e), "> argument is invalid") + " expecting a Parser method reference but got: <".concat(JSON.stringify(t), ">") + "\n inside top level rule: <".concat(this.recordingProdStack[0].name, ">"));
            throw n.KNOWN_RECORDER_ERROR = !0, n;
        } var i = (0, o.default)(this.recordingProdStack), a = t.ruleName, s = new l.NonTerminal({ idx: e, nonTerminalName: a, label: null == r ? void 0 : r.LABEL, referencedRule: void 0 }); return i.definition.push(s), this.outputCst ? _ : y; }, t.prototype.consumeInternalRecord = function (t, e, r) { if (I(e), !(0, p.hasShortKeyProperty)(t)) {
            var n = new Error("<CONSUME".concat(A(e), "> argument is invalid") + " expecting a TokenType reference but got: <".concat(JSON.stringify(t), ">") + "\n inside top level rule: <".concat(this.recordingProdStack[0].name, ">"));
            throw n.KNOWN_RECORDER_ERROR = !0, n;
        } var i = (0, o.default)(this.recordingProdStack), a = new l.Terminal({ idx: e, terminalType: t, label: null == r ? void 0 : r.LABEL }); return i.definition.push(a), E; }, t; }();
        function O(t, e, r, n) { void 0 === n && (n = !1), I(r); var i = (0, o.default)(this.recordingProdStack), a = (0, u.default)(e) ? e : e.DEF, s = new t({ definition: [], idx: r }); return n && (s.separator = e.SEP), (0, c.default)(e, "MAX_LOOKAHEAD") && (s.maxLookahead = e.MAX_LOOKAHEAD), this.recordingProdStack.push(s), a.call(this), i.definition.push(s), this.recordingProdStack.pop(), y; }
        function R(t, e) { var r = this; I(e); var n = (0, o.default)(this.recordingProdStack), f = !1 === (0, i.default)(t), p = !1 === f ? t : t.DEF, d = new l.Alternation({ definition: [], idx: e, ignoreAmbiguities: f && !0 === t.IGNORE_AMBIGUITIES }); (0, c.default)(t, "MAX_LOOKAHEAD") && (d.maxLookahead = t.MAX_LOOKAHEAD); var h = (0, a.default)(p, (function (t) { return (0, u.default)(t.GATE); })); return d.hasPredicates = h, n.definition.push(d), (0, s.default)(p, (function (t) { var e = new l.Alternative({ definition: [] }); d.definition.push(e), (0, c.default)(t, "IGNORE_AMBIGUITIES") ? e.ignoreAmbiguities = t.IGNORE_AMBIGUITIES : (0, c.default)(t, "GATE") && (e.ignoreAmbiguities = !0), r.recordingProdStack.push(e), t.ALT.call(r), r.recordingProdStack.pop(); })), y; }
        function A(t) { return 0 === t ? "" : "".concat(t); }
        function I(t) { if (t < 0 || t > m) {
            var e = new Error("Invalid DSL Method idx value: <".concat(t, ">\n\t") + "Idx value must be a none negative value smaller than ".concat(m + 1));
            throw e.KNOWN_RECORDER_ERROR = !0, e;
        } }
        e.GastRecorder = g;
    }, 598: (t, e, r) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.LexerAdapter = void 0;
        var n = r(2941), o = function () { function t() { } return t.prototype.initLexerAdapter = function () { this.tokVector = [], this.tokVectorLength = 0, this.currIdx = -1; }, Object.defineProperty(t.prototype, "input", { get: function () { return this.tokVector; }, set: function (t) { if (!0 !== this.selfAnalysisDone)
                throw Error("Missing <performSelfAnalysis> invocation at the end of the Parser's constructor."); this.reset(), this.tokVector = t, this.tokVectorLength = t.length; }, enumerable: !1, configurable: !0 }), t.prototype.SKIP_TOKEN = function () { return this.currIdx <= this.tokVector.length - 2 ? (this.consumeToken(), this.LA(1)) : n.END_OF_FILE; }, t.prototype.LA = function (t) { var e = this.currIdx + t; return e < 0 || this.tokVectorLength <= e ? n.END_OF_FILE : this.tokVector[e]; }, t.prototype.consumeToken = function () { this.currIdx++; }, t.prototype.exportLexerState = function () { return this.currIdx; }, t.prototype.importLexerState = function (t) { this.currIdx = t; }, t.prototype.resetLexerState = function () { this.currIdx = -1; }, t.prototype.moveToTerminatedState = function () { this.currIdx = this.tokVector.length - 1; }, t.prototype.getLexerPosition = function () { return this.exportLexerState(); }, t; }();
        e.LexerAdapter = o;
    }, 161: function (t, e, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function (t, e) { return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]); })(t, e); }, function (t, e) { if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null"); function r() { this.constructor = t; } n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }), i = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.collectMethods = e.LooksAhead = void 0;
        var a = r(4677), s = i(r(9756)), u = i(r(3352)), c = r(2941), l = r(8209), f = r(7729), p = r(7729), d = function () { function t() { } return t.prototype.initLooksAhead = function (t) { this.dynamicTokensEnabled = (0, u.default)(t, "dynamicTokensEnabled") ? t.dynamicTokensEnabled : c.DEFAULT_PARSER_CONFIG.dynamicTokensEnabled, this.maxLookahead = (0, u.default)(t, "maxLookahead") ? t.maxLookahead : c.DEFAULT_PARSER_CONFIG.maxLookahead, this.lookAheadFuncsCache = new Map; }, t.prototype.preComputeLookaheadFunctions = function (t) { var e = this; (0, s.default)(t, (function (t) { e.TRACE_INIT("".concat(t.name, " Rule Lookahead"), (function () { var r = v(t), n = r.alternation, o = r.repetition, i = r.option, u = r.repetitionMandatory, c = r.repetitionMandatoryWithSeparator, f = r.repetitionWithSeparator; (0, s.default)(n, (function (r) { var n = 0 === r.idx ? "" : r.idx; e.TRACE_INIT("".concat((0, p.getProductionDslName)(r)).concat(n), (function () { var n = (0, a.buildLookaheadFuncForOr)(r.idx, t, r.maxLookahead || e.maxLookahead, r.hasPredicates, e.dynamicTokensEnabled, e.lookAheadBuilderForAlternatives), o = (0, l.getKeyForAutomaticLookahead)(e.fullRuleNameToShort[t.name], l.OR_IDX, r.idx); e.setLaFuncCache(o, n); })); })), (0, s.default)(o, (function (r) { e.computeLookaheadFunc(t, r.idx, l.MANY_IDX, a.PROD_TYPE.REPETITION, r.maxLookahead, (0, p.getProductionDslName)(r)); })), (0, s.default)(i, (function (r) { e.computeLookaheadFunc(t, r.idx, l.OPTION_IDX, a.PROD_TYPE.OPTION, r.maxLookahead, (0, p.getProductionDslName)(r)); })), (0, s.default)(u, (function (r) { e.computeLookaheadFunc(t, r.idx, l.AT_LEAST_ONE_IDX, a.PROD_TYPE.REPETITION_MANDATORY, r.maxLookahead, (0, p.getProductionDslName)(r)); })), (0, s.default)(c, (function (r) { e.computeLookaheadFunc(t, r.idx, l.AT_LEAST_ONE_SEP_IDX, a.PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, r.maxLookahead, (0, p.getProductionDslName)(r)); })), (0, s.default)(f, (function (r) { e.computeLookaheadFunc(t, r.idx, l.MANY_SEP_IDX, a.PROD_TYPE.REPETITION_WITH_SEPARATOR, r.maxLookahead, (0, p.getProductionDslName)(r)); })); })); })); }, t.prototype.computeLookaheadFunc = function (t, e, r, n, o, i) { var s = this; this.TRACE_INIT("".concat(i).concat(0 === e ? "" : e), (function () { var i = (0, a.buildLookaheadFuncForOptionalProd)(e, t, o || s.maxLookahead, s.dynamicTokensEnabled, n, s.lookAheadBuilderForOptional), u = (0, l.getKeyForAutomaticLookahead)(s.fullRuleNameToShort[t.name], r, e); s.setLaFuncCache(u, i); })); }, t.prototype.lookAheadBuilderForOptional = function (t, e, r) { return (0, a.buildSingleAlternativeLookaheadFunction)(t, e, r); }, t.prototype.lookAheadBuilderForAlternatives = function (t, e, r, n) { return (0, a.buildAlternativesLookAheadFunc)(t, e, r, n); }, t.prototype.getKeyForAutomaticLookahead = function (t, e) { var r = this.getLastExplicitRuleShortName(); return (0, l.getKeyForAutomaticLookahead)(r, t, e); }, t.prototype.getLaFuncFromCache = function (t) { return this.lookAheadFuncsCache.get(t); }, t.prototype.setLaFuncCache = function (t, e) { this.lookAheadFuncsCache.set(t, e); }, t; }();
        e.LooksAhead = d;
        var h = new (function (t) { function e() { var e = null !== t && t.apply(this, arguments) || this; return e.dslMethods = { option: [], alternation: [], repetition: [], repetitionWithSeparator: [], repetitionMandatory: [], repetitionMandatoryWithSeparator: [] }, e; } return o(e, t), e.prototype.reset = function () { this.dslMethods = { option: [], alternation: [], repetition: [], repetitionWithSeparator: [], repetitionMandatory: [], repetitionMandatoryWithSeparator: [] }; }, e.prototype.visitOption = function (t) { this.dslMethods.option.push(t); }, e.prototype.visitRepetitionWithSeparator = function (t) { this.dslMethods.repetitionWithSeparator.push(t); }, e.prototype.visitRepetitionMandatory = function (t) { this.dslMethods.repetitionMandatory.push(t); }, e.prototype.visitRepetitionMandatoryWithSeparator = function (t) { this.dslMethods.repetitionMandatoryWithSeparator.push(t); }, e.prototype.visitRepetition = function (t) { this.dslMethods.repetition.push(t); }, e.prototype.visitAlternation = function (t) { this.dslMethods.alternation.push(t); }, e; }(f.GAstVisitor));
        function v(t) { h.reset(), t.accept(h); var e = h.dslMethods; return h.reset(), e; }
        e.collectMethods = v;
    }, 146: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.PerformanceTracer = void 0;
        var o = n(r(3352)), i = r(7146), a = r(2941), s = function () { function t() { } return t.prototype.initPerformanceTracer = function (t) { if ((0, o.default)(t, "traceInitPerf")) {
            var e = t.traceInitPerf, r = "number" == typeof e;
            this.traceInitMaxIdent = r ? e : 1 / 0, this.traceInitPerf = r ? e > 0 : e;
        }
        else
            this.traceInitMaxIdent = 0, this.traceInitPerf = a.DEFAULT_PARSER_CONFIG.traceInitPerf; this.traceInitIndent = -1; }, t.prototype.TRACE_INIT = function (t, e) { if (!0 === this.traceInitPerf) {
            this.traceInitIndent++;
            var r = new Array(this.traceInitIndent + 1).join("\t");
            this.traceInitIndent < this.traceInitMaxIdent && console.log("".concat(r, "--\x3e <").concat(t, ">"));
            var n = (0, i.timer)(e), o = n.time, a = n.value, s = o > 10 ? console.warn : console.log;
            return this.traceInitIndent < this.traceInitMaxIdent && s("".concat(r, "<-- <").concat(t, "> time: ").concat(o, "ms")), this.traceInitIndent--, a;
        } return e(); }, t; }();
        e.PerformanceTracer = s;
    }, 8503: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.RecognizerApi = void 0;
        var o = n(r(8346)), i = n(r(1886)), a = r(643), s = r(2941), u = r(1007), c = r(3870), l = r(7729), f = function () { function t() { } return t.prototype.ACTION = function (t) { return t.call(this); }, t.prototype.consume = function (t, e, r) { return this.consumeInternal(e, t, r); }, t.prototype.subrule = function (t, e, r) { return this.subruleInternal(e, t, r); }, t.prototype.option = function (t, e) { return this.optionInternal(e, t); }, t.prototype.or = function (t, e) { return this.orInternal(e, t); }, t.prototype.many = function (t, e) { return this.manyInternal(t, e); }, t.prototype.atLeastOne = function (t, e) { return this.atLeastOneInternal(t, e); }, t.prototype.CONSUME = function (t, e) { return this.consumeInternal(t, 0, e); }, t.prototype.CONSUME1 = function (t, e) { return this.consumeInternal(t, 1, e); }, t.prototype.CONSUME2 = function (t, e) { return this.consumeInternal(t, 2, e); }, t.prototype.CONSUME3 = function (t, e) { return this.consumeInternal(t, 3, e); }, t.prototype.CONSUME4 = function (t, e) { return this.consumeInternal(t, 4, e); }, t.prototype.CONSUME5 = function (t, e) { return this.consumeInternal(t, 5, e); }, t.prototype.CONSUME6 = function (t, e) { return this.consumeInternal(t, 6, e); }, t.prototype.CONSUME7 = function (t, e) { return this.consumeInternal(t, 7, e); }, t.prototype.CONSUME8 = function (t, e) { return this.consumeInternal(t, 8, e); }, t.prototype.CONSUME9 = function (t, e) { return this.consumeInternal(t, 9, e); }, t.prototype.SUBRULE = function (t, e) { return this.subruleInternal(t, 0, e); }, t.prototype.SUBRULE1 = function (t, e) { return this.subruleInternal(t, 1, e); }, t.prototype.SUBRULE2 = function (t, e) { return this.subruleInternal(t, 2, e); }, t.prototype.SUBRULE3 = function (t, e) { return this.subruleInternal(t, 3, e); }, t.prototype.SUBRULE4 = function (t, e) { return this.subruleInternal(t, 4, e); }, t.prototype.SUBRULE5 = function (t, e) { return this.subruleInternal(t, 5, e); }, t.prototype.SUBRULE6 = function (t, e) { return this.subruleInternal(t, 6, e); }, t.prototype.SUBRULE7 = function (t, e) { return this.subruleInternal(t, 7, e); }, t.prototype.SUBRULE8 = function (t, e) { return this.subruleInternal(t, 8, e); }, t.prototype.SUBRULE9 = function (t, e) { return this.subruleInternal(t, 9, e); }, t.prototype.OPTION = function (t) { return this.optionInternal(t, 0); }, t.prototype.OPTION1 = function (t) { return this.optionInternal(t, 1); }, t.prototype.OPTION2 = function (t) { return this.optionInternal(t, 2); }, t.prototype.OPTION3 = function (t) { return this.optionInternal(t, 3); }, t.prototype.OPTION4 = function (t) { return this.optionInternal(t, 4); }, t.prototype.OPTION5 = function (t) { return this.optionInternal(t, 5); }, t.prototype.OPTION6 = function (t) { return this.optionInternal(t, 6); }, t.prototype.OPTION7 = function (t) { return this.optionInternal(t, 7); }, t.prototype.OPTION8 = function (t) { return this.optionInternal(t, 8); }, t.prototype.OPTION9 = function (t) { return this.optionInternal(t, 9); }, t.prototype.OR = function (t) { return this.orInternal(t, 0); }, t.prototype.OR1 = function (t) { return this.orInternal(t, 1); }, t.prototype.OR2 = function (t) { return this.orInternal(t, 2); }, t.prototype.OR3 = function (t) { return this.orInternal(t, 3); }, t.prototype.OR4 = function (t) { return this.orInternal(t, 4); }, t.prototype.OR5 = function (t) { return this.orInternal(t, 5); }, t.prototype.OR6 = function (t) { return this.orInternal(t, 6); }, t.prototype.OR7 = function (t) { return this.orInternal(t, 7); }, t.prototype.OR8 = function (t) { return this.orInternal(t, 8); }, t.prototype.OR9 = function (t) { return this.orInternal(t, 9); }, t.prototype.MANY = function (t) { this.manyInternal(0, t); }, t.prototype.MANY1 = function (t) { this.manyInternal(1, t); }, t.prototype.MANY2 = function (t) { this.manyInternal(2, t); }, t.prototype.MANY3 = function (t) { this.manyInternal(3, t); }, t.prototype.MANY4 = function (t) { this.manyInternal(4, t); }, t.prototype.MANY5 = function (t) { this.manyInternal(5, t); }, t.prototype.MANY6 = function (t) { this.manyInternal(6, t); }, t.prototype.MANY7 = function (t) { this.manyInternal(7, t); }, t.prototype.MANY8 = function (t) { this.manyInternal(8, t); }, t.prototype.MANY9 = function (t) { this.manyInternal(9, t); }, t.prototype.MANY_SEP = function (t) { this.manySepFirstInternal(0, t); }, t.prototype.MANY_SEP1 = function (t) { this.manySepFirstInternal(1, t); }, t.prototype.MANY_SEP2 = function (t) { this.manySepFirstInternal(2, t); }, t.prototype.MANY_SEP3 = function (t) { this.manySepFirstInternal(3, t); }, t.prototype.MANY_SEP4 = function (t) { this.manySepFirstInternal(4, t); }, t.prototype.MANY_SEP5 = function (t) { this.manySepFirstInternal(5, t); }, t.prototype.MANY_SEP6 = function (t) { this.manySepFirstInternal(6, t); }, t.prototype.MANY_SEP7 = function (t) { this.manySepFirstInternal(7, t); }, t.prototype.MANY_SEP8 = function (t) { this.manySepFirstInternal(8, t); }, t.prototype.MANY_SEP9 = function (t) { this.manySepFirstInternal(9, t); }, t.prototype.AT_LEAST_ONE = function (t) { this.atLeastOneInternal(0, t); }, t.prototype.AT_LEAST_ONE1 = function (t) { return this.atLeastOneInternal(1, t); }, t.prototype.AT_LEAST_ONE2 = function (t) { this.atLeastOneInternal(2, t); }, t.prototype.AT_LEAST_ONE3 = function (t) { this.atLeastOneInternal(3, t); }, t.prototype.AT_LEAST_ONE4 = function (t) { this.atLeastOneInternal(4, t); }, t.prototype.AT_LEAST_ONE5 = function (t) { this.atLeastOneInternal(5, t); }, t.prototype.AT_LEAST_ONE6 = function (t) { this.atLeastOneInternal(6, t); }, t.prototype.AT_LEAST_ONE7 = function (t) { this.atLeastOneInternal(7, t); }, t.prototype.AT_LEAST_ONE8 = function (t) { this.atLeastOneInternal(8, t); }, t.prototype.AT_LEAST_ONE9 = function (t) { this.atLeastOneInternal(9, t); }, t.prototype.AT_LEAST_ONE_SEP = function (t) { this.atLeastOneSepFirstInternal(0, t); }, t.prototype.AT_LEAST_ONE_SEP1 = function (t) { this.atLeastOneSepFirstInternal(1, t); }, t.prototype.AT_LEAST_ONE_SEP2 = function (t) { this.atLeastOneSepFirstInternal(2, t); }, t.prototype.AT_LEAST_ONE_SEP3 = function (t) { this.atLeastOneSepFirstInternal(3, t); }, t.prototype.AT_LEAST_ONE_SEP4 = function (t) { this.atLeastOneSepFirstInternal(4, t); }, t.prototype.AT_LEAST_ONE_SEP5 = function (t) { this.atLeastOneSepFirstInternal(5, t); }, t.prototype.AT_LEAST_ONE_SEP6 = function (t) { this.atLeastOneSepFirstInternal(6, t); }, t.prototype.AT_LEAST_ONE_SEP7 = function (t) { this.atLeastOneSepFirstInternal(7, t); }, t.prototype.AT_LEAST_ONE_SEP8 = function (t) { this.atLeastOneSepFirstInternal(8, t); }, t.prototype.AT_LEAST_ONE_SEP9 = function (t) { this.atLeastOneSepFirstInternal(9, t); }, t.prototype.RULE = function (t, e, r) { if (void 0 === r && (r = s.DEFAULT_RULE_CONFIG), (0, i.default)(this.definedRulesNames, t)) {
            var n = { message: u.defaultGrammarValidatorErrorProvider.buildDuplicateRuleNameError({ topLevelRule: t, grammarName: this.className }), type: s.ParserDefinitionErrorType.DUPLICATE_RULE_NAME, ruleName: t };
            this.definitionErrors.push(n);
        } this.definedRulesNames.push(t); var o = this.defineRule(t, e, r); return this[t] = o, o; }, t.prototype.OVERRIDE_RULE = function (t, e, r) { void 0 === r && (r = s.DEFAULT_RULE_CONFIG); var n = (0, c.validateRuleIsOverridden)(t, this.definedRulesNames, this.className); this.definitionErrors = this.definitionErrors.concat(n); var o = this.defineRule(t, e, r); return this[t] = o, o; }, t.prototype.BACKTRACK = function (t, e) { return function () { this.isBackTrackingStack.push(1); var r = this.saveRecogState(); try {
            return t.apply(this, e), !0;
        }
        catch (t) {
            if ((0, a.isRecognitionException)(t))
                return !1;
            throw t;
        }
        finally {
            this.reloadRecogState(r), this.isBackTrackingStack.pop();
        } }; }, t.prototype.getGAstProductions = function () { return this.gastProductionsCache; }, t.prototype.getSerializedGastProductions = function () { return (0, l.serializeGrammar)((0, o.default)(this.gastProductionsCache)); }, t; }();
        e.RecognizerApi = f;
    }, 3273: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.RecognizerEngine = void 0;
        var o = n(r(5455)), i = n(r(6152)), a = n(r(5676)), s = n(r(9794)), u = n(r(5652)), c = n(r(9259)), l = n(r(3352)), f = n(r(8346)), p = n(r(8215)), d = n(r(4004)), h = r(8209), v = r(643), y = r(4677), m = r(9985), T = r(2941), E = r(9992), _ = r(6736), g = r(1201), O = function () { function t() { } return t.prototype.initRecognizerEngine = function (t, e) { if (this.className = this.constructor.name, this.shortRuleNameToFull = {}, this.fullRuleNameToShort = {}, this.ruleShortNameIdx = 256, this.tokenMatcher = g.tokenStructuredMatcherNoCategories, this.subruleIdx = 0, this.definedRulesNames = [], this.tokensMap = {}, this.isBackTrackingStack = [], this.RULE_STACK = [], this.RULE_OCCURRENCE_STACK = [], this.gastProductionsCache = {}, (0, l.default)(e, "serializedGrammar"))
            throw Error("The Parser's configuration can no longer contain a <serializedGrammar> property.\n\tSee: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_6-0-0\n\tFor Further details."); if ((0, i.default)(t)) {
            if ((0, o.default)(t))
                throw Error("A Token Vocabulary cannot be empty.\n\tNote that the first argument for the parser constructor\n\tis no longer a Token vector (since v4.0).");
            if ("number" == typeof t[0].startOffset)
                throw Error("The Parser constructor no longer accepts a token vector as the first argument.\n\tSee: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_4-0-0\n\tFor Further details.");
        } if ((0, i.default)(t))
            this.tokensMap = (0, p.default)(t, (function (t, e) { return t[e.name] = e, t; }), {});
        else if ((0, l.default)(t, "modes") && (0, s.default)((0, a.default)((0, f.default)(t.modes)), g.isTokenType)) {
            var r = (0, a.default)((0, f.default)(t.modes)), n = (0, u.default)(r);
            this.tokensMap = (0, p.default)(n, (function (t, e) { return t[e.name] = e, t; }), {});
        }
        else {
            if (!(0, c.default)(t))
                throw new Error("<tokensDictionary> argument must be An Array of Token constructors, A dictionary of Token constructors or an IMultiModeLexerDefinition");
            this.tokensMap = (0, d.default)(t);
        } this.tokensMap.EOF = _.EOF; var h = (0, l.default)(t, "modes") ? (0, a.default)((0, f.default)(t.modes)) : (0, f.default)(t), v = (0, s.default)(h, (function (t) { return (0, o.default)(t.categoryMatches); })); this.tokenMatcher = v ? g.tokenStructuredMatcherNoCategories : g.tokenStructuredMatcher, (0, g.augmentTokenTypes)((0, f.default)(this.tokensMap)); }, t.prototype.defineRule = function (t, e, r) { if (this.selfAnalysisDone)
            throw Error("Grammar rule <".concat(t, "> may not be defined after the 'performSelfAnalysis' method has been called'\n") + "Make sure that all grammar rule definitions are done before 'performSelfAnalysis' is called."); var n, o = (0, l.default)(r, "resyncEnabled") ? r.resyncEnabled : T.DEFAULT_RULE_CONFIG.resyncEnabled, i = (0, l.default)(r, "recoveryValueFunc") ? r.recoveryValueFunc : T.DEFAULT_RULE_CONFIG.recoveryValueFunc, a = this.ruleShortNameIdx << h.BITS_FOR_METHOD_TYPE + h.BITS_FOR_OCCURRENCE_IDX; return this.ruleShortNameIdx++, this.shortRuleNameToFull[a] = t, this.fullRuleNameToShort[t] = a, n = !0 === this.outputCst ? function () { for (var r = [], n = 0; n < arguments.length; n++)
            r[n] = arguments[n]; try {
            this.ruleInvocationStateUpdate(a, t, this.subruleIdx), e.apply(this, r);
            var s = this.CST_STACK[this.CST_STACK.length - 1];
            return this.cstPostRule(s), s;
        }
        catch (t) {
            return this.invokeRuleCatch(t, o, i);
        }
        finally {
            this.ruleFinallyStateUpdate();
        } } : function () { for (var r = [], n = 0; n < arguments.length; n++)
            r[n] = arguments[n]; try {
            return this.ruleInvocationStateUpdate(a, t, this.subruleIdx), e.apply(this, r);
        }
        catch (t) {
            return this.invokeRuleCatch(t, o, i);
        }
        finally {
            this.ruleFinallyStateUpdate();
        } }, Object.assign(n, { ruleName: t, originalGrammarAction: e }); }, t.prototype.invokeRuleCatch = function (t, e, r) { var n = 1 === this.RULE_STACK.length, o = e && !this.isBackTracking() && this.recoveryEnabled; if ((0, v.isRecognitionException)(t)) {
            var i = t;
            if (o) {
                var a, s = this.findReSyncTokenType();
                if (this.isInCurrentRuleReSyncSet(s))
                    return i.resyncedTokens = this.reSyncTo(s), this.outputCst ? ((a = this.CST_STACK[this.CST_STACK.length - 1]).recoveredNode = !0, a) : r();
                throw this.outputCst && ((a = this.CST_STACK[this.CST_STACK.length - 1]).recoveredNode = !0, i.partialCstResult = a), i;
            }
            if (n)
                return this.moveToTerminatedState(), r();
            throw i;
        } throw t; }, t.prototype.optionInternal = function (t, e) { var r = this.getKeyForAutomaticLookahead(h.OPTION_IDX, e); return this.optionInternalLogic(t, e, r); }, t.prototype.optionInternalLogic = function (t, e, r) { var n, o = this, i = this.getLaFuncFromCache(r); if ("function" != typeof t) {
            n = t.DEF;
            var a = t.GATE;
            if (void 0 !== a) {
                var s = i;
                i = function () { return a.call(o) && s.call(o); };
            }
        }
        else
            n = t; if (!0 === i.call(this))
            return n.call(this); }, t.prototype.atLeastOneInternal = function (t, e) { var r = this.getKeyForAutomaticLookahead(h.AT_LEAST_ONE_IDX, t); return this.atLeastOneInternalLogic(t, e, r); }, t.prototype.atLeastOneInternalLogic = function (t, e, r) { var n, o = this, i = this.getLaFuncFromCache(r); if ("function" != typeof e) {
            n = e.DEF;
            var a = e.GATE;
            if (void 0 !== a) {
                var s = i;
                i = function () { return a.call(o) && s.call(o); };
            }
        }
        else
            n = e; if (!0 !== i.call(this))
            throw this.raiseEarlyExitException(t, y.PROD_TYPE.REPETITION_MANDATORY, e.ERR_MSG); for (var u = this.doSingleRepetition(n); !0 === i.call(this) && !0 === u;)
            u = this.doSingleRepetition(n); this.attemptInRepetitionRecovery(this.atLeastOneInternal, [t, e], i, h.AT_LEAST_ONE_IDX, t, m.NextTerminalAfterAtLeastOneWalker); }, t.prototype.atLeastOneSepFirstInternal = function (t, e) { var r = this.getKeyForAutomaticLookahead(h.AT_LEAST_ONE_SEP_IDX, t); this.atLeastOneSepFirstInternalLogic(t, e, r); }, t.prototype.atLeastOneSepFirstInternalLogic = function (t, e, r) { var n = this, o = e.DEF, i = e.SEP; if (!0 !== this.getLaFuncFromCache(r).call(this))
            throw this.raiseEarlyExitException(t, y.PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, e.ERR_MSG); o.call(this); for (var a = function () { return n.tokenMatcher(n.LA(1), i); }; !0 === this.tokenMatcher(this.LA(1), i);)
            this.CONSUME(i), o.call(this); this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [t, i, a, o, m.NextTerminalAfterAtLeastOneSepWalker], a, h.AT_LEAST_ONE_SEP_IDX, t, m.NextTerminalAfterAtLeastOneSepWalker); }, t.prototype.manyInternal = function (t, e) { var r = this.getKeyForAutomaticLookahead(h.MANY_IDX, t); return this.manyInternalLogic(t, e, r); }, t.prototype.manyInternalLogic = function (t, e, r) { var n, o = this, i = this.getLaFuncFromCache(r); if ("function" != typeof e) {
            n = e.DEF;
            var a = e.GATE;
            if (void 0 !== a) {
                var s = i;
                i = function () { return a.call(o) && s.call(o); };
            }
        }
        else
            n = e; for (var u = !0; !0 === i.call(this) && !0 === u;)
            u = this.doSingleRepetition(n); this.attemptInRepetitionRecovery(this.manyInternal, [t, e], i, h.MANY_IDX, t, m.NextTerminalAfterManyWalker, u); }, t.prototype.manySepFirstInternal = function (t, e) { var r = this.getKeyForAutomaticLookahead(h.MANY_SEP_IDX, t); this.manySepFirstInternalLogic(t, e, r); }, t.prototype.manySepFirstInternalLogic = function (t, e, r) { var n = this, o = e.DEF, i = e.SEP; if (!0 === this.getLaFuncFromCache(r).call(this)) {
            o.call(this);
            for (var a = function () { return n.tokenMatcher(n.LA(1), i); }; !0 === this.tokenMatcher(this.LA(1), i);)
                this.CONSUME(i), o.call(this);
            this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [t, i, a, o, m.NextTerminalAfterManySepWalker], a, h.MANY_SEP_IDX, t, m.NextTerminalAfterManySepWalker);
        } }, t.prototype.repetitionSepSecondInternal = function (t, e, r, n, o) { for (; r();)
            this.CONSUME(e), n.call(this); this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [t, e, r, n, o], r, h.AT_LEAST_ONE_SEP_IDX, t, o); }, t.prototype.doSingleRepetition = function (t) { var e = this.getLexerPosition(); return t.call(this), this.getLexerPosition() > e; }, t.prototype.orInternal = function (t, e) { var r = this.getKeyForAutomaticLookahead(h.OR_IDX, e), n = (0, i.default)(t) ? t : t.DEF, o = this.getLaFuncFromCache(r).call(this, n); if (void 0 !== o)
            return n[o].ALT.call(this); this.raiseNoAltException(e, t.ERR_MSG); }, t.prototype.ruleFinallyStateUpdate = function () { if (this.RULE_STACK.pop(), this.RULE_OCCURRENCE_STACK.pop(), this.cstFinallyStateUpdate(), 0 === this.RULE_STACK.length && !1 === this.isAtEndOfInput()) {
            var t = this.LA(1), e = this.errorMessageProvider.buildNotAllInputParsedMessage({ firstRedundant: t, ruleName: this.getCurrRuleFullName() });
            this.SAVE_ERROR(new v.NotAllInputParsedException(e, t));
        } }, t.prototype.subruleInternal = function (t, e, r) { var n; try {
            var o = void 0 !== r ? r.ARGS : void 0;
            return this.subruleIdx = e, n = t.apply(this, o), this.cstPostNonTerminal(n, void 0 !== r && void 0 !== r.LABEL ? r.LABEL : t.ruleName), n;
        }
        catch (e) {
            throw this.subruleInternalError(e, r, t.ruleName);
        } }, t.prototype.subruleInternalError = function (t, e, r) { throw (0, v.isRecognitionException)(t) && void 0 !== t.partialCstResult && (this.cstPostNonTerminal(t.partialCstResult, void 0 !== e && void 0 !== e.LABEL ? e.LABEL : r), delete t.partialCstResult), t; }, t.prototype.consumeInternal = function (t, e, r) { var n; try {
            var o = this.LA(1);
            !0 === this.tokenMatcher(o, t) ? (this.consumeToken(), n = o) : this.consumeInternalError(t, o, r);
        }
        catch (r) {
            n = this.consumeInternalRecovery(t, e, r);
        } return this.cstPostTerminal(void 0 !== r && void 0 !== r.LABEL ? r.LABEL : t.name, n), n; }, t.prototype.consumeInternalError = function (t, e, r) { var n, o = this.LA(0); throw n = void 0 !== r && r.ERR_MSG ? r.ERR_MSG : this.errorMessageProvider.buildMismatchTokenMessage({ expected: t, actual: e, previous: o, ruleName: this.getCurrRuleFullName() }), this.SAVE_ERROR(new v.MismatchedTokenException(n, e, o)); }, t.prototype.consumeInternalRecovery = function (t, e, r) { if (!this.recoveryEnabled || "MismatchedTokenException" !== r.name || this.isBackTracking())
            throw r; var n = this.getFollowsForInRuleRecovery(t, e); try {
            return this.tryInRuleRecovery(t, n);
        }
        catch (t) {
            throw t.name === E.IN_RULE_RECOVERY_EXCEPTION ? r : t;
        } }, t.prototype.saveRecogState = function () { var t = this.errors, e = (0, d.default)(this.RULE_STACK); return { errors: t, lexerState: this.exportLexerState(), RULE_STACK: e, CST_STACK: this.CST_STACK }; }, t.prototype.reloadRecogState = function (t) { this.errors = t.errors, this.importLexerState(t.lexerState), this.RULE_STACK = t.RULE_STACK; }, t.prototype.ruleInvocationStateUpdate = function (t, e, r) { this.RULE_OCCURRENCE_STACK.push(r), this.RULE_STACK.push(t), this.cstInvocationStateUpdate(e); }, t.prototype.isBackTracking = function () { return 0 !== this.isBackTrackingStack.length; }, t.prototype.getCurrRuleFullName = function () { var t = this.getLastExplicitRuleShortName(); return this.shortRuleNameToFull[t]; }, t.prototype.shortRuleNameToFullName = function (t) { return this.shortRuleNameToFull[t]; }, t.prototype.isAtEndOfInput = function () { return this.tokenMatcher(this.LA(1), _.EOF); }, t.prototype.reset = function () { this.resetLexerState(), this.subruleIdx = 0, this.isBackTrackingStack = [], this.errors = [], this.RULE_STACK = [], this.CST_STACK = [], this.RULE_OCCURRENCE_STACK = []; }, t; }();
        e.RecognizerEngine = O;
    }, 9992: function (t, e, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function (t, e) { return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]); })(t, e); }, function (t, e) { if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null"); function r() { this.constructor = t; } n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }), i = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.attemptInRepetitionRecovery = e.Recoverable = e.InRuleRecoveryException = e.IN_RULE_RECOVERY_EXCEPTION = e.EOF_FOLLOW_KEY = void 0;
        var a = r(6736), s = i(r(5455)), u = i(r(4934)), c = i(r(5676)), l = i(r(6760)), f = i(r(5281)), p = i(r(3352)), d = i(r(1886)), h = i(r(4004)), v = r(643), y = r(3710), m = r(2941);
        e.EOF_FOLLOW_KEY = {}, e.IN_RULE_RECOVERY_EXCEPTION = "InRuleRecoveryException";
        var T = function (t) { function r(r) { var n = t.call(this, r) || this; return n.name = e.IN_RULE_RECOVERY_EXCEPTION, n; } return o(r, t), r; }(Error);
        e.InRuleRecoveryException = T;
        var E = function () { function t() { } return t.prototype.initRecoverable = function (t) { this.firstAfterRepMap = {}, this.resyncFollows = {}, this.recoveryEnabled = (0, p.default)(t, "recoveryEnabled") ? t.recoveryEnabled : m.DEFAULT_PARSER_CONFIG.recoveryEnabled, this.recoveryEnabled && (this.attemptInRepetitionRecovery = _); }, t.prototype.getTokenToInsert = function (t) { var e = (0, a.createTokenInstance)(t, "", NaN, NaN, NaN, NaN, NaN, NaN); return e.isInsertedInRecovery = !0, e; }, t.prototype.canTokenTypeBeInsertedInRecovery = function (t) { return !0; }, t.prototype.canTokenTypeBeDeletedInRecovery = function (t) { return !0; }, t.prototype.tryInRepetitionRecovery = function (t, e, r, n) { for (var o = this, i = this.findReSyncTokenType(), a = this.exportLexerState(), s = [], c = !1, l = this.LA(1), f = this.LA(1), p = function () { var t = o.LA(0), e = o.errorMessageProvider.buildMismatchTokenMessage({ expected: n, actual: l, previous: t, ruleName: o.getCurrRuleFullName() }), r = new v.MismatchedTokenException(e, l, o.LA(0)); r.resyncedTokens = (0, u.default)(s), o.SAVE_ERROR(r); }; !c;) {
            if (this.tokenMatcher(f, n))
                return void p();
            if (r.call(this))
                return p(), void t.apply(this, e);
            this.tokenMatcher(f, i) ? c = !0 : (f = this.SKIP_TOKEN(), this.addToResyncTokens(f, s));
        } this.importLexerState(a); }, t.prototype.shouldInRepetitionRecoveryBeTried = function (t, e, r) { return !1 !== r && !this.tokenMatcher(this.LA(1), t) && !this.isBackTracking() && !this.canPerformInRuleRecovery(t, this.getFollowsForInRuleRecovery(t, e)); }, t.prototype.getFollowsForInRuleRecovery = function (t, e) { var r = this.getCurrentGrammarPath(t, e); return this.getNextPossibleTokenTypes(r); }, t.prototype.tryInRuleRecovery = function (t, e) { if (this.canRecoverWithSingleTokenInsertion(t, e))
            return this.getTokenToInsert(t); if (this.canRecoverWithSingleTokenDeletion(t)) {
            var r = this.SKIP_TOKEN();
            return this.consumeToken(), r;
        } throw new T("sad sad panda"); }, t.prototype.canPerformInRuleRecovery = function (t, e) { return this.canRecoverWithSingleTokenInsertion(t, e) || this.canRecoverWithSingleTokenDeletion(t); }, t.prototype.canRecoverWithSingleTokenInsertion = function (t, e) { var r = this; if (!this.canTokenTypeBeInsertedInRecovery(t))
            return !1; if ((0, s.default)(e))
            return !1; var n = this.LA(1); return void 0 !== (0, f.default)(e, (function (t) { return r.tokenMatcher(n, t); })); }, t.prototype.canRecoverWithSingleTokenDeletion = function (t) { return !!this.canTokenTypeBeDeletedInRecovery(t) && this.tokenMatcher(this.LA(2), t); }, t.prototype.isInCurrentRuleReSyncSet = function (t) { var e = this.getCurrFollowKey(), r = this.getFollowSetFromFollowKey(e); return (0, d.default)(r, t); }, t.prototype.findReSyncTokenType = function () { for (var t = this.flattenFollowSet(), e = this.LA(1), r = 2;;) {
            var n = (0, f.default)(t, (function (t) { return (0, a.tokenMatcher)(e, t); }));
            if (void 0 !== n)
                return n;
            e = this.LA(r), r++;
        } }, t.prototype.getCurrFollowKey = function () { if (1 === this.RULE_STACK.length)
            return e.EOF_FOLLOW_KEY; var t = this.getLastExplicitRuleShortName(), r = this.getLastExplicitRuleOccurrenceIndex(), n = this.getPreviousExplicitRuleShortName(); return { ruleName: this.shortRuleNameToFullName(t), idxInCallingRule: r, inRule: this.shortRuleNameToFullName(n) }; }, t.prototype.buildFullFollowKeyStack = function () { var t = this, r = this.RULE_STACK, n = this.RULE_OCCURRENCE_STACK; return (0, l.default)(r, (function (o, i) { return 0 === i ? e.EOF_FOLLOW_KEY : { ruleName: t.shortRuleNameToFullName(o), idxInCallingRule: n[i], inRule: t.shortRuleNameToFullName(r[i - 1]) }; })); }, t.prototype.flattenFollowSet = function () { var t = this, e = (0, l.default)(this.buildFullFollowKeyStack(), (function (e) { return t.getFollowSetFromFollowKey(e); })); return (0, c.default)(e); }, t.prototype.getFollowSetFromFollowKey = function (t) { if (t === e.EOF_FOLLOW_KEY)
            return [a.EOF]; var r = t.ruleName + t.idxInCallingRule + y.IN + t.inRule; return this.resyncFollows[r]; }, t.prototype.addToResyncTokens = function (t, e) { return this.tokenMatcher(t, a.EOF) || e.push(t), e; }, t.prototype.reSyncTo = function (t) { for (var e = [], r = this.LA(1); !1 === this.tokenMatcher(r, t);)
            r = this.SKIP_TOKEN(), this.addToResyncTokens(r, e); return (0, u.default)(e); }, t.prototype.attemptInRepetitionRecovery = function (t, e, r, n, o, i, a) { }, t.prototype.getCurrentGrammarPath = function (t, e) { return { ruleStack: this.getHumanReadableRuleStack(), occurrenceStack: (0, h.default)(this.RULE_OCCURRENCE_STACK), lastTok: t, lastTokOccurrence: e }; }, t.prototype.getHumanReadableRuleStack = function () { var t = this; return (0, l.default)(this.RULE_STACK, (function (e) { return t.shortRuleNameToFullName(e); })); }, t; }();
        function _(t, e, r, n, o, i, s) { var u = this.getKeyForAutomaticLookahead(n, o), c = this.firstAfterRepMap[u]; if (void 0 === c) {
            var l = this.getCurrRuleFullName();
            c = new i(this.getGAstProductions()[l], o).startWalking(), this.firstAfterRepMap[u] = c;
        } var f = c.token, p = c.occurrence, d = c.isEndOfRule; 1 === this.RULE_STACK.length && d && void 0 === f && (f = a.EOF, p = 1), void 0 !== f && void 0 !== p && this.shouldInRepetitionRecoveryBeTried(f, p, s) && this.tryInRepetitionRecovery(t, e, r, f); }
        e.Recoverable = E, e.attemptInRepetitionRecovery = _;
    }, 3225: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.TreeBuilder = void 0;
        var o = r(7485), i = n(r(4291)), a = n(r(3352)), s = n(r(249)), u = n(r(4336)), c = r(8169), l = r(2941), f = function () { function t() { } return t.prototype.initTreeBuilder = function (t) { if (this.CST_STACK = [], this.outputCst = t.outputCst, this.nodeLocationTracking = (0, a.default)(t, "nodeLocationTracking") ? t.nodeLocationTracking : l.DEFAULT_PARSER_CONFIG.nodeLocationTracking, this.outputCst)
            if (/full/i.test(this.nodeLocationTracking))
                this.recoveryEnabled ? (this.setNodeLocationFromToken = o.setNodeLocationFull, this.setNodeLocationFromNode = o.setNodeLocationFull, this.cstPostRule = i.default, this.setInitialNodeLocation = this.setInitialNodeLocationFullRecovery) : (this.setNodeLocationFromToken = i.default, this.setNodeLocationFromNode = i.default, this.cstPostRule = this.cstPostRuleFull, this.setInitialNodeLocation = this.setInitialNodeLocationFullRegular);
            else if (/onlyOffset/i.test(this.nodeLocationTracking))
                this.recoveryEnabled ? (this.setNodeLocationFromToken = o.setNodeLocationOnlyOffset, this.setNodeLocationFromNode = o.setNodeLocationOnlyOffset, this.cstPostRule = i.default, this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRecovery) : (this.setNodeLocationFromToken = i.default, this.setNodeLocationFromNode = i.default, this.cstPostRule = this.cstPostRuleOnlyOffset, this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRegular);
            else {
                if (!/none/i.test(this.nodeLocationTracking))
                    throw Error('Invalid <nodeLocationTracking> config option: "'.concat(t.nodeLocationTracking, '"'));
                this.setNodeLocationFromToken = i.default, this.setNodeLocationFromNode = i.default, this.cstPostRule = i.default, this.setInitialNodeLocation = i.default;
            }
        else
            this.cstInvocationStateUpdate = i.default, this.cstFinallyStateUpdate = i.default, this.cstPostTerminal = i.default, this.cstPostNonTerminal = i.default, this.cstPostRule = i.default; }, t.prototype.setInitialNodeLocationOnlyOffsetRecovery = function (t) { t.location = { startOffset: NaN, endOffset: NaN }; }, t.prototype.setInitialNodeLocationOnlyOffsetRegular = function (t) { t.location = { startOffset: this.LA(1).startOffset, endOffset: NaN }; }, t.prototype.setInitialNodeLocationFullRecovery = function (t) { t.location = { startOffset: NaN, startLine: NaN, startColumn: NaN, endOffset: NaN, endLine: NaN, endColumn: NaN }; }, t.prototype.setInitialNodeLocationFullRegular = function (t) { var e = this.LA(1); t.location = { startOffset: e.startOffset, startLine: e.startLine, startColumn: e.startColumn, endOffset: NaN, endLine: NaN, endColumn: NaN }; }, t.prototype.cstInvocationStateUpdate = function (t) { var e = { name: t, children: Object.create(null) }; this.setInitialNodeLocation(e), this.CST_STACK.push(e); }, t.prototype.cstFinallyStateUpdate = function () { this.CST_STACK.pop(); }, t.prototype.cstPostRuleFull = function (t) { var e = this.LA(0), r = t.location; r.startOffset <= e.startOffset == 1 ? (r.endOffset = e.endOffset, r.endLine = e.endLine, r.endColumn = e.endColumn) : (r.startOffset = NaN, r.startLine = NaN, r.startColumn = NaN); }, t.prototype.cstPostRuleOnlyOffset = function (t) { var e = this.LA(0), r = t.location; r.startOffset <= e.startOffset == 1 ? r.endOffset = e.endOffset : r.startOffset = NaN; }, t.prototype.cstPostTerminal = function (t, e) { var r = this.CST_STACK[this.CST_STACK.length - 1]; (0, o.addTerminalToCst)(r, e, t), this.setNodeLocationFromToken(r.location, e); }, t.prototype.cstPostNonTerminal = function (t, e) { var r = this.CST_STACK[this.CST_STACK.length - 1]; (0, o.addNoneTerminalToCst)(r, e, t), this.setNodeLocationFromNode(r.location, t.location); }, t.prototype.getBaseCstVisitorConstructor = function () { if ((0, u.default)(this.baseCstVisitorConstructor)) {
            var t = (0, c.createBaseSemanticVisitorConstructor)(this.className, (0, s.default)(this.gastProductionsCache));
            return this.baseCstVisitorConstructor = t, t;
        } return this.baseCstVisitorConstructor; }, t.prototype.getBaseCstVisitorConstructorWithDefaults = function () { if ((0, u.default)(this.baseCstVisitorWithDefaultsConstructor)) {
            var t = (0, c.createBaseVisitorConstructorWithDefaults)(this.className, (0, s.default)(this.gastProductionsCache), this.getBaseCstVisitorConstructor());
            return this.baseCstVisitorWithDefaultsConstructor = t, t;
        } return this.baseCstVisitorWithDefaultsConstructor; }, t.prototype.getLastExplicitRuleShortName = function () { var t = this.RULE_STACK; return t[t.length - 1]; }, t.prototype.getPreviousExplicitRuleShortName = function () { var t = this.RULE_STACK; return t[t.length - 2]; }, t.prototype.getLastExplicitRuleOccurrenceIndex = function () { var t = this.RULE_OCCURRENCE_STACK; return t[t.length - 1]; }, t; }();
        e.TreeBuilder = f;
    }, 4803: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.applyMixins = void 0, e.applyMixins = function (t, e) { e.forEach((function (e) { var r = e.prototype; Object.getOwnPropertyNames(r).forEach((function (n) { if ("constructor" !== n) {
            var o = Object.getOwnPropertyDescriptor(r, n);
            o && (o.get || o.set) ? Object.defineProperty(t.prototype, n, o) : t.prototype[n] = e.prototype[n];
        } })); })); };
    }, 6178: function (t, e, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function (t, e) { return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]); })(t, e); }, function (t, e) { if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null"); function r() { this.constructor = t; } n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }), i = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.charCodeToOptimizedIndex = e.minOptimizationVal = e.buildLineBreakIssueMessage = e.LineTerminatorOptimizedTester = e.isShortPattern = e.isCustomPattern = e.cloneEmptyGroups = e.performWarningRuntimeChecks = e.performRuntimeChecks = e.addStickyFlag = e.addStartOfInput = e.findUnreachablePatterns = e.findModesThatDoNotExist = e.findInvalidGroupType = e.findDuplicatePatterns = e.findUnsupportedFlags = e.findStartOfInputAnchor = e.findEmptyMatchRegExps = e.findEndOfInputAnchor = e.findInvalidPatterns = e.findMissingPatterns = e.validatePatterns = e.analyzeTokenTypes = e.enableSticky = e.disableSticky = e.SUPPORT_STICKY = e.MODES = e.DEFAULT_MODE = void 0;
        var a = r(4844), s = r(9027), u = i(r(3237)), c = i(r(5455)), l = i(r(417)), f = i(r(6152)), p = i(r(8346)), d = i(r(5676)), h = i(r(2070)), v = i(r(7335)), y = i(r(3493)), m = i(r(6760)), T = i(r(9756)), E = i(r(5505)), _ = i(r(1049)), g = i(r(4336)), O = i(r(5281)), R = i(r(3352)), A = i(r(249)), I = i(r(859)), x = i(r(882)), N = i(r(4573)), P = i(r(8215)), S = i(r(1886)), b = r(7146), k = r(1480), L = r(3067);
        function C(t) { var e = (0, x.default)(t, (function (t) { return !(0, R.default)(t, "PATTERN"); })); return { errors: (0, m.default)(e, (function (t) { return { message: "Token Type: ->" + t.name + "<- missing static 'PATTERN' property", type: s.LexerDefinitionErrorType.MISSING_PATTERN, tokenTypes: [t] }; })), valid: (0, v.default)(t, e) }; }
        function M(t) { var e = (0, x.default)(t, (function (t) { var e = t.PATTERN; return !((0, I.default)(e) || (0, _.default)(e) || (0, R.default)(e, "exec") || (0, E.default)(e)); })); return { errors: (0, m.default)(e, (function (t) { return { message: "Token Type: ->" + t.name + "<- static 'PATTERN' can only be a RegExp, a Function matching the {CustomPatternMatcherFunc} type or an Object matching the {ICustomPattern} interface.", type: s.LexerDefinitionErrorType.INVALID_PATTERN, tokenTypes: [t] }; })), valid: (0, v.default)(t, e) }; }
        e.DEFAULT_MODE = "defaultMode", e.MODES = "modes", e.SUPPORT_STICKY = "boolean" == typeof new RegExp("(?:)").sticky, e.disableSticky = function () { e.SUPPORT_STICKY = !1; }, e.enableSticky = function () { e.SUPPORT_STICKY = !0; }, e.analyzeTokenTypes = function (t, r) { var n, o = (r = (0, N.default)(r, { useSticky: e.SUPPORT_STICKY, debug: !1, safeMode: !1, positionTracking: "full", lineTerminatorCharacters: ["\r", "\n"], tracer: function (t, e) { return e(); } })).tracer; o("initCharCodeToOptimizedIndexMap", (function () { !function () { if ((0, c.default)(J)) {
            J = new Array(65536);
            for (var t = 0; t < 65536; t++)
                J[t] = t > 255 ? 255 + ~~(t / 255) : t;
        } }(); })), o("Reject Lexer.NA", (function () { n = (0, h.default)(t, (function (t) { return t.PATTERN === s.Lexer.NA; })); })); var i, a, u, l, p, d, v, O, A, x, L, C = !1; o("Transform Patterns", (function () { C = !1, i = (0, m.default)(n, (function (t) { var e = t.PATTERN; if ((0, I.default)(e)) {
            var n = e.source;
            return 1 !== n.length || "^" === n || "$" === n || "." === n || e.ignoreCase ? 2 !== n.length || "\\" !== n[0] || (0, S.default)(["d", "D", "s", "S", "t", "r", "n", "t", "0", "c", "b", "B", "f", "v", "w", "W"], n[1]) ? r.useSticky ? Y(e) : K(e) : n[1] : n;
        } if ((0, _.default)(e))
            return C = !0, { exec: e }; if ("object" == typeof e)
            return C = !0, e; if ("string" == typeof e) {
            if (1 === e.length)
                return e;
            var o = e.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&"), i = new RegExp(o);
            return r.useSticky ? Y(i) : K(i);
        } throw Error("non exhaustive match"); })); })), o("misc mapping", (function () { a = (0, m.default)(n, (function (t) { return t.tokenTypeIdx; })), u = (0, m.default)(n, (function (t) { var e = t.GROUP; if (e !== s.Lexer.SKIPPED) {
            if ((0, E.default)(e))
                return e;
            if ((0, g.default)(e))
                return !1;
            throw Error("non exhaustive match");
        } })), l = (0, m.default)(n, (function (t) { var e = t.LONGER_ALT; if (e)
            return (0, f.default)(e) ? (0, m.default)(e, (function (t) { return (0, y.default)(n, t); })) : [(0, y.default)(n, e)]; })), p = (0, m.default)(n, (function (t) { return t.PUSH_MODE; })), d = (0, m.default)(n, (function (t) { return (0, R.default)(t, "POP_MODE"); })); })), o("Line Terminator Handling", (function () { var t = Q(r.lineTerminatorCharacters); v = (0, m.default)(n, (function (t) { return !1; })), "onlyOffset" !== r.positionTracking && (v = (0, m.default)(n, (function (e) { return (0, R.default)(e, "LINE_BREAKS") ? !!e.LINE_BREAKS : !1 === q(e, t) && (0, k.canMatchCharCode)(t, e.PATTERN); }))); })), o("Misc Mapping #2", (function () { O = (0, m.default)(n, H), A = (0, m.default)(i, X), x = (0, P.default)(n, (function (t, e) { var r = e.GROUP; return (0, E.default)(r) && r !== s.Lexer.SKIPPED && (t[r] = []), t; }), {}), L = (0, m.default)(i, (function (t, e) { return { pattern: i[e], longerAlt: l[e], canLineTerminator: v[e], isCustom: O[e], short: A[e], group: u[e], push: p[e], pop: d[e], tokenTypeIdx: a[e], tokenType: n[e] }; })); })); var M = !0, D = []; return r.safeMode || o("First Char Optimization", (function () { D = (0, P.default)(n, (function (t, e, n) { if ("string" == typeof e.PATTERN) {
            var o = tt(e.PATTERN.charCodeAt(0));
            Z(t, o, L[n]);
        }
        else if ((0, f.default)(e.START_CHARS_HINT)) {
            var i;
            (0, T.default)(e.START_CHARS_HINT, (function (e) { var r = tt("string" == typeof e ? e.charCodeAt(0) : e); i !== r && (i = r, Z(t, r, L[n])); }));
        }
        else if ((0, I.default)(e.PATTERN))
            if (e.PATTERN.unicode)
                M = !1, r.ensureOptimizations && (0, b.PRINT_ERROR)("".concat(k.failedOptimizationPrefixMsg) + "\tUnable to analyze < ".concat(e.PATTERN.toString(), " > pattern.\n") + "\tThe regexp unicode flag is not currently supported by the regexp-to-ast library.\n\tThis will disable the lexer's first char optimizations.\n\tFor details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNICODE_OPTIMIZE");
            else {
                var a = (0, k.getOptimizedStartCodesIndices)(e.PATTERN, r.ensureOptimizations);
                (0, c.default)(a) && (M = !1), (0, T.default)(a, (function (e) { Z(t, e, L[n]); }));
            }
        else
            r.ensureOptimizations && (0, b.PRINT_ERROR)("".concat(k.failedOptimizationPrefixMsg) + "\tTokenType: <".concat(e.name, "> is using a custom token pattern without providing <start_chars_hint> parameter.\n") + "\tThis will disable the lexer's first char optimizations.\n\tFor details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_OPTIMIZE"), M = !1; return t; }), []); })), { emptyGroups: x, patternIdxToConfig: L, charCodeToPatternIdxToConfig: D, hasCustom: C, canBeOptimized: M }; }, e.validatePatterns = function (t, e) { var r = [], n = C(t); r = r.concat(n.errors); var o = M(n.valid), i = o.valid; return (r = (r = (r = (r = r.concat(o.errors)).concat(function (t) { var e = [], r = (0, x.default)(t, (function (t) { return (0, I.default)(t.PATTERN); })); return (e = (e = (e = (e = e.concat(w(r))).concat(U(r))).concat(B(r))).concat(G(r))).concat(F(r)); }(i))).concat(W(i))).concat(V(i, e))).concat(z(i)); }, e.findMissingPatterns = C, e.findInvalidPatterns = M;
        var D = /[^\\][$]/;
        function w(t) { var e = function (t) { function e() { var e = null !== t && t.apply(this, arguments) || this; return e.found = !1, e; } return o(e, t), e.prototype.visitEndAnchor = function (t) { this.found = !0; }, e; }(a.BaseRegExpVisitor), r = (0, x.default)(t, (function (t) { var r = t.PATTERN; try {
            var n = (0, L.getRegExpAst)(r), o = new e;
            return o.visit(n), o.found;
        }
        catch (t) {
            return D.test(r.source);
        } })); return (0, m.default)(r, (function (t) { return { message: "Unexpected RegExp Anchor Error:\n\tToken Type: ->" + t.name + "<- static 'PATTERN' cannot contain end of input anchor '$'\n\tSee chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS\tfor details.", type: s.LexerDefinitionErrorType.EOI_ANCHOR_FOUND, tokenTypes: [t] }; })); }
        function F(t) { var e = (0, x.default)(t, (function (t) { return t.PATTERN.test(""); })); return (0, m.default)(e, (function (t) { return { message: "Token Type: ->" + t.name + "<- static 'PATTERN' must not match an empty string", type: s.LexerDefinitionErrorType.EMPTY_MATCH_PATTERN, tokenTypes: [t] }; })); }
        e.findEndOfInputAnchor = w, e.findEmptyMatchRegExps = F;
        var j = /[^\\[][\^]|^\^/;
        function U(t) { var e = function (t) { function e() { var e = null !== t && t.apply(this, arguments) || this; return e.found = !1, e; } return o(e, t), e.prototype.visitStartAnchor = function (t) { this.found = !0; }, e; }(a.BaseRegExpVisitor), r = (0, x.default)(t, (function (t) { var r = t.PATTERN; try {
            var n = (0, L.getRegExpAst)(r), o = new e;
            return o.visit(n), o.found;
        }
        catch (t) {
            return j.test(r.source);
        } })); return (0, m.default)(r, (function (t) { return { message: "Unexpected RegExp Anchor Error:\n\tToken Type: ->" + t.name + "<- static 'PATTERN' cannot contain start of input anchor '^'\n\tSee https://chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS\tfor details.", type: s.LexerDefinitionErrorType.SOI_ANCHOR_FOUND, tokenTypes: [t] }; })); }
        function B(t) { var e = (0, x.default)(t, (function (t) { var e = t.PATTERN; return e instanceof RegExp && (e.multiline || e.global); })); return (0, m.default)(e, (function (t) { return { message: "Token Type: ->" + t.name + "<- static 'PATTERN' may NOT contain global('g') or multiline('m')", type: s.LexerDefinitionErrorType.UNSUPPORTED_FLAGS_FOUND, tokenTypes: [t] }; })); }
        function G(t) { var e = [], r = (0, m.default)(t, (function (r) { return (0, P.default)(t, (function (t, n) { return r.PATTERN.source !== n.PATTERN.source || (0, S.default)(e, n) || n.PATTERN === s.Lexer.NA || (e.push(n), t.push(n)), t; }), []); })); r = (0, l.default)(r); var n = (0, x.default)(r, (function (t) { return t.length > 1; })); return (0, m.default)(n, (function (t) { var e = (0, m.default)(t, (function (t) { return t.name; })), r = (0, u.default)(t).PATTERN; return { message: "The same RegExp pattern ->".concat(r, "<-") + "has been used in all of the following Token Types: ".concat(e.join(", "), " <-"), type: s.LexerDefinitionErrorType.DUPLICATE_PATTERNS_FOUND, tokenTypes: t }; })); }
        function W(t) { var e = (0, x.default)(t, (function (t) { if (!(0, R.default)(t, "GROUP"))
            return !1; var e = t.GROUP; return e !== s.Lexer.SKIPPED && e !== s.Lexer.NA && !(0, E.default)(e); })); return (0, m.default)(e, (function (t) { return { message: "Token Type: ->" + t.name + "<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String", type: s.LexerDefinitionErrorType.INVALID_GROUP_TYPE_FOUND, tokenTypes: [t] }; })); }
        function V(t, e) { var r = (0, x.default)(t, (function (t) { return void 0 !== t.PUSH_MODE && !(0, S.default)(e, t.PUSH_MODE); })); return (0, m.default)(r, (function (t) { return { message: "Token Type: ->".concat(t.name, "<- static 'PUSH_MODE' value cannot refer to a Lexer Mode ->").concat(t.PUSH_MODE, "<-") + "which does not exist", type: s.LexerDefinitionErrorType.PUSH_MODE_DOES_NOT_EXIST, tokenTypes: [t] }; })); }
        function z(t) { var e = [], r = (0, P.default)(t, (function (t, e, r) { var n, o, i = e.PATTERN; return i === s.Lexer.NA || ((0, E.default)(i) ? t.push({ str: i, idx: r, tokenType: e }) : (0, I.default)(i) && (n = i, o = [".", "\\", "[", "]", "|", "^", "$", "(", ")", "?", "*", "+", "{"], void 0 === (0, O.default)(o, (function (t) { return -1 !== n.source.indexOf(t); }))) && t.push({ str: i.source, idx: r, tokenType: e })), t; }), []); return (0, T.default)(t, (function (t, n) { (0, T.default)(r, (function (r) { var o = r.str, i = r.idx, a = r.tokenType; if (n < i && function (t, e) { if ((0, I.default)(e)) {
            var r = e.exec(t);
            return null !== r && 0 === r.index;
        } if ((0, _.default)(e))
            return e(t, 0, [], {}); if ((0, R.default)(e, "exec"))
            return e.exec(t, 0, [], {}); if ("string" == typeof e)
            return e === t; throw Error("non exhaustive match"); }(o, t.PATTERN)) {
            var u = "Token: ->".concat(a.name, "<- can never be matched.\n") + "Because it appears AFTER the Token Type ->".concat(t.name, "<-") + "in the lexer's definition.\nSee https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNREACHABLE";
            e.push({ message: u, type: s.LexerDefinitionErrorType.UNREACHABLE_PATTERN, tokenTypes: [t, a] });
        } })); })), e; }
        function K(t) { var e = t.ignoreCase ? "i" : ""; return new RegExp("^(?:".concat(t.source, ")"), e); }
        function Y(t) { var e = t.ignoreCase ? "iy" : "y"; return new RegExp("".concat(t.source), e); }
        function H(t) { var e = t.PATTERN; if ((0, I.default)(e))
            return !1; if ((0, _.default)(e))
            return !0; if ((0, R.default)(e, "exec"))
            return !0; if ((0, E.default)(e))
            return !1; throw Error("non exhaustive match"); }
        function X(t) { return !(!(0, E.default)(t) || 1 !== t.length) && t.charCodeAt(0); }
        function q(t, e) { if ((0, R.default)(t, "LINE_BREAKS"))
            return !1; if ((0, I.default)(t.PATTERN)) {
            try {
                (0, k.canMatchCharCode)(e, t.PATTERN);
            }
            catch (t) {
                return { issue: s.LexerDefinitionErrorType.IDENTIFY_TERMINATOR, errMsg: t.message };
            }
            return !1;
        } if ((0, E.default)(t.PATTERN))
            return !1; if (H(t))
            return { issue: s.LexerDefinitionErrorType.CUSTOM_LINE_BREAK }; throw Error("non exhaustive match"); }
        function $(t, e) { if (e.issue === s.LexerDefinitionErrorType.IDENTIFY_TERMINATOR)
            return "Warning: unable to identify line terminator usage in pattern.\n" + "\tThe problem is in the <".concat(t.name, "> Token Type\n") + "\t Root cause: ".concat(e.errMsg, ".\n") + "\tFor details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#IDENTIFY_TERMINATOR"; if (e.issue === s.LexerDefinitionErrorType.CUSTOM_LINE_BREAK)
            return "Warning: A Custom Token Pattern should specify the <line_breaks> option.\n" + "\tThe problem is in the <".concat(t.name, "> Token Type\n") + "\tFor details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_LINE_BREAK"; throw Error("non exhaustive match"); }
        function Q(t) { return (0, m.default)(t, (function (t) { return (0, E.default)(t) ? t.charCodeAt(0) : t; })); }
        function Z(t, e, r) { void 0 === t[e] ? t[e] = [r] : t[e].push(r); }
        e.findStartOfInputAnchor = U, e.findUnsupportedFlags = B, e.findDuplicatePatterns = G, e.findInvalidGroupType = W, e.findModesThatDoNotExist = V, e.findUnreachablePatterns = z, e.addStartOfInput = K, e.addStickyFlag = Y, e.performRuntimeChecks = function (t, r, n) { var o = []; return (0, R.default)(t, e.DEFAULT_MODE) || o.push({ message: "A MultiMode Lexer cannot be initialized without a <" + e.DEFAULT_MODE + "> property in its definition\n", type: s.LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE }), (0, R.default)(t, e.MODES) || o.push({ message: "A MultiMode Lexer cannot be initialized without a <" + e.MODES + "> property in its definition\n", type: s.LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY }), (0, R.default)(t, e.MODES) && (0, R.default)(t, e.DEFAULT_MODE) && !(0, R.default)(t.modes, t.defaultMode) && o.push({ message: "A MultiMode Lexer cannot be initialized with a ".concat(e.DEFAULT_MODE, ": <").concat(t.defaultMode, ">") + "which does not exist\n", type: s.LexerDefinitionErrorType.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST }), (0, R.default)(t, e.MODES) && (0, T.default)(t.modes, (function (t, e) { (0, T.default)(t, (function (t, r) { (0, g.default)(t) && o.push({ message: "A Lexer cannot be initialized using an undefined Token Type. Mode:" + "<".concat(e, "> at index: <").concat(r, ">\n"), type: s.LexerDefinitionErrorType.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED }); })); })), o; }, e.performWarningRuntimeChecks = function (t, e, r) { var n = [], o = !1, i = (0, l.default)((0, d.default)((0, p.default)(t.modes))), a = (0, h.default)(i, (function (t) { return t.PATTERN === s.Lexer.NA; })), u = Q(r); return e && (0, T.default)(a, (function (t) { var e = q(t, u); if (!1 !== e) {
            var r = { message: $(t, e), type: e.issue, tokenType: t };
            n.push(r);
        }
        else
            (0, R.default)(t, "LINE_BREAKS") ? !0 === t.LINE_BREAKS && (o = !0) : (0, k.canMatchCharCode)(u, t.PATTERN) && (o = !0); })), e && !o && n.push({ message: "Warning: No LINE_BREAKS Found.\n\tThis Lexer has been defined to track line and column information,\n\tBut none of the Token Types can be identified as matching a line terminator.\n\tSee https://chevrotain.io/docs/guide/resolving_lexer_errors.html#LINE_BREAKS \n\tfor details.", type: s.LexerDefinitionErrorType.NO_LINE_BREAKS_FLAGS }), n; }, e.cloneEmptyGroups = function (t) { var e = {}, r = (0, A.default)(t); return (0, T.default)(r, (function (r) { var n = t[r]; if (!(0, f.default)(n))
            throw Error("non exhaustive match"); e[r] = []; })), e; }, e.isCustomPattern = H, e.isShortPattern = X, e.LineTerminatorOptimizedTester = { test: function (t) { for (var e = t.length, r = this.lastIndex; r < e; r++) {
                var n = t.charCodeAt(r);
                if (10 === n)
                    return this.lastIndex = r + 1, !0;
                if (13 === n)
                    return 10 === t.charCodeAt(r + 1) ? this.lastIndex = r + 2 : this.lastIndex = r + 1, !0;
            } return !1; }, lastIndex: 0 }, e.buildLineBreakIssueMessage = $, e.minOptimizationVal = 256;
        var J = [];
        function tt(t) { return t < e.minOptimizationVal ? t : J[t]; }
        e.charCodeToOptimizedIndex = tt;
    }, 495: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.defaultLexerErrorProvider = void 0, e.defaultLexerErrorProvider = { buildUnableToPopLexerModeMessage: function (t) { return "Unable to pop Lexer Mode after encountering Token ->".concat(t.image, "<- The Mode Stack is empty"); }, buildUnexpectedCharactersMessage: function (t, e, r, n, o) { return "unexpected character: ->".concat(t.charAt(e), "<- at offset: ").concat(e, ",") + " skipped ".concat(r, " characters."); } };
    }, 9027: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.Lexer = e.LexerDefinitionErrorType = void 0;
        var o, i = r(6178), a = n(r(4291)), s = n(r(5455)), u = n(r(6152)), c = n(r(6974)), l = n(r(2070)), f = n(r(6760)), p = n(r(9756)), d = n(r(249)), h = n(r(4336)), v = n(r(3059)), y = n(r(19)), m = n(r(8215)), T = n(r(4004)), E = r(7146), _ = r(1201), g = r(495), O = r(3067);
        (o = e.LexerDefinitionErrorType || (e.LexerDefinitionErrorType = {}))[o.MISSING_PATTERN = 0] = "MISSING_PATTERN", o[o.INVALID_PATTERN = 1] = "INVALID_PATTERN", o[o.EOI_ANCHOR_FOUND = 2] = "EOI_ANCHOR_FOUND", o[o.UNSUPPORTED_FLAGS_FOUND = 3] = "UNSUPPORTED_FLAGS_FOUND", o[o.DUPLICATE_PATTERNS_FOUND = 4] = "DUPLICATE_PATTERNS_FOUND", o[o.INVALID_GROUP_TYPE_FOUND = 5] = "INVALID_GROUP_TYPE_FOUND", o[o.PUSH_MODE_DOES_NOT_EXIST = 6] = "PUSH_MODE_DOES_NOT_EXIST", o[o.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE = 7] = "MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE", o[o.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY = 8] = "MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY", o[o.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST = 9] = "MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST", o[o.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED = 10] = "LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED", o[o.SOI_ANCHOR_FOUND = 11] = "SOI_ANCHOR_FOUND", o[o.EMPTY_MATCH_PATTERN = 12] = "EMPTY_MATCH_PATTERN", o[o.NO_LINE_BREAKS_FLAGS = 13] = "NO_LINE_BREAKS_FLAGS", o[o.UNREACHABLE_PATTERN = 14] = "UNREACHABLE_PATTERN", o[o.IDENTIFY_TERMINATOR = 15] = "IDENTIFY_TERMINATOR", o[o.CUSTOM_LINE_BREAK = 16] = "CUSTOM_LINE_BREAK";
        var R = { deferDefinitionErrorsHandling: !1, positionTracking: "full", lineTerminatorsPattern: /\n|\r\n?/g, lineTerminatorCharacters: ["\n", "\r"], ensureOptimizations: !1, safeMode: !1, errorMessageProvider: g.defaultLexerErrorProvider, traceInitPerf: !1, skipValidations: !1 };
        Object.freeze(R);
        var A = function () { function t(t, e) { void 0 === e && (e = R); var r = this; if (this.lexerDefinition = t, this.lexerDefinitionErrors = [], this.lexerDefinitionWarning = [], this.patternIdxToConfig = {}, this.charCodeToPatternIdxToConfig = {}, this.modes = [], this.emptyGroups = {}, this.trackStartLines = !0, this.trackEndLines = !0, this.hasCustom = !1, this.canModeBeOptimized = {}, this.TRACE_INIT = function (t, e) { if (!0 === r.traceInitPerf) {
            r.traceInitIndent++;
            var n = new Array(r.traceInitIndent + 1).join("\t");
            r.traceInitIndent < r.traceInitMaxIdent && console.log("".concat(n, "--\x3e <").concat(t, ">"));
            var o = (0, E.timer)(e), i = o.time, a = o.value, s = i > 10 ? console.warn : console.log;
            return r.traceInitIndent < r.traceInitMaxIdent && s("".concat(n, "<-- <").concat(t, "> time: ").concat(i, "ms")), r.traceInitIndent--, a;
        } return e(); }, "boolean" == typeof e)
            throw Error("The second argument to the Lexer constructor is now an ILexerConfig Object.\na boolean 2nd argument is no longer supported"); this.config = (0, y.default)({}, R, e); var n = this.config.traceInitPerf; !0 === n ? (this.traceInitMaxIdent = 1 / 0, this.traceInitPerf = !0) : "number" == typeof n && (this.traceInitMaxIdent = n, this.traceInitPerf = !0), this.traceInitIndent = -1, this.TRACE_INIT("Lexer Constructor", (function () { var n, o = !0; r.TRACE_INIT("Lexer Config handling", (function () { if (r.config.lineTerminatorsPattern === R.lineTerminatorsPattern)
            r.config.lineTerminatorsPattern = i.LineTerminatorOptimizedTester;
        else if (r.config.lineTerminatorCharacters === R.lineTerminatorCharacters)
            throw Error("Error: Missing <lineTerminatorCharacters> property on the Lexer config.\n\tFor details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#MISSING_LINE_TERM_CHARS"); if (e.safeMode && e.ensureOptimizations)
            throw Error('"safeMode" and "ensureOptimizations" flags are mutually exclusive.'); r.trackStartLines = /full|onlyStart/i.test(r.config.positionTracking), r.trackEndLines = /full/i.test(r.config.positionTracking), (0, u.default)(t) ? n = { modes: { defaultMode: (0, T.default)(t) }, defaultMode: i.DEFAULT_MODE } : (o = !1, n = (0, T.default)(t)); })), !1 === r.config.skipValidations && (r.TRACE_INIT("performRuntimeChecks", (function () { r.lexerDefinitionErrors = r.lexerDefinitionErrors.concat((0, i.performRuntimeChecks)(n, r.trackStartLines, r.config.lineTerminatorCharacters)); })), r.TRACE_INIT("performWarningRuntimeChecks", (function () { r.lexerDefinitionWarning = r.lexerDefinitionWarning.concat((0, i.performWarningRuntimeChecks)(n, r.trackStartLines, r.config.lineTerminatorCharacters)); }))), n.modes = n.modes ? n.modes : {}, (0, p.default)(n.modes, (function (t, e) { n.modes[e] = (0, l.default)(t, (function (t) { return (0, h.default)(t); })); })); var c = (0, d.default)(n.modes); if ((0, p.default)(n.modes, (function (t, n) { r.TRACE_INIT("Mode: <".concat(n, "> processing"), (function () { var o; r.modes.push(n), !1 === r.config.skipValidations && r.TRACE_INIT("validatePatterns", (function () { r.lexerDefinitionErrors = r.lexerDefinitionErrors.concat((0, i.validatePatterns)(t, c)); })), (0, s.default)(r.lexerDefinitionErrors) && ((0, _.augmentTokenTypes)(t), r.TRACE_INIT("analyzeTokenTypes", (function () { o = (0, i.analyzeTokenTypes)(t, { lineTerminatorCharacters: r.config.lineTerminatorCharacters, positionTracking: e.positionTracking, ensureOptimizations: e.ensureOptimizations, safeMode: e.safeMode, tracer: r.TRACE_INIT }); })), r.patternIdxToConfig[n] = o.patternIdxToConfig, r.charCodeToPatternIdxToConfig[n] = o.charCodeToPatternIdxToConfig, r.emptyGroups = (0, y.default)({}, r.emptyGroups, o.emptyGroups), r.hasCustom = o.hasCustom || r.hasCustom, r.canModeBeOptimized[n] = o.canBeOptimized); })); })), r.defaultMode = n.defaultMode, !(0, s.default)(r.lexerDefinitionErrors) && !r.config.deferDefinitionErrorsHandling) {
            var g = (0, f.default)(r.lexerDefinitionErrors, (function (t) { return t.message; })).join("-----------------------\n");
            throw new Error("Errors detected in definition of Lexer:\n" + g);
        } (0, p.default)(r.lexerDefinitionWarning, (function (t) { (0, E.PRINT_WARNING)(t.message); })), r.TRACE_INIT("Choosing sub-methods implementations", (function () { if (i.SUPPORT_STICKY ? (r.chopInput = v.default, r.match = r.matchWithTest) : (r.updateLastIndex = a.default, r.match = r.matchWithExec), o && (r.handleModes = a.default), !1 === r.trackStartLines && (r.computeNewColumn = v.default), !1 === r.trackEndLines && (r.updateTokenEndLineColumnLocation = a.default), /full/i.test(r.config.positionTracking))
            r.createTokenInstance = r.createFullToken;
        else if (/onlyStart/i.test(r.config.positionTracking))
            r.createTokenInstance = r.createStartOnlyToken;
        else {
            if (!/onlyOffset/i.test(r.config.positionTracking))
                throw Error('Invalid <positionTracking> config option: "'.concat(r.config.positionTracking, '"'));
            r.createTokenInstance = r.createOffsetOnlyToken;
        } r.hasCustom ? (r.addToken = r.addTokenUsingPush, r.handlePayload = r.handlePayloadWithCustom) : (r.addToken = r.addTokenUsingMemberAccess, r.handlePayload = r.handlePayloadNoCustom); })), r.TRACE_INIT("Failed Optimization Warnings", (function () { var t = (0, m.default)(r.canModeBeOptimized, (function (t, e, r) { return !1 === e && t.push(r), t; }), []); if (e.ensureOptimizations && !(0, s.default)(t))
            throw Error("Lexer Modes: < ".concat(t.join(", "), " > cannot be optimized.\n") + '\t Disable the "ensureOptimizations" lexer config flag to silently ignore this and run the lexer in an un-optimized mode.\n\t Or inspect the console log for details on how to resolve these issues.'); })), r.TRACE_INIT("clearRegExpParserCache", (function () { (0, O.clearRegExpParserCache)(); })), r.TRACE_INIT("toFastProperties", (function () { (0, E.toFastProperties)(r); })); })); } return t.prototype.tokenize = function (t, e) { if (void 0 === e && (e = this.defaultMode), !(0, s.default)(this.lexerDefinitionErrors)) {
            var r = (0, f.default)(this.lexerDefinitionErrors, (function (t) { return t.message; })).join("-----------------------\n");
            throw new Error("Unable to Tokenize because Errors detected in definition of Lexer:\n" + r);
        } return this.tokenizeInternal(t, e); }, t.prototype.tokenizeInternal = function (t, e) { var r, n, o, a, s, u, l, f, p, d, h, v, y, m, T, E, _ = this, g = t, O = g.length, R = 0, A = 0, I = this.hasCustom ? 0 : Math.floor(t.length / 10), x = new Array(I), N = [], P = this.trackStartLines ? 1 : void 0, S = this.trackStartLines ? 1 : void 0, b = (0, i.cloneEmptyGroups)(this.emptyGroups), k = this.trackStartLines, L = this.config.lineTerminatorsPattern, C = 0, M = [], D = [], w = [], F = []; function j() { return M; } function U(t) { var e = (0, i.charCodeToOptimizedIndex)(t), r = D[e]; return void 0 === r ? F : r; } Object.freeze(F); var B, G = function (t) { if (1 === w.length && void 0 === t.tokenType.PUSH_MODE) {
            var e = _.config.errorMessageProvider.buildUnableToPopLexerModeMessage(t);
            N.push({ offset: t.startOffset, line: t.startLine, column: t.startColumn, length: t.image.length, message: e });
        }
        else {
            w.pop();
            var r = (0, c.default)(w);
            M = _.patternIdxToConfig[r], D = _.charCodeToPatternIdxToConfig[r], C = M.length;
            var n = _.canModeBeOptimized[r] && !1 === _.config.safeMode;
            E = D && n ? U : j;
        } }; function W(t) { w.push(t), D = this.charCodeToPatternIdxToConfig[t], M = this.patternIdxToConfig[t], C = M.length, C = M.length; var e = this.canModeBeOptimized[t] && !1 === this.config.safeMode; E = D && e ? U : j; } for (W.call(this, e); R < O;) {
            u = null;
            var V = g.charCodeAt(R), z = E(V), K = z.length;
            for (r = 0; r < K; r++) {
                var Y = (B = z[r]).pattern;
                if (l = null, !1 !== (nt = B.short) ? V === nt && (u = Y) : !0 === B.isCustom ? null !== (T = Y.exec(g, R, x, b)) ? (u = T[0], void 0 !== T.payload && (l = T.payload)) : u = null : (this.updateLastIndex(Y, R), u = this.match(Y, t, R)), null !== u) {
                    if (void 0 !== (s = B.longerAlt)) {
                        var H = s.length;
                        for (o = 0; o < H; o++) {
                            var X = M[s[o]], q = X.pattern;
                            if (f = null, !0 === X.isCustom ? null !== (T = q.exec(g, R, x, b)) ? (a = T[0], void 0 !== T.payload && (f = T.payload)) : a = null : (this.updateLastIndex(q, R), a = this.match(q, t, R)), a && a.length > u.length) {
                                u = a, l = f, B = X;
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            if (null !== u) {
                if (p = u.length, void 0 !== (d = B.group) && (h = B.tokenTypeIdx, v = this.createTokenInstance(u, R, h, B.tokenType, P, S, p), this.handlePayload(v, l), !1 === d ? A = this.addToken(x, A, v) : b[d].push(v)), t = this.chopInput(t, p), R += p, S = this.computeNewColumn(S, p), !0 === k && !0 === B.canLineTerminator) {
                    var $ = 0, Q = void 0, Z = void 0;
                    L.lastIndex = 0;
                    do {
                        !0 === (Q = L.test(u)) && (Z = L.lastIndex - 1, $++);
                    } while (!0 === Q);
                    0 !== $ && (P += $, S = p - Z, this.updateTokenEndLineColumnLocation(v, d, Z, $, P, S, p));
                }
                this.handleModes(B, G, W, v);
            }
            else {
                for (var J = R, tt = P, et = S, rt = !1; !rt && R < O;)
                    for (g.charCodeAt(R), t = this.chopInput(t, 1), R++, n = 0; n < C; n++) {
                        var nt, ot = M[n];
                        if (Y = ot.pattern, !1 !== (nt = ot.short) ? g.charCodeAt(R) === nt && (rt = !0) : !0 === ot.isCustom ? rt = null !== Y.exec(g, R, x, b) : (this.updateLastIndex(Y, R), rt = null !== Y.exec(t)), !0 === rt)
                            break;
                    }
                y = R - J, m = this.config.errorMessageProvider.buildUnexpectedCharactersMessage(g, J, y, tt, et), N.push({ offset: J, line: tt, column: et, length: y, message: m });
            }
        } return this.hasCustom || (x.length = A), { tokens: x, groups: b, errors: N }; }, t.prototype.handleModes = function (t, e, r, n) { if (!0 === t.pop) {
            var o = t.push;
            e(n), void 0 !== o && r.call(this, o);
        }
        else
            void 0 !== t.push && r.call(this, t.push); }, t.prototype.chopInput = function (t, e) { return t.substring(e); }, t.prototype.updateLastIndex = function (t, e) { t.lastIndex = e; }, t.prototype.updateTokenEndLineColumnLocation = function (t, e, r, n, o, i, a) { var s, u; void 0 !== e && (u = (s = r === a - 1) ? -1 : 0, 1 === n && !0 === s || (t.endLine = o + u, t.endColumn = i - 1 - u)); }, t.prototype.computeNewColumn = function (t, e) { return t + e; }, t.prototype.createOffsetOnlyToken = function (t, e, r, n) { return { image: t, startOffset: e, tokenTypeIdx: r, tokenType: n }; }, t.prototype.createStartOnlyToken = function (t, e, r, n, o, i) { return { image: t, startOffset: e, startLine: o, startColumn: i, tokenTypeIdx: r, tokenType: n }; }, t.prototype.createFullToken = function (t, e, r, n, o, i, a) { return { image: t, startOffset: e, endOffset: e + a - 1, startLine: o, endLine: o, startColumn: i, endColumn: i + a - 1, tokenTypeIdx: r, tokenType: n }; }, t.prototype.addTokenUsingPush = function (t, e, r) { return t.push(r), e; }, t.prototype.addTokenUsingMemberAccess = function (t, e, r) { return t[e] = r, ++e; }, t.prototype.handlePayloadNoCustom = function (t, e) { }, t.prototype.handlePayloadWithCustom = function (t, e) { null !== e && (t.payload = e); }, t.prototype.matchWithTest = function (t, e, r) { return !0 === t.test(e) ? e.substring(r, t.lastIndex) : null; }, t.prototype.matchWithExec = function (t, e) { var r = t.exec(e); return null !== r ? r[0] : null; }, t.SKIPPED = "This marks a skipped Token pattern, this means each token identified by it willbe consumed and then thrown into oblivion, this can be used to for example to completely ignore whitespace.", t.NA = /NOT_APPLICABLE/, t; }();
        e.Lexer = A;
    }, 1480: function (t, e, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function (t, e) { return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]); })(t, e); }, function (t, e) { if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null"); function r() { this.constructor = t; } n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }), i = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.canMatchCharCode = e.firstCharOptimizedIndices = e.getOptimizedStartCodesIndices = e.failedOptimizationPrefixMsg = void 0;
        var a = r(4844), s = i(r(6152)), u = i(r(9794)), c = i(r(9756)), l = i(r(5281)), f = i(r(8346)), p = i(r(1886)), d = r(7146), h = r(3067), v = r(6178), y = "Complement Sets are not supported for first char optimization";
        function m(t, e, r) { switch (t.type) {
            case "Disjunction":
                for (var n = 0; n < t.value.length; n++)
                    m(t.value[n], e, r);
                break;
            case "Alternative":
                var o = t.value;
                for (n = 0; n < o.length; n++) {
                    var i = o[n];
                    switch (i.type) {
                        case "EndAnchor":
                        case "GroupBackReference":
                        case "Lookahead":
                        case "NegativeLookahead":
                        case "StartAnchor":
                        case "WordBoundary":
                        case "NonWordBoundary": continue;
                    }
                    var a = i;
                    switch (a.type) {
                        case "Character":
                            T(a.value, e, r);
                            break;
                        case "Set":
                            if (!0 === a.complement)
                                throw Error(y);
                            (0, c.default)(a.value, (function (t) { if ("number" == typeof t)
                                T(t, e, r);
                            else {
                                var n = t;
                                if (!0 === r)
                                    for (var o = n.from; o <= n.to; o++)
                                        T(o, e, r);
                                else {
                                    for (o = n.from; o <= n.to && o < v.minOptimizationVal; o++)
                                        T(o, e, r);
                                    if (n.to >= v.minOptimizationVal)
                                        for (var i = n.from >= v.minOptimizationVal ? n.from : v.minOptimizationVal, a = n.to, s = (0, v.charCodeToOptimizedIndex)(i), u = (0, v.charCodeToOptimizedIndex)(a), c = s; c <= u; c++)
                                            e[c] = c;
                                }
                            } }));
                            break;
                        case "Group":
                            m(a.value, e, r);
                            break;
                        default: throw Error("Non Exhaustive Match");
                    }
                    var s = void 0 !== a.quantifier && 0 === a.quantifier.atLeast;
                    if ("Group" === a.type && !1 === _(a) || "Group" !== a.type && !1 === s)
                        break;
                }
                break;
            default: throw Error("non exhaustive match!");
        } return (0, f.default)(e); }
        function T(t, e, r) { var n = (0, v.charCodeToOptimizedIndex)(t); e[n] = n, !0 === r && function (t, e) { var r = String.fromCharCode(t), n = r.toUpperCase(); if (n !== r)
            e[o = (0, v.charCodeToOptimizedIndex)(n.charCodeAt(0))] = o;
        else {
            var o, i = r.toLowerCase();
            i !== r && (e[o = (0, v.charCodeToOptimizedIndex)(i.charCodeAt(0))] = o);
        } }(t, e); }
        function E(t, e) { return (0, l.default)(t.value, (function (t) { if ("number" == typeof t)
            return (0, p.default)(e, t); var r = t; return void 0 !== (0, l.default)(e, (function (t) { return r.from <= t && t <= r.to; })); })); }
        function _(t) { var e = t.quantifier; return !(!e || 0 !== e.atLeast) || !!t.value && ((0, s.default)(t.value) ? (0, u.default)(t.value, _) : _(t.value)); }
        e.failedOptimizationPrefixMsg = 'Unable to use "first char" lexer optimizations:\n', e.getOptimizedStartCodesIndices = function (t, r) { void 0 === r && (r = !1); try {
            var n = (0, h.getRegExpAst)(t);
            return m(n.value, {}, n.flags.ignoreCase);
        }
        catch (n) {
            if (n.message === y)
                r && (0, d.PRINT_WARNING)("".concat(e.failedOptimizationPrefixMsg) + "\tUnable to optimize: < ".concat(t.toString(), " >\n") + "\tComplement Sets cannot be automatically optimized.\n\tThis will disable the lexer's first char optimizations.\n\tSee: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#COMPLEMENT for details.");
            else {
                var o = "";
                r && (o = "\n\tThis will disable the lexer's first char optimizations.\n\tSee: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#REGEXP_PARSING for details."), (0, d.PRINT_ERROR)("".concat(e.failedOptimizationPrefixMsg, "\n") + "\tFailed parsing: < ".concat(t.toString(), " >\n") + "\tUsing the regexp-to-ast library version: ".concat(a.VERSION, "\n") + "\tPlease open an issue at: https://github.com/bd82/regexp-to-ast/issues" + o);
            }
        } return []; }, e.firstCharOptimizedIndices = m;
        var g = function (t) { function e(e) { var r = t.call(this) || this; return r.targetCharCodes = e, r.found = !1, r; } return o(e, t), e.prototype.visitChildren = function (e) { if (!0 !== this.found) {
            switch (e.type) {
                case "Lookahead": return void this.visitLookahead(e);
                case "NegativeLookahead": return void this.visitNegativeLookahead(e);
            }
            t.prototype.visitChildren.call(this, e);
        } }, e.prototype.visitCharacter = function (t) { (0, p.default)(this.targetCharCodes, t.value) && (this.found = !0); }, e.prototype.visitSet = function (t) { t.complement ? void 0 === E(t, this.targetCharCodes) && (this.found = !0) : void 0 !== E(t, this.targetCharCodes) && (this.found = !0); }, e; }(a.BaseRegExpVisitor);
        e.canMatchCharCode = function (t, e) { if (e instanceof RegExp) {
            var r = (0, h.getRegExpAst)(e), n = new g(t);
            return n.visit(r), n.found;
        } return void 0 !== (0, l.default)(e, (function (e) { return (0, p.default)(t, e.charCodeAt(0)); })); };
    }, 3067: (t, e, r) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.clearRegExpParserCache = e.getRegExpAst = void 0;
        var n = r(4844), o = {}, i = new n.RegExpParser;
        e.getRegExpAst = function (t) { var e = t.toString(); if (o.hasOwnProperty(e))
            return o[e]; var r = i.pattern(e); return o[e] = r, r; }, e.clearRegExpParserCache = function () { o = {}; };
    }, 1201: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.isTokenType = e.hasExtendingTokensTypesMapProperty = e.hasExtendingTokensTypesProperty = e.hasCategoriesProperty = e.hasShortKeyProperty = e.singleAssignCategoriesToksMap = e.assignCategoriesMapProp = e.assignCategoriesTokensProp = e.assignTokenDefaultProps = e.expandCategories = e.augmentTokenTypes = e.tokenIdxToClass = e.tokenShortNameIdx = e.tokenStructuredMatcherNoCategories = e.tokenStructuredMatcher = void 0;
        var o = n(r(5455)), i = n(r(417)), a = n(r(6152)), s = n(r(5676)), u = n(r(7335)), c = n(r(6760)), l = n(r(9756)), f = n(r(3352)), p = n(r(1886)), d = n(r(4004));
        function h(t) { for (var e = (0, d.default)(t), r = t, n = !0; n;) {
            r = (0, i.default)((0, s.default)((0, c.default)(r, (function (t) { return t.CATEGORIES; }))));
            var a = (0, u.default)(r, e);
            e = e.concat(a), (0, o.default)(a) ? n = !1 : r = a;
        } return e; }
        function v(t) { (0, l.default)(t, (function (t) { E(t) || (e.tokenIdxToClass[e.tokenShortNameIdx] = t, t.tokenTypeIdx = e.tokenShortNameIdx++), _(t) && !(0, a.default)(t.CATEGORIES) && (t.CATEGORIES = [t.CATEGORIES]), _(t) || (t.CATEGORIES = []), g(t) || (t.categoryMatches = []), O(t) || (t.categoryMatchesMap = {}); })); }
        function y(t) { (0, l.default)(t, (function (t) { t.categoryMatches = [], (0, l.default)(t.categoryMatchesMap, (function (r, n) { t.categoryMatches.push(e.tokenIdxToClass[n].tokenTypeIdx); })); })); }
        function m(t) { (0, l.default)(t, (function (t) { T([], t); })); }
        function T(t, e) { (0, l.default)(t, (function (t) { e.categoryMatchesMap[t.tokenTypeIdx] = !0; })), (0, l.default)(e.CATEGORIES, (function (r) { var n = t.concat(e); (0, p.default)(n, r) || T(n, r); })); }
        function E(t) { return (0, f.default)(t, "tokenTypeIdx"); }
        function _(t) { return (0, f.default)(t, "CATEGORIES"); }
        function g(t) { return (0, f.default)(t, "categoryMatches"); }
        function O(t) { return (0, f.default)(t, "categoryMatchesMap"); }
        e.tokenStructuredMatcher = function (t, e) { var r = t.tokenTypeIdx; return r === e.tokenTypeIdx || !0 === e.isParent && !0 === e.categoryMatchesMap[r]; }, e.tokenStructuredMatcherNoCategories = function (t, e) { return t.tokenTypeIdx === e.tokenTypeIdx; }, e.tokenShortNameIdx = 1, e.tokenIdxToClass = {}, e.augmentTokenTypes = function (t) { var e = h(t); v(e), m(e), y(e), (0, l.default)(e, (function (t) { t.isParent = t.categoryMatches.length > 0; })); }, e.expandCategories = h, e.assignTokenDefaultProps = v, e.assignCategoriesTokensProp = y, e.assignCategoriesMapProp = m, e.singleAssignCategoriesToksMap = T, e.hasShortKeyProperty = E, e.hasCategoriesProperty = _, e.hasExtendingTokensTypesProperty = g, e.hasExtendingTokensTypesMapProperty = O, e.isTokenType = function (t) { return (0, f.default)(t, "tokenTypeIdx"); };
    }, 6736: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.tokenMatcher = e.createTokenInstance = e.EOF = e.createToken = e.hasTokenLabel = e.tokenName = e.tokenLabel = void 0;
        var o = n(r(5505)), i = n(r(3352)), a = n(r(4336)), s = r(9027), u = r(1201);
        function c(t) { return (0, o.default)(t.LABEL) && "" !== t.LABEL; }
        e.tokenLabel = function (t) { return c(t) ? t.LABEL : t.name; }, e.tokenName = function (t) { return t.name; }, e.hasTokenLabel = c;
        function l(t) { return function (t) { var e = t.pattern, r = {}; if (r.name = t.name, (0, a.default)(e) || (r.PATTERN = e), (0, i.default)(t, "parent"))
            throw "The parent property is no longer supported.\nSee: https://github.com/chevrotain/chevrotain/issues/564#issuecomment-349062346 for details."; return (0, i.default)(t, "categories") && (r.CATEGORIES = t.categories), (0, u.augmentTokenTypes)([r]), (0, i.default)(t, "label") && (r.LABEL = t.label), (0, i.default)(t, "group") && (r.GROUP = t.group), (0, i.default)(t, "pop_mode") && (r.POP_MODE = t.pop_mode), (0, i.default)(t, "push_mode") && (r.PUSH_MODE = t.push_mode), (0, i.default)(t, "longer_alt") && (r.LONGER_ALT = t.longer_alt), (0, i.default)(t, "line_breaks") && (r.LINE_BREAKS = t.line_breaks), (0, i.default)(t, "start_chars_hint") && (r.START_CHARS_HINT = t.start_chars_hint), r; }(t); }
        e.createToken = l, e.EOF = l({ name: "EOF", pattern: s.Lexer.NA }), (0, u.augmentTokenTypes)([e.EOF]), e.createTokenInstance = function (t, e, r, n, o, i, a, s) { return { image: e, startOffset: r, endOffset: n, startLine: o, endLine: i, startColumn: a, endColumn: s, tokenTypeIdx: t.tokenTypeIdx, tokenType: t }; }, e.tokenMatcher = function (t, e) { return (0, u.tokenStructuredMatcher)(t, e); };
    }, 7979: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.VERSION = void 0, e.VERSION = "10.1.2";
    }, 8962: function (t, e, r) {
        "use strict";
        var n = this && this.__assign || function () { return (n = Object.assign || function (t) { for (var e, r = 1, n = arguments.length; r < n; r++)
            for (var o in e = arguments[r])
                Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]); return t; }).apply(this, arguments); };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.generateCstDts = void 0;
        var o = r(7842), i = r(1871), a = { includeVisitorInterface: !0, visitorInterfaceName: "ICstNodeVisitor" };
        e.generateCstDts = function (t, e) { var r = n(n({}, a), e), s = (0, o.buildModel)(t); return (0, i.genDts)(s, r); };
    }, 1871: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.genDts = void 0;
        var o = n(r(5676)), i = n(r(6152)), a = n(r(6760)), s = n(r(8215)), u = n(r(5652)), c = n(r(3779));
        function l(t) { return "token" === t.kind ? "IToken" : f(t.name); }
        function f(t) { return (0, c.default)(t) + "CstNode"; }
        function p(t) { return (0, c.default)(t) + "CstChildren"; }
        e.genDts = function (t, e) { var r, n, c = []; return c = (c = c.concat('import type { CstNode, ICstVisitor, IToken } from "chevrotain";')).concat((0, o.default)((0, a.default)(t, (function (t) { return function (t) { return [function (t) { var e = f(t.name), r = p(t.name); return "export interface ".concat(e, ' extends CstNode {\n  name: "').concat(t.name, '";\n  children: ').concat(r, ";\n}"); }(t), function (t) { var e = p(t.name); return "export type ".concat(e, " = {\n  ").concat((0, a.default)(t.properties, (function (t) { return function (t) { var e = function (t) { if ((0, i.default)(t)) {
                var e = (0, u.default)((0, a.default)(t, (function (t) { return l(t); })));
                return "(" + (0, s.default)(e, (function (t, e) { return t + " | " + e; })) + ")";
            } return l(t); }(t.type); return "".concat(t.name).concat(t.optional ? "?" : "", ": ").concat(e, "[];"); }(t); })).join("\n  "), "\n};"); }(t)]; }(t); })))), e.includeVisitorInterface && (c = c.concat((r = e.visitorInterfaceName, n = t, "export interface ".concat(r, "<IN, OUT> extends ICstVisitor<IN, OUT> {\n  ").concat((0, a.default)(n, (function (t) { return function (t) { var e = p(t.name); return "".concat(t.name, "(children: ").concat(e, ", param?: IN): OUT;"); }(t); })).join("\n  "), "\n}")))), c.join("\n\n") + "\n"; };
    }, 7842: function (t, e, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function (t, e) { return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]); })(t, e); }, function (t, e) { if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null"); function r() { this.constructor = t; } n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }), i = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.buildModel = void 0;
        var a = r(7729), s = i(r(6760)), u = i(r(5676)), c = i(r(8346)), l = i(r(1525)), f = i(r(3440)), p = i(r(19));
        e.buildModel = function (t) { var e = new d, r = (0, c.default)(t); return (0, s.default)(r, (function (t) { return e.visitRule(t); })); };
        var d = function (t) { function e() { return null !== t && t.apply(this, arguments) || this; } return o(e, t), e.prototype.visitRule = function (t) { var e = this.visitEach(t.definition), r = (0, f.default)(e, (function (t) { return t.propertyName; })), n = (0, s.default)(r, (function (t, e) { var r = !(0, l.default)(t, (function (t) { return !t.canBeNull; })), n = t[0].type; return t.length > 1 && (n = (0, s.default)(t, (function (t) { return t.type; }))), { name: e, type: n, optional: r }; })); return { name: t.name, properties: n }; }, e.prototype.visitAlternative = function (t) { return this.visitEachAndOverrideWith(t.definition, { canBeNull: !0 }); }, e.prototype.visitOption = function (t) { return this.visitEachAndOverrideWith(t.definition, { canBeNull: !0 }); }, e.prototype.visitRepetition = function (t) { return this.visitEachAndOverrideWith(t.definition, { canBeNull: !0 }); }, e.prototype.visitRepetitionMandatory = function (t) { return this.visitEach(t.definition); }, e.prototype.visitRepetitionMandatoryWithSeparator = function (t) { return this.visitEach(t.definition).concat({ propertyName: t.separator.name, canBeNull: !0, type: h(t.separator) }); }, e.prototype.visitRepetitionWithSeparator = function (t) { return this.visitEachAndOverrideWith(t.definition, { canBeNull: !0 }).concat({ propertyName: t.separator.name, canBeNull: !0, type: h(t.separator) }); }, e.prototype.visitAlternation = function (t) { return this.visitEachAndOverrideWith(t.definition, { canBeNull: !0 }); }, e.prototype.visitTerminal = function (t) { return [{ propertyName: t.label || t.terminalType.name, canBeNull: !1, type: h(t) }]; }, e.prototype.visitNonTerminal = function (t) { return [{ propertyName: t.label || t.nonTerminalName, canBeNull: !1, type: h(t) }]; }, e.prototype.visitEachAndOverrideWith = function (t, e) { return (0, s.default)(this.visitEach(t), (function (t) { return (0, p.default)({}, t, e); })); }, e.prototype.visitEach = function (t) { var e = this; return (0, u.default)((0, s.default)(t, (function (t) { return e.visit(t); }))); }, e; }(a.GAstVisitor);
        function h(t) { return t instanceof a.NonTerminal ? { kind: "rule", name: t.referencedRule.name } : { kind: "token" }; }
    }, 7729: (t, e, r) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.isSequenceProd = e.isBranchingProd = e.isOptionalProd = e.getProductionDslName = e.GAstVisitor = e.serializeProduction = e.serializeGrammar = e.Alternative = e.Alternation = e.RepetitionWithSeparator = e.RepetitionMandatoryWithSeparator = e.RepetitionMandatory = e.Repetition = e.Option = e.NonTerminal = e.Terminal = e.Rule = void 0;
        var n = r(5700);
        Object.defineProperty(e, "Rule", { enumerable: !0, get: function () { return n.Rule; } }), Object.defineProperty(e, "Terminal", { enumerable: !0, get: function () { return n.Terminal; } }), Object.defineProperty(e, "NonTerminal", { enumerable: !0, get: function () { return n.NonTerminal; } }), Object.defineProperty(e, "Option", { enumerable: !0, get: function () { return n.Option; } }), Object.defineProperty(e, "Repetition", { enumerable: !0, get: function () { return n.Repetition; } }), Object.defineProperty(e, "RepetitionMandatory", { enumerable: !0, get: function () { return n.RepetitionMandatory; } }), Object.defineProperty(e, "RepetitionMandatoryWithSeparator", { enumerable: !0, get: function () { return n.RepetitionMandatoryWithSeparator; } }), Object.defineProperty(e, "RepetitionWithSeparator", { enumerable: !0, get: function () { return n.RepetitionWithSeparator; } }), Object.defineProperty(e, "Alternation", { enumerable: !0, get: function () { return n.Alternation; } }), Object.defineProperty(e, "Alternative", { enumerable: !0, get: function () { return n.Alternative; } }), Object.defineProperty(e, "serializeGrammar", { enumerable: !0, get: function () { return n.serializeGrammar; } }), Object.defineProperty(e, "serializeProduction", { enumerable: !0, get: function () { return n.serializeProduction; } });
        var o = r(7694);
        Object.defineProperty(e, "GAstVisitor", { enumerable: !0, get: function () { return o.GAstVisitor; } });
        var i = r(2515);
        Object.defineProperty(e, "getProductionDslName", { enumerable: !0, get: function () { return i.getProductionDslName; } }), Object.defineProperty(e, "isOptionalProd", { enumerable: !0, get: function () { return i.isOptionalProd; } }), Object.defineProperty(e, "isBranchingProd", { enumerable: !0, get: function () { return i.isBranchingProd; } }), Object.defineProperty(e, "isSequenceProd", { enumerable: !0, get: function () { return i.isSequenceProd; } });
    }, 2515: function (t, e, r) {
        "use strict";
        var n = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.getProductionDslName = e.isBranchingProd = e.isOptionalProd = e.isSequenceProd = void 0;
        var o = n(r(1525)), i = n(r(9794)), a = n(r(1886)), s = r(5700);
        e.isSequenceProd = function (t) { return t instanceof s.Alternative || t instanceof s.Option || t instanceof s.Repetition || t instanceof s.RepetitionMandatory || t instanceof s.RepetitionMandatoryWithSeparator || t instanceof s.RepetitionWithSeparator || t instanceof s.Terminal || t instanceof s.Rule; }, e.isOptionalProd = function t(e, r) { return void 0 === r && (r = []), !!(e instanceof s.Option || e instanceof s.Repetition || e instanceof s.RepetitionWithSeparator) || (e instanceof s.Alternation ? (0, o.default)(e.definition, (function (e) { return t(e, r); })) : !(e instanceof s.NonTerminal && (0, a.default)(r, e)) && e instanceof s.AbstractProduction && (e instanceof s.NonTerminal && r.push(e), (0, i.default)(e.definition, (function (e) { return t(e, r); })))); }, e.isBranchingProd = function (t) { return t instanceof s.Alternation; }, e.getProductionDslName = function (t) { if (t instanceof s.NonTerminal)
            return "SUBRULE"; if (t instanceof s.Option)
            return "OPTION"; if (t instanceof s.Alternation)
            return "OR"; if (t instanceof s.RepetitionMandatory)
            return "AT_LEAST_ONE"; if (t instanceof s.RepetitionMandatoryWithSeparator)
            return "AT_LEAST_ONE_SEP"; if (t instanceof s.RepetitionWithSeparator)
            return "MANY_SEP"; if (t instanceof s.Repetition)
            return "MANY"; if (t instanceof s.Terminal)
            return "CONSUME"; throw Error("non exhaustive match"); };
    }, 5700: function (t, e, r) {
        "use strict";
        var n, o = this && this.__extends || (n = function (t, e) { return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) { t.__proto__ = e; } || function (t, e) { for (var r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]); })(t, e); }, function (t, e) { if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null"); function r() { this.constructor = t; } n(t, e), t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r); }), i = this && this.__importDefault || function (t) { return t && t.__esModule ? t : { default: t }; };
        Object.defineProperty(e, "__esModule", { value: !0 }), e.serializeProduction = e.serializeGrammar = e.Terminal = e.Alternation = e.RepetitionWithSeparator = e.Repetition = e.RepetitionMandatoryWithSeparator = e.RepetitionMandatory = e.Option = e.Alternative = e.Rule = e.NonTerminal = e.AbstractProduction = void 0;
        var a = i(r(6760)), s = i(r(9756)), u = i(r(5505)), c = i(r(859)), l = i(r(2208)), f = i(r(19));
        var p = function () { function t(t) { this._definition = t; } return Object.defineProperty(t.prototype, "definition", { get: function () { return this._definition; }, set: function (t) { this._definition = t; }, enumerable: !1, configurable: !0 }), t.prototype.accept = function (t) { t.visit(this), (0, s.default)(this.definition, (function (e) { e.accept(t); })); }, t; }();
        e.AbstractProduction = p;
        var d = function (t) { function e(e) { var r = t.call(this, []) || this; return r.idx = 1, (0, f.default)(r, (0, l.default)(e, (function (t) { return void 0 !== t; }))), r; } return o(e, t), Object.defineProperty(e.prototype, "definition", { get: function () { return void 0 !== this.referencedRule ? this.referencedRule.definition : []; }, set: function (t) { }, enumerable: !1, configurable: !0 }), e.prototype.accept = function (t) { t.visit(this); }, e; }(p);
        e.NonTerminal = d;
        var h = function (t) { function e(e) { var r = t.call(this, e.definition) || this; return r.orgText = "", (0, f.default)(r, (0, l.default)(e, (function (t) { return void 0 !== t; }))), r; } return o(e, t), e; }(p);
        e.Rule = h;
        var v = function (t) { function e(e) { var r = t.call(this, e.definition) || this; return r.ignoreAmbiguities = !1, (0, f.default)(r, (0, l.default)(e, (function (t) { return void 0 !== t; }))), r; } return o(e, t), e; }(p);
        e.Alternative = v;
        var y = function (t) { function e(e) { var r = t.call(this, e.definition) || this; return r.idx = 1, (0, f.default)(r, (0, l.default)(e, (function (t) { return void 0 !== t; }))), r; } return o(e, t), e; }(p);
        e.Option = y;
        var m = function (t) { function e(e) { var r = t.call(this, e.definition) || this; return r.idx = 1, (0, f.default)(r, (0, l.default)(e, (function (t) { return void 0 !== t; }))), r; } return o(e, t), e; }(p);
        e.RepetitionMandatory = m;
        var T = function (t) { function e(e) { var r = t.call(this, e.definition) || this; return r.idx = 1, (0, f.default)(r, (0, l.default)(e, (function (t) { return void 0 !== t; }))), r; } return o(e, t), e; }(p);
        e.RepetitionMandatoryWithSeparator = T;
        var E = function (t) { function e(e) { var r = t.call(this, e.definition) || this; return r.idx = 1, (0, f.default)(r, (0, l.default)(e, (function (t) { return void 0 !== t; }))), r; } return o(e, t), e; }(p);
        e.Repetition = E;
        var _ = function (t) { function e(e) { var r = t.call(this, e.definition) || this; return r.idx = 1, (0, f.default)(r, (0, l.default)(e, (function (t) { return void 0 !== t; }))), r; } return o(e, t), e; }(p);
        e.RepetitionWithSeparator = _;
        var g = function (t) { function e(e) { var r = t.call(this, e.definition) || this; return r.idx = 1, r.ignoreAmbiguities = !1, r.hasPredicates = !1, (0, f.default)(r, (0, l.default)(e, (function (t) { return void 0 !== t; }))), r; } return o(e, t), Object.defineProperty(e.prototype, "definition", { get: function () { return this._definition; }, set: function (t) { this._definition = t; }, enumerable: !1, configurable: !0 }), e; }(p);
        e.Alternation = g;
        var O = function () { function t(t) { this.idx = 1, (0, f.default)(this, (0, l.default)(t, (function (t) { return void 0 !== t; }))); } return t.prototype.accept = function (t) { t.visit(this); }, t; }();
        function R(t) { function e(t) { return (0, a.default)(t, R); } if (t instanceof d) {
            var r = { type: "NonTerminal", name: t.nonTerminalName, idx: t.idx };
            return (0, u.default)(t.label) && (r.label = t.label), r;
        } if (t instanceof v)
            return { type: "Alternative", definition: e(t.definition) }; if (t instanceof y)
            return { type: "Option", idx: t.idx, definition: e(t.definition) }; if (t instanceof m)
            return { type: "RepetitionMandatory", idx: t.idx, definition: e(t.definition) }; if (t instanceof T)
            return { type: "RepetitionMandatoryWithSeparator", idx: t.idx, separator: R(new O({ terminalType: t.separator })), definition: e(t.definition) }; if (t instanceof _)
            return { type: "RepetitionWithSeparator", idx: t.idx, separator: R(new O({ terminalType: t.separator })), definition: e(t.definition) }; if (t instanceof E)
            return { type: "Repetition", idx: t.idx, definition: e(t.definition) }; if (t instanceof g)
            return { type: "Alternation", idx: t.idx, definition: e(t.definition) }; if (t instanceof O) {
            var n = { type: "Terminal", name: t.terminalType.name, label: (i = t.terminalType, s = i, (0, u.default)(s.LABEL) && "" !== s.LABEL ? i.LABEL : i.name), idx: t.idx };
            (0, u.default)(t.label) && (n.terminalLabel = t.label);
            var o = t.terminalType.PATTERN;
            return t.terminalType.PATTERN && (n.pattern = (0, c.default)(o) ? o.source : o), n;
        } var i, s; if (t instanceof h)
            return { type: "Rule", name: t.name, orgText: t.orgText, definition: e(t.definition) }; throw Error("non exhaustive match"); }
        e.Terminal = O, e.serializeGrammar = function (t) { return (0, a.default)(t, R); }, e.serializeProduction = R;
    }, 7694: (t, e, r) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.GAstVisitor = void 0;
        var n = r(5700), o = function () { function t() { } return t.prototype.visit = function (t) { var e = t; switch (e.constructor) {
            case n.NonTerminal: return this.visitNonTerminal(e);
            case n.Alternative: return this.visitAlternative(e);
            case n.Option: return this.visitOption(e);
            case n.RepetitionMandatory: return this.visitRepetitionMandatory(e);
            case n.RepetitionMandatoryWithSeparator: return this.visitRepetitionMandatoryWithSeparator(e);
            case n.RepetitionWithSeparator: return this.visitRepetitionWithSeparator(e);
            case n.Repetition: return this.visitRepetition(e);
            case n.Alternation: return this.visitAlternation(e);
            case n.Terminal: return this.visitTerminal(e);
            case n.Rule: return this.visitRule(e);
            default: throw Error("non exhaustive match");
        } }, t.prototype.visitNonTerminal = function (t) { }, t.prototype.visitAlternative = function (t) { }, t.prototype.visitOption = function (t) { }, t.prototype.visitRepetition = function (t) { }, t.prototype.visitRepetitionMandatory = function (t) { }, t.prototype.visitRepetitionMandatoryWithSeparator = function (t) { }, t.prototype.visitRepetitionWithSeparator = function (t) { }, t.prototype.visitAlternation = function (t) { }, t.prototype.visitTerminal = function (t) { }, t.prototype.visitRule = function (t) { }, t; }();
        e.GAstVisitor = o;
    }, 7146: (t, e, r) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.toFastProperties = e.timer = e.PRINT_ERROR = e.PRINT_WARNING = void 0;
        var n = r(6910);
        Object.defineProperty(e, "PRINT_WARNING", { enumerable: !0, get: function () { return n.PRINT_WARNING; } }), Object.defineProperty(e, "PRINT_ERROR", { enumerable: !0, get: function () { return n.PRINT_ERROR; } });
        var o = r(150);
        Object.defineProperty(e, "timer", { enumerable: !0, get: function () { return o.timer; } });
        var i = r(4470);
        Object.defineProperty(e, "toFastProperties", { enumerable: !0, get: function () { return i.toFastProperties; } });
    }, 6910: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.PRINT_WARNING = e.PRINT_ERROR = void 0, e.PRINT_ERROR = function (t) { console && console.error && console.error("Error: ".concat(t)); }, e.PRINT_WARNING = function (t) { console && console.warn && console.warn("Warning: ".concat(t)); };
    }, 150: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.timer = void 0, e.timer = function (t) { var e = (new Date).getTime(), r = t(); return { time: (new Date).getTime() - e, value: r }; };
    }, 4470: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.toFastProperties = void 0, e.toFastProperties = function (t) { function e() { } e.prototype = t; var r = new e; function n() { return typeof r.bar; } return n(), n(), t; };
    } }, e = {}; function r(n) { var o = e[n]; if (void 0 !== o)
    return o.exports; var i = e[n] = { id: n, loaded: !1, exports: {} }; return t[n].call(i.exports, i, i.exports, r), i.loaded = !0, i.exports; } r.g = function () { if ("object" == typeof globalThis)
    return globalThis; try {
    return this || new Function("return this")();
}
catch (t) {
    if ("object" == typeof window)
        return window;
} }(), r.nmd = t => (t.paths = [], t.children || (t.children = []), t); var n = {}; return (() => {
    "use strict";
    var t = n;
    Object.defineProperty(t, "__esModule", { value: !0 }), t.Parser = t.createSyntaxDiagramsCode = t.clearCache = t.generateCstDts = t.GAstVisitor = t.serializeProduction = t.serializeGrammar = t.Terminal = t.Rule = t.RepetitionWithSeparator = t.RepetitionMandatoryWithSeparator = t.RepetitionMandatory = t.Repetition = t.Option = t.NonTerminal = t.Alternative = t.Alternation = t.defaultLexerErrorProvider = t.NoViableAltException = t.NotAllInputParsedException = t.MismatchedTokenException = t.isRecognitionException = t.EarlyExitException = t.defaultParserErrorProvider = t.tokenName = t.tokenMatcher = t.tokenLabel = t.EOF = t.createTokenInstance = t.createToken = t.LexerDefinitionErrorType = t.Lexer = t.EMPTY_ALT = t.ParserDefinitionErrorType = t.EmbeddedActionsParser = t.CstParser = t.VERSION = void 0;
    var e = r(7979);
    Object.defineProperty(t, "VERSION", { enumerable: !0, get: function () { return e.VERSION; } });
    var o = r(2941);
    Object.defineProperty(t, "CstParser", { enumerable: !0, get: function () { return o.CstParser; } }), Object.defineProperty(t, "EmbeddedActionsParser", { enumerable: !0, get: function () { return o.EmbeddedActionsParser; } }), Object.defineProperty(t, "ParserDefinitionErrorType", { enumerable: !0, get: function () { return o.ParserDefinitionErrorType; } }), Object.defineProperty(t, "EMPTY_ALT", { enumerable: !0, get: function () { return o.EMPTY_ALT; } });
    var i = r(9027);
    Object.defineProperty(t, "Lexer", { enumerable: !0, get: function () { return i.Lexer; } }), Object.defineProperty(t, "LexerDefinitionErrorType", { enumerable: !0, get: function () { return i.LexerDefinitionErrorType; } });
    var a = r(6736);
    Object.defineProperty(t, "createToken", { enumerable: !0, get: function () { return a.createToken; } }), Object.defineProperty(t, "createTokenInstance", { enumerable: !0, get: function () { return a.createTokenInstance; } }), Object.defineProperty(t, "EOF", { enumerable: !0, get: function () { return a.EOF; } }), Object.defineProperty(t, "tokenLabel", { enumerable: !0, get: function () { return a.tokenLabel; } }), Object.defineProperty(t, "tokenMatcher", { enumerable: !0, get: function () { return a.tokenMatcher; } }), Object.defineProperty(t, "tokenName", { enumerable: !0, get: function () { return a.tokenName; } });
    var s = r(1007);
    Object.defineProperty(t, "defaultParserErrorProvider", { enumerable: !0, get: function () { return s.defaultParserErrorProvider; } });
    var u = r(643);
    Object.defineProperty(t, "EarlyExitException", { enumerable: !0, get: function () { return u.EarlyExitException; } }), Object.defineProperty(t, "isRecognitionException", { enumerable: !0, get: function () { return u.isRecognitionException; } }), Object.defineProperty(t, "MismatchedTokenException", { enumerable: !0, get: function () { return u.MismatchedTokenException; } }), Object.defineProperty(t, "NotAllInputParsedException", { enumerable: !0, get: function () { return u.NotAllInputParsedException; } }), Object.defineProperty(t, "NoViableAltException", { enumerable: !0, get: function () { return u.NoViableAltException; } });
    var c = r(495);
    Object.defineProperty(t, "defaultLexerErrorProvider", { enumerable: !0, get: function () { return c.defaultLexerErrorProvider; } });
    var l = r(7729);
    Object.defineProperty(t, "Alternation", { enumerable: !0, get: function () { return l.Alternation; } }), Object.defineProperty(t, "Alternative", { enumerable: !0, get: function () { return l.Alternative; } }), Object.defineProperty(t, "NonTerminal", { enumerable: !0, get: function () { return l.NonTerminal; } }), Object.defineProperty(t, "Option", { enumerable: !0, get: function () { return l.Option; } }), Object.defineProperty(t, "Repetition", { enumerable: !0, get: function () { return l.Repetition; } }), Object.defineProperty(t, "RepetitionMandatory", { enumerable: !0, get: function () { return l.RepetitionMandatory; } }), Object.defineProperty(t, "RepetitionMandatoryWithSeparator", { enumerable: !0, get: function () { return l.RepetitionMandatoryWithSeparator; } }), Object.defineProperty(t, "RepetitionWithSeparator", { enumerable: !0, get: function () { return l.RepetitionWithSeparator; } }), Object.defineProperty(t, "Rule", { enumerable: !0, get: function () { return l.Rule; } }), Object.defineProperty(t, "Terminal", { enumerable: !0, get: function () { return l.Terminal; } });
    var f = r(7729);
    Object.defineProperty(t, "serializeGrammar", { enumerable: !0, get: function () { return f.serializeGrammar; } }), Object.defineProperty(t, "serializeProduction", { enumerable: !0, get: function () { return f.serializeProduction; } }), Object.defineProperty(t, "GAstVisitor", { enumerable: !0, get: function () { return f.GAstVisitor; } });
    var p = r(8962);
    Object.defineProperty(t, "generateCstDts", { enumerable: !0, get: function () { return p.generateCstDts; } }), t.clearCache = function () { console.warn("The clearCache function was 'soft' removed from the Chevrotain API.\n\t It performs no action other than printing this message.\n\t Please avoid using it as it will be completely removed in the future"); };
    var d = r(5781);
    Object.defineProperty(t, "createSyntaxDiagramsCode", { enumerable: !0, get: function () { return d.createSyntaxDiagramsCode; } });
    t.Parser = function () { throw new Error("The Parser class has been deprecated, use CstParser or EmbeddedActionsParser instead.\t\nSee: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_7-0-0"); };
})(), n; })(); }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5167:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MultipleLineComment = exports.Comment = exports.WhiteSpace = exports.StringLiteral = exports.QuotedString = exports.DataLiteral = exports.Colon = exports.Separator = exports.Terminator = exports.ArrayEnd = exports.ArrayStart = exports.ObjectEnd = exports.ObjectStart = void 0;
const chevrotain_1 = __nccwpck_require__(8613);
const unicode_1 = __nccwpck_require__(1730);
exports.ObjectStart = (0, chevrotain_1.createToken)({ name: "OpenBracket", pattern: /{/ });
exports.ObjectEnd = (0, chevrotain_1.createToken)({ name: "CloseBracket", pattern: /}/ });
exports.ArrayStart = (0, chevrotain_1.createToken)({ name: "ArrayStart", pattern: /\(/ });
exports.ArrayEnd = (0, chevrotain_1.createToken)({ name: "ArrayEnd", pattern: /\)/ });
exports.Terminator = (0, chevrotain_1.createToken)({ name: "Terminator", pattern: /;/ });
exports.Separator = (0, chevrotain_1.createToken)({ name: "Separator", pattern: /,/ });
exports.Colon = (0, chevrotain_1.createToken)({ name: "Colon", pattern: /=/ });
function matchQuotedString(text, startOffset) {
    let quote = text.charAt(startOffset);
    if (quote !== `'` && quote !== `"`) {
        return null;
    }
    const reg = new RegExp(`${quote}(?:[^\\\\${quote}]|\\\\(?:[bfnrtv${quote}\\\\/]|u[0-9a-fA-F]{4}))*${quote}`, "y");
    // using 'y' sticky flag (Note it is not supported on IE11...)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
    reg.lastIndex = startOffset;
    // Note that just because we are using a custom token pattern
    // Does not mean we cannot implement it using JavaScript Regular Expressions...
    const execResult = reg.exec(text);
    if (execResult !== null) {
        const fullMatch = execResult[0];
        // compute the payload
        // const matchWithOutQuotes = fullMatch.substring(1, fullMatch.length - 1);
        // const matchWithOutQuotes = JSON.stringify(
        //   fullMatch.substring(1, fullMatch.length - 1)
        // );
        const matchWithOutQuotes = (0, unicode_1.stripQuotes)(fullMatch.substring(1, fullMatch.length - 1));
        // attach the payload
        // @ts-expect-error
        execResult.payload = matchWithOutQuotes;
    }
    return execResult;
}
const dataLiteralPattern = /<[0-9a-fA-F\s]+>/y;
function matchData(text, startOffset) {
    if (text.charAt(startOffset) !== `<`) {
        return null;
    }
    // using 'y' sticky flag (Note it is not supported on IE11...)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
    dataLiteralPattern.lastIndex = startOffset;
    // Note that just because we are using a custom token pattern
    // Does not mean we cannot implement it using JavaScript Regular Expressions...
    const execResult = dataLiteralPattern.exec(text);
    if (execResult !== null) {
        const fullMatch = execResult[0];
        // compute the payload
        const matchWithOutQuotes = fullMatch
            .substring(1, fullMatch.length - 2)
            .trim();
        // attach the payload
        // @ts-expect-error
        execResult.payload = Buffer.from(matchWithOutQuotes);
        // TODO: validate buffer (even number)
    }
    return execResult;
}
exports.DataLiteral = (0, chevrotain_1.createToken)({
    name: "DataLiteral",
    pattern: { exec: matchData },
    line_breaks: false,
    start_chars_hint: [`<`],
});
exports.QuotedString = (0, chevrotain_1.createToken)({
    name: "QuotedString",
    pattern: { exec: matchQuotedString },
    line_breaks: false,
    // Optional property that will enable optimizations in the lexer
    // See: https://chevrotain.io/documentation/10_1_2/interfaces/itokenconfig.html#start_chars_hint
    start_chars_hint: [`"`, `'`],
});
exports.StringLiteral = (0, chevrotain_1.createToken)({
    name: "StringLiteral",
    pattern: /[\w_$/:.-]+/,
    line_breaks: false,
});
exports.WhiteSpace = (0, chevrotain_1.createToken)({
    name: "WhiteSpace",
    pattern: /[ \t\n\r]+/u,
    // pattern: /[ \t\n\r\x0A\x0D\u{2028}\u{2029}\x09\x0B\x0C\x20]+/u,
    group: chevrotain_1.Lexer.SKIPPED,
});
const AbsComment = (0, chevrotain_1.createToken)({ name: "AbsComment", pattern: chevrotain_1.Lexer.NA });
exports.Comment = (0, chevrotain_1.createToken)({
    name: "Comment",
    pattern: /\/\/.*/,
    categories: AbsComment,
    group: chevrotain_1.Lexer.SKIPPED,
});
exports.MultipleLineComment = (0, chevrotain_1.createToken)({
    name: "MultipleLineComment",
    pattern: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//,
    categories: AbsComment,
    // note that comments could span multiple lines.
    // forgetting to enable this flag will cause inaccuracies in the lexer location tracking.
    line_breaks: true,
    group: chevrotain_1.Lexer.SKIPPED,
});
// Labels only affect error messages and Diagrams.
exports.ObjectStart.LABEL = "'{'";
exports.ObjectEnd.LABEL = "'}'";
exports.ArrayStart.LABEL = "'('";
exports.ArrayEnd.LABEL = "')'";
exports.Terminator.LABEL = "';'";
exports.Colon.LABEL = "'='";
exports.Separator.LABEL = "','";
exports["default"] = [
    // the order is important !!!!
    exports.WhiteSpace,
    // Comments
    exports.Comment,
    exports.MultipleLineComment,
    // etc..
    exports.ObjectStart,
    exports.ObjectEnd,
    exports.ArrayStart,
    exports.ArrayEnd,
    exports.Terminator,
    exports.Separator,
    exports.Colon,
    // Data Types
    exports.DataLiteral,
    exports.QuotedString,
    exports.StringLiteral,
];
//# sourceMappingURL=identifiers.js.map

/***/ }),

/***/ 1304:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lexer = exports.tokens = exports.tokenVocabulary = void 0;
const chevrotain_1 = __nccwpck_require__(8613);
const identifiers_1 = __importDefault(__nccwpck_require__(5167));
// the vocabulary will be exported and used in the Parser definition.
exports.tokenVocabulary = {};
// The order of tokens is important
exports.tokens = [...identifiers_1.default];
exports.lexer = new chevrotain_1.Lexer(exports.tokens);
exports.tokens.forEach((tokenType) => {
    exports.tokenVocabulary[tokenType.name] = tokenType;
});
//# sourceMappingURL=lexer.js.map

/***/ }),

/***/ 4140:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parse = exports.htmlText = exports.serializedGrammar = exports.BaseVisitor = exports.PbxprojParser = exports.CommentCstParser = void 0;
const chevrotain_1 = __nccwpck_require__(8613);
const identifiers_1 = __nccwpck_require__(5167);
const lexer_1 = __nccwpck_require__(1304);
class CommentCstParser extends chevrotain_1.CstParser {
    LA(howMuch) {
        // Skip Comments during regular parsing as we wish to auto-magically insert them
        // into our CST
        while ((0, chevrotain_1.tokenMatcher)(super.LA(howMuch), identifiers_1.Comment)) {
            // @ts-expect-error
            super.consumeToken();
        }
        return super.LA(howMuch);
    }
    cstPostTerminal(key, consumedToken) {
        // @ts-expect-error
        super.cstPostTerminal(key, consumedToken);
        let lookBehindIdx = -1;
        let prevToken = super.LA(lookBehindIdx);
        // After every Token (terminal) is successfully consumed
        // We will add all the comment that appeared before it to the CST (Parse Tree)
        while ((0, chevrotain_1.tokenMatcher)(prevToken, identifiers_1.Comment)) {
            // @ts-expect-error
            super.cstPostTerminal(identifiers_1.Comment.name, prevToken);
            lookBehindIdx--;
            prevToken = super.LA(lookBehindIdx);
        }
    }
}
exports.CommentCstParser = CommentCstParser;
class PbxprojParser extends CommentCstParser {
    constructor() {
        super(lexer_1.tokens, {
            recoveryEnabled: false,
        });
        this.head = this.RULE("head", () => {
            this.OR([
                { ALT: () => this.SUBRULE(this.array) },
                { ALT: () => this.SUBRULE(this.object) },
            ]);
        });
        this.array = this.RULE("array", () => {
            this.CONSUME(identifiers_1.ArrayStart);
            this.OPTION(() => {
                this.MANY(() => {
                    this.SUBRULE(this.value);
                    this.OPTION2(() => this.CONSUME(identifiers_1.Separator));
                });
            });
            this.CONSUME(identifiers_1.ArrayEnd);
        });
        this.object = this.RULE("object", () => {
            this.CONSUME(identifiers_1.ObjectStart);
            this.OPTION(() => {
                this.MANY(() => {
                    this.SUBRULE(this.objectItem);
                });
            });
            this.CONSUME(identifiers_1.ObjectEnd);
        });
        this.objectItem = this.RULE("objectItem", () => {
            this.SUBRULE(this.identifier);
            this.CONSUME(identifiers_1.Colon);
            this.SUBRULE(this.value);
            this.CONSUME(identifiers_1.Terminator);
        });
        this.identifier = this.RULE("identifier", () => {
            this.OR([
                { ALT: () => this.CONSUME(identifiers_1.QuotedString) },
                { ALT: () => this.CONSUME(identifiers_1.StringLiteral) },
            ]);
        });
        this.value = this.RULE("value", () => {
            this.OR([
                { ALT: () => this.SUBRULE(this.object) },
                { ALT: () => this.SUBRULE(this.array) },
                { ALT: () => this.CONSUME(identifiers_1.DataLiteral) },
                { ALT: () => this.SUBRULE(this.identifier) },
            ]);
        });
        // very important to call this after all the rules have been setup.
        // otherwise the parser may not work correctly as it will lack information
        // derived from the self analysis.
        this.performSelfAnalysis();
    }
}
exports.PbxprojParser = PbxprojParser;
const parser = new PbxprojParser();
exports.BaseVisitor = parser.getBaseCstVisitorConstructorWithDefaults();
exports.serializedGrammar = parser.getSerializedGastProductions();
exports.htmlText = (0, chevrotain_1.createSyntaxDiagramsCode)(exports.serializedGrammar);
function parse(text) {
    const lexingResult = lexer_1.lexer.tokenize(text);
    if (lexingResult.errors.length) {
        throw new Error(`Parsing errors: ${lexingResult.errors[0].message}`);
    }
    parser.input = lexingResult.tokens;
    const parsingResult = parser.head();
    if (parser.errors.length) {
        throw new Error(`Parsing errors: ${parser.errors[0].message}`);
    }
    return parsingResult;
}
exports.parse = parse;
//# sourceMappingURL=parser.js.map

/***/ }),

/***/ 4517:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isPBXFileReference = exports.isPBXBuildFile = exports.createReferenceList = void 0;
/** Create a list of <UUID, Comment> */
function createReferenceList(project) {
    const strict = false;
    const objects = project?.objects ?? {};
    const referenceCache = {};
    function getXCConfigurationListComment(id) {
        for (const [innerId, obj] of Object.entries(objects)) {
            if (obj.buildConfigurationList === id) {
                let name = obj.name ?? obj.path ?? obj.productName;
                if (!name) {
                    name = objects[obj.targets?.[0]]?.name;
                    if (!name) {
                        // NOTE(EvanBacon): I have no idea what I'm doing...
                        // this is for the case where the build configuration list is pointing to the main `PBXProject` object (no name).
                        // We locate the proxy (which may or may not be related) and use the remoteInfo property.
                        const proxy = Object.values(objects).find((obj) => obj.isa === "PBXContainerItemProxy" &&
                            obj.containerPortal === innerId);
                        name = proxy?.remoteInfo;
                    }
                }
                return `Build configuration list for ${obj.isa} "${name}"`;
            }
        }
        return `Build configuration list for [unknown]`;
    }
    function getBuildPhaseNameContainingFile(buildFileId) {
        const buildPhase = Object.values(objects).find((obj) => obj.files?.includes(buildFileId));
        return buildPhase ? getBuildPhaseName(buildPhase) : null;
    }
    function getPBXBuildFileComment(id, buildFile) {
        const buildPhaseName = getBuildPhaseNameContainingFile(id) ?? "[missing build phase]";
        const name = getCommentForObject(buildFile.fileRef, objects[buildFile.fileRef]);
        return `${name} in ${buildPhaseName}`;
    }
    function getCommentForObject(id, object) {
        if (!object?.isa) {
            return null;
        }
        if (id in referenceCache) {
            return referenceCache[id];
        }
        if (isPBXBuildFile(object)) {
            referenceCache[id] = getPBXBuildFileComment(id, object);
        }
        else if (isXCConfigurationList(object)) {
            referenceCache[id] = getXCConfigurationListComment(id);
        }
        else if (isPBXProject(object)) {
            referenceCache[id] = "Project object";
        }
        else if (object.isa?.endsWith("BuildPhase")) {
            referenceCache[id] = getBuildPhaseName(object) ?? "";
        }
        else {
            referenceCache[id] = object.name ?? object.path ?? object.isa ?? null;
        }
        return referenceCache[id] ?? null;
    }
    Object.entries(objects).forEach(([id, object]) => {
        if (id === project.rootObject) {
            return;
        }
        if (!getCommentForObject(id, object)) {
            if (strict)
                throw new Error("Failed to find comment reference for ID: " +
                    id +
                    ", isa: " +
                    object.isa);
        }
    });
    return referenceCache;
}
exports.createReferenceList = createReferenceList;
function isPBXProject(val) {
    return val?.isa === "PBXProject";
}
function isPBXBuildFile(val) {
    return val?.isa === "PBXBuildFile";
}
exports.isPBXBuildFile = isPBXBuildFile;
function isPBXFileReference(val) {
    return val?.isa === "PBXFileReference";
}
exports.isPBXFileReference = isPBXFileReference;
function isXCConfigurationList(val) {
    return val?.isa === "XCConfigurationList";
}
function getBuildPhaseName(buildPhase) {
    return buildPhase.name ?? getDefaultBuildPhaseName(buildPhase.isa);
}
/** Return the default name for a build phase object based on the `isa` */
function getDefaultBuildPhaseName(isa) {
    return isa.match(/PBX([a-zA-Z]+)BuildPhase/)?.[1] ?? null;
}
//# sourceMappingURL=referenceBuilder.js.map

/***/ }),

/***/ 1086:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ISA = void 0;
/** Elements: http://www.monobjc.net/xcode-project-file-format.html */
var ISA;
(function (ISA) {
    ISA["PBXBuildFile"] = "PBXBuildFile";
    ISA["PBXBuildPhase"] = "PBXBuildPhase";
    /*-*/ ISA["PBXAppleScriptBuildPhase"] = "PBXAppleScriptBuildPhase";
    /*-*/ ISA["PBXCopyFilesBuildPhase"] = "PBXCopyFilesBuildPhase";
    /*-*/ ISA["PBXFrameworksBuildPhase"] = "PBXFrameworksBuildPhase";
    /*-*/ ISA["PBXHeadersBuildPhase"] = "PBXHeadersBuildPhase";
    /*-*/ ISA["PBXResourcesBuildPhase"] = "PBXResourcesBuildPhase";
    /*-*/ ISA["PBXShellScriptBuildPhase"] = "PBXShellScriptBuildPhase";
    /*-*/ ISA["PBXSourcesBuildPhase"] = "PBXSourcesBuildPhase";
    ISA["PBXContainerItemProxy"] = "PBXContainerItemProxy";
    ISA["PBXFileElement"] = "PBXFileElement";
    /*-*/ ISA["PBXFileReference"] = "PBXFileReference";
    /*-*/ ISA["PBXGroup"] = "PBXGroup";
    /*-*/ ISA["PBXVariantGroup"] = "PBXVariantGroup";
    ISA["PBXTarget"] = "PBXTarget";
    /*-*/ ISA["PBXAggregateTarget"] = "PBXAggregateTarget";
    /*-*/ ISA["PBXLegacyTarget"] = "PBXLegacyTarget";
    /*-*/ ISA["PBXNativeTarget"] = "PBXNativeTarget";
    ISA["PBXProject"] = "PBXProject";
    ISA["PBXTargetDependency"] = "PBXTargetDependency";
    ISA["XCBuildConfiguration"] = "XCBuildConfiguration";
    ISA["XCConfigurationList"] = "XCConfigurationList";
})(ISA = exports.ISA || (exports.ISA = {}));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 5625:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NEXT_STEP_MAPPING = void 0;
// https://github.com/CocoaPods/Nanaimo/blob/master/lib/nanaimo/unicode/next_step_mapping.rb
// Taken from http://ftp.unicode.org/Public/MAPPINGS/VENDORS/NEXT/NEXTSTEP.TXT
exports.NEXT_STEP_MAPPING = Object.freeze({
    [0x80]: 0x00a0,
    [0x81]: 0x00c0,
    [0x82]: 0x00c1,
    [0x83]: 0x00c2,
    [0x84]: 0x00c3,
    [0x85]: 0x00c4,
    [0x86]: 0x00c5,
    [0x87]: 0x00c7,
    [0x88]: 0x00c8,
    [0x89]: 0x00c9,
    [0x8a]: 0x00ca,
    [0x8b]: 0x00cb,
    [0x8c]: 0x00cc,
    [0x8d]: 0x00cd,
    [0x8e]: 0x00ce,
    [0x8f]: 0x00cf,
    [0x90]: 0x00d0,
    [0x91]: 0x00d1,
    [0x92]: 0x00d2,
    [0x93]: 0x00d3,
    [0x94]: 0x00d4,
    [0x95]: 0x00d5,
    [0x96]: 0x00d6,
    [0x97]: 0x00d9,
    [0x98]: 0x00da,
    [0x99]: 0x00db,
    [0x9a]: 0x00dc,
    [0x9b]: 0x00dd,
    [0x9c]: 0x00de,
    [0x9d]: 0x00b5,
    [0x9e]: 0x00d7,
    [0x9f]: 0x00f7,
    [0xa0]: 0x00a9,
    [0xa1]: 0x00a1,
    [0xa2]: 0x00a2,
    [0xa3]: 0x00a3,
    [0xa4]: 0x2044,
    [0xa5]: 0x00a5,
    [0xa6]: 0x0192,
    [0xa7]: 0x00a7,
    [0xa8]: 0x00a4,
    [0xa9]: 0x2019,
    [0xaa]: 0x201c,
    [0xab]: 0x00ab,
    [0xac]: 0x2039,
    [0xad]: 0x203a,
    [0xae]: 0xfb01,
    [0xaf]: 0xfb02,
    [0xb0]: 0x00ae,
    [0xb1]: 0x2013,
    [0xb2]: 0x2020,
    [0xb3]: 0x2021,
    [0xb4]: 0x00b7,
    [0xb5]: 0x00a6,
    [0xb6]: 0x00b6,
    [0xb7]: 0x2022,
    [0xb8]: 0x201a,
    [0xb9]: 0x201e,
    [0xba]: 0x201d,
    [0xbb]: 0x00bb,
    [0xbc]: 0x2026,
    [0xbd]: 0x2030,
    [0xbe]: 0x00ac,
    [0xbf]: 0x00bf,
    [0xc0]: 0x00b9,
    [0xc1]: 0x02cb,
    [0xc2]: 0x00b4,
    [0xc3]: 0x02c6,
    [0xc4]: 0x02dc,
    [0xc5]: 0x00af,
    [0xc6]: 0x02d8,
    [0xc7]: 0x02d9,
    [0xc8]: 0x00a8,
    [0xc9]: 0x00b2,
    [0xca]: 0x02da,
    [0xcb]: 0x00b8,
    [0xcc]: 0x00b3,
    [0xcd]: 0x02dd,
    [0xce]: 0x02db,
    [0xcf]: 0x02c7,
    [0xd0]: 0x2014,
    [0xd1]: 0x00b1,
    [0xd2]: 0x00bc,
    [0xd3]: 0x00bd,
    [0xd4]: 0x00be,
    [0xd5]: 0x00e0,
    [0xd6]: 0x00e1,
    [0xd7]: 0x00e2,
    [0xd8]: 0x00e3,
    [0xd9]: 0x00e4,
    [0xda]: 0x00e5,
    [0xdb]: 0x00e7,
    [0xdc]: 0x00e8,
    [0xdd]: 0x00e9,
    [0xde]: 0x00ea,
    [0xdf]: 0x00eb,
    [0xe0]: 0x00ec,
    [0xe1]: 0x00c6,
    [0xe2]: 0x00ed,
    [0xe3]: 0x00aa,
    [0xe4]: 0x00ee,
    [0xe5]: 0x00ef,
    [0xe6]: 0x00f0,
    [0xe7]: 0x00f1,
    [0xe8]: 0x0141,
    [0xe9]: 0x00d8,
    [0xea]: 0x0152,
    [0xeb]: 0x00ba,
    [0xec]: 0x00f2,
    [0xed]: 0x00f3,
    [0xee]: 0x00f4,
    [0xef]: 0x00f5,
    [0xf0]: 0x00f6,
    [0xf1]: 0x00e6,
    [0xf2]: 0x00f9,
    [0xf3]: 0x00fa,
    [0xf4]: 0x00fb,
    [0xf5]: 0x0131,
    [0xf6]: 0x00fc,
    [0xf7]: 0x00fd,
    [0xf8]: 0x0142,
    [0xf9]: 0x00f8,
    [0xfa]: 0x0153,
    [0xfb]: 0x00df,
    [0xfc]: 0x00fe,
    [0xfd]: 0x00ff,
    [0xfe]: 0xfffd,
    [0xff]: 0xfffd, // .notdef, REPLACEMENT CHARACTER
});
//# sourceMappingURL=NextStepMapping.js.map

/***/ }),

/***/ 699:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QUOTE_REGEXP = exports.UNQUOTE_MAP = exports.QUOTE_MAP = void 0;
exports.QUOTE_MAP = Object.freeze({
    [`\a`]: "\\a",
    "\b": "\\b",
    "\f": "\\f",
    "\r": "\\r",
    "\t": "\\t",
    "\v": "\\v",
    "\n": "\\n",
    '"': '\\"',
    "\\": "\\\\",
    "\x00": "\\U0000",
    "\x01": "\\U0001",
    "\x02": "\\U0002",
    "\x03": "\\U0003",
    "\x04": "\\U0004",
    "\x05": "\\U0005",
    "\x06": "\\U0006",
    "\x0E": "\\U000e",
    "\x0F": "\\U000f",
    "\x10": "\\U0010",
    "\x11": "\\U0011",
    "\x12": "\\U0012",
    "\x13": "\\U0013",
    "\x14": "\\U0014",
    "\x15": "\\U0015",
    "\x16": "\\U0016",
    "\x17": "\\U0017",
    "\x18": "\\U0018",
    "\x19": "\\U0019",
    "\x1A": "\\U001a",
    [`\e`]: "\\U001b",
    "\x1C": "\\U001c",
    "\x1D": "\\U001d",
    "\x1E": "\\U001e",
    "\x1F": "\\U001f",
});
exports.UNQUOTE_MAP = Object.freeze({
    a: `\a`,
    b: "\b",
    f: "\f",
    n: "\n",
    r: "\r",
    t: "\t",
    v: "\v",
    "\n": "\n",
    '"': `\"`,
    "'": `\'`,
    // ... U
    "\\": "\\",
});
exports.QUOTE_REGEXP = /\x07|\x08|\f|\r|\t|\v|\n|"|\\|\x00|\x01|\x02|\x03|\x04|\x05|\x06|\x0E|\x0F|\x10|\x11|\x12|\x13|\x14|\x15|\x16|\x17|\x18|\x19|\x1A|\x1B|\x1C|\x1D|\x1E|\x1F/g;
//# sourceMappingURL=QuoteMaps.js.map

/***/ }),

/***/ 1730:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stripQuotes = exports.addQuotes = void 0;
const NextStepMapping_1 = __nccwpck_require__(5625);
const QuoteMaps_1 = __nccwpck_require__(699);
function addQuotes(string) {
    return string.replace(QuoteMaps_1.QUOTE_REGEXP, (sub) => {
        return QuoteMaps_1.QUOTE_MAP[sub];
    });
}
exports.addQuotes = addQuotes;
const OCTAL_DIGITS = "01234567".split("");
const ESCAPE_PREFIXES = [
    ...OCTAL_DIGITS,
    "a",
    "b",
    "f",
    "n",
    "r",
    "t",
    "v",
    `\"`,
    "\n",
    "U",
    "\\",
];
// Credit to Samantha Marshall
// Taken from https://github.com/samdmarshall/pbPlist/blob/346c29f91f913d35d0e24f6722ec19edb24e5707/pbPlist/StrParse.py#L197
// Licensed under https://raw.githubusercontent.com/samdmarshall/pbPlist/blob/346c29f91f913d35d0e24f6722ec19edb24e5707/LICENSE
//
// Originally from: http://www.opensource.apple.com/source/CF/CF-744.19/CFOldStylePList.c See `getSlashedChar()`
function stripQuotes(input) {
    let formattedString = "";
    let extractedString = input;
    let stringLength = input.length;
    let index = 0;
    while (index < stringLength) {
        let currentChar = extractedString[index];
        if (currentChar === `\\`) {
            let nextChar = extractedString[index + 1];
            if (ESCAPE_PREFIXES.includes(nextChar)) {
                index++;
                if (QuoteMaps_1.UNQUOTE_MAP[nextChar]) {
                    formattedString += QuoteMaps_1.UNQUOTE_MAP[nextChar];
                }
                else if (nextChar === "U") {
                    const startingIndex = index + 1;
                    const endingIndex = startingIndex + 4;
                    const unicodeNumbers = extractedString.slice(startingIndex, endingIndex);
                    for (const number in unicodeNumbers.split("")) {
                        index += 1;
                        if (!isHexNumber(number)) {
                            // let message = 'Invalid unicode sequence on line '+str(LineNumberForIndex(string_data, start_index+index))
                            throw new Error(`Unicode '\\U' escape sequence terminated without 4 following hex characters`);
                        }
                        formattedString += String.fromCharCode(parseInt(unicodeNumbers, 16));
                    }
                }
                else if (OCTAL_DIGITS.includes(nextChar)) {
                    const octalString = extractedString.slice(index - 1, 3);
                    if (/\\A[0-7]{3}\\z/.test(octalString)) {
                        let startingIndex = index;
                        let endingIndex = startingIndex + 1;
                        for (let octIndex = 0; octIndex < 3; octIndex++) {
                            let test_index = startingIndex + octIndex;
                            let test_oct = extractedString[test_index];
                            if (OCTAL_DIGITS.includes(test_oct)) {
                                endingIndex += 1;
                            }
                        }
                        let octalNumbers = extractedString.slice(startingIndex, endingIndex);
                        let hexNumber = parseInt(octalNumbers, 8);
                        if (hexNumber >= 0x80) {
                            // @ts-ignore
                            hexNumber = NextStepMapping_1.NEXT_STEP_MAPPING[hexNumber];
                        }
                        formattedString += String.fromCharCode(hexNumber);
                    }
                    else {
                        formattedString += nextChar;
                    }
                }
                else {
                    throw new Error(`Failed to handle ${nextChar} which is in the list of possible escapes`);
                }
            }
            else {
                formattedString += currentChar;
                index++;
                formattedString += nextChar;
            }
        }
        else {
            formattedString += currentChar;
        }
        index++;
    }
    return formattedString;
}
exports.stripQuotes = stripQuotes;
function isHexNumber(number) {
    return /^[0-9a-fA-F]$/.test(number);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5198:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContextVisitor = void 0;
const parser_1 = __nccwpck_require__(4140);
/** Converts a CST for `pbxproj` into a JSON representation. */
class ContextVisitor extends parser_1.BaseVisitor {
    constructor() {
        super();
        this.context = {};
        // The "validateVisitor" method is a helper utility which performs static analysis
        // to detect missing or redundant visitor methods
        this.validateVisitor();
    }
    head(ctx) {
        if (ctx.array) {
            this.context = this.visit(ctx.array);
        }
        else if (ctx.object) {
            this.context = this.visit(ctx.object);
        }
    }
    object(ctx) {
        return (ctx.objectItem?.reduce((prev, item) => ({
            ...prev,
            ...this.visit(item),
        }), {}) ?? {});
    }
    array(ctx) {
        return ctx.value?.map((item) => this.visit(item)) ?? [];
    }
    objectItem(ctx) {
        return {
            [this.visit(ctx.identifier)]: this.visit(ctx.value),
        };
    }
    identifier(ctx) {
        // console.log("id:", ctx);
        if (ctx.QuotedString) {
            return ctx.QuotedString[0].payload ?? ctx.QuotedString[0].image;
        }
        else if (ctx.StringLiteral) {
            return ctx.StringLiteral[0].payload ?? ctx.StringLiteral[0].image;
        }
        throw new Error("unhandled: " + ctx);
    }
    value(ctx) {
        if (ctx.identifier) {
            return this.visit(ctx.identifier);
        }
        else if (ctx.DataLiteral) {
            return ctx.DataLiteral[0].payload ?? ctx.DataLiteral[0].image;
        }
        else if (ctx.object) {
            return this.visit(ctx.object);
        }
        else if (ctx.array) {
            return this.visit(ctx.array);
        }
        throw new Error("unhandled: " + ctx);
    }
}
exports.ContextVisitor = ContextVisitor;
//# sourceMappingURL=contextVisitor.js.map

/***/ }),

/***/ 1368:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Writer = void 0;
const referenceBuilder_1 = __nccwpck_require__(4517);
const unicode_1 = __nccwpck_require__(1730);
let EOL = "\n";
try {
    EOL = (__nccwpck_require__(2037).EOL);
}
catch { }
function isObject(value) {
    return (typeof value === "object" && value !== null && !(value instanceof Buffer));
}
/** Ensure string values that use invalid characters are wrapped in quotes. */
function ensureQuotes(value) {
    value = (0, unicode_1.addQuotes)(value);
    // Seems like no hyphen is the wehhh
    if (/^[\w_$/:.]+$/.test(value)) {
        //   if (/^[\w_$/:.-]+$/.test(value)) {
        return value;
    }
    return `"${value}"`;
}
// TODO: How to handle buffer? <xx xx xx>
function formatData(data) {
    return `<${data.toString()}>`;
}
function getSortedObjects(objects) {
    const sorted = {};
    // sort by isa
    Object.entries(objects).forEach(([id, object]) => {
        if (!sorted[object.isa]) {
            sorted[object.isa] = [];
        }
        sorted[object.isa].push([id, object]);
    });
    // alphabetize by isa like Xcode
    return Object.entries(sorted).sort();
}
class Writer {
    constructor(project, options = {}) {
        this.project = project;
        this.options = options;
        this.indent = 0;
        this.contents = "";
        this.comments = {};
        this.comments = (0, referenceBuilder_1.createReferenceList)(project);
        this.writeShebang();
        this.writeProject();
    }
    pad(x) {
        // \t might also work...
        const tab = this.options.tab ?? "\t";
        return x > 0 ? tab + this.pad(x - 1) : "";
        // return x > 0 ? "    " + pad(x - 1) : "";
    }
    getResults() {
        return this.contents;
    }
    println(string) {
        this.contents += this.pad(this.indent);
        this.contents += string;
        this.contents += EOL;
    }
    write(string) {
        this.contents += this.pad(this.indent);
        this.contents += string;
    }
    printAssignLn(key, value) {
        return this.println(key + " = " + value + ";");
    }
    flush(string) {
        const current = this.indent;
        this.indent = 0;
        this.write(string);
        this.indent = current;
    }
    writeShebang() {
        const headComment = this.options?.shebang ?? "!$*UTF8*$!";
        this.println(`// ${headComment}`);
    }
    /** Format ID with optional comment reference. */
    formatId(id, cmt = this.comments[id]) {
        if (cmt) {
            // 13B07F961A680F5B00A75B9A /* yolo87.app */
            return `${id} /* ${cmt} */`;
        }
        // If there is no reference then we might need to wrap with quotes.
        return ensureQuotes(id);
    }
    writeProject() {
        this.println("{");
        if (this.project) {
            this.indent++;
            this.writeObject(this.project, true);
            this.indent--;
        }
        this.println("}");
    }
    writeObject(object, isBase) {
        Object.entries(object).forEach(([key, value]) => {
            if (this.options.skipNullishValues && value == null) {
                return;
            }
            else if (value instanceof Buffer) {
                this.printAssignLn(ensureQuotes(key), formatData(value));
            }
            else if (Array.isArray(value)) {
                this.writeArray(key, value);
            }
            else if (isObject(value)) {
                // Deeper empty objects should be inlined.
                if (!isBase && !Object.keys(value).length) {
                    this.println(ensureQuotes(key) + " = {};");
                    return;
                }
                this.println(ensureQuotes(key) + " = {");
                this.indent++;
                if (isBase && key === "objects") {
                    this.writePbxObjects(value);
                }
                else {
                    this.writeObject(value, isBase);
                }
                this.indent--;
                this.println("};");
            }
            else {
                this.printAssignLn(ensureQuotes(key), key === "remoteGlobalIDString"
                    ? ensureQuotes(value)
                    : this.formatId(value));
            }
        });
    }
    writePbxObjects(projectObjects) {
        getSortedObjects(projectObjects).forEach(([isa, objects]) => {
            this.flush(EOL);
            this.flush(`/* Begin ${isa} section */` + EOL);
            objects.forEach(([id, obj]) => this.writeObjectInclusive(id, obj));
            this.flush(`/* End ${isa} section */` + EOL);
        });
    }
    writeArray(key, value) {
        this.println(ensureQuotes(key) + " = (");
        this.indent++;
        value.forEach((item) => {
            // TODO: Nested arrays?
            if (item instanceof Buffer) {
                this.println(formatData(item) + ",");
            }
            else if (item == null) {
                return;
            }
            else if (isObject(item)) {
                this.println("{");
                if (item) {
                    this.indent++;
                    this.writeObject(item);
                    this.indent--;
                }
                this.println("},");
            }
            else {
                this.println(this.formatId(String(item)) + ",");
            }
        });
        this.indent--;
        this.println(");");
    }
    writeObjectInclusive(key, value) {
        if ((0, referenceBuilder_1.isPBXBuildFile)(value) || (0, referenceBuilder_1.isPBXFileReference)(value)) {
            return this.writeObjectWithoutIndent(key, value);
        }
        this.println(this.formatId(key) + " = {");
        /* foo = { */
        this.indent++;
        /*  */ this.writeObject(value);
        this.indent--;
        /* }; */
        this.println("};");
    }
    writeObjectWithoutIndent(key, value) {
        const line = [];
        const buildInline = (key, value) => {
            line.push(this.formatId(key) + " = {");
            Object.entries(value).forEach(([key, obj]) => {
                if (this.options.skipNullishValues && obj == null) {
                    return;
                }
                else if (obj instanceof Buffer) {
                    line.push(ensureQuotes(key) + " = " + formatData(obj) + "; ");
                }
                else if (Array.isArray(obj)) {
                    line.push(ensureQuotes(key) + " = (");
                    obj.forEach((item) => line.push(ensureQuotes(item) + ", "));
                    line.push("); ");
                }
                else if (isObject(obj)) {
                    buildInline(key, obj);
                }
                else {
                    line.push(ensureQuotes(key) + " = " + this.formatId(obj) + "; ");
                }
            });
            line.push("}; ");
        };
        buildInline(key, value);
        this.println(line.join("").trim());
    }
}
exports.Writer = Writer;
//# sourceMappingURL=writer.js.map

/***/ }),

/***/ 6546:
/***/ ((module) => {

"use strict";

module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}


/***/ }),

/***/ 4851:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  __nccwpck_require__(6546)(Yallist)
} catch (er) {}


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 2081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 1576:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 9512:
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(9602);
const exec = __nccwpck_require__(5082);
const fs = __nccwpck_require__(7147);
const semver = __nccwpck_require__(1256);
const glob = __nccwpck_require__(6760);
const { parse, build } = __nccwpck_require__(5110);

function updateVersion(projectFile, nextVersion, nextBuildNumber) {
  // go through each key value pair in the project file
  for (const key in projectFile.objects) {
    const value = projectFile.objects[key];
    const buildSettings = value?.buildSettings;
    const marketingVer = buildSettings?.MARKETING_VERSION;
    const projectVer = buildSettings?.CURRENT_PROJECT_VERSION;

    if (marketingVer !== undefined) {
      buildSettings.MARKETING_VERSION = nextVersion;
    }

    if (projectVer !== undefined) {
      buildSettings.CURRENT_PROJECT_VERSION = nextBuildNumber;
    }
  }
}

async function run() {
  let version = core.getInput("version");
  const buildNumber = core.getInput("build-number");

  core.info(`Setting Version: ${version}, Build Number: ${buildNumber}`);

  const projFilePath = glob.sync("**/*.pbxproj")[0];
  core.info(`Found Project File Path: ${projFilePath}`);

  const projFile = fs.readFileSync(projFilePath, "utf8");
  const proj = parse(projFile);
  updateVersion(proj, version, buildNumber);
  const newProjFile = build(proj);
  fs.writeFileSync(projFilePath, newProjFile);
}

run();

})();

module.exports = __webpack_exports__;
/******/ })()
;