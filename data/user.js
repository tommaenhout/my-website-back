require('dotenv').config();
const mongodb = require('mongodb');
const connection = require ('./connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function getAllUsers() {
	const connectionDB = await connection.getConnection();
	const database = await connectionDB.db('my-website');
	const users = await database.collection('users');
	const allUsers = await users.find().toArray();
	return allUsers;
}

async function addUser(user){
	const connectionDB = await connection.getConnection();
	
	console.log(user);
	user.password = bcrypt.hashSync(user.password,8);

	const result = await connectionDB.db('my-website')
		.collection('users')
		.insertOne(user);
	
	return result;
}

async function findByCredentials(email,password){
	const connectionDB = await connection.getConnection();
	const user = await connectionDB.db('my-website')
		.collection('users')
		.findOne({email:email});
	if(!user){
		throw new Error('Invalid email or password');
	}

	const isMatch = bcrypt.compareSync(password, user.password);

	if(!isMatch){
		throw new Error('Invalid email or password');
	}

	return user;

}

async function findSimilarUsers(user){
	console.log(user)
	const connectionDB = await connection.getConnection();
	const users = await connectionDB.db('my-website')
		.collection('users')
		.find({level: {$regex: user.level, $options: 'i'},
				email: {$regex: user.email, $options: 'i'}})
		.toArray();
	return users;
}

async function generateJWT(user){
    // tercer parámetro es un key de la aplicación
        const token = jwt.sign({_id: user._id, email:user.email}, process.env.SECRET_KEY, {expiresIn: '5min'})
        return token;
    }



    module.exports = {getAllUsers, addUser, findByCredentials, generateJWT, findSimilarUsers};