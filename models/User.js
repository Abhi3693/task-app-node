const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, minlength: 3 },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (req, res, next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.verifyPassword = async function (password) {
  let result = await bcrypt.compare(password, this.password);
  return result;
};

userSchema.methods.signToken = async function () {
  let payload = { id: this._id, email: this.email };
  let token = await jwt.sign(payload, process.env.SECRET_KEY);
  return token;
};

userSchema.methods.userResponse = function (token) {
  return {
    email: this.email,
    username: this.username,
    token: token,
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
