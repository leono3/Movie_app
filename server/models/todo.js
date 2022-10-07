const { Schema, model} = require('mongoose');

const todoSchema = new Schema({
    todo: String,
    completed: Boolean,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = model('Todo', todoSchema);