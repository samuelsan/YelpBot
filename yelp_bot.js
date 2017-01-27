
// token=xoxb-133553196565-VtLT0uKiS3qBjWgPxcwwOix4 node yelp_bot.js

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: 'wUTOZlkQEAao78D1YjFfNg',
  consumer_secret: 'nT4spmkqwqoW1oXsumSKIfCW1-w',
  token: 'CJrU80xL8itZQDieyVp_AfgwzkQ08SBp',
  token_secret: 'r6Y2zrlyZhmmxOEjLOKYbXPrK3Q',
});

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();


function get_yelp_rating(item, convo){
    convo.ask("Which place do you want a rating for?", function(response, convo) {
      convo.say("Stay tuned!")
      yelp.search({term: response.text, location: 'Toronto Eglinton', limit: 1})
        .then(function (data) { //The API call was returned successfully
          convo.say("The rating for " + response.text + " is " + data.businesses[0].rating.toString() + " stars"); //Log the API call response to the console
          convo.say("Bon Appetit!");
          convo.next();
        }).catch(function (err) { 
         console.error(err); 

         });
    });
};

function get_yelp_food(item, convo){
    convo.ask("What kind of food do you want?", function(response, convo) {
        convo.say("Coming right up!");
      yelp.search({term: response.text, location: 'Toronto Eglinton', limit: 3})
        .then(function (data) { //The API call was returned successfully
          convo.say("The following places have " + response.text + " food"); //Log the API call response to the console

          var counter = 1;
          while(data.businesses[counter-1]){
            convo.say(counter.toString() + '. ' + data.businesses[counter-1].name);
            convo.say("Address is " + data.businesses[counter-1].location.address);
            counter++;
          }
        convo.say("Bon Appetit!");
          convo.next();
        }).catch(function (err) { 
         console.error(err); 
         });
    });
};    

function get_yelp_review(item, convo){
    convo.ask("What place do you want a review of?", function(response, convo) {
        convo.say("Looking!");
      yelp.business(response.text.replace(/\s+/g, '-').toLowerCase() + "-toronto")
        .then(function (data) {
          convo.say("Here are some reviews for " + response.text + ". The overall rating is " + data.rating.toString() + " stars"); 
          var counter = 1;
          while(data.reviews[counter-1]){
            convo.say(counter.toString() + '. ' + data.reviews[counter-1].excerpt);
            counter++;
          }
        convo.say("Bon Appetit!");
          convo.next();
        }).catch(function (err) { 
         console.error(err); 
         });
    });
};    


controller.hears(['Yelp Rating'],['direct_message'],function(bot,message) {
    bot.startConversation(message, get_yelp_rating);
});

controller.hears(['Yelp Food'],['direct_message'],function(bot,message) {
    bot.startConversation(message, get_yelp_food);
});

controller.hears(['Yelp Review'],['direct_message'],function(bot,message) {
    bot.startConversation(message, get_yelp_review);
});
