const { Schema, models, model } = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    }
},
{
  timestamps: true,
});

const UserModel = models.User || model('User', userSchema);

export default UserModel;