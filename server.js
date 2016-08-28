
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var app = express();
var tappedout_url = 'http://tappedout.net/'

var CARD_PRICES = {
  LOWER: ".col-sm-4 :nth-child(3)",
  MEDIUM: ".col-sm-4 :nth-child(2)",
  HIGHER: ".col-sm-4 :nth-child(4)"
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/card/:card_name', function (req, res) {
	var card_name = req.params.card_name;
	var raw_html = null

	var url = tappedout_url + 'mtg-card/' + card_name;
	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var title, release, rating;
            var json = { 'price' : "", 'card': "", '_error': null};
            try{
            	var price_column = $(html).find(CARD_PRICES.MEDIUM).html();

            	var price = parseFloat( price_column.split(" ").filter( function( el ) {
		       return el != ""
		     })[1].substring(1));
            }catch(err){
            	res.send({'_error': {'source': url, '_error': err}});
            	return;
            }
            json.card = card_name;
            json.price = price;
            json._error = false;

            res.send(json)
		}
	});

});

var server = app.listen(process.env.PORT, function () {

  var host = process.env.IP;
  var port = process.env.PORT;

  console.log("MTG-PriceChecker listening at http://%s:%s", host, port);
});