const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const confirmationSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    confirmationId: {
        type: String,
        required: true
    }
});


var Confirmation = mongoose.model('Confirmation', confirmationSchema);
module.exports = Confirmation;