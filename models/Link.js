const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    original_name: {
        type: String,
        required: true,
    },
    downloads: {
        type: Number,
        default: 1,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    passwordFile: {
        type: String,
        default: null,
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Link', linkSchema);