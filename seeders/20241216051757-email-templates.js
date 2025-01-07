'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('EmailTemplates', [
      // Registration Template
      {
        type: 'registration',
        subject: 'Welcome to TalentMatch!',
        body: `
          <div style="font-family: Arial, sans-serif; background-color: #F6F6F6; padding: 20px;">
            <div style="background-color: white; margin: auto; max-width: 600px; border-radius: 5px; overflow: hidden;">
              <div style="background-color: #1DA1F2; height: 40px;"></div>
              <div style="padding: 20px; text-align: center;">
                <h1 style="color: #333;">Welcome to TalentMatch!</h1>
                <p style="font-size: 16px; color: #555; line-height: 1.5;">Hi {{name}},</p>
                <p style="font-size: 16px; color: #555; line-height: 1.5;">
                  Thanks for your interest in joining TalentMatch! To complete your registration, we need you to verify your email address.
                </p>
                <p style="font-size: 16px; color: #555; line-height: 1.5;">Verification code: {{verificationLink}}</p>
                <p style="font-size: 14px; color: #777; margin-top: 10px;">
                  Please note that this code will expire in 12h.
                </p>
                <p style="font-size: 14px; color: #777;">
                  If you did not make this request, you do not need to do anything.
                </p>
              </div>
              <div style="background-color: #F6F6F6; text-align: center; padding: 10px; font-size: 12px; color: #999;">
                <p>Thanks for your time,<br>The TalentMatch Team</p>
              </div>
            </div>
          </div>`,
        status:1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Forgot Password Template
      {
        type: 'forgot_password',
        subject: 'Reset Your Password - TalentMatch',
        body: `
          <div style="font-family: Arial, sans-serif; background-color: #F6F6F6; padding: 20px;">
            <div style="background-color: white; margin: auto; max-width: 600px; border-radius: 5px; overflow: hidden;">
              <div style="background-color: #1DA1F2; height: 40px;"></div>
              <div style="padding: 20px; text-align: center;">
                <h1 style="color: #333;">Reset Your Password</h1>
                <p style="font-size: 16px; color: #555; line-height: 1.5;">Hi {{name}},</p>
                <p style="font-size: 16px; color: #555; line-height: 1.5;">
                  We received a request to reset your password. If this was you, click the button below to reset it.
                </p>
                <a href="{{resetLink}}" 
                  style="display: inline-block; text-decoration: none; background-color: #1DA1F2; color: white; padding: 12px 24px; font-size: 16px; border-radius: 5px; margin: 20px 0; font-weight: bold;">
                  Reset Password
                </a>
                <p style="font-size: 14px; color: #777;">
                  If you did not make this request, please ignore this email.
                </p>
              </div>
              <div style="background-color: #F6F6F6; text-align: center; padding: 10px; font-size: 12px; color: #999;">
                <p>Thanks for your time,<br>The TalentMatch Team</p>
              </div>
            </div>
          </div>
        `,
        status:1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Change Password Template
      {
        type: 'change_password',
        subject: 'Your Password Has Been Updated - TalentMatch',
        body: `
          <div style="font-family: Arial, sans-serif; background-color: #F6F6F6; padding: 20px;">
            <div style="background-color: white; margin: auto; max-width: 600px; border-radius: 5px; overflow: hidden;">
              <div style="background-color: #1DA1F2; height: 40px;"></div>
              <div style="padding: 20px; text-align: center;">
                <h1 style="color: #333;">Password Updated Successfully</h1>
                <p style="font-size: 16px; color: #555;">Hi {{name}},</p>
                <p style="font-size: 16px; color: #555;">
                  Your password has been successfully updated. If this was not you, please contact our support team immediately.
                </p>
              </div>
              <div style="background-color: #F6F6F6; text-align: center; padding: 10px; font-size: 12px; color: #999;">
                <p>Thanks for your time,<br>The TalentMatch Team</p>
              </div>
            </div>
          </div>
        `,
        status:1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Reset Password Success Template
      {
        type: 'reset_password_success',
        subject: 'Password Reset Successful - TalentMatch',
        body: `
          <div style="font-family: Arial, sans-serif; background-color: #F6F6F6; padding: 20px;">
            <div style="background-color: white; margin: auto; max-width: 600px; border-radius: 5px; overflow: hidden;">
              <div style="background-color: #1DA1F2; height: 40px;"></div>
              <div style="padding: 20px; text-align: center;">
                <h1 style="color: #333;">Password Reset Successful</h1>
                <p style="font-size: 16px; color: #555;">Hi {{name}},</p>
                <p style="font-size: 16px; color: #555;">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
              </div>
              <div style="background-color: #F6F6F6; text-align: center; padding: 10px; font-size: 12px; color: #999;">
                <p>Thanks for your time,<br>The TalentMatch Team</p>
              </div>
            </div>
          </div>
        `,
        status:1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('EmailTemplates', null, {});
  },
};
