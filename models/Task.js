const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

taskSchema.methods.taskResponse = function () {
  return {
    body: this.body,
    auther: this.author,
    id: this.id,
  };
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
