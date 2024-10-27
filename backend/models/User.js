const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'officer', 'adviser'],
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema);
