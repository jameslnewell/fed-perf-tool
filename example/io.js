var options = {
  desiredCapabilities: {
    browserName: 'phantomjs',
    'phantomjs.binary.path': 'C:\\PhantomJS\\2.0.0\\bin\\phantomjs.exe'
  }
};

var webdriver = require('selenium-webdriver'),
  By = require('selenium-webdriver').By,
  until = require('selenium-webdriver').until
;

var driver = new webdriver.Builder()
  .forBrowser('phantomjs', '2.0.0')
  .withCapabilities(options.desiredCapabilities)
  .build()
;

driver.get('https://www.nib.com.au/').then(function() {

  console.log('loaded');

  driver.executeScript('return window.performance.timing').then(function(perf) {
    console.log('perf', perf);

    driver.getCurrentUrl().then(function(url) {
      console.log(url.toString());
      driver.quit();
    });

  });


});
