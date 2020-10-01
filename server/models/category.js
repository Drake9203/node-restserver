const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CategorySchema = new Schema({
    description: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    user: { type: Schema.Types.ObjectId, ref: 'Usuario' }

});


module.exports = mongoose.model('Category', CategorySchema);