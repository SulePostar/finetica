class Logger {
    static info(msg) {
        console.log(`[${new Date().toISOString()}] ℹ️  ${msg}`);
    }

    static success(msg) {
        console.log(`[${new Date().toISOString()}] ✅ ${msg}`);
    }

    static warn(msg) {
        console.log(`[${new Date().toISOString()}] ⚠️  ${msg}`);
    }

    static error(msg) {
        console.log(`[${new Date().toISOString()}] ❌ ${msg}`);
    }

    static debug(msg) {
        if (process.env.DEBUG) {
            console.log(`[${new Date().toISOString()}] 🐛 ${msg}`);
        }
    }
}

module.exports = Logger;
