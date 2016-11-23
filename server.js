	var express = require('express');
	var bodyParser=require('body-parser');
	var morgan=require('morgan');
	var config =require('./config');
	var app = express();
	var mongoose = require('mongoose');
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser.json());
	app.use(morgan('dev'));

	var api = require('./app/routes/api')(app,express);
	app.use('/api',api);	

mongoose.Promise = global.Promise;

	mongoose.connect(config.database,function(err){
		if(err){
			console.log('Error');
		}
		else
			console.log('Connected to DB');
	})
	app.get('*',function(req,res){

		res.sendFile(__dirname+'/public/views/index.html');

	});




	app.listen(config.port,function(err){
		if(err){
			console.log('Error');

		}else
		{
			console.log('Listening on Port 3000');
		}
	});



