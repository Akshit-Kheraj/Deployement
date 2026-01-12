const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createPatients,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    getPatientStats
} = require('../controllers/patientController');

// All routes require authentication
router.use(protect);

// Bulk create patients
router.post('/bulk', createPatients);

// Get statistics
router.get('/stats', getPatientStats);

// Get all patients (with query params for search/filter)
router.get('/', getPatients);

// Get single patient
router.get('/:id', getPatientById);

// Update patient
router.put('/:id', updatePatient);

// Delete patient
router.delete('/:id', deletePatient);

module.exports = router;
