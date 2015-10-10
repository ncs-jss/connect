var express = require('express');
var router = express.Router();
var request = require('superagent-cache')();
/* GET home page. */
router.get('/', function(req, res, next) {
  var latest;
  /**
   * Sends a request to get latest updates.
   * The response body is cached in memory for 15 minutes.
   * TODO: use redis in future if needed
   */
  request
    .get(process.env.API_URL + '/latest')
    .expiration(900000)
    .end(function(error, response){
      if(error){
        res.render('index', {});
        console.log(error);
      }else
        res.render('index', response.body);
    })

});

module.exports = router;
