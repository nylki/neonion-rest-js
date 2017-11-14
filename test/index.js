import {createTarget, fetchTarget, fetchTargets, createAnnotation, fetchAnnotation, NeonionRestTarget} from '../neonion-rest.js';


const host = '0.0.0.0';
const port = 8301;



async function testCreateTarget(id='target:1') {
  let response;
    try {
      response = await createTarget({host, port, id, info:{test:'test'}});
      console.log('TARGET RETURNED', response);
    } catch (e) {
      console.log('Hmm, some error occured during fetch');
      console.log(e);
    }

    return response;
}



async function testFetchTarget(id='target:1') {
  console.log(`trying to fetch target with id: ${id}`);
  let response;
    try {
      response = await fetchTarget({id, host, port});
      console.log('TARGET RETURNED', response);
    } catch (e) {
      console.log('Hmm, some error occured during fetch');
      console.log(e);
    }

    return response;
}



async function testFetchTargets() {
  console.log('trying to fetch multiple targets. one justcreated the other not.');
  return fetchTargets({ids:['target:1', 'target:2'], host, port});
}

async function testCreateAnnotation() {
  console.log('trying to create annotation');
  return createAnnotation({targetID:'target:1', id:'annotation:1', info:{customKey: "test"}, host, port});
}

async function testFetchAnnotation() {
  console.log('trying to fetch annotation');
  return fetchAnnotation({targetID:'target:1', id:'annotation:1', host, port});
}

async function testFetchAnnotationViaWrapper() {
  // test create endpoint wrapper/management object
  let testTarget = new NeonionRestTarget({host, port, id:'target:1'});
  return testTarget.fetchAnnotation('annotation:1');
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
