var User = require('../models/user');

var config=require('../../config');

var secretKey=config.secretKey;

var jsonwebtoken =require('jsonwebtoken');
var event =require('events');


	function createToken(user){

	var token=	jsonwebtoken.sign({
			_id:user._id,
			name:user.name,
			username:user.username,

		},secretKey,{
			expirtesInMinute:1440
		}); 

		return token;

	}



module.exports = function(app,express){

	 var api = express.Router();

	 api.post('/signup',function(req,res){
	 var user = new User({
	 	name:req.body.name,
	 	username:req.body.username,
	 	password:req.body.password
	 });

	 user.save(function(err){
	 	if(err){
	 		res.send(err);
	 		return;
	 		}
	 		res.json({message:'User has been created!!'});
	 });
	 });

	 api.get('/users',function(req,res){
	 	User.find({},function(err,users){
	 		if(err){
	 			res.send(err);
	 		}else{
	 			res.json(users);
	 		}
	 	});
	 });

		


api.post('/login', function(req, res) {

		User.findOne({ 
			username: req.body.username,
			password:req.body.password
		}).exec(function(err, user) {

			if(err) throw err;

			if(!user) {

				res.send({ message: "User doenst exist"});
			} else if(user){ 

				 

					///// token
					var token = createToken(user);

					res.json({
						success: true,
						message: "Successfuly login!",
						token: token
					});
				
			}
		});
	});


	api.use(function(req,res,next){
		console.log("Somebody Just Came to Our App!");
		
		var token = req.body.token || req.param('token')|| req.headers['x-access-token'];
		console.log(token);
		// check if token exists

		if(token){
			jsonwebtoken.verify(token,secretKey,function(err,decoded){
				if(err){
					res.status(403).send({success:false,message:"Failed to Authenticate User"});
	 			}else{
					//

					req.decoded=decoded;
					next();
				}
			});
		}else{
			res.status(403).send({success:false,message:"No Token Provided"});
		}
	});

	api.get('/',function(req,res){

		res.json('Hello World');
	
	}); 
	
	 return api
}