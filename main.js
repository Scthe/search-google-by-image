var scrap = require('./scrapper'),
  fs = require('fs'),
  Q = require('q'),
  _ = require('underscore'),
  baseDir, resultFilePath,
  casper = require('casper').create();

// TODO add -v verbose flag


parseCmdArgs(casper.cli.args);
console.log('dir: "' + baseDir + '"');
console.log('out: "' + resultFilePath + '"');
var fileList = fs.list(baseDir);

casper.start();

var promises = _.chain(fileList)
  .map(appendDirPath)
  .filter(function(e) { // TODO filter by extension too
    'use strict';
    return fs.isFile(e); // for some reason we have to wrap the call
  }).map(function(filePath) {
    'use strict';
    console.log('Opening google image page for: "' + filePath + '"');
    return scrap(casper, filePath);
  }).value();

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
  if (args.length !== 2) {
    console.log('Incorect arguments. Provide only 2 arguments:');
    console.log('1) directory containing images to use');
    console.log('2) output file');
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

  var succesFiles = [];
  // create object representing the results
  _.chain(results)
    .filter(function(e) {
      return e.state === 'fulfilled' && e.value !== undefined &&
        e.value.file && e.value.name;
    }).each(function(e) {
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
  var res = {
    path: baseDir,
    names: succesFiles
  };
  fs.write(outFile, JSON.stringify(res, null, 2), 'w');
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
