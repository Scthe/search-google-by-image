/*jslint indent: 2 */
/*jshint expr: true*/
/* global describe, it, casper*/
/* global expect */

var scrapper = require('../scrapper');

describe('GoogleImagesScrapper', function(){
'use strict';

  it('finds \"Mona Lisa\"', function(done){
    scrapper(casper,'test/data/Mona_Lisa,_by_Leonardo_da_Vinci.jpg',function(imageTitle){
      expect(imageTitle).to.exist;

      imageTitle = imageTitle.toLowerCase();
      expect(imageTitle).to.contain('mona');
      expect(imageTitle).to.contain('lisa');
      done();
    });
  });

  it('returns empty if image was not found', function(done){
    scrapper(casper,'test/data/TheRoad1.jpg',function(imageTitle){
      expect(imageTitle).to.not.exist;
      done();
    });
  });

});
