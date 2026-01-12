// Test endpoint to verify biomarker update
const testBiomarkerUpdate = async (req, res) => {
    try {
        const { patientId, biomarkers } = req.body;

        console.log('TEST: Updating patient:', patientId);
        console.log('TEST: New biomarkers:', JSON.stringify(biomarkers, null, 2));

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        console.log('TEST: Current biomarkers:', JSON.stringify(patient.biomarkers, null, 2));

        patient.biomarkers = biomarkers;
        patient.markModified('biomarkers');

        await patient.save();

        // Verify the save
        const updated = await Patient.findById(patientId);
        console.log('TEST: After save biomarkers:', JSON.stringify(updated.biomarkers, null, 2));

        res.json({
            success: true,
            before: patient.biomarkers,
            after: updated.biomarkers
        });
    } catch (error) {
        console.error('TEST: Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { testBiomarkerUpdate };
