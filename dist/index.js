/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 188:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 764:
/***/ ((module) => {

module.exports = eval("require")("axios");


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
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nccwpck_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nccwpck_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ../../../.nvm/versions/node/v16.13.1/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?@actions/core
var core = __nccwpck_require__(188);
;// CONCATENATED MODULE: external "child_process"
const external_child_process_namespaceObject = require("child_process");
// EXTERNAL MODULE: ../../../.nvm/versions/node/v16.13.1/lib/node_modules/@vercel/ncc/dist/ncc/@@notfound.js?axios
var _notfoundaxios = __nccwpck_require__(764);
var _notfoundaxios_default = /*#__PURE__*/__nccwpck_require__.n(_notfoundaxios);
;// CONCATENATED MODULE: ./index.js




try {

    const webhook = (0,core.getInput)('webhook');
    const token = (0,core.getInput)('token');
    const senderName = (0,core.getInput)('sender-name');
    const senderImage = (0,core.getInput)('sender-image');
    const title = (0,core.getInput)('title');
    const text = (0,core.getInput)('text');
    // const messageCommit = getInput('message-commit');

    const regexCommit = /[^\#\#\#]*$/gm;
    let m;
    let messageCommit;
    let commitsList = [];

    (0,external_child_process_namespaceObject.exec)('git log -1 --format=%B', (error, stdout, stderr) => {
        messageCommit = stdout;
    });

    while ((m = regexCommit.exec(messageCommit)) !== null) {
        if (m.index === regexCommit.lastIndex) {
            regexCommit.lastIndex++;
        }

        m.forEach((match) => {
            if (match != '')
                commitsList.push(match);
        });
    }

    let slidesData = [];

    for (let index = 2; index < commitsList.length; index++) {

        slidesData.push(parseListToJson(commitsList[index]))

    }

    let cliqMessage = {
        text: text || '',
        bot: {
            "name": senderName || '',
            "image": senderImage || ''
        },
        card: {
            "title": messageCommit || '',
        },
        "slides": slidesData
    }

    _notfoundaxios_default().post(webhook, cliqMessage, {
        params: {
            zapikey: token,
        },
    });

    (0,core.setOutput)('message-json', JSON.stringify(cliqMessage));


} catch (error) {
    (0,core.setFailed)(error.message);
}


function parseListToJson(list) {

    let regex = /[^\*]*$/gm;
    let m;
    let commits = [];

    let template = {
        type: "list",
        title: '',
        data: []
    };

    while ((m = regex.exec(list)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        m.forEach((match) => {
            if (match != '')
                commits.push(match.replace(/\n/g, '').replace('([', '[').replace('))', ')').trim());
        });
    }
    template.title = commits[0];

    for (let index = 1; index < commits.length; index++) {
        template.data.push(commits[index]);
    }

    return JSON.stringify(template);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;