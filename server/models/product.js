const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProductSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    priceUnit: { type: Number, required: [true, 'El precio únitario es necesario'] },
    description: { type: String, required: false },
    avalible: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    img: { type: String, required: false },
});

module.exports = mongoose.model('Product', ProductSchema);