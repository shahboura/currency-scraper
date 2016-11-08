var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var currencyRouter = express.Router();
currencyRouter.route('/currencies')
	.get(function(req, res){
		var responseJson = {hello: "this is my api"};
		
		res.json(responseJson);
	});

app.use('/api', currencyRouter);

// run server
app.listen(port, function(){
	console.log('Running on PORT: ' + port);
});