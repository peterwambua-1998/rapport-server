const TokenManager = require("../services/tokenManager.service");

exports.checkAuth = async (req, res, next) => {
    try {
        // For demonstration, using a fixed userId. In production, get from session/JWT
        const userId = process.env.YOUTUBE_CHANNEL_ID; 
        const manager = new TokenManager();
        const tokens = await manager.getToken();
        
        if (!tokens) {
            return res.redirect('/auth');
        }

        // Check if token needs refresh (5 minutes buffer)
        if (tokens.expiry_date - Date.now() < 300000) {
            oauth2Client.setCredentials(tokens);
            const { credentials } = await oauth2Client.refreshAccessToken();
            await tokenManager.saveToken(userId, credentials);
            oauth2Client.setCredentials(credentials);
        } else {
            oauth2Client.setCredentials(tokens);
        }
        
        next();
    } catch (error) {
        next(error);
    }
};