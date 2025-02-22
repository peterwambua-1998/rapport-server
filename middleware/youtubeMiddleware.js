const TokenManager = require("../services/tokenManager.service");
const { google } = require('googleapis');

const checkAuth = async (req, res, next) => {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            process.env.YOUTUBE_REDIRECT_URI
        );

        const tokenManager = new TokenManager();
        const tokens = await tokenManager.getToken();

        if (tokens.tokenRec == null) {
            return res.redirect('/api/auth/youtube/authorize');
        }
        // Check if token needs refresh (5 minutes buffer)
        console.log('Youtube middleware');
        console.log(tokens.tokenRec.expiresAt - Date.now() < 300000);
        
        if (tokens.tokenRec.expiresAt - Date.now() < 300000) {
            oauth2Client.setCredentials(tokens.encryptedData);
            const { credentials } = await oauth2Client.refreshAccessToken();
            await tokenManager.saveToken(credentials);
            oauth2Client.setCredentials(credentials);
        } else {
            oauth2Client.setCredentials(tokens.encryptedData);
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = checkAuth;