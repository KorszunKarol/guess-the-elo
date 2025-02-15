/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "(ssr)/./src/workers/stockfishWorker.ts":
/*!****************************************!*\
  !*** ./src/workers/stockfishWorker.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/// <reference lib=\"webworker\" />\n// This is a Web Worker file that handles Stockfish analysis\n// It runs in a separate thread to avoid blocking the UI\nlet stockfish = null;\nlet isAnalyzing = false;\n// Initialize Stockfish\nconst initStockfish = async ()=>{\n    try {\n        // Determine the correct path based on environment\n        const basePath =  true ? `${self.location.origin}/wasm` : 0;\n        const workerPath = `${basePath}/stockfish-nnue-16-single.js`;\n        console.log('Loading Stockfish worker from:', workerPath);\n        const engine = new Worker(workerPath, {\n            type: 'module',\n            name: 'stockfish-worker'\n        });\n        // Add this initialization sequence\n        engine.postMessage('uci');\n        engine.postMessage('setoption name Use NNUE value true');\n        engine.postMessage('setoption name Threads value 2');\n        engine.postMessage('isready');\n        // Set up message handler\n        engine.onmessage = (e)=>{\n            const message = e.data;\n            // Parse Stockfish output and send back to main thread\n            if (message.startsWith('info depth')) {\n                const evaluation = parseEvaluation(message);\n                const bestLine = parseBestLine(message);\n                if (evaluation !== null && bestLine) {\n                    self.postMessage({\n                        type: 'analysis',\n                        data: {\n                            evaluation,\n                            line: bestLine\n                        }\n                    });\n                }\n            }\n            // Handle \"bestmove\" messages when analysis is complete\n            if (message.startsWith('bestmove')) {\n                isAnalyzing = false;\n                self.postMessage({\n                    type: 'complete'\n                });\n            }\n        };\n        console.log('Initializing Stockfish worker from:', \"file:///home/karolito/DL/guess-the-elo/frontend/src/workers/stockfishWorker.ts\");\n        console.log('WASM path:', /* asset import */ new __webpack_require__.U(__webpack_require__(/*! stockfish/src/stockfish-nnue-16-single.wasm */ \"(ssr)/./node_modules/stockfish/src/stockfish-nnue-16-single.wasm\")).href);\n        return engine;\n    } catch (error) {\n        console.error('Stockfish initialization failed:', error);\n        throw error;\n    }\n};\n// Parse evaluation score from Stockfish output\nconst parseEvaluation = (line)=>{\n    const scoreMatch = line.match(/score (cp|mate) (-?\\d+)/);\n    if (!scoreMatch) return null;\n    const [_, type, value] = scoreMatch;\n    if (type === 'cp') {\n        return parseInt(value) / 100;\n    } else {\n        // Handle mate scores\n        return value.startsWith('-') ? -Infinity : Infinity;\n    }\n};\n// Parse best line from Stockfish output\nconst parseBestLine = (line)=>{\n    const moveMatch = line.match(/pv (.+)$/);\n    if (!moveMatch) return null;\n    const moves = moveMatch[1].split(' ');\n    return {\n        move: moves[0],\n        evaluation: 0,\n        sequence: moves\n    };\n};\n// Handle messages from the main thread\nself.onmessage = async (e)=>{\n    const { type, fen, settings } = e.data;\n    if (!stockfish) {\n        stockfish = await initStockfish();\n        if (!stockfish) return; // Exit if initialization failed\n    }\n    switch(type){\n        case 'start':\n            if (fen && stockfish) {\n                isAnalyzing = true;\n                // Update settings if provided\n                if (settings) {\n                    stockfish.postMessage(`setoption name MultiPV value ${settings.multiPV}`);\n                    stockfish.postMessage(`setoption name Threads value ${settings.threads}`);\n                }\n                // Start analysis\n                stockfish.postMessage('position fen ' + fen);\n                stockfish.postMessage(`go depth ${settings?.depth || 20}`);\n            }\n            break;\n        case 'stop':\n            if (stockfish && isAnalyzing) {\n                stockfish.postMessage('stop');\n                isAnalyzing = false;\n            }\n            break;\n    }\n};\n// Handle worker cleanup\nself.addEventListener('unload', ()=>{\n    if (stockfish) {\n        stockfish.postMessage('quit');\n    }\n});\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUk0QixPQUFPekMsV0FBVztnQkFDcEJDLGNBQWM7Z0JBRWQsOEJBQThCO2dCQUM5QixJQUFJeUMsVUFBVTtvQkFDWjFDLFVBQVVlLFdBQVcsQ0FBQyxDQUFDLDZCQUE2QixFQUFFMkIsU0FBU0MsT0FBTyxFQUFFO29CQUN4RTNDLFVBQVVlLFdBQVcsQ0FBQyxDQUFDLDZCQUE2QixFQUFFMkIsU0FBU0UsT0FBTyxFQUFFO2dCQUMxRTtnQkFFQSxpQkFBaUI7Z0JBQ2pCNUMsVUFBVWUsV0FBVyxDQUFDLGtCQUFrQjBCO2dCQUN4Q3pDLFVBQVVlLFdBQVcsQ0FBQyxDQUFDLFNBQVMsRUFBRTJCLFVBQVVHLFNBQVMsSUFBSTtZQUMzRDtZQUNBO1FBRUYsS0FBSztZQUNILElBQUk3QyxhQUFhQyxhQUFhO2dCQUM1QkQsVUFBVWUsV0FBVyxDQUFDO2dCQUN0QmQsY0FBYztZQUNoQjtZQUNBO0lBQ0o7QUFDRjtBQUVBLHdCQUF3QjtBQUN4QkksS0FBS3lDLGdCQUFnQixDQUFDLFVBQVU7SUFDOUIsSUFBSTlDLFdBQVc7UUFDYkEsVUFBVWUsV0FBVyxDQUFDO0lBQ3hCO0FBQ0Y7QUE3SWtFIiwic291cmNlcyI6WyIvaG9tZS9rYXJvbGl0by9ETC9ndWVzcy10aGUtZWxvL2Zyb250ZW5kL3NyYy93b3JrZXJzL3N0b2NrZmlzaFdvcmtlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBsaWI9XCJ3ZWJ3b3JrZXJcIiAvPlxuXG4vLyBUaGlzIGlzIGEgV2ViIFdvcmtlciBmaWxlIHRoYXQgaGFuZGxlcyBTdG9ja2Zpc2ggYW5hbHlzaXNcbi8vIEl0IHJ1bnMgaW4gYSBzZXBhcmF0ZSB0aHJlYWQgdG8gYXZvaWQgYmxvY2tpbmcgdGhlIFVJXG5cbmltcG9ydCB0eXBlIHsgU3RvY2tmaXNoTGluZSB9IGZyb20gJ0AvdHlwZXMvc3RvY2tmaXNoJztcbmltcG9ydCBTdG9ja2Zpc2ggZnJvbSAnc3RvY2tmaXNoL3NyYy9zdG9ja2Zpc2gtbm51ZS0xNi1zaW5nbGUuanMnO1xuXG5pbnRlcmZhY2UgU3RvY2tmaXNoTWVzc2FnZSB7XG4gIHR5cGU6ICdzdGFydCcgfCAnc3RvcCc7XG4gIGZlbj86IHN0cmluZztcbiAgc2V0dGluZ3M/OiB7XG4gICAgZGVwdGg6IG51bWJlcjtcbiAgICBtdWx0aVBWOiBudW1iZXI7XG4gICAgdGhyZWFkczogbnVtYmVyO1xuICB9O1xufVxuXG5sZXQgc3RvY2tmaXNoOiBXb3JrZXIgfCBudWxsID0gbnVsbDtcbmxldCBpc0FuYWx5emluZyA9IGZhbHNlO1xuXG4vLyBJbml0aWFsaXplIFN0b2NrZmlzaFxuY29uc3QgaW5pdFN0b2NrZmlzaCA9IGFzeW5jICgpID0+IHtcbiAgdHJ5IHtcbiAgICAvLyBEZXRlcm1pbmUgdGhlIGNvcnJlY3QgcGF0aCBiYXNlZCBvbiBlbnZpcm9ubWVudFxuICAgIGNvbnN0IGJhc2VQYXRoID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCdcbiAgICAgID8gYCR7c2VsZi5sb2NhdGlvbi5vcmlnaW59L3dhc21gXG4gICAgICA6ICcvX25leHQvc3RhdGljL3dhc20nO1xuXG4gICAgY29uc3Qgd29ya2VyUGF0aCA9IGAke2Jhc2VQYXRofS9zdG9ja2Zpc2gtbm51ZS0xNi1zaW5nbGUuanNgO1xuICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIFN0b2NrZmlzaCB3b3JrZXIgZnJvbTonLCB3b3JrZXJQYXRoKTtcblxuICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBXb3JrZXIod29ya2VyUGF0aCwge1xuICAgICAgdHlwZTogJ21vZHVsZScsXG4gICAgICBuYW1lOiAnc3RvY2tmaXNoLXdvcmtlcidcbiAgICB9KTtcblxuICAgIC8vIEFkZCB0aGlzIGluaXRpYWxpemF0aW9uIHNlcXVlbmNlXG4gICAgZW5naW5lLnBvc3RNZXNzYWdlKCd1Y2knKTtcbiAgICBlbmdpbmUucG9zdE1lc3NhZ2UoJ3NldG9wdGlvbiBuYW1lIFVzZSBOTlVFIHZhbHVlIHRydWUnKTtcbiAgICBlbmdpbmUucG9zdE1lc3NhZ2UoJ3NldG9wdGlvbiBuYW1lIFRocmVhZHMgdmFsdWUgMicpO1xuICAgIGVuZ2luZS5wb3N0TWVzc2FnZSgnaXNyZWFkeScpO1xuXG4gICAgLy8gU2V0IHVwIG1lc3NhZ2UgaGFuZGxlclxuICAgIGVuZ2luZS5vbm1lc3NhZ2UgPSAoZTogTWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZS5kYXRhO1xuXG4gICAgICAvLyBQYXJzZSBTdG9ja2Zpc2ggb3V0cHV0IGFuZCBzZW5kIGJhY2sgdG8gbWFpbiB0aHJlYWRcbiAgICAgIGlmIChtZXNzYWdlLnN0YXJ0c1dpdGgoJ2luZm8gZGVwdGgnKSkge1xuICAgICAgICBjb25zdCBldmFsdWF0aW9uID0gcGFyc2VFdmFsdWF0aW9uKG1lc3NhZ2UpO1xuICAgICAgICBjb25zdCBiZXN0TGluZSA9IHBhcnNlQmVzdExpbmUobWVzc2FnZSk7XG5cbiAgICAgICAgaWYgKGV2YWx1YXRpb24gIT09IG51bGwgJiYgYmVzdExpbmUpIHtcbiAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6ICdhbmFseXNpcycsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGV2YWx1YXRpb24sXG4gICAgICAgICAgICAgIGxpbmU6IGJlc3RMaW5lXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSGFuZGxlIFwiYmVzdG1vdmVcIiBtZXNzYWdlcyB3aGVuIGFuYWx5c2lzIGlzIGNvbXBsZXRlXG4gICAgICBpZiAobWVzc2FnZS5zdGFydHNXaXRoKCdiZXN0bW92ZScpKSB7XG4gICAgICAgIGlzQW5hbHl6aW5nID0gZmFsc2U7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyB0eXBlOiAnY29tcGxldGUnIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zb2xlLmxvZygnSW5pdGlhbGl6aW5nIFN0b2NrZmlzaCB3b3JrZXIgZnJvbTonLCBpbXBvcnQubWV0YS51cmwpO1xuICAgIGNvbnNvbGUubG9nKCdXQVNNIHBhdGg6JywgbmV3IFVSTCgnc3RvY2tmaXNoL3NyYy9zdG9ja2Zpc2gtbm51ZS0xNi1zaW5nbGUud2FzbScsIGltcG9ydC5tZXRhLnVybCkuaHJlZik7XG5cbiAgICByZXR1cm4gZW5naW5lO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1N0b2NrZmlzaCBpbml0aWFsaXphdGlvbiBmYWlsZWQ6JywgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG4vLyBQYXJzZSBldmFsdWF0aW9uIHNjb3JlIGZyb20gU3RvY2tmaXNoIG91dHB1dFxuY29uc3QgcGFyc2VFdmFsdWF0aW9uID0gKGxpbmU6IHN0cmluZyk6IG51bWJlciB8IG51bGwgPT4ge1xuICBjb25zdCBzY29yZU1hdGNoID0gbGluZS5tYXRjaCgvc2NvcmUgKGNwfG1hdGUpICgtP1xcZCspLyk7XG4gIGlmICghc2NvcmVNYXRjaCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgW18sIHR5cGUsIHZhbHVlXSA9IHNjb3JlTWF0Y2g7XG4gIGlmICh0eXBlID09PSAnY3AnKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KHZhbHVlKSAvIDEwMDtcbiAgfSBlbHNlIHtcbiAgICAvLyBIYW5kbGUgbWF0ZSBzY29yZXNcbiAgICByZXR1cm4gdmFsdWUuc3RhcnRzV2l0aCgnLScpID8gLUluZmluaXR5IDogSW5maW5pdHk7XG4gIH1cbn07XG5cbi8vIFBhcnNlIGJlc3QgbGluZSBmcm9tIFN0b2NrZmlzaCBvdXRwdXRcbmNvbnN0IHBhcnNlQmVzdExpbmUgPSAobGluZTogc3RyaW5nKTogU3RvY2tmaXNoTGluZSB8IG51bGwgPT4ge1xuICBjb25zdCBtb3ZlTWF0Y2ggPSBsaW5lLm1hdGNoKC9wdiAoLispJC8pO1xuICBpZiAoIW1vdmVNYXRjaCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgbW92ZXMgPSBtb3ZlTWF0Y2hbMV0uc3BsaXQoJyAnKTtcbiAgcmV0dXJuIHtcbiAgICBtb3ZlOiBtb3Zlc1swXSxcbiAgICBldmFsdWF0aW9uOiAwLCAvLyBUaGlzIHdpbGwgYmUgdXBkYXRlZCB3aXRoIHRoZSBwYXJzZWQgZXZhbHVhdGlvblxuICAgIHNlcXVlbmNlOiBtb3Zlc1xuICB9O1xufTtcblxuLy8gSGFuZGxlIG1lc3NhZ2VzIGZyb20gdGhlIG1haW4gdGhyZWFkXG5zZWxmLm9ubWVzc2FnZSA9IGFzeW5jIChlOiBNZXNzYWdlRXZlbnQ8U3RvY2tmaXNoTWVzc2FnZT4pID0+IHtcbiAgY29uc3QgeyB0eXBlLCBmZW4sIHNldHRpbmdzIH0gPSBlLmRhdGE7XG5cbiAgaWYgKCFzdG9ja2Zpc2gpIHtcbiAgICBzdG9ja2Zpc2ggPSBhd2FpdCBpbml0U3RvY2tmaXNoKCk7XG4gICAgaWYgKCFzdG9ja2Zpc2gpIHJldHVybjsgLy8gRXhpdCBpZiBpbml0aWFsaXphdGlvbiBmYWlsZWRcbiAgfVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgIGlmIChmZW4gJiYgc3RvY2tmaXNoKSB7XG4gICAgICAgIGlzQW5hbHl6aW5nID0gdHJ1ZTtcblxuICAgICAgICAvLyBVcGRhdGUgc2V0dGluZ3MgaWYgcHJvdmlkZWRcbiAgICAgICAgaWYgKHNldHRpbmdzKSB7XG4gICAgICAgICAgc3RvY2tmaXNoLnBvc3RNZXNzYWdlKGBzZXRvcHRpb24gbmFtZSBNdWx0aVBWIHZhbHVlICR7c2V0dGluZ3MubXVsdGlQVn1gKTtcbiAgICAgICAgICBzdG9ja2Zpc2gucG9zdE1lc3NhZ2UoYHNldG9wdGlvbiBuYW1lIFRocmVhZHMgdmFsdWUgJHtzZXR0aW5ncy50aHJlYWRzfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RhcnQgYW5hbHlzaXNcbiAgICAgICAgc3RvY2tmaXNoLnBvc3RNZXNzYWdlKCdwb3NpdGlvbiBmZW4gJyArIGZlbik7XG4gICAgICAgIHN0b2NrZmlzaC5wb3N0TWVzc2FnZShgZ28gZGVwdGggJHtzZXR0aW5ncz8uZGVwdGggfHwgMjB9YCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ3N0b3AnOlxuICAgICAgaWYgKHN0b2NrZmlzaCAmJiBpc0FuYWx5emluZykge1xuICAgICAgICBzdG9ja2Zpc2gucG9zdE1lc3NhZ2UoJ3N0b3AnKTtcbiAgICAgICAgaXNBbmFseXppbmcgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICB9XG59O1xuXG4vLyBIYW5kbGUgd29ya2VyIGNsZWFudXBcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcigndW5sb2FkJywgKCkgPT4ge1xuICBpZiAoc3RvY2tmaXNoKSB7XG4gICAgc3RvY2tmaXNoLnBvc3RNZXNzYWdlKCdxdWl0Jyk7XG4gIH1cbn0pOyJdLCJuYW1lcyI6WyJzdG9ja2Zpc2giLCJpc0FuYWx5emluZyIsImluaXRTdG9ja2Zpc2giLCJiYXNlUGF0aCIsInByb2Nlc3MiLCJzZWxmIiwibG9jYXRpb24iLCJvcmlnaW4iLCJ3b3JrZXJQYXRoIiwiY29uc29sZSIsImxvZyIsImVuZ2luZSIsIldvcmtlciIsInR5cGUiLCJuYW1lIiwicG9zdE1lc3NhZ2UiLCJvbm1lc3NhZ2UiLCJlIiwibWVzc2FnZSIsImRhdGEiLCJzdGFydHNXaXRoIiwiZXZhbHVhdGlvbiIsInBhcnNlRXZhbHVhdGlvbiIsImJlc3RMaW5lIiwicGFyc2VCZXN0TGluZSIsImxpbmUiLCJ1cmwiLCJVUkwiLCJocmVmIiwiZXJyb3IiLCJzY29yZU1hdGNoIiwibWF0Y2giLCJfIiwidmFsdWUiLCJwYXJzZUludCIsIkluZmluaXR5IiwibW92ZU1hdGNoIiwibW92ZXMiLCJzcGxpdCIsIm1vdmUiLCJzZXF1ZW5jZSIsImZlbiIsInNldHRpbmdzIiwibXVsdGlQViIsInRocmVhZHMiLCJkZXB0aCIsImFkZEV2ZW50TGlzdGVuZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./src/workers/stockfishWorker.ts\n");

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
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor-chunks/stockfish"], () => (__webpack_require__("(ssr)/./src/workers/stockfishWorker.ts")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/_next/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			"_ssr_src_workers_stockfishWorker_ts": 1
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.O.require = (chunkId) => (installedChunks[chunkId]);
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 			__webpack_require__.O();
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			__webpack_require__.e("vendor-chunks/stockfish");
/******/ 			return next();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;