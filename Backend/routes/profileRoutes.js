const express = require('express');
const router = express.Router();
const profileController = require('../controller/profileController');

// View pet profile
router.get('/:id', profileController.viewPet);

// Create pet profile
router.post('/', profileController.createPet);

// Update pet profile
router.patch('/:id', profileController.updatePet);

// Delete pet profile
router.delete('/:id', profileController.deletePet);

module.exports = router;

