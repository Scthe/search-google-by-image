var scrap = require('./scrapper'),
  fs = require('fs'),
  Q = require('q'),
  _ = require('underscore'),
  path = 'debug/data', // TODO provide through cmd
  fileList = fs.list(path),
  casper = require('casper').create();

casper.start();

/*
scrap(casper, img)
  .then(function(result) {
    'use strict';
    if (result !== undefined) {
      console.log('>>>' + result);
    } else {
      console.log('>>>NULL');
    }
  });
*/
var promises = _.chain(fileList)
  .map(appendDirPath)
  .filter(function(e) {
    return fs.isFile(e); // for some reason we have to wrap the call
  })
  // TODO filter by extension
  .map(function(filePath) {
    console.log('Opening google image page for: "' + filePath + '"');
    return scrap(casper, filePath);
  }).value();


function appendDirPath(fileName) {
  'use strict';
  console.log('>>' + fileName)
  return path + '/' + fileName; // TODO check for ending '/' in path
}


casper.run(function() {
  'use strict';
  // console.log('--END--');
  casper.exit();
});

/*
casper.on('page.error', function(msg, trace) {
    this.echo('Error: ' + msg, 'ERROR');
    for (var i = 0; i < trace.length; i++) {
      var step = trace[i];
      this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
    }
  });
*/
