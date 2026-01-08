const mongoose = require("mongoose");

async function connectMongo() {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL environment variable is not set");
        }

        if (!process.env.MONGO_DB_NAME) {
            throw new Error("MONGO_DB_NAME environment variable is not set");
        }

        const url = process.env.MONGO_URL;
        const dbName = process.env.MONGO_DB_NAME;

        // Build connection URL - add database name to the end
        const connectionUrl = url.endsWith('/')
            ? `${url}${dbName}`
            : `${url}/${dbName}`;



        await mongoose.connect(connectionUrl);

        console.log(`✅ MongoDB connected successfully to database: ${dbName}`);
        return mongoose.connection;
    } catch (error) {
        if (error.code === 8000 || error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
            console.error("❌ MongoDB Authentication failed!");
            console.error("   Please check your MONGO_URL in .env file:");
            console.error("   - Verify username and password are correct");
            console.error("   - Make sure special characters in password are URL-encoded");
            console.error("   - Format: mongodb+srv://username:password@cluster.mongodb.net");
        } else {
            console.error("❌ MongoDB connection failed:", error.message);
        }
        throw error;
    }
}

module.exports = { connectMongo };
