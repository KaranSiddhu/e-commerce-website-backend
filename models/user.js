const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxLength:32,
        trim: true
    },
    lastName:{
        type:String,
        maxLength:32,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    userInfo:{
        type:String,
        trim:true
    },
    secure_password:{
        type:String,
        required:true
    },
    salt:String,
    role:{
        type:Number, 
        default: 0
    },
    purchases:{
        type:Array,
        default:[]
    }
}, {timestamps: true});

userSchema.virtual("password")
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.secure_password = this.securePassword(password);
    })
    .get(function() {
        return this._password;
    })

//*Schema methods for hashing password
userSchema.methods = {

    securePassword: function(plainPassword){
        if(!plainPassword) return '';
        try{
            return crypto.createHmac('sha256',this.salt )
                    .update(plainPassword)
                    .digest('hex');
        }catch(err){
            return "";
        }
    },

    autheticate: function(plainPassword){
        return this.securePassword(plainPassword) === this.secure_password;
    } 
}

module.exports = mongoose.model('User', userSchema);