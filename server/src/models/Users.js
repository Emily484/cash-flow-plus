import mongoose from 'mongoose';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    loginAttempts: {type: Number, default: 0},
    lockUntil: {type: Date },
});

UserSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS && this.lockUntil > new Date()){
        return next(new Error('Account locked. Please try again later'));
    }

    if(this.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        this.lockUntil = new Date() + LOCKOUT_DURATION;
    }

    this.loginAttempts += 1;
    return this.save(next);
});

const UserModel = mongoose.model("users", UserSchema)

export { UserModel };