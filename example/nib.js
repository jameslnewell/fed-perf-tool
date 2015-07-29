
var extend  = require('extend');
var chalk   = require('chalk');
var sprintf = require('sprintf-js').sprintf;

var Tester  = require('../lib/tester');
var test    = require('../lib/test/timing');

var config = extend({
  url:            'https://review.nib.com.au/?preview=1',
  browser:        'chrome',

  limits: {
    interactive:  1000,
    completed:    4500
  },

  selenium: {
    hostname:     '127.0.0.1',
    port:         4444,
    user:         'username',
    pwd:          'password'
  }

});

var tester = new Tester();
tester
  .url(config.url)
  .browser(config.browser)
  .test(test, function(err, results) {
    if (err) return console.log(err);

    var val, slower = false;

    //print interactive time
    process.stdout.write('interactive time: ');
    val = sprintf('%5dms', results.interactive);
    if (results.interactive <= config.limits.interactive) {
      val = chalk.green(val);
    } else {
      slower = true;
      val = chalk.red(val)+'\t('+chalk.magenta(sprintf('%4dms slower', results.interactive-config.limits.interactive))+')';
    }
    process.stdout.write(val+'\n');

    //print completed time
    process.stdout.write('completed time:   ');
    val = sprintf('%5dms', results.completed);
    if (results.completed <= config.limits.completed) {
      val = chalk.green(val);
    } else {
      slower = true;
      val = chalk.red(val)+'\t('+chalk.magenta(sprintf('%4dms slower', results.completed-config.limits.completed))+')';
    }
    process.stdout.write(val);

    //check values are within the config.limits
    if (slower) {
      return process.exit(1);
    }

  })
;