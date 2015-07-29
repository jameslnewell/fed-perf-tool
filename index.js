var wd      = require('wd');
var browser = wd.remote('http://localhost:8001');

browser.init({browserName: 'phantomjs'}, function() {
  browser.get('https://qa.online4.nib.com.au/', function() {
    test_timing();
  });
});

function test_timing() {

  browser.eval('document.readyState', function(err, data) {
    console.log('ready?', err, data); //"interactive" means finished parsing but still loading sub-resources, "complete" means loaded

    if (data === 'complete') {

      browser.eval('window.performance.timing', function(err, data) { //https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming
        console.log('perf', err, data);
              
          console.log('interactive time:', data.domInteractive-data.domLoading, 'ms');
          console.log('completed time:  ', data.domComplete-data.domLoading, 'ms');
          
          browser.quit();
          
      });
   
    } else {
      setTimeout(test_timing, 100);
    }
   
  });
  
}

//log the values and exit if above threshold
//pass threshold as param(s) or env variable
//pass url as param
//pass driver as param
//remote phantom driver  http://nib-phantom-2.cloudapp.net:4444
//number of times to average
//use config file and config file path to limit the no of command line args