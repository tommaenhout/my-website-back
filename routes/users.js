var express = require('express');
var router = express.Router();
const data = require('../data/user');
const auth = require('../middleware/auth');




router.get('/',auth, async(req,res)=>{
	const allUsers = await data.getAllUsers();
	res.send(allUsers)
});

router.post('/', async (req,res)=>{
	console.log(req.body);
	const result = await data.addUser(req.body);
	res.send(result);
});

router.get('/findSimilar' , async (req,res)=>{
	console.log(req.body)
	try {
	const result = await data.findSimilarUsers(req.body);
	res.send(result);
	} catch (error) {
		res.status(404).send({error: error.message});
	}
})

router.post('/login', async(req,res)=>{
	try{
		const user = await data.findByCredentials(req.body.email,req.body.password);
		const token = await data.generateJWT(user);
		res.send({user,token})
	} catch (error){
		res.status(401).send(error.message);
	}


});


module.exports = router;
