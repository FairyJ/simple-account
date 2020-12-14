// Models are defined using the Schema interface. 
// The Schema allows you to define the fields stored in each document along with their validation requirements and default values
// Schemas are then "compiled" into models using the mongoose.model() method

//require mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

// var db = mongoose.createConnection('127.0.0.', 'users');
//connect to database our database name is user, and mongoose server is in port 27017, this will use user database 
//mongo return promisees we can use to check if we are connect or not 
mongoose.connect(process.env.MONGO_DB_HOST, { useNewUrlParser: true })

    .then(() => console.log('mongoDB connected...'))

    .catch(error => console.log('mongoDB NOT connect ... '));

//define schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,//user have to input all of information 
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    createdAt:
    {
        type: Date,
        required: true,
        default: Date.now
    },
    comments: [{
        id: ObjectId,
        comment: {
            type: String,
            trim: true
        }
    }],
    active: {
        type: Boolean,
        default: false
    }

});

// mongoose.model will take the value (User) and make it lowercase and plural and create collection from it . 
//we save this mongoose.model  into variable User variable which that will give us model class .

//const modelName = mongoose.model(modelName, schema)
var User = mongoose.model('User', userSchema);

//then we will export this User which is a model class
module.exports = User;