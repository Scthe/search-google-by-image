/*jslint indent: 2 */
/*jshint expr: true*/
/* global describe, it, casper*/
/* global expect */

var imageSearch = require('../imageSearch');

describe('Search google by image', function(){
'use strict';

  testWithFile('finds \"Mona Lisa\"',
    'test/data/Mona_Lisa,_by_Leonardo_da_Vinci.jpg', function(result){

    expect(result).to.exist;
    expect(result.name).to.exist;
    var imageTitle = result.name.toLowerCase();
    expect(imageTitle).to.contain('mona');
    expect(imageTitle).to.contain('lisa');
  });

  testWithFile('returns empty if image was not found', 'test/data/TheRoad1.jpg', function(imageTitle){
      expect(imageTitle.name).to.not.exist;
  });

  function testWithFile(testName,filePath, correctnesCheck){
    it(testName,function(endTest){
      casper.start();
      imageSearch(casper,filePath)
      .then(correctnesCheck)
      .then(endTest)
      .done();
    });
  }

});
