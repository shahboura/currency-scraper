var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	config = require('./config');

gulp.task('default', function(){
	nodemon({
		script: 'app.js',
		ext: 'js',
		env: {
			PORT: config.port
		},
		ignore:['./node_modules/**']
	})
	.on('restart', function(){
		console.log('Restarting');
	});
});