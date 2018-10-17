const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blogs');

const PostSchema = mongoose.Schema({
	title: {type: String, required: true},
	body: {type: String, required: true},
	tags: [{type: String }],
	posted: {type: Date, default: Date.now},
	comments: [{ body: String, date: {type: Date, default: Date.now } }] 
}, {collection: 'post'});

const PostModel = mongoose.model("PostModel", PostSchema);

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/blogpost', (req,res) => {
	PostModel
		.find()
		.then(posts => {
				res.json(posts);
			})
		.catch(err => res.status(400).json('Error displaying posts from DB.'));	
});

app.post('/blogpost', (req,res) => {
	const post = req.body;
	post.tags = post.tags.split(",");
	console.log(post);
	PostModel.create(post)
			.then( 
				function(obj) {	
					res.sendStatus(200);
				},
				function(error) {
					res.sendStatus(400);
				}
			)
});

app.put("/blogpost/comment/:id", (req,res) => {

	const postId = req.params.id;
	const comment = { body: req.body.comment };

	PostModel.update({_id: postId}, 
					 { $push: { comments: comment } 
					}) 
			.then( 
				function(status) {	
					res.sendStatus(200);
				},
				function(error) {
					res.sendStatus(400);
				}
			);
});

app.delete("/blogpost/:id", (req,res) => {
	const postId = req.params.id;
	PostModel.remove({_id: postId})
			.then( 
				function(status) {	
					res.sendStatus(200);
				},
				function(error) {
					res.sendStatus(400);
				}
			);
});

app.get("/blogpost/:id", (req,res) => {
	const postId = req.params.id;
	PostModel.findById(postId)
			.then( 
				function(post) {	
					res.json(post);
				},
				function(error) {
					res.sendStatus(400);
				}
			);
});

app.put("/blogpost/:id", (req,res) => {
	const postId = req.params.id;
	const post = req.body;
	post.tags = post.tags.split(",");

	PostModel.update({_id: postId}, {
				title: post.title,
				body: post.body,
				tags: post.tags
			})
			.then( 
				function(status) {	
					res.sendStatus(200);
				},
				function(error) {
					res.sendStatus(400);
				}
			);
});

const share = require('social-share');



app.listen(3000, () => {
	console.log(`app is running at port 3000`);
});