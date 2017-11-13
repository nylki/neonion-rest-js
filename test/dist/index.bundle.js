/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__neonion_rest_js__ = __webpack_require__(1);



const host = '0.0.0.0';
const port = 8301;

// test create endpoint wrapper/management object
let testTarget = new __WEBPACK_IMPORTED_MODULE_0__neonion_rest_js__["a" /* NeonionRestTarget */]({host, port, id:1});

async function testCreateTarget(id=1) {
  console.log(`trying to create target with id: ${id}`);
  let response;
    try {
      response = await Object(__WEBPACK_IMPORTED_MODULE_0__neonion_rest_js__["c" /* createTarget */])({host, port, id, info:{test:'test'}});
      console.log('TARGET RETURNED', response);
    } catch (e) {
      console.log('Hmm, some error occured during fetch');
      console.log(e);
    }

    return response;
}



async function testFetchTarget(id=1) {
  console.log(`trying to fetch target with id: ${id}`);
  let response;
    try {
      response = await Object(__WEBPACK_IMPORTED_MODULE_0__neonion_rest_js__["e" /* fetchTarget */])({id, host, port});
      console.log('TARGET RETURNED', response);
    } catch (e) {
      console.log('Hmm, some error occured during fetch');
      console.log(e);
    }

    return response;
}



async function testFetchTargets() {
  console.log('trying to fetch multiple targets. one justcreated the other not.');
  return Object(__WEBPACK_IMPORTED_MODULE_0__neonion_rest_js__["f" /* fetchTargets */])({ids:[1, 2], host, port});
}

async function testCreateAnnotation() {
  console.log('trying to create annotation');
  return Object(__WEBPACK_IMPORTED_MODULE_0__neonion_rest_js__["b" /* createAnnotation */])({targetID:1, id:1, info:{customKey: "test"}, host, port});
}

async function testFetchAnnotation() {
  console.log('trying to fetch annotation');
  return Object(__WEBPACK_IMPORTED_MODULE_0__neonion_rest_js__["d" /* fetchAnnotation */])({targetID:1, id:1, host, port});
}

async function testFetchAnnotationViaWrapper() {
  return testTarget.fetchAnnotation(1);
}

// Selenium can only read the window or document context
// thats why we put our functions and testing results (promises) into window.


window.testCreateTarget = testCreateTarget;
window.testFetchTarget = testFetchTarget;



async function runTests() {
  window.createTargetResponse = await testCreateTarget();
  window.fetchTargetResponse = await testFetchTarget();
  window.fetchTargetsResponse = await testFetchTargets();
  window.conflictTargetResponse = await testCreateTarget();
  window.createAnnotationResponse = await testCreateAnnotation();
  window.fetchAnnotationResponse = await testFetchAnnotation();
  window.testFetchAnnotationViaWrapperResponse = await testFetchAnnotationViaWrapper();

  return Promise.all([
    window.createTargetResponse,
    window.fetchTargetResponse,
    window.fetchTargetsResponse,
    window.conflictTargetResponse,
    window.createAnnotationResponse,
    window.fetchAnnotationResponse,
    window.testFetchAnnotationViaWrapperResponse
  ]);

};

runTests().then(console.log)


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = createTarget;
/* harmony export (immutable) */ __webpack_exports__["e"] = fetchTarget;
/* harmony export (immutable) */ __webpack_exports__["f"] = fetchTargets;
/* harmony export (immutable) */ __webpack_exports__["b"] = createAnnotation;
/* harmony export (immutable) */ __webpack_exports__["d"] = fetchAnnotation;
/* unused harmony export fetchAnnotations */
/* harmony export (immutable) */ __webpack_exports__["a"] = NeonionRestTarget;
// TODO: create Function or Class that wraps the API functions.
// wanted usage:
// let neonion = new Neonion(ip, port)
// neonion.fetchAnnotation(projectid, annotationid)
// maybe:
// let projectFoo = neonion.project(id)
// projectFoo.fetchannotation()


// TODO: Use indexedDB to cache project JSON, and annotation JSON
// for each operation
// So it is possible to instantly have annotation etc. on webapp start.

const putRequestBaseConfig = {
  method: "PUT",
  mode: 'cors',
  headers: new Headers({
		'Content-Type': 'application/json'
	})
};

// Default values for annotation JSON Object
const annotationBaseConfig = {
  // @context has to be wrapped in quotes in JSON because of the @
  '@context': 'http://www.w3.org/ns/anno.jsonld',
  type: 'Annotation'
}

function isContentType(response, type) {
  // Check if response body has correct content-type
  let contentType = response.headers.get("content-type");
  return contentType && contentType.includes(type);
}

/**
 * Try to fetch JSON for given url.
 * @param  {String} url url to fetch
 * @return {Object} return JSON object on success, otherwise undefined.
 */
async function fetchJSON(url) {

  try {
    let response = await fetch(url, {method: "GET"});
    if(response.status === 404) {
      console.warn(`Couldnt find JSON. Status 404 for url ${url}.\n See Response for details:`, response);
    } else if(isContentType(response, "application/json")) {
      return response.json();
    }  else {
      console.warn(`Could not fetch JSON for url ${url}\n See Response for details:`, response);
    }

  } catch (e) {
    console.warn(`Could not fetch fetching JSON for url ${url}\n:`, e);
    return;
  }

}

/**
 * try to create target with given id
 * @param  {[type]} id               [description]
 * @param  {String} [host="0.0.0.0"] [description]
 * @param  {Number} [port=8301]      [description]
 * @return {Promise->Object}         Promise that resolves into request result
 */
async function createTarget({id, info, host="0.0.0.0", port=8301}) {
  if(id === undefined) throw new Error('No ID specified for target creation.');

  let body = Object.assign({id: `target:${id}`}, info);
  let config = Object.assign({body: JSON.stringify(body)}, putRequestBaseConfig);
  let url = `http://${host}:${port}/targets/target%3A${id}`;
  let request = new Request(url, config);

  return fetch(request);
}


/**
 * try to fetch target with given id
 * @param  {Number} id
 * @param  {String} host
 * @param  {Number} port
 * @return {Promise->Object} Promise that resolves into the target Object
 */
async function fetchTarget({id, host, port}) {
  return fetchJSON(`http://${host}:${port}/targets/target%3A${id}`);
}

/**
 *  If no ids given, return all targets,
 *  otherwise return Promise.All() for all given ids.
 * @param  {Array}  [ids=[]] Optional list of ids to fetch, if empty fetch all.
 * @param  {String} [host="0.0.0.0"]
 * @param  {Number} [port=8301]
 * @return {Promise->Array} Promise that resolves into an array of fetched targets
 */
async function fetchTargets({ids=[], host="0.0.0.0", port=8301}) {
  if(ids.length === 0) {
    return fetchJSON(`http://${host}:${port}/targets`);
  } else {
    let promises = ids.map(id => fetchTarget({id, host, port}));
    return Promise.all(promises);
  }
}

/**
 * Try to create Annotation with given ID
 * @param  {Number} id
 * @param  {String} [host="0.0.0.0"]
 * @param  {Number} [port=8301]
 * @return {Promise->Object} Promise that resolves into the request result
 */
async function createAnnotation({targetID, id, info, host="0.0.0.0", port=8301}) {
  if(id === undefined) throw new Error('No ID specified for annotation creation.');

  let body = Object.assign({
    target: `target:${targetID}`,
    id: `annotation:${id}`},
    annotationBaseConfig,
    info);

  let config = Object.assign({body: JSON.stringify(body)}, putRequestBaseConfig);
  let url = `http://${host}:${port}/targets/target%3A${targetID}/annotations/annotation%3A${id}`;
  let request = new Request(url, config);
  console.log(config);

  return fetch(request);
}

async function fetchAnnotation({targetID, id, host="0.0.0.0", port=8301}) {
  return fetchJSON(`http://${host}:${port}/targets/target%3A${targetID}/annotations/annotation%3A${id}`);
}

async function fetchAnnotations({targetID, ids=[], host="0.0.0.0", port=8301}) {
  if(ids.length === 0) {
    return fetchJSON(`http://${host}:${port}/targets/target%3A${targetID}/annotations`);
  } else {
    let promises = ids.map(id => fetchAnnotation(targetID, id, host, port));
    return Promise.all(promises);
  }
}

/**
 * Wrapper Object for all API functions.
 * @param       {[type]} targetID         [description]
 * @param       {[type]} id               [description]
 * @param       {String} [host="0.0.0.0"] [description]
 * @param       {Number} [port=8301]      [description]
 * @constructor
 */
function NeonionRestTarget({host="0.0.0.0", port=8301, id}) {
  this.targetID = id;
  this.host = host;
  this.port = port;


  this.fetchAnnotation = function (id) {
    return fetchAnnotation({targetID: this.targetID, id, host: this.host, port: this.port});
  }

  this.fetchAnnotations = function (ids) {
    return fetchAnnotations({targetID: this.targetID, ids, host: this.host, port: this.port});
  }


  this.createAnnotation = function ({info, id}) {
    // Auto-add a free ID if none given
    // if(!id) id = generateFreeID()
    return createAnnotation({targetID: this.targetID, id, info, host: this.host, port: this.port});
  }

}


/***/ })
/******/ ]);