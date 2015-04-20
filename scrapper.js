/*jslint indent: 2 */
/* global casper*/

module.exports = execute;


function execute(casper, filePath, callback) {
  'use strict';
  var url = 'https://images.google.com/',
    currentStep = 0;

  // Mask as browser that can use 'search by image' feature
  casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36');

  // go to google images
  casper.thenOpen(url);

  clickWhenAvailable('.gsst_a', 'opening the dialog');
  clickWhenAvailable('.qbtbha.qbtbtxt.qbclr', 'changing dialog tab to "Upload an image"');

  uploadFileWhenAvailable('input[id=qbfile]', 'preparing for file upload');

  // when '#resultStats' is shown we are on the results page
  evalWhenAvailable('#resultStats', 'getting the image name', function() {
    var xs = document.getElementsByClassName('_gUb'); // page element with name
    return xs === undefined || xs.length === 0 ? undefined : (xs[0]).textContent;
  }, callback);



  function clickWhenAvailable(selector, stepName) {
    casper.waitForSelector(selector, function() {
      debug(this, currentStep, stepName);
      this.click(selector);
      ++currentStep;
    });
  }

  function uploadFileWhenAvailable(selector, stepName) {
    casper.waitForSelector(selector, function() {
      debug(this, currentStep, stepName);
      this.page.uploadFile(selector, filePath);
      ++currentStep;
    });
  }

  function evalWhenAvailable(selector, stepName, fToEval, callback) {
    casper.waitForSelector(selector, function() {
      debug(this, currentStep, stepName);
      var result;
      result = this.evaluate(fToEval);
      // console.log('>>' + result);

      ++currentStep;
      callback(result);
    });
  }

  function debug(casper, num, txt) {
    // console.log(num + '>' + txt);
    // casper.capture('cap' + num + '_' + txt + '.png');
  }
}
