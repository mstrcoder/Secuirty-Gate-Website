const mongoose = require('mongoose');
// const constants = require('../constants');
// const jwt = require('jsonwebtoken');

const VisitorSchema = mongoose.Schema({
    name:String,
    number:Number
});

// UserSchema.methods.generateJwtToken = (_id) => {
//     const token = jwt.sign(
//         {_id: _id},
//         constants.JWT_SECRET,
//         {expiresIn:"1h"}
//         );
//     return token;
// }

const VisitorModel = mongoose.model('visitor', VisitorSchema);

module.exports = VisitorModel;