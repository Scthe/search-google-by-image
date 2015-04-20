//var x = require('casper').selectXPath;
// var casper = require('casper').create(),
var url = 'https://images.google.com/';

module.exports = execute;

function execute(casper, file_path, callback) {

  casper.on('page.error', function(msg, trace) {
    this.echo('Error: ' + msg, 'ERROR');
    for (var i = 0; i < trace.length; i++) {
      var step = trace[i];
      this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
    }
  });

  function debug(casper, num, txt) {
    console.log(num + '>' + txt);
    casper.capture('cap' + num + '_' + txt + '.png')
  }

  casper.start();
  casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36');

  //console.log('--start--');
  casper.thenOpen(url);

  selector1 = '.gsst_a';
  casper.waitForSelector(selector1, function() {
    debug(this, 1, 'dialog_open')
    this.click(selector1);
  });

  //casper.thenEvaluate('google.qb.ti(true);');

  selector2 = '.qbtbha.qbtbtxt.qbclr';
  casper.waitForSelector(selector2, function() {
    debug(this, 2, 'dialog_change_tab')
    this.click(selector2);
  });

  //<input id="qbfile" name="encoded_image" style="margin:7px 4px" type="file">
  selector3 = 'input[id=qbfile]';
  casper.waitForSelector(selector3, function() {
    debug(this, 3, 'pre_file_input')
    this.page.uploadFile(selector3, file_path);
  });

  selector4 = '._gUb';
  var text = undefined;
  var timeout = 2000;

  casper.waitForSelector('#resultStats', function() {
    debug(this, 4, 'wait_for_page_reload')
      //this.page.uploadFile(selector4, file_path);
    text = this.evaluate(function(selector_) {
      var xs = document.getElementsByClassName('_gUb');
      return xs === undefined || xs.length ===0  ? undefined : (xs[0]).textContent;
    }, selector4);
    callback(text);
  }, function() {
    debug(this, 99, 'err_wait_for_page_reload')
    callback(undefined);
  });

  /*
   casper.run(function() {
    // we either have the text or not, anyway is time to end
      this.echo('>> "' + text + '"');
      callback(text);
   });
  /*
    casper.run(function() {
      //this.echo(getReturnedText());
      //phantom.exit(1);
      console.log('--END--');
      casper.exit();
    });
  */
}
