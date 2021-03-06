var Q = require('q'),
  id = 0;

module.exports = execute;


function execute(casper, filePath) {
  'use strict';
  var url = 'https://images.google.com/',
    currentStep = 0,
    execId = id++,
    deferred = Q.defer();

  // Mask as browser that can use 'search by image' feature
  casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36');

  // go to google images
  casper.thenOpen(url);

  clickWhenAvailable('.gsst_a', 'opening the dialog');
  clickWhenAvailable('.qbtbha.qbtbtxt.qbclr', 'changing dialog tab to "Upload an image"');

  uploadFileWhenAvailable('input[id=qbfile]', 'preparing for file upload');

  // when '#resultStats' is shown we are on the results page
  evalWhenAvailable('#resultStats', 'getting the image name', function() {
    /* global document*/
    var xs = document.getElementsByClassName('_gUb'); // page element with name
    return xs === undefined || xs.length === 0 ? undefined : (xs[0]).textContent;
  });

  return deferred.promise;


  function clickWhenAvailable(selector, stepName) {
    casper.waitForSelector(selector, function() {
      debug(this, currentStep, stepName);
      this.click(selector);
      ++currentStep;
    }, reject(casper));
  }

  function uploadFileWhenAvailable(selector, stepName) {
    casper.waitForSelector(selector, function() {
      // console.log('    ' + filePath);
      debug(this, currentStep, stepName);
      this.page.uploadFile(selector, filePath);
      ++currentStep;
    }, reject(casper));
  }

  function evalWhenAvailable(selector, stepName, fToEval) {
    casper.waitForSelector(selector, function() {
      debug(this, currentStep, stepName);
      ++currentStep;
      var googledName = this.evaluate(fToEval);
      // console.log('>>' + googledName);
      deferred.resolve({
        file: filePath,
        name: googledName
      });
    }, reject(casper));
  }

  function debug(casper, num, txt) {
    // console.log('[' + execId + '] step ' + num + ': ' + txt);
    // casper.capture('debug/cap' + num + '_' + txt + '.png');
  }

  function reject(casper_) {
    return function() {
      // console.log('Rromise reject');
      deferred.reject();
      casper_.options.onWaitTimeout();
    };
  }
}
