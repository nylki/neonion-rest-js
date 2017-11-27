// TODO: create Function or Class that wraps the API functions.
// wanted usage:
// let neonion = new Neonion(ip, port)
// neonion.fetchAnnotation(projectid, annotationid)
// maybe:
// let projectFoo = neonion.project(id)
// projectFoo.fetchAnnotation()


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
const annotationMinBody = {
  // @context has to be wrapped in quotes in JSON because of the @
  '@context': 'http://www.w3.org/ns/anno.jsonld',
  type: 'Annotation'
}

function isContentType(response, type) {
  // Check if response body has correct content-type
  let contentType = response.headers.get("content-type");
  return contentType && contentType.includes(type);
}

function fetchException(message, originalResponse, statusCode, statusText) {
  this.message = message;
  if(originalResponse) this.originalResponse = originalResponse;
  if(statusCode) this.statusCode = statusCode;
  if(statusText) this.statusText = statusText;

  this.toString = () => `${(this.statusCode && this.statusText) ? `(Error ${this.statusCode} ${this.statusText})` : ''} ${this.message}`;
}

/**
 * Try to fetch JSON for given url.
 * @param  {String} url url to fetch
 * @return {Object} return JSON object on success, otherwise undefined.
 */
 async function fetchJSON(url) {

   let response = await fetch(url, {method: "GET"});
   if(response.status === 404) {
     throw new fetchException(`Status 404. Server is reachable but there is no JSON for url: ${url}.\n Return undefined for this request. See Response for details.`, response,  response.status, response.statusText);
   } else if(isContentType(response, "application/json")) {
     return response.json();
   }  else {
    throw new fetchException('Error fetching '+ url +'. See Response for details.', response, response.status, response.statusText);
   }

 }

/**
 * try to create target with given id
 * @param  {[type]} id               [description]
 * @param  {String} [host="0.0.0.0"] [description]
 * @param  {Number} [port=8301]      [description]
 * @return {Promise->Object}         Promise that resolves into request result
 */
export async function createTarget({id, info, host="0.0.0.0", port=8301}) {
  if(id === undefined) throw new Error('No ID specified for target creation.');
  let body = Object.assign({id: `${id}`}, info);
  let config = Object.assign({body: JSON.stringify(body)}, putRequestBaseConfig);
  let url = `http://${host}:${port}/targets/${id}`;
  let request = new Request(url, config);

  return fetch(request);
}

function formatID(id) {
  return id.replace(':', '%3A');
}


/**
 * try to fetch target with given id
 * @param  {Number} id
 * @param  {String} host
 * @param  {Number} port
 * @return {Promise->Object} Promise that resolves into the target Object
 */
export async function fetchTarget({id, host, port}) {
  return fetchJSON(`http://${host}:${port}/targets/${formatID(id)}`);
}

/**
 *  If no ids given, return all targets in the database.
 *  otherwise return Promise.All() for all given ids.
 * !! Targets that can't be found will be resolved as undefined. !!
 * @param  {Array}  [ids=[]] Optional list of ids to fetch, if empty fetch all.
 * @param  {String} [host="0.0.0.0"]
 * @param  {Number} [port=8301]
 * @return {Promise->Array} Promise that resolves into an array of fetched targets
 */
export async function fetchTargets({ids=[], host="0.0.0.0", port=8301}) {
  if(ids.length === 0) {
    return fetchJSON(`http://${host}:${port}/targets`);
  } else {

    let promises = ids.map(async (id) => {
      // Handle 404 status errors to return undefined, so promise.all
      // does not fail completely and succeeds deliver the list of targets.
      try {
        return await fetchTarget({id, host, port});

      } catch (e) {
        console.log('' + e);
        console.warn(e.message);
        // If it isn't a 404 error, actually throw, because it could be a network error.
        if(e.originalResponse.status === undefined || e.originalResponse.status !== 404) {
          throw e;
        }
      }
    });

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
export async function createAnnotation({targetID, id, info={}, host="0.0.0.0", port=8301}) {

  if(id === undefined) throw new Error('No ID specified for annotation creation.');
  if(targetID === undefined) throw new Error('No target ID specified for annotation creation');

  let body = Object.assign({target: `${targetID}`, id: `${id}`}, annotationMinBody, info);
  let config = Object.assign({body: JSON.stringify(body)}, putRequestBaseConfig);
  let url = `http://${host}:${port}/targets/${formatID(targetID)}/annotations/${formatID(id)}`;
  let request = new Request(url, config);
  return fetch(request);
}

export async function fetchAnnotation({targetID, id, host="0.0.0.0", port=8301}) {
  return fetchJSON(`http://${host}:${port}/targets/${formatID(targetID)}/annotations/${formatID(id)}`);
}

export async function fetchAnnotations({targetID, ids=[], host="0.0.0.0", port=8301}) {
  if(ids.length === 0) {
    return fetchJSON(`http://${host}:${port}/targets/${formatID(targetID)}/annotations`);
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
export function NeonionRestTarget({host="0.0.0.0", port=8301, id}) {

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


let NeonionRest = {createTarget, fetchTarget, fetchTargets, createAnnotation, fetchAnnotations, NeonionRestTarget};


export default NeonionRest;
