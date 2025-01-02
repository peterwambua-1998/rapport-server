const env = require("./env");

const config = {
  server: {
    port: env.PORT,
    env: env.NODE_ENV,
  },
  app: {
    frontendUrl: env.FRONTEND_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRE,
  },
  email: {
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_SECURE,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
    from: env.EMAIL_FROM,
  },
  twilio: {
    accountSID: env.TWILIO_ACCOUNT_SID,
    authToken: env.TWILIO_AUTH_TOKEN,
    number: env.TWILIO_PHONE_NUMBER,
  },
  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    publishableKey: env.STRIPE_PUBLISHABLE_KEY,
    environment: env.STRIPE_ENVIRONMENT,
  },
  linkedin: {
    clientId: env.LINKEDIN_CLIENT_ID,
    clientSecret: env.LINKEDIN_CLIENT_SECRET,
    redirectURL: env.LINKEDIN_REDIRECT_URI,
  },
  openai: {
    apiKey: env.OPENAI_API_KEY,
    embeddingModel: env.OPENAI_EMBEDDING_MODEL,
    model: env.OPENAI_MODEL,
    maxTokens: env.OPENAI_MAX_TOKENS,
    temperature: env.OPENAI_TEMPERATURE,
    systemPrompt: `You are a social media manager for a friendly, customer-focused brand that prioritizes natural products. Your role is to respond to customer inquiries and comments in a warm, engaging, and enthusiastic tone. Use friendly emojis to enhance the message where appropriate. Your responses should be clear, concise, and show genuine excitement about the brand's products. Always make the customer feel valued and encouraged to take action or reach out again.`,
  },
  google: {
    appCredentials: env.GOOGLE_APPLICATION_CREDENTIALS,
  },
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
};

module.exports = config;
