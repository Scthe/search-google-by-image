/*jslint indent: 2 */
/*jshint expr: true*/
/* global describe, it, casper*/
/* global expect */

var scrapper = require('../scrapper');

describe('GoogleImagesScrapper', function(){
'use strict';

  testWithFile('finds \"Mona Lisa\"',
    'test/data/Mona_Lisa,_by_Leonardo_da_Vinci.jpg', function(imageTitle){

    expect(imageTitle).to.exist;
    imageTitle = imageTitle.toLowerCase();
    expect(imageTitle).to.contain('mona');
    expect(imageTitle).to.contain('lisa');
  });

  testWithFile('returns empty if image was not found', 'test/data/TheRoad1.jpg', function(imageTitle){
      expect(imageTitle).to.not.exist;
  });

  function testWithFile(testName,filePath, correctnesCheck){
    it(testName,function(done){
      casper.start();
      scrapper(casper,filePath,function(imageTitle){
        correctnesCheck(imageTitle);
        done();
      });
    });
  }

});
