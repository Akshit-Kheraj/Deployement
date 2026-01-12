require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');

const MONGODB_URI = process.env.MONGODB_URI;

// Demo credentials
const DEMO_ACCOUNTS = {
    admin: {
        name: 'Admin User',
        email: 'admin@medstargenx.com',
        password: 'Admin@123',
        role: 'admin',
        userType: 'admin',
        isApproved: true,
        isActive: true,
    },
    doctor: {
        name: 'Dr. Sarah Johnson',
        email: 'doctor@medstargenx.com',
        password: 'Doctor@123',
        role: 'user',
        userType: 'doctor',
        specialization: 'Oncology',
        licenseNumber: 'MD-12345',
        isApproved: false,
        isActive: true,
    },
};

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

/**
 * Seed the database with demo accounts
 */
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seed...\n');

        // Connect to database
        await connectDB();

        // Clear all existing users
        console.log('🗑️  Clearing existing users...');
        await User.deleteMany({});
        console.log('✅ All existing users deleted\n');

        // Create demo accounts
        console.log('👥 Creating demo accounts...\n');

        const createdAccounts = [];

        for (const [type, userData] of Object.entries(DEMO_ACCOUNTS)) {
            const user = await User.create(userData);
            createdAccounts.push({
                type,
                email: user.email,
                password: userData.password,
                userType: user.userType,
                isApproved: user.isApproved,
            });
            console.log(`✅ Created ${type}:`, user.email);
        }

        // Display credentials
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║                    DEMO ACCOUNTS CREATED                   ║');
        console.log('╠════════════════════════════════════════════════════════════╣');
        console.log('║                                                            ║');

        createdAccounts.forEach(account => {
            console.log('║  ' + account.type.toUpperCase().padEnd(54) + '║');
            console.log('║  Email: ' + account.email.padEnd(47) + '║');
            console.log('║  Password: ' + account.password.padEnd(44) + '║');
            console.log('║  Type: ' + account.userType.padEnd(48) + '║');
            console.log('║  Approved: ' + (account.isApproved ? 'Yes' : 'No').padEnd(44) + '║');
            console.log('║                                                            ║');
        });

        console.log('╚════════════════════════════════════════════════════════════╝');
        console.log('\n📝 Note: Doctor account needs admin approval before login');
        console.log('🔐 Login as admin to approve from the admin dashboard\n');

        console.log('✨ Database seeding completed successfully!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed script
seedDatabase();
