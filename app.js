const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const reqall = require('require-all')
const app = express();
const fs = require('fs');


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));

//requiring the Users route for the database
const userRoutes = require('./api/routes/users');
const uploadRoutes = require('./api/routes/upload');
const folderPath = 'views';

const mongoURI = 'mongodb://localhost:27017/multerdb';
const options = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
};

const conn = mongoose
	.connect(mongoURI, options)
	.then(function () {
		console.log('connnected to multerdb');
		})
	.catch(function (error) {
		console.log(error);
	});


fs.readdirSync(folderPath);
app.use('/views/users', userRoutes);
app.use('/routes/uploads', uploadRoutes);



module.exports = app;
