var wd = require('wd');

/**
 * Create the tester
 * @constructor
 * @param   {Object} options
 * @param   {Object} [options.remote] See https://www.npmjs.com/package/wd#browser-initialization
 */
function Tester(options) {
  this.options = {
    url:      '',
    browser:  'phantom',
    remote:   options
  };
}

Tester.prototype.url = function(url) {
  this.options.url = url;
  return this;
};

Tester.prototype.browser = function(browser) {
  //TODO: check valid values: phantomjs, chrome, firefox
  this.options.browser = browser;
  return this;
};

Tester.prototype.test = function(test, callback) {
  var self = this;
  var browser = wd.asyncRemote('localhost'); //wd.remote("ondemand.saucelabs.com", 80, "username", "apikey");

  var capabilities = { //https://code.google.com/p/selenium/wiki/DesiredCapabilities
    browserName: self.options.browser,

    'phantomjs.binary.path': 'C:\\PhantomJS\\2.0.0\\bin\\phantomjs.exe',
    //'phantomjs.binary.path': 'C:\\PhantomJS\\1.9.x\\phantomjs.exe',
    'phantomjs.cli.args': ['--ignore-ssl-errors=true', '--ssl-protocol=any'] //necessary for https - https://github.com/admc/wd/issues/358
  };

  function quit(err, results) {
    browser.quit(function() {
      callback(err, results);
    });
  }

  browser.init(capabilities, function(err) {
    if (err) return quit(err);

    browser.get(self.options.url, function(err) {
      if (err) return quit(err);

      //check the url - if the browser can't load the page then we don't get an error
      browser.eval('window.location.href', function(err, data) {
        if (err) return quit(err);

        if (data !== self.options.url) {
          quit(new Error('Tried to load "'+self.options.url+'" but got "'+data+'"'));
        } else {

          test(browser, function(err, results) {
            if (err) return quit(err);
            quit(err, results);
          });

        }

      });

    });

  });

  return this;
};

module.exports = Tester;