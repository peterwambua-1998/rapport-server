const crypto = require('crypto');
const { AdminToken } = require('../models');

class TokenManager {
    constructor() {
        this.encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    }

    encrypt(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
            'aes-256-gcm',
            this.encryptionKey,
            iv
        );

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();

        return {
            encryptedData: encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    decrypt(encryptedData, iv, authTag) {
        const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            this.encryptionKey,
            Buffer.from(iv, 'hex')
        );

        decipher.setAuthTag(Buffer.from(authTag, 'hex'));

        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    async saveToken(tokens) {
        const encrypted = this.encrypt(JSON.stringify(tokens));

        try {
            await AdminToken.upsert({
                encryptedToken: encrypted.encryptedData,
                iv: encrypted.iv,
                authTag: encrypted.authTag,
                expiresAt: new Date(tokens.expiry_date)
            });
        } catch (error) {
            console.error('Error saving token:', error);
            throw new Error('Failed to save token');
        }
    }

    async getToken() {
        try {
            const tokenRecord = await AdminToken.findOne({ where: { id: 1 } });

            if (!tokenRecord) return null;

            const decrypted = this.decrypt(
                tokenRecord.encryptedToken,
                tokenRecord.iv,
                tokenRecord.authTag
            );

            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Error retrieving token:', error);
            throw new Error('Failed to retrieve token');
        }
    }

    async deleteToken() {
        try {
            await AdminToken.destroy({
                where: { id: 1 }
            });
        } catch (error) {
            console.error('Error deleting token:', error);
            throw new Error('Failed to delete token');
        }
    }
}

module.exports = TokenManager;