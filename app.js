
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var app = express();
var tappedout_url = 'http://tappedout.net/'

app.get('/card/:card_name', function (req, res) {
	var card_name = req.params.card_name;
	var raw_html = null

	var url = tappedout_url + 'mtg-card/' + card_name
	console.log(url)
	request(url, function(error, response, html){
		console.log(request);
		if (!request.statusCode === 200){
			
		}
		if(!error){
			var $ = cheerio.load(html);
			var title, release, rating;
            var json = { 'price' : "", 'card': "", '_error': null};
            try{
            	price_column = $(html).find(".col-sm-4 :nth-child(3)").html();

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

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});