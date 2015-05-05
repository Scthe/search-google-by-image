var scrap = require('./scrapper'),
  fs = require('fs'),
  Q = require('q'),
  _ = require('underscore'),
  format = require('utils').format,
  casper = require('casper').create({
    onStepTimeout: throwTimeoutException,
    onTimeout: throwTimeoutException,
    onWaitTimeout: throwTimeoutException
  });

var baseDir, resultFilePath,
  doneCount = 0,
  acceptedImageExtensions = ['jpg', 'jpeg', 'png', 'gif']; // No TIFF cause file size, no BMP cause why?

// TODO add -v verbose flag


parseCmdArgs(casper.cli.args);
console.log('dir: "' + baseDir + '"');
console.log('out: "' + resultFilePath + '"'); // TODO check if out dir is valid

var images = listImages(baseDir);
console.log('Found ' + images.length + ' images');

casper.start();

var promises = images.map(function(filePath) {
  'use strict';
  // console.log('Opening google image page for: "' + filePath + '"');
  return scrap(casper, filePath)
    .then(reportProgress);
});

console.log('(this may take a while, I will update You with progress)');

var writeAsJson__ = _.partial(writeAsJson, resultFilePath);
Q.allSettled(promises)
  .then(parseResults)
  .then(writeAsJson__)
  .done();

// there is no need to place this inside promise chain,
// since casper uses it's own command queue
casper.run(function() {
  'use strict';
  // console.log('--END--');
  casper.exit(0);
});


//
// implementation functions
//

function parseCmdArgs(args) {
  'use strict';
  // console.dir('$' + args);
  // console.dir('$' + args.length);

  // console.log(casper.cli.raw.args)
  if (args.length !== 2) {
    console.log('usage: npm start -- IMAGES_DIRECTORY OUTPUT_FILE');
    console.log('or: casperjs main.js -- IMAGES_DIRECTORY OUTPUT_FILE');
    console.log('(Due too some casperjs bug the path cannot contain spaces)'); // TODO allow for spaces in paths
    console.log('Received: ' + args);
    casper.exit(1);
  } else {
    // TODO add validation
    baseDir = args[0].replace('\\', '/');
    resultFilePath = args[1].replace('\\', '/');
  }
}

function listImages(path) {
  'use strict';

  // base path validation
  path = path.trim();
  if (path.length === 0 || path.search(/[\*\?]/) !== -1) {
    console.log('ERROR: IMAGES_DIRECTORY is either just spaces or contains \'*\' or \'?\'');
    casper.exit(1);
  }

  var fileList = fs.list(baseDir),
    images = _.chain(fileList)
    .map(appendDirPath)
    .filter(fileFilter)
    .value();

  if (images.length === 0) {
    console.log('ERROR: Could not find any files');
    casper.exit(1);
  }

  // console.dir(">images:" + images);
  return images;

  function fileFilter(filePath) {
    // filter by extension and if seems ok check if it is file or directory
    var ext = filePath.substring(filePath.lastIndexOf('.') + 1); // wow, amazingly this does not throw exception
    return _(acceptedImageExtensions).contains(ext) && fs.isFile(filePath);
  }

  function appendDirPath(fileName) {
    if (endsWith(fileName, '\\') || endsWith(fileName, '/')) {
      fileName = fileName.substring(0, fileName.length - 1);
    }
    return baseDir + '/' + fileName;
  }
}

function parseResults(results) {
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

  console.log(format('Found title for %d/%d images', succesFiles.length, results.length));
  return {
    path: baseDir,
    names: succesFiles
  };
}

function writeAsJson(outFilePath, obj) {
  'use strict';
  console.log(format('Writing results to: \'%s\'', outFilePath));
  fs.write(outFilePath, JSON.stringify(obj, null, 2), 'w');
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

function endsWith(str, suffix) {
  'use strict';
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
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
