var scrap = require('./scrapper'),
  fs = require('fs'),
  Q = require('q'),
  _ = require('underscore'),
  format = require('utils').format,
  baseDir, resultFilePath,
  doneCount = 0,
  casper = require('casper').create({
    onStepTimeout: throwTimeoutException,
    onTimeout: throwTimeoutException,
    onWaitTimeout: throwTimeoutException
  });

// TODO add -v verbose flag


parseCmdArgs(casper.cli.args);
console.log('dir: "' + baseDir + '"');
console.log('out: "' + resultFilePath + '"');
var fileList = fs.list(baseDir),
  images = _.chain(fileList)
  .map(appendDirPath)
  .filter(function(e) { // TODO filter by extension too
    'use strict';
    return fs.isFile(e); // for some reason we have to wrap the call
  }).value();

casper.start();

var promises = images.map(function(filePath) {
  'use strict';
  // console.log('Opening google image page for: "' + filePath + '"');
  return scrap(casper, filePath)
    .then(reportProgress);
});

console.log('Found ' + promises.length + ' images');
console.log('(this may take a while, I will update You with progress)');

Q.allSettled(promises)
  .then(_.partial(parseResults, _, resultFilePath))
  .done();

casper.run(function() {
  'use strict';
  // console.log('--END--');
  casper.exit();
});

function parseCmdArgs(args) {
  'use strict';
  // console.log(args)
  // console.log(casper.cli.raw.args)
  if (args.length !== 2) {
    console.log('usage: npm start -- IMAGES_DIRECTORY OUTPUT_FILE');
    console.log('or: casperjs main.js -- IMAGES_DIRECTORY OUTPUT_FILE');
    console.log('(Due too some casperjs bug the path cannot contain spaces)'); // TODO allow for spaces in paths
    console.log('Received: ' + args);
  } else {
    // TODO add validation
    baseDir = args[0];
    resultFilePath = args[1];
  }
}

function appendDirPath(fileName) {
  'use strict';
  return baseDir + '/' + fileName; // TODO check for ending '/' in path
}

function parseResults(results, outFile) {
  'use strict';

  console.log('Reading the results..');
  var succesFiles = [];
  // create object representing the results
  _.chain(results)
    .filter(isResultOk)
    .each(function(e) {
      // console.log(e);
      var fileName = e.value.file.split('/').pop().trim();
      if (fileName) {
        succesFiles.push({
          path: fileName,
          name: e.value.name
        });
      }
    });
  //
  console.log('Writing results to: "' + outFile + '"');
  var res = {
    path: baseDir,
    names: succesFiles
  };
  fs.write(outFile, JSON.stringify(res, null, 2), 'w');
}

function isResultOk(e) {
  'use strict';
  return e.state === 'fulfilled' && e.value !== undefined &&
    e.value.file && e.value.name;
}

function reportProgress(lastResult) {
  'use strict';
  ++doneCount;
  var resDesc = lastResult && lastResult.name ? lastResult.name : '-';
  console.log(format('Image %d/%d: "%s"', doneCount, promises.length, resDesc));
  return lastResult;
}

function throwTimeoutException() {
  'use strict';
  reportProgress({
    name: 'ERROR!'
  });
  throw 'Search timeout';
}

/*
casper.on('page.error', function(msg, trace) {
    this.echo('Error: ' + msg, 'ERROR');
    for (var i = 0; i < trace.length; i++) {
      var step = trace[i];
      this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
    }
  });
*/
