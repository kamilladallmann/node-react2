const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const PhotoSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    fileImage: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;