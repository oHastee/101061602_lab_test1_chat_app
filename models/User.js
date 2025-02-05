const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    createdOn: { type: Date, default: Date.now }
});
// UserSchema might have to change later
module.exports = mongoose.model('User', UserSchema);
