var sc = require('./scrapper'),
  casper = require('casper').create();

casper.start();

var i1 = 'test/data/Mona_Lisa,_by_Leonardo_da_Vinci.jpg';
var i2 = 'test/data/TheRoad1.jpg';
var img = i2;

sc(casper, img, function(result) {
  'use strict';
  if (result !== undefined) {
    console.log('>>>' + result);
  } else {
    console.log('>>>NULL');
  }
});

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