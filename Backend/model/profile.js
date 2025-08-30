const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema({
  _id: Schema.Types.ObjectId, //mongoose's built-in id generation
  name: String,
  species: { type: String, enum: ['dog', 'cat', 'rabbit'] }, //ideally this would return a paw print related to the species, based on the string
  birthday: Date,
  breed: { type: String, default: 'Unknown breed.' },
  needs: { type: String, default: 'No special needs.' },
  marks: { type: String, default: 'No identifying marks.' },
  tags: [String] //each tag string will go into this list
}, { timestamps: true });

const Profile = mongoose.model('profiles', profileSchema);
module.exports = Profile;
