var assert = require('assert'),
  scrapper = require('../scrapper');

describe('GoogleImagesScrapper', function(){

  it('finds \"Mona Lisa\"', function(){
    var image_title = scrapper('test/data/Mona_Lisa,_by_Leonardo_da_Vinci.jpg');
    assert(image_title); // exists

    image_title = image_title.toLowerCase();
    assert(image_title.indexOf('mona') !== -1);
    assert(image_title.indexOf('misa') !== -1);
  });


});

