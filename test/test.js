

/**
* @fileoverview Test basic functionality of the neonion REST-API and the JS library
* with Selenium in headless Firefox. index.html in this test directory will be used for testing,
* but run via a local webserver.

*/

'use strict';

const assert = require('assert');
const {Builder, By, Key, promise, until} = require('selenium-webdriver');

// async/await do not work well when the promise manager is enabled.
// See https://github.com/SeleniumHQ/selenium/issues/3037
//
// 3037 does not impact these specific examples, but it is still recommended
// that you disable the promise manager when using async/await.
promise.USE_PROMISE_MANAGER = false;

describe('neon rest API with fetch', function() {
  let driver;

  beforeEach(async function() {
    // start python3 rest-api.py etc.
    driver = await new Builder().forBrowser('firefox').build();
  });

  afterEach(async function() {
    // stop python3 rest-api.py etc.
    await driver.quit();
  });

  it('Should support target and annotation creation and fetch', async function() {

    await driver.sleep(1000);

    // This requires that a local webserver, serving the test dir is running
    // which should be the case when running `npm test`, see package.json
    await driver.get('http://localhost:3000');

    // TODO: Fix tests, so they actually use a random ID instead of default 1
    let createTargetResponse = await driver.executeScript('return window.createTargetResponse');
    console.log(createTargetResponse);
    assert.equal(createTargetResponse.status, 201);
    assert.equal(createTargetResponse.statusText, 'Created');


    // Test fetching a single target
    let fetchTargetResponse = await driver.executeScript('return window.fetchTargetResponse');
    assert(fetchTargetResponse !== undefined);
    assert.equal(fetchTargetResponse.id, 'target:1');

    // Test fetching multiple targets (1 and 2). 1 exists. 2 does not.
    // Expect an array of length 2. Expect the first entry to be "target:1"
    // Also expect the second entry to be undefined, as target:2 has not
    // beeen created.
    let fetchTargetsResponse = await driver.executeScript('return window.fetchTargetsResponse');
    assert(fetchTargetsResponse !== undefined && fetchTargetsResponse !== null);
    assert.equal(fetchTargetsResponse.length, 2);
    assert.equal(fetchTargetsResponse[0].id, 'target:1');

    // Create a conflict by trying to create already existing target.
    let conflictTargetResponse = await driver.executeScript("return window.conflictTargetResponse");
    assert.equal(conflictTargetResponse.status, 409);
    assert.equal(conflictTargetResponse.statusText, 'Conflict');

    // Create annotation @ target 1
    let createAnnotationResponse = await driver.executeScript('return window.createAnnotationResponse');
    console.log('createAnnotationResponse:', createAnnotationResponse);
    assert.equal(createAnnotationResponse.status, 201);
    assert.equal(createAnnotationResponse.statusText, 'Created');



    // Fetch just created annotation
    let fetchAnnotationResponse = await driver.executeScript('return window.fetchAnnotationResponse');
    console.log('fetchAnnotationResponse:', fetchAnnotationResponse);
    assert(fetchAnnotationResponse !== undefined && fetchAnnotationResponse !== null);
    assert.equal(fetchAnnotationResponse.id, 'annotation:1');
    assert.equal(fetchAnnotationResponse.target, 'target:1');
    assert.equal(fetchAnnotationResponse.type, 'Annotation');
    assert.equal(fetchAnnotationResponse.customKey, 'test');
    assert.equal(fetchAnnotationResponse['@context'], 'http://www.w3.org/ns/anno.jsonld');

    // Fetch just created annotation via wrapper object
    let testFetchAnnotationViaWrapperResponse = await driver.executeScript('return window.testFetchAnnotationViaWrapperResponse');
    assert(fetchAnnotationResponse !== undefined);
    assert.equal(testFetchAnnotationViaWrapperResponse.id, 'annotation:2');
    assert.equal(testFetchAnnotationViaWrapperResponse.target, 'target:1');
    assert.equal(testFetchAnnotationViaWrapperResponse.type, 'Annotation');
    assert.equal(testFetchAnnotationViaWrapperResponse.position[1], 2);
    assert.equal(testFetchAnnotationViaWrapperResponse['@context'], 'http://www.w3.org/ns/anno.jsonld');

  });
});
