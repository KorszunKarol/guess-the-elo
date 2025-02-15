/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "(app-pages-browser)/./node_modules/stockfish/src/stockfish-nnue-16-single.wasm":
/*!******************************************************************!*\
  !*** ./node_modules/stockfish/src/stockfish-nnue-16-single.wasm ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "static/media/stockfish-nnue-16-single.9e603870.wasm";

/***/ }),

/***/ "(app-pages-browser)/./src/workers/stockfishWorker.ts":
/*!****************************************!*\
  !*** ./src/workers/stockfishWorker.ts ***!
  \****************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/// <reference lib=\"webworker\" />\n// This is a Web Worker file that handles Stockfish analysis\n// It runs in a separate thread to avoid blocking the UI\nlet stockfish = null;\nlet isAnalyzing = false;\n// Initialize Stockfish\nconst initStockfish = async ()=>{\n    try {\n        // Determine the correct path based on environment\n        const basePath =  true ? \"\".concat(self.location.origin, \"/wasm\") : 0;\n        const workerPath = \"\".concat(basePath, \"/stockfish-nnue-16-single.js\");\n        console.log('Loading Stockfish worker from:', workerPath);\n        const engine = new Worker(workerPath, {\n            type: 'module',\n            name: 'stockfish-worker'\n        });\n        // Add this initialization sequence\n        engine.postMessage('uci');\n        engine.postMessage('setoption name Use NNUE value true');\n        engine.postMessage('setoption name Threads value 2');\n        engine.postMessage('isready');\n        // Set up message handler\n        engine.onmessage = (e)=>{\n            const message = e.data;\n            // Parse Stockfish output and send back to main thread\n            if (message.startsWith('info depth')) {\n                const evaluation = parseEvaluation(message);\n                const bestLine = parseBestLine(message);\n                if (evaluation !== null && bestLine) {\n                    self.postMessage({\n                        type: 'analysis',\n                        data: {\n                            evaluation,\n                            line: bestLine\n                        }\n                    });\n                }\n            }\n            // Handle \"bestmove\" messages when analysis is complete\n            if (message.startsWith('bestmove')) {\n                isAnalyzing = false;\n                self.postMessage({\n                    type: 'complete'\n                });\n            }\n        };\n        console.log('Initializing Stockfish worker from:', \"file:///home/karolito/DL/guess-the-elo/frontend/src/workers/stockfishWorker.ts\");\n        console.log('WASM path:', /* asset import */ new __webpack_require__.U(__webpack_require__(/*! stockfish/src/stockfish-nnue-16-single.wasm */ \"(app-pages-browser)/./node_modules/stockfish/src/stockfish-nnue-16-single.wasm\")).href);\n        return engine;\n    } catch (error) {\n        console.error('Stockfish initialization failed:', error);\n        throw error;\n    }\n};\n// Parse evaluation score from Stockfish output\nconst parseEvaluation = (line)=>{\n    const scoreMatch = line.match(/score (cp|mate) (-?\\d+)/);\n    if (!scoreMatch) return null;\n    const [_, type, value] = scoreMatch;\n    if (type === 'cp') {\n        return parseInt(value) / 100;\n    } else {\n        // Handle mate scores\n        return value.startsWith('-') ? -Infinity : Infinity;\n    }\n};\n// Parse best line from Stockfish output\nconst parseBestLine = (line)=>{\n    const moveMatch = line.match(/pv (.+)$/);\n    if (!moveMatch) return null;\n    const moves = moveMatch[1].split(' ');\n    return {\n        move: moves[0],\n        evaluation: 0,\n        sequence: moves\n    };\n};\n// Handle messages from the main thread\nself.onmessage = async (e)=>{\n    const { type, fen, settings } = e.data;\n    if (!stockfish) {\n        stockfish = await initStockfish();\n        if (!stockfish) return; // Exit if initialization failed\n    }\n    switch(type){\n        case 'start':\n            if (fen && stockfish) {\n                isAnalyzing = true;\n                // Update settings if provided\n                if (settings) {\n                    stockfish.postMessage(\"setoption name MultiPV value \".concat(settings.multiPV));\n                    stockfish.postMessage(\"setoption name Threads value \".concat(settings.threads));\n                }\n                // Start analysis\n                stockfish.postMessage('position fen ' + fen);\n                stockfish.postMessage(\"go depth \".concat((settings === null || settings === void 0 ? void 0 : settings.depth) || 20));\n            }\n            break;\n        case 'stop':\n            if (stockfish && isAnalyzing) {\n                stockfish.postMessage('stop');\n                isAnalyzing = false;\n            }\n            break;\n    }\n};\n// Handle worker cleanup\nself.addEventListener('unload', ()=>{\n    if (stockfish) {\n        stockfish.postMessage('quit');\n    }\n});\n\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy93b3JrZXJzL3N0b2NrZmlzaFdvcmtlci50cyIsIm1hcHBpbmdzIjoiO0FBQUEsaUNBQWlDO0FBRWpDLDREQUE0RDtBQUM1RCx3REFBd0Q7QUFleEQsSUFBSUEsWUFBMkI7QUFDL0IsSUFBSUMsY0FBYztBQUVsQix1QkFBdUI7QUFDdkIsTUFBTUMsZ0JBQWdCO0lBQ3BCLElBQUk7UUFDRixrREFBa0Q7UUFDbEQsTUFBTUMsV0FBV0MsS0FBc0MsR0FDbkQsR0FBd0IsT0FBckJDLEtBQUtDLFFBQVEsQ0FBQ0MsTUFBTSxFQUFDLFdBQ3hCLENBQW9CO1FBRXhCLE1BQU1DLGFBQWEsR0FBWSxPQUFUTCxVQUFTO1FBQy9CTSxRQUFRQyxHQUFHLENBQUMsa0NBQWtDRjtRQUU5QyxNQUFNRyxTQUFTLElBQUlDLE9BQU9KLFlBQVk7WUFDcENLLE1BQU07WUFDTkMsTUFBTTtRQUNSO1FBRUEsbUNBQW1DO1FBQ25DSCxPQUFPSSxXQUFXLENBQUM7UUFDbkJKLE9BQU9JLFdBQVcsQ0FBQztRQUNuQkosT0FBT0ksV0FBVyxDQUFDO1FBQ25CSixPQUFPSSxXQUFXLENBQUM7UUFFbkIseUJBQXlCO1FBQ3pCSixPQUFPSyxTQUFTLEdBQUcsQ0FBQ0M7WUFDbEIsTUFBTUMsVUFBVUQsRUFBRUUsSUFBSTtZQUV0QixzREFBc0Q7WUFDdEQsSUFBSUQsUUFBUUUsVUFBVSxDQUFDLGVBQWU7Z0JBQ3BDLE1BQU1DLGFBQWFDLGdCQUFnQko7Z0JBQ25DLE1BQU1LLFdBQVdDLGNBQWNOO2dCQUUvQixJQUFJRyxlQUFlLFFBQVFFLFVBQVU7b0JBQ25DbEIsS0FBS1UsV0FBVyxDQUFDO3dCQUNmRixNQUFNO3dCQUNOTSxNQUFNOzRCQUNKRTs0QkFDQUksTUFBTUY7d0JBQ1I7b0JBQ0Y7Z0JBQ0Y7WUFDRjtZQUVBLHVEQUF1RDtZQUN2RCxJQUFJTCxRQUFRRSxVQUFVLENBQUMsYUFBYTtnQkFDbENuQixjQUFjO2dCQUNkSSxLQUFLVSxXQUFXLENBQUM7b0JBQUVGLE1BQU07Z0JBQVc7WUFDdEM7UUFDRjtRQUVBSixRQUFRQyxHQUFHLENBQUMsdUNBQXVDLGdGQUFlO1FBQ2xFRCxRQUFRQyxHQUFHLENBQUMsY0FBYyxzTUFBdUUsQ0FBQ2tCLElBQUk7UUFFdEcsT0FBT2pCO0lBQ1QsRUFBRSxPQUFPa0IsT0FBTztRQUNkcEIsUUFBUW9CLEtBQUssQ0FBQyxvQ0FBb0NBO1FBQ2xELE1BQU1BO0lBQ1I7QUFDRjtBQUVBLCtDQUErQztBQUMvQyxNQUFNUCxrQkFBa0IsQ0FBQ0c7SUFDdkIsTUFBTUssYUFBYUwsS0FBS00sS0FBSyxDQUFDO0lBQzlCLElBQUksQ0FBQ0QsWUFBWSxPQUFPO0lBRXhCLE1BQU0sQ0FBQ0UsR0FBR25CLE1BQU1vQixNQUFNLEdBQUdIO0lBQ3pCLElBQUlqQixTQUFTLE1BQU07UUFDakIsT0FBT3FCLFNBQVNELFNBQVM7SUFDM0IsT0FBTztRQUNMLHFCQUFxQjtRQUNyQixPQUFPQSxNQUFNYixVQUFVLENBQUMsT0FBTyxDQUFDZSxXQUFXQTtJQUM3QztBQUNGO0FBRUEsd0NBQXdDO0FBQ3hDLE1BQU1YLGdCQUFnQixDQUFDQztJQUNyQixNQUFNVyxZQUFZWCxLQUFLTSxLQUFLLENBQUM7SUFDN0IsSUFBSSxDQUFDSyxXQUFXLE9BQU87SUFFdkIsTUFBTUMsUUFBUUQsU0FBUyxDQUFDLEVBQUUsQ0FBQ0UsS0FBSyxDQUFDO0lBQ2pDLE9BQU87UUFDTEMsTUFBTUYsS0FBSyxDQUFDLEVBQUU7UUFDZGhCLFlBQVk7UUFDWm1CLFVBQVVIO0lBQ1o7QUFDRjtBQUVBLHVDQUF1QztBQUN2Q2hDLEtBQUtXLFNBQVMsR0FBRyxPQUFPQztJQUN0QixNQUFNLEVBQUVKLElBQUksRUFBRTRCLEdBQUcsRUFBRUMsUUFBUSxFQUFFLEdBQUd6QixFQUFFRSxJQUFJO0lBRXRDLElBQUksQ0FBQ25CLFdBQVc7UUFDZEEsWUFBWSxNQUFNRTtRQUNsQixJQUFJLENBQUNGLFdBQVcsUUFBUSxnQ0FBZ0M7SUFDMUQ7SUFFQSxPQUFRYTtRQUNOLEtBQUs7WUFDSCxJQUFJNEIsT0FBT3pDLFdBQVc7Z0JBQ3BCQyxjQUFjO2dCQUVkLDhCQUE4QjtnQkFDOUIsSUFBSXlDLFVBQVU7b0JBQ1oxQyxVQUFVZSxXQUFXLENBQUMsZ0NBQWlELE9BQWpCMkIsU0FBU0MsT0FBTztvQkFDdEUzQyxVQUFVZSxXQUFXLENBQUMsZ0NBQWlELE9BQWpCMkIsU0FBU0UsT0FBTztnQkFDeEU7Z0JBRUEsaUJBQWlCO2dCQUNqQjVDLFVBQVVlLFdBQVcsQ0FBQyxrQkFBa0IwQjtnQkFDeEN6QyxVQUFVZSxXQUFXLENBQUMsWUFBa0MsT0FBdEIyQixDQUFBQSxxQkFBQUEsK0JBQUFBLFNBQVVHLEtBQUssS0FBSTtZQUN2RDtZQUNBO1FBRUYsS0FBSztZQUNILElBQUk3QyxhQUFhQyxhQUFhO2dCQUM1QkQsVUFBVWUsV0FBVyxDQUFDO2dCQUN0QmQsY0FBYztZQUNoQjtZQUNBO0lBQ0o7QUFDRjtBQUVBLHdCQUF3QjtBQUN4QkksS0FBS3lDLGdCQUFnQixDQUFDLFVBQVU7SUFDOUIsSUFBSTlDLFdBQVc7UUFDYkEsVUFBVWUsV0FBVyxDQUFDO0lBQ3hCO0FBQ0Y7QUE3SWtFIiwic291cmNlcyI6WyIvaG9tZS9rYXJvbGl0by9ETC9ndWVzcy10aGUtZWxvL2Zyb250ZW5kL3NyYy93b3JrZXJzL3N0b2NrZmlzaFdvcmtlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBsaWI9XCJ3ZWJ3b3JrZXJcIiAvPlxuXG4vLyBUaGlzIGlzIGEgV2ViIFdvcmtlciBmaWxlIHRoYXQgaGFuZGxlcyBTdG9ja2Zpc2ggYW5hbHlzaXNcbi8vIEl0IHJ1bnMgaW4gYSBzZXBhcmF0ZSB0aHJlYWQgdG8gYXZvaWQgYmxvY2tpbmcgdGhlIFVJXG5cbmltcG9ydCB0eXBlIHsgU3RvY2tmaXNoTGluZSB9IGZyb20gJ0AvdHlwZXMvc3RvY2tmaXNoJztcbmltcG9ydCBTdG9ja2Zpc2ggZnJvbSAnc3RvY2tmaXNoL3NyYy9zdG9ja2Zpc2gtbm51ZS0xNi1zaW5nbGUuanMnO1xuXG5pbnRlcmZhY2UgU3RvY2tmaXNoTWVzc2FnZSB7XG4gIHR5cGU6ICdzdGFydCcgfCAnc3RvcCc7XG4gIGZlbj86IHN0cmluZztcbiAgc2V0dGluZ3M/OiB7XG4gICAgZGVwdGg6IG51bWJlcjtcbiAgICBtdWx0aVBWOiBudW1iZXI7XG4gICAgdGhyZWFkczogbnVtYmVyO1xuICB9O1xufVxuXG5sZXQgc3RvY2tmaXNoOiBXb3JrZXIgfCBudWxsID0gbnVsbDtcbmxldCBpc0FuYWx5emluZyA9IGZhbHNlO1xuXG4vLyBJbml0aWFsaXplIFN0b2NrZmlzaFxuY29uc3QgaW5pdFN0b2NrZmlzaCA9IGFzeW5jICgpID0+IHtcbiAgdHJ5IHtcbiAgICAvLyBEZXRlcm1pbmUgdGhlIGNvcnJlY3QgcGF0aCBiYXNlZCBvbiBlbnZpcm9ubWVudFxuICAgIGNvbnN0IGJhc2VQYXRoID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCdcbiAgICAgID8gYCR7c2VsZi5sb2NhdGlvbi5vcmlnaW59L3dhc21gXG4gICAgICA6ICcvX25leHQvc3RhdGljL3dhc20nO1xuXG4gICAgY29uc3Qgd29ya2VyUGF0aCA9IGAke2Jhc2VQYXRofS9zdG9ja2Zpc2gtbm51ZS0xNi1zaW5nbGUuanNgO1xuICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIFN0b2NrZmlzaCB3b3JrZXIgZnJvbTonLCB3b3JrZXJQYXRoKTtcblxuICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBXb3JrZXIod29ya2VyUGF0aCwge1xuICAgICAgdHlwZTogJ21vZHVsZScsXG4gICAgICBuYW1lOiAnc3RvY2tmaXNoLXdvcmtlcidcbiAgICB9KTtcblxuICAgIC8vIEFkZCB0aGlzIGluaXRpYWxpemF0aW9uIHNlcXVlbmNlXG4gICAgZW5naW5lLnBvc3RNZXNzYWdlKCd1Y2knKTtcbiAgICBlbmdpbmUucG9zdE1lc3NhZ2UoJ3NldG9wdGlvbiBuYW1lIFVzZSBOTlVFIHZhbHVlIHRydWUnKTtcbiAgICBlbmdpbmUucG9zdE1lc3NhZ2UoJ3NldG9wdGlvbiBuYW1lIFRocmVhZHMgdmFsdWUgMicpO1xuICAgIGVuZ2luZS5wb3N0TWVzc2FnZSgnaXNyZWFkeScpO1xuXG4gICAgLy8gU2V0IHVwIG1lc3NhZ2UgaGFuZGxlclxuICAgIGVuZ2luZS5vbm1lc3NhZ2UgPSAoZTogTWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZS5kYXRhO1xuXG4gICAgICAvLyBQYXJzZSBTdG9ja2Zpc2ggb3V0cHV0IGFuZCBzZW5kIGJhY2sgdG8gbWFpbiB0aHJlYWRcbiAgICAgIGlmIChtZXNzYWdlLnN0YXJ0c1dpdGgoJ2luZm8gZGVwdGgnKSkge1xuICAgICAgICBjb25zdCBldmFsdWF0aW9uID0gcGFyc2VFdmFsdWF0aW9uKG1lc3NhZ2UpO1xuICAgICAgICBjb25zdCBiZXN0TGluZSA9IHBhcnNlQmVzdExpbmUobWVzc2FnZSk7XG5cbiAgICAgICAgaWYgKGV2YWx1YXRpb24gIT09IG51bGwgJiYgYmVzdExpbmUpIHtcbiAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6ICdhbmFseXNpcycsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGV2YWx1YXRpb24sXG4gICAgICAgICAgICAgIGxpbmU6IGJlc3RMaW5lXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlIFwiYmVzdG1vdmVcIiBtZXNzYWdlcyB3aGVuIGFuYWx5c2lzIGlzIGNvbXBsZXRlXG4gICAgICBpZiAobWVzc2FnZS5zdGFydHNXaXRoKCdiZXN0bW92ZScpKSB7XG4gICAgICAgIGlzQW5hbHl6aW5nID0gZmFsc2U7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyB0eXBlOiAnY29tcGxldGUnIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zb2xlLmxvZygnSW5pdGlhbGl6aW5nIFN0b2NrZmlzaCB3b3JrZXIgZnJvbTonLCBpbXBvcnQubWV0YS51cmwpO1xuICAgIGNvbnNvbGUubG9nKCdXQVNNIHBhdGg6JywgbmV3IFVSTCgnc3RvY2tmaXNoL3NyYy9zdG9ja2Zpc2gtbm51ZS0xNi1zaW5nbGUud2FzbScsIGltcG9ydC5tZXRhLnVybCkuaHJlZik7XG5cbiAgICByZXR1cm4gZW5naW5lO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1N0b2NrZmlzaCBpbml0aWFsaXphdGlvbiBmYWlsZWQ6JywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG4vLyBQYXJzZSBldmFsdWF0aW9uIHNjb3JlIGZyb20gU3RvY2tmaXNoIG91dHB1dFxuY29uc3QgcGFyc2VFdmFsdWF0aW9uID0gKGxpbmU6IHN0cmluZyk6IG51bWJlciB8IG51bGwgPT4ge1xuICBjb25zdCBzY29yZU1hdGNoID0gbGluZS5tYXRjaCgvc2NvcmUgKGNwfG1hdGUpICgtP1xcZCspLyk7XG4gIGlmICghc2NvcmVNYXRjaCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgW18sIHR5cGUsIHZhbHVlXSA9IHNjb3JlTWF0Y2g7XG4gIGlmICh0eXBlID09PSAnY3AnKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KHZhbHVlKSAvIDEwMDtcbiAgfSBlbHNlIHtcbiAgICAvLyBIYW5kbGUgbWF0ZSBzY29yZXNcbiAgICByZXR1cm4gdmFsdWUuc3RhcnRzV2l0aCgnLScpID8gLUluZmluaXR5IDogSW5maW5pdHk7XG4gIH1cbn07XG5cbi8vIFBhcnNlIGJlc3QgbGluZSBmcm9tIFN0b2NrZmlzaCBvdXRwdXRcbmNvbnN0IHBhcnNlQmVzdExpbmUgPSAobGluZTogc3RyaW5nKTogU3RvY2tmaXNoTGluZSB8IG51bGwgPT4ge1xuICBjb25zdCBtb3ZlTWF0Y2ggPSBsaW5lLm1hdGNoKC9wdiAoLispJC8pO1xuICBpZiAoIW1vdmVNYXRjaCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgbW92ZXMgPSBtb3ZlTWF0Y2hbMV0uc3BsaXQoJyAnKTtcbiAgcmV0dXJuIHtcbiAgICBtb3ZlOiBtb3Zlc1swXSxcbiAgICBldmFsdWF0aW9uOiAwLCAvLyBUaGlzIHdpbGwgYmUgdXBkYXRlZCB3aXRoIHRoZSBwYXJzZWQgZXZhbHVhdGlvblxuICAgIHNlcXVlbmNlOiBtb3Zlc1xuICB9O1xufTtcblxuLy8gSGFuZGxlIG1lc3NhZ2VzIGZyb20gdGhlIG1haW4gdGhyZWFkXG5zZWxmLm9ubWVzc2FnZSA9IGFzeW5jIChlOiBNZXNzYWdlRXZlbnQ8U3RvY2tmaXNoTWVzc2FnZT4pID0+IHtcbiAgY29uc3QgeyB0eXBlLCBmZW4sIHNldHRpbmdzIH0gPSBlLmRhdGE7XG5cbiAgaWYgKCFzdG9ja2Zpc2gpIHtcbiAgICBzdG9ja2Zpc2ggPSBhd2FpdCBpbml0U3RvY2tmaXNoKCk7XG4gICAgaWYgKCFzdG9ja2Zpc2gpIHJldHVybjsgLy8gRXhpdCBpZiBpbml0aWFsaXphdGlvbiBmYWlsZWRcbiAgfVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgIGlmIChmZW4gJiYgc3RvY2tmaXNoKSB7XG4gICAgICAgIGlzQW5hbHl6aW5nID0gdHJ1ZTtcblxuICAgICAgICAvLyBVcGRhdGUgc2V0dGluZ3MgaWYgcHJvdmlkZWRcbiAgICAgICAgaWYgKHNldHRpbmdzKSB7XG4gICAgICAgICAgc3RvY2tmaXNoLnBvc3RNZXNzYWdlKGBzZXRvcHRpb24gbmFtZSBNdWx0aVBWIHZhbHVlICR7c2V0dGluZ3MubXVsdGlQVn1gKTtcbiAgICAgICAgICBzdG9ja2Zpc2gucG9zdE1lc3NhZ2UoYHNldG9wdGlvbiBuYW1lIFRocmVhZHMgdmFsdWUgJHtzZXR0aW5ncy50aHJlYWRzfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RhcnQgYW5hbHlzaXNcbiAgICAgICAgc3RvY2tmaXNoLnBvc3RNZXNzYWdlKCdwb3NpdGlvbiBmZW4gJyArIGZlbik7XG4gICAgICAgIHN0b2NrZmlzaC5wb3N0TWVzc2FnZShgZ28gZGVwdGggJHtzZXR0aW5ncz8uZGVwdGggfHwgMjB9YCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3N0b3AnOlxuICAgICAgaWYgKHN0b2NrZmlzaCAmJiBpc0FuYWx5emluZykge1xuICAgICAgICBzdG9ja2Zpc2gucG9zdE1lc3NhZ2UoJ3N0b3AnKTtcbiAgICAgICAgaXNBbmFseXppbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICB9XG59O1xuXG4vLyBIYW5kbGUgd29ya2VyIGNsZWFudXBcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcigndW5sb2FkJywgKCkgPT4ge1xuICBpZiAoc3RvY2tmaXNoKSB7XG4gICAgc3RvY2tmaXNoLnBvc3RNZXNzYWdlKCdxdWl0Jyk7XG4gIH1cbn0pOyJdLCJuYW1lcyI6WyJzdG9ja2Zpc2giLCJpc0FuYWx5emluZyIsImluaXRTdG9ja2Zpc2giLCJiYXNlUGF0aCIsInByb2Nlc3MiLCJzZWxmIiwibG9jYXRpb24iLCJvcmlnaW4iLCJ3b3JrZXJQYXRoIiwiY29uc29sZSIsImxvZyIsImVuZ2luZSIsIldvcmtlciIsInR5cGUiLCJuYW1lIiwicG9zdE1lc3NhZ2UiLCJvbm1lc3NhZ2UiLCJlIiwibWVzc2FnZSIsImRhdGEiLCJzdGFydHNXaXRoIiwiZXZhbHVhdGlvbiIsInBhcnNlRXZhbHVhdGlvbiIsImJlc3RMaW5lIiwicGFyc2VCZXN0TGluZSIsImxpbmUiLCJ1cmwiLCJVUkwiLCJocmVmIiwiZXJyb3IiLCJzY29yZU1hdGNoIiwibWF0Y2giLCJfIiwidmFsdWUiLCJwYXJzZUludCIsIkluZmluaXR5IiwibW92ZU1hdGNoIiwibW92ZXMiLCJzcGxpdCIsIm1vdmUiLCJzZXF1ZW5jZSIsImZlbiIsInNldHRpbmdzIiwibXVsdGlQViIsInRocmVhZHMiLCJkZXB0aCIsImFkZEV2ZW50TGlzdGVuZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/workers/stockfishWorker.ts\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "static/webpack/" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("static/webpack/" + __webpack_require__.h() + ".82f820a66c7b587a.hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("c8385ee3ce932746")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/relative url */
/******/ 	(() => {
/******/ 		__webpack_require__.U = function RelativeURL(url) {
/******/ 			var realUrl = new URL(url, "x:/");
/******/ 			var values = {};
/******/ 			for (var key in realUrl) values[key] = realUrl[key];
/******/ 			values.href = url;
/******/ 			values.pathname = url.replace(/[?#].*/, "");
/******/ 			values.origin = values.protocol = "";
/******/ 			values.toString = values.toJSON = () => (url);
/******/ 			for (var key in values) Object.defineProperty(this, key, { enumerable: true, configurable: true, value: values[key] });
/******/ 		};
/******/ 		__webpack_require__.U.prototype = URL.prototype;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	(() => {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = () => {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: (script) => (script),
/******/ 					createScriptURL: (url) => (url)
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	(() => {
/******/ 		__webpack_require__.ts = (script) => (__webpack_require__.tt().createScript(script));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script url */
/******/ 	(() => {
/******/ 		__webpack_require__.tu = (url) => (__webpack_require__.tt().createScriptURL(url));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				// inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results).then(function () {});
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								}
/******/ 								return setStatus("ready").then(function () {
/******/ 									return updatedModules;
/******/ 								});
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/_next/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	(() => {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push((options) => {
/******/ 			const originalFactory = options.factory;
/******/ 			options.factory = (moduleObject, moduleExports, webpackRequire) => {
/******/ 				const hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				const cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : () => {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/******/ 	/* webpack/runtime/css loading */
/******/ 	(() => {
/******/ 		var createStylesheet = (chunkId, fullhref, resolve, reject) => {
/******/ 			var linkTag = document.createElement("link");
/******/ 		
/******/ 			linkTag.rel = "stylesheet";
/******/ 			linkTag.type = "text/css";
/******/ 			var onLinkComplete = (event) => {
/******/ 				// avoid mem leaks.
/******/ 				linkTag.onerror = linkTag.onload = null;
/******/ 				if (event.type === 'load') {
/******/ 					resolve();
/******/ 				} else {
/******/ 					var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 					var realHref = event && event.target && event.target.href || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + realHref + ")");
/******/ 					err.code = "CSS_CHUNK_LOAD_FAILED";
/******/ 					err.type = errorType;
/******/ 					err.request = realHref;
/******/ 					linkTag.parentNode.removeChild(linkTag)
/******/ 					reject(err);
/******/ 				}
/******/ 			}
/******/ 			linkTag.onerror = linkTag.onload = onLinkComplete;
/******/ 			linkTag.href = fullhref;
/******/ 		
/******/ 			(function(linkTag) {
/******/ 			                if (typeof _N_E_STYLE_LOAD === 'function') {
/******/ 			                    const { href, onload, onerror } = linkTag;
/******/ 			                    _N_E_STYLE_LOAD(new URL(href).pathname).then(()=>onload == null ? void 0 : onload.call(linkTag, {
/******/ 			                            type: 'load'
/******/ 			                        }), ()=>onerror == null ? void 0 : onerror.call(linkTag, {}));
/******/ 			                } else {
/******/ 			                    document.head.appendChild(linkTag);
/******/ 			                }
/******/ 			            })(linkTag)
/******/ 			return linkTag;
/******/ 		};
/******/ 		var findStylesheet = (href, fullhref) => {
/******/ 			var existingLinkTags = document.getElementsByTagName("link");
/******/ 			for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 				var tag = existingLinkTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 				if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
/******/ 			}
/******/ 			var existingStyleTags = document.getElementsByTagName("style");
/******/ 			for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 				var tag = existingStyleTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href");
/******/ 				if(dataHref === href || dataHref === fullhref) return tag;
/******/ 			}
/******/ 		};
/******/ 		var loadStylesheet = (chunkId) => {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				if(findStylesheet(href, fullhref)) return resolve();
/******/ 				createStylesheet(chunkId, fullhref, resolve, reject);
/******/ 			});
/******/ 		}
/******/ 		// no chunk loading
/******/ 		
/******/ 		var oldTags = [];
/******/ 		var newTags = [];
/******/ 		var applyHandler = (options) => {
/******/ 			return { dispose: () => {
/******/ 				for(var i = 0; i < oldTags.length; i++) {
/******/ 					var oldTag = oldTags[i];
/******/ 					if(oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);
/******/ 				}
/******/ 				oldTags.length = 0;
/******/ 			}, apply: () => {
/******/ 				for(var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";
/******/ 				newTags.length = 0;
/******/ 			} };
/******/ 		}
/******/ 		__webpack_require__.hmrC.miniCss = (chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList) => {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			chunkIds.forEach((chunkId) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				var oldTag = findStylesheet(href, fullhref);
/******/ 				if(!oldTag) return;
/******/ 				promises.push(new Promise((resolve, reject) => {
/******/ 					var tag = createStylesheet(chunkId, fullhref, () => {
/******/ 						tag.as = "style";
/******/ 						tag.rel = "preload";
/******/ 						resolve();
/******/ 					}, reject);
/******/ 					oldTags.push(oldTag);
/******/ 					newTags.push(tag);
/******/ 				}));
/******/ 			});
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = __webpack_require__.hmrS_importScripts = __webpack_require__.hmrS_importScripts || {
/******/ 			"_app-pages-browser_src_workers_stockfishWorker_ts": 1
/******/ 		};
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		// no chunk loading
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var success = false;
/******/ 			self["webpackHotUpdate_N_E"] = (_, moreModules, runtime) => {
/******/ 				for(var moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						currentUpdate[moduleId] = moreModules[moduleId];
/******/ 						if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 					}
/******/ 				}
/******/ 				if(runtime) currentUpdateRuntime.push(runtime);
/******/ 				success = true;
/******/ 			};
/******/ 			// start update chunk loading
/******/ 			importScripts(__webpack_require__.tu(__webpack_require__.p + __webpack_require__.hu(chunkId)));
/******/ 			if(!success) throw new Error("Loading update chunk failed for unknown reason");
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.importScriptsHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result = newModuleFactory
/******/ 						? getAffectedModuleEffects(moduleId)
/******/ 						: {
/******/ 								type: "disposed",
/******/ 								moduleId: moduleId
/******/ 							};
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err1) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err1,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err1);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.importScripts = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.importScripts = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.importScriptsHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("(app-pages-browser)/./src/workers/stockfishWorker.ts");
/******/ 	_N_E = __webpack_exports__;
/******/ 	
/******/ })()
;