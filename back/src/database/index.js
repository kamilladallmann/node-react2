const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeback', {useNewUrlParser: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;

