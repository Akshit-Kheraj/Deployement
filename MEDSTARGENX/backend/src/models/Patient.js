const mongoose = require('mongoose');

const biomarkerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    normalRange: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['normal', 'elevated', 'abnormal', 'critical'],
        required: true
    }
}, { _id: false });

const modelProbabilitiesSchema = new mongoose.Schema({
    randomForest: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    gradientBoosting: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    xgboost: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
}, { _id: false });

const patientSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        min: 0,
        max: 150
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Unknown'],
        default: 'Unknown'
    },
    bloodType: {
        type: String,
        trim: true
    },
    riskScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['Malignant', 'Benign', 'Under Review'],
        required: true
    },
    prediction: {
        type: String,
        enum: ['Cancer', 'Non-Cancer'],
        required: true
    },
    riskCategory: {
        type: String,
        enum: ['Low Risk', 'Moderate Risk', 'High Risk', 'Very High Risk'],
        required: true
    },
    // Clinical Prediction Fields (from Hybrid ML System)
    drugAndDoseSuggestions: {
        type: String,
        trim: true
    },
    predictedResponseProbability: {
        type: Number,
        min: 0,
        max: 1
    },
    pharmacogenomicStatus: {
        type: String,
        trim: true
    },
    predictedToxicityType: {
        type: String,
        trim: true
    },
    adrs: {
        type: String,
        trim: true
    },
    contraindications: {
        type: String,
        trim: true
    },
    predictedResistanceType: {
        type: String,
        trim: true
    },
    resistanceManagementAction: {
        type: String,
        trim: true
    },
    monitoringAlert: {
        type: String,
        trim: true
    },
    doseAdjustmentRecommendation: {
        type: String,
        trim: true
    },
    clinicalActionAlert: {
        type: String,
        trim: true
    },
    biomarkers: [biomarkerSchema],
    modelProbabilities: modelProbabilitiesSchema,
    recommendations: [{
        type: String
    }],
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    uploadDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    lastAnalysis: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
patientSchema.index({ uploadedBy: 1, uploadDate: -1 });
patientSchema.index({ uploadedBy: 1, status: 1 });
patientSchema.index({ uploadedBy: 1, patientId: 1 });
patientSchema.index({ name: 'text', patientId: 'text' });

// Virtual for risk level
patientSchema.virtual('riskLevel').get(function () {
    if (this.riskScore >= 70) return 'High';
    if (this.riskScore >= 40) return 'Medium';
    return 'Low';
});

// Method to get patient summary
patientSchema.methods.getSummary = function () {
    return {
        id: this._id,
        patientId: this.patientId,
        name: this.name,
        riskScore: this.riskScore,
        status: this.status,
        uploadDate: this.uploadDate
    };
};

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
