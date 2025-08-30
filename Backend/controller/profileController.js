const mongoose = require('mongoose');
const Profile = require('../model/profile'); // adjust path if needed

// GET: Fetch all details of a pet
exports.viewPet = async (req, res) => {
    try {
        const pet = await Profile.findById(req.params.id);
        if (!pet) return res.status(404).json({ error: 'Pet not found' });
        res.json(pet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST: Create profile of a pet
exports.createPet = async (req, res) => {
    try {
        const newPet = new Profile({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            species: req.body.species,
            birthday: req.body.dob,
            breed: req.body.breed || 'Unknown breed.',
            needs: req.body.needs || 'No special needs.',
            marks: req.body.marks || 'No identifying marks.',
            tags: req.body.tags || []
        });

        await newPet.save();
        res.status(201).json(newPet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PATCH: Update profile details
exports.updatePet = async (req, res) => {
    try {
        const updates = req.body; // key-value pairs to update
        const pet = await Profile.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!pet) return res.status(404).json({ error: 'Pet not found' });
        res.json(pet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE: Delete profile of a pet
exports.deletePet = async (req, res) => {
    try {
        const pet = await Profile.findByIdAndDelete(req.params.id);
        if (!pet) return res.status(404).json({ error: 'Pet not found' });
        res.json({ message: 'Pet profile deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
