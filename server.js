
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var util = require('./util')

var config_file = require('./config.json');

var app = express();
var tappedout_url = 'http://tappedout.net/'
var deck_brew_url = 'https://api.deckbrew.com/mtg/'

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

app.get('/card/list/:card_name', function(req, res) {
  var card_list_obj = [];
  var card_list = [];
  var json = {'_error': null};
  var card_name = req.params.card_name;
  var url = deck_brew_url + 'cards?name=' + card_name;
  request(url, function(error, response, html) {
    response = JSON.parse(html);
      if (!error) {
        try{
          
          for(var i in response){
            card_list_obj.push(
              {
                'name': response[i]['name'],
                'weight': util.levenshteinDistance(
                    card_name,
                    response[i]['name']
                  )
              });
          }
          
          card_list_obj = util.sortObject(card_list_obj, 'weight');
          
          for(var i in card_list_obj){
            card_list.push(card_list_obj[i]['name']);
          }
          json.list = card_list;
          json._error = false;
          
        }catch (err) {
          json._error = {'source': url, '_error': err};
        }
        res.send(json)
      }
  });
});

app.get('/card/:card_name', function (req, res) {
	var card_name = req.params.card_name;

	var url = tappedout_url + 'mtg-card/' + card_name;
	request(url, function(error, response, html){
		if (!error) {
			var $ = cheerio.load(html);
      var json = { 'price' : "", 'card': "", '_error': null};
      try{
      	var price_column = $(html).find(CARD_PRICES.LOWER).html();

      	var price = parseFloat( price_column.split(" ").filter( function( el ) {
          return el != ""
       })[1].substring(1));
       
        } catch (err) {
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


var server = app.listen(config_file['port'], function () {
  var host = config_file['host'];
  var port = config_file['port'];
  console.log("MTG-PriceChecker listening at http://%s:%s", host, port);
});