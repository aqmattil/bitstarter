#!/usr/bin/env node

var fs = require('fs');
//var sys = require('util');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "localhost";

var assertFileExists = function(infile) {
  var instr = infile.toString();
  if(!fs.existsSync(instr)) {
    console.log("%s does not exist. Exiting.", instr);
    process.exit(1);
  }
  return instr;
};

var assertUrlExists = function(url) {
  return url.toString();
};

var cheerioHtmlFile = function(htmlfile) {
  return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
  return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
  $ = htmlfile;
//  console.log(htmlfile);
  var checks = loadChecks(checksfile).sort();
  var out = {};
  for(var ii in checks) {
    var present = $(checks[ii]).length > 0;
    out[checks[ii]] = present;
  }
  console.log(JSON.stringify(out, null, 4));
  return out;
};

var clone = function(fn) {
  return fn.bind({});
};

var loadHtmlUrl = function(url, callback) {
  var result = rest.get(url).on('complete', function(result) {
    callback(result);
  });
};

if(require.main == module) {
  program
    .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
    .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
    .option('-u, --url <url_to_check>', 'URL to page to check', clone(assertUrlExists), URL_DEFAULT)
    .parse(process.argv);
  var checkJson;
  var htmlfile;
  if(program.file && program.url == URL_DEFAULT) {
    htmlfile = cheerioHtmlFile(program.file);
    checkJson = checkHtmlFile(htmlfile, program.checks);
  }
  else if(program.url && program.file == HTMLFILE_DEFAULT) {
    var testfile = loadHtmlUrl(program.url, function(result) {
      htmlfile = cheerio.load(result);
      checkJson = checkHtmlFile(htmlfile, program.checks);
    } );
  }


//  var outJson = JSON.stringify(checkJson, null, 4);
//  console.log(outJson);
} else {
  exports.checkHtmlFile = checkHtmlFile;
}
