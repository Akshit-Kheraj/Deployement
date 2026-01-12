const Patient = require('../models/Patient');

/**
 * @desc    Create multiple patients (bulk upload)
 * @route   POST /api/patients/bulk
 * @access  Private
 */
const createPatients = async (req, res) => {
    try {
        const { patients } = req.body;

        if (!patients || !Array.isArray(patients) || patients.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of patients'
            });
        }

        // Add uploadedBy to each patient
        const patientsWithUser = patients.map(patient => ({
            ...patient,
            uploadedBy: req.user._id
        }));

        console.log(`Bulk uploading ${patientsWithUser.length} patients for user:`, req.user._id);

        // Bulk insert
        const savedPatients = await Patient.insertMany(patientsWithUser);

        console.log(`Successfully saved ${savedPatients.length} patients to database`);

        res.status(201).json({
            success: true,
            count: savedPatients.length,
            data: savedPatients
        });
    } catch (error) {
        console.error('Error creating patients:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving patients',
            error: error.message
        });
    }
};

/**
 * @desc    Get all patients for logged-in user
 * @route   GET /api/patients
 * @access  Private
 */
const getPatients = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 50 } = req.query;

        // Build query
        const query = { uploadedBy: req.user._id };

        console.log('Fetching patients for user:', req.user._id);

        // Add status filter
        if (status && status !== 'all') {
            query.status = status;
        }

        // Add search filter
        if (search) {
            query.$or = [
                { patientId: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query with pagination
        const patients = await Patient.find(query)
            .sort({ uploadDate: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('-__v');

        const total = await Patient.countDocuments(query);

        console.log(`Found ${patients.length} patients out of ${total} total for this user`);

        res.json({
            success: true,
            count: patients.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: patients
        });
    } catch (error) {
        console.error('Error getting patients:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving patients',
            error: error.message
        });
    }
};

/**
 * @desc    Get single patient by ID
 * @route   GET /api/patients/:id
 * @access  Private
 */
const getPatientById = async (req, res) => {
    try {
        console.log('Getting patient by ID:', req.params.id, 'for user:', req.user._id);

        // Find patient by patientId or _id with ownership check
        let patient;

        // Check if it's a MongoDB ObjectId (24 hex characters)
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            patient = await Patient.findOne({
                _id: req.params.id,
                uploadedBy: req.user._id
            });
        } else {
            // Search by custom patientId field with ownership check
            patient = await Patient.findOne({
                patientId: req.params.id,
                uploadedBy: req.user._id
            });
        }

        if (!patient) {
            console.log('Patient not found or access denied:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        console.log('Patient found:', patient._id);
        res.json({
            success: true,
            data: patient
        });
    } catch (error) {
        console.error('Error getting patient:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving patient',
            error: error.message
        });
    }
};

/**
 * @desc    Update patient details
 * @route   PUT /api/patients/:id
 * @access  Private
 */
const updatePatient = async (req, res) => {
    try {
        const { name, age, gender, bloodType, biomarkers, recommendations } = req.body;

        console.log('Update patient request:', {
            patientId: req.params.id,
            userId: req.user?._id,
            hasBiomarkers: !!biomarkers,
            hasRecommendations: !!recommendations
        });

        // Find patient with ownership check - doctors can only update their own patients
        let patient;

        // Check if it's a MongoDB ObjectId (24 hex characters)
        const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);

        if (isObjectId) {
            patient = await Patient.findOne({
                _id: req.params.id,
                uploadedBy: req.user._id
            });
        } else {
            patient = await Patient.findOne({
                patientId: req.params.id,
                uploadedBy: req.user._id
            });
        }

        if (!patient) {
            console.log('Patient not found:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        // Update fields
        if (name) patient.name = name;
        if (age) patient.age = age;
        if (gender) patient.gender = gender;
        if (bloodType) patient.bloodType = bloodType;
        if (biomarkers) {
            console.log('Updating biomarkers:', JSON.stringify(biomarkers, null, 2));
            patient.biomarkers = biomarkers;
            patient.markModified('biomarkers'); // Explicitly mark as modified
        }
        if (recommendations) patient.recommendations = recommendations;

        // Save updated patient
        try {
            await patient.save();
            console.log('Patient saved successfully. Biomarkers:', JSON.stringify(patient.biomarkers, null, 2));
        } catch (saveError) {
            console.error('Error saving patient:', saveError);
            if (saveError.name === 'ValidationError') {
                console.error('Validation errors:', saveError.errors);
            }
            throw saveError;
        }

        res.json({
            success: true,
            data: patient,
            message: 'Patient updated successfully'
        });
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating patient',
            error: error.message
        });
    }
};

/**
 * @desc    Delete patient
 * @route   DELETE /api/patients/:id
 * @access  Private
 */
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findOneAndDelete({
            _id: req.params.id,
            uploadedBy: req.user._id
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.json({
            success: true,
            message: 'Patient deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting patient',
            error: error.message
        });
    }
};

/**
 * @desc    Get patient statistics
 * @route   GET /api/patients/stats
 * @access  Private
 */
const getPatientStats = async (req, res) => {
    try {
        const stats = await Patient.aggregate([
            { $match: { uploadedBy: req.user._id } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    avgRiskScore: { $avg: '$riskScore' }
                }
            }
        ]);

        const total = await Patient.countDocuments({ uploadedBy: req.user._id });

        res.json({
            success: true,
            data: {
                total,
                byStatus: stats
            }
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving statistics',
            error: error.message
        });
    }
};

module.exports = {
    createPatients,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    getPatientStats
};
