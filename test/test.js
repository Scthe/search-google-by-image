var scrapper = require('../scrapper');

describe('GoogleImagesScrapper', function(){

  it('finds \"Mona Lisa\"', function(done){
    scrapper(casper,'test/data/Mona_Lisa,_by_Leonardo_da_Vinci.jpg',function(image_title){
      expect(image_title).to.exist;

      image_title = image_title.toLowerCase();
      expect(image_title).to.contain('mona');
      expect(image_title).to.contain('lisa');
      done();
    });
  });

  it('returns empty if image was not found', function(done){
    scrapper(casper,'test/data/TheRoad1.jpg',function(image_title){
      console.log("?>"+image_title)
      expect(image_title).to.not.exist;
      done();
    });
  });

});
