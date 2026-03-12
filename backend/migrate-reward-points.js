/**
 * Migration script to set rewardPoints = 100 for all existing users
 * Run this once after deploying the reward points feature
 */

const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/user");

async function migrateRewardPoints() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Update all users who don't have rewardPoints set
        const result = await User.updateMany(
            { rewardPoints: { $exists: false } },
            { $set: { rewardPoints: 100 } }
        );

        console.log(`✨ Updated ${result.modifiedCount} users with 100 reward points`);

        // Also handle users with null or 0 rewardPoints
        const result2 = await User.updateMany(
            { $or: [{ rewardPoints: null }, { rewardPoints: 0 }] },
            { $set: { rewardPoints: 100 } }
        );

        console.log(`✨ Updated ${result2.modifiedCount} additional users with 100 reward points`);

        await mongoose.connection.close();
        console.log("✅ Migration complete");
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

migrateRewardPoints();
