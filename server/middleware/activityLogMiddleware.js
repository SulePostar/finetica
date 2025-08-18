/**
 * Middleware to extract IP address and user agent for activity logging
 * This middleware adds req.clientInfo to the request object
 */
const getClientInfo = (req, res, next) => {
    // Extract IP address
    const ipAddress =
        req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket?.remoteAddress ||
        'unknown';

    // Extract user agent
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Add client info to request object
    req.clientInfo = {
        ipAddress: ipAddress.split(',')[0].trim(), // Handle multiple IPs from proxy
        userAgent,
    };

    next();
};

module.exports = getClientInfo;
