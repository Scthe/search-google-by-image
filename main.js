var scrap = require('./scrapper'),
  fs = require('fs'),
  Q = require('q'),
  _ = require('underscore'),
  path = 'debug/data', // TODO provide through cmd
  resultFile = 'result.json', // TODO provide through cmd
  fileList = fs.list(path),
  casper = require('casper').create();

casper.start();

var promises = _.chain(fileList)
  .map(appendDirPath)
  .filter(function(e) {
    'use strict';
    return fs.isFile(e); // for some reason we have to wrap the call
  })
  // TODO filter by extension
  .map(function(filePath) {
    'use strict';
    console.log('Opening google image page for: "' + filePath + '"');
    return scrap(casper, filePath);
  }).value();

Q.allSettled(promises)
  .then(function(results) {
    'use strict';

    var succesFiles = [];
    // create object representing the results
    _.chain(results)
      .filter(function(e) {
        return e.state === 'fulfilled' && e.value !== undefined;
      }).map(function(e) {
        var filePath = e.value.file,
          googledName = e.value.name;
        // console.log('>>' + googledName + '<<');
        return filePath && googledName ? [filePath, googledName] : undefined;
      }).filter(function(e) {
        return e !== undefined;
      }).each(function(e) {
        // console.log(e);
        var fileName = e[0].split('/').pop().trim();
        if (fileName) {
          succesFiles.push({
            path: fileName,
            name: e[1]
          });
        }
      });
    //
    var res = {
      path: path,
      names: succesFiles
    };
    fs.write(resultFile, JSON.stringify(res, null, 2), 'w');
  })
  .done();


function appendDirPath(fileName) {
  'use strict';
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
