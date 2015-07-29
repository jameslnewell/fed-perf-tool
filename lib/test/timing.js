
module.exports = function(browser, callback) {

  function test() {

    browser.eval('document.readyState', function(err, data) {
      if (err) return callback(err);

      if (data === 'complete') { //"interactive" means finished parsing but still loading sub-resources, "complete" means loaded

        browser.eval('window.performance.timing', function(err, data) { //https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming, requires phantomjs2 - see https://github.com/ariya/phantomjs/issues/12204
          if (err) return callback(err);

          callback(null, {
            interactive:  data.domInteractive-data.domLoading,
            completed:    data.domComplete-data.domLoading
          });

        });

      } else {
        setTimeout(test, 100);
      }

    });
  }

  test();

};