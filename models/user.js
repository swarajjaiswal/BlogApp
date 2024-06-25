const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { createToken } = require('../service/auth');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'USER',
    },
}, { timestamps: true });

userSchema.pre("save", function (next) {
    // 'this' points to the user that is being signed up first time
    const user = this;
    //checks if the user enters/modifies a password
    if (!user.isModified("password")) return;
    //salt stores a random string of size 16
    const salt = randomBytes(16).toString();
    //sha256 is an algorithm used to generate a hashed string
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.statics.matchPassword = async function (email, password) {
    const user = await this.findOne({ email });
  
    if (!user) {
        throw new Error('User not found');
    }
    const salt = user.salt;

    const hashedPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if (hashedPassword !== user.password) {
        throw new Error('Incorrect password');
    }

    const token = createToken(user);
    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
