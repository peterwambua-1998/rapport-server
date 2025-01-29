"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    async validatePassword(password) {
      return bcrypt.compare(password, this.password);
    }

    static associate(models) {
      User.hasOne(models.RecruiterProfile, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });

      User.hasOne(models.JobSeeker, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      User.hasMany(models.Skill, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      User.hasMany(models.CareerGoal, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      User.hasMany(models.SoftSkill, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      User.hasOne(models.VisibilitySetting, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      User.hasMany(models.JobseekerSkills, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      User.hasMany(models.MatchedCandidate, {
        foreignKey: "UserId",
        onDelete: "CASCADE",
      });

      User.hasOne(models.UserLinkedProfile, {
        foreignKey: "userId",
        as: "linkedProfile",
      });

      User.hasMany(models.Conversation, {
        foreignKey: "recruiterId",
        onDelete: "CASCADE",
      });

      User.hasMany(models.Conversation, {
        foreignKey: "jobSeekerId",
        onDelete: "CASCADE",
      });

      User.hasOne(models.userVerificationStatus, {
        foreignKey: 'userId',
      });

      User.hasOne(models.ProfessionalInformation, {
        foreignKey: 'userId',
      });

      User.hasOne(models.JobSeekerStat, {
        foreignKey: 'userId',
      });

      User.hasOne(models.PersonalInformation, {
        foreignKey: 'userId',
      });

      User.hasMany(models.TestimonialRequest, {
        foreignKey: 'userId',
      });

      User.hasMany(models.Testimonial, {
        foreignKey: 'userId',
      });

      User.hasMany(models.Interview, {
        foreignKey: 'userId',
      });

      User.hasMany(models.Experience, {
        foreignKey: 'userId',
      });

      User.hasMany(models.Education, {
        foreignKey: 'userId',
      });

      User.hasMany(models.Certification, {
        foreignKey: 'userId',
      });

      User.hasMany(models.Feature, {
        foreignKey: "createdBy",
        as: "creator",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      fName: { type: DataTypes.STRING, allowNull: false },
      mName: { type: DataTypes.STRING, allowNull: true },
      lName: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: true, unique: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: true },
      role: {
        type: DataTypes.ENUM("job_seeker", "recruiter", "admin"),
        allowNull: false,
      },
      avatar: { type: DataTypes.STRING, allowNull: true },
      cover_photo: { type: DataTypes.STRING, allowNull: true },
      video_path: { type: DataTypes.STRING, allowNull: true },
      resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
      resetPasswordExpire: { type: DataTypes.DATE, allowNull: true },
      linkedinId: { type: DataTypes.STRING, unique: true },
      linkedinIdLogin: { type: DataTypes.STRING, allowNull: false, defaultValue:false },
      verificationToken: { type: DataTypes.STRING, allowNull: true },
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      status: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        // beforeUpdate: async (user) => {
        //   if (user.changed("password")) {
        //     user.password = await bcrypt.hash(user.password, 10);
        //   }
        // }, 
      },
    }
  );

  return User;
};
