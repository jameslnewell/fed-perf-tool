var webpage = require('webpage');

var page = webpage.create();
page.open('https://www.nib.com.au', function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    page.render('example.png');
  }
  phantom.exit();
});