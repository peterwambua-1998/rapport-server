exports.validateProfileInfo = async (profileInfo) => {
    const requiredFields = [
        'AboutMe', 'ProfessionalTitle', 'Location', 'Industry',
        'YearsofExperience', 'CurrentRole', 'Company'
    ];

    const missingFields = requiredFields.filter(field =>
        !profileInfo[field] || profileInfo[field] === ''
    );

    if (missingFields.length > 0) {
        return {
            isValid: false,
            missingFields,
            message: `Missing required fields: ${missingFields.join(', ')}`
        };
    }

    // Validate array properties
    const arrayValidations = [
        {
            field: 'Education',
            validate: (items) => items.length > 0 &&
                items.every(item =>
                    item.school && item.degree && item.major &&
                    item.startDate && item.endDate
                )
        },
        {
            field: 'WorkExperience',
            validate: (items) => items.length > 0 &&
                items.every(item =>
                    item.position && item.employer &&
                    item.description && item.startDate
                )
        },
        {
            field: 'Certifications',
            validate: (items) => items.length > 0 &&
                items.every(item => item.name && item.organization)
        },
        {
            field: 'Skills',
            validate: (items) => items.length > 0 &&
                items.every(item => item.name && item.proficiency)
        }
    ];

    for (const validation of arrayValidations) {
        if (!validation.validate(profileInfo[validation.field])) {
            return {
                isValid: false,
                missingFields: [validation.field],
                message: `Invalid or empty ${validation.field}`
            };
        }
    }

    return {
        isValid: true,
        missingFields: null,
        message: 'Profile is valid'
    };
}

exports.transformProfileInfo = (profileInfo) => {
    return {
        AboutMe: profileInfo.PersonalInformation?.about || '',
        ProfessionalTitle: profileInfo.ProfessionalInformation?.professionalTitle || '',
        Location: profileInfo.PersonalInformation?.location || '',
        Industry: profileInfo.PersonalInformation?.industry || '',
        videoUrl: profileInfo.video_path || '',
        profilePhotoUrl: profileInfo.avatar || '',
        YearsofExperience: profileInfo.ProfessionalInformation?.yearsOfExperience || 0,
        CurrentRole: profileInfo.ProfessionalInformation?.currentRole || '',
        Company: profileInfo.ProfessionalInformation?.company || '',
        LinkedInProfileUrl: profileInfo.ProfessionalInformation?.linkedIn || null,
        PortfolioUrl: profileInfo.ProfessionalInformation?.portfolio || null,
        GithubUrl: profileInfo.ProfessionalInformation?.github || '',

        Education: (profileInfo.Education || []).map(edu => ({
            school: edu.school,
            degree: edu.degree,
            major: edu.major,
            startDate: edu.startDate ? formatDate(edu.startDate) : '',
            endDate: edu.endDate ? formatDate(edu.endDate) : ''
        })),

        WorkExperience: (profileInfo.Experiences || []).map(exp => ({
            position: exp.position,
            employer: exp.employer,
            description: exp.description,
            startDate: exp.startDate ? formatDate(exp.startDate) : '',
            endDate: exp.endDate ? formatDate(exp.endDate) : '',
            currentlyWorking: exp.currentlyWorking
        })),

        Certifications: (profileInfo.Certifications || []).map(cert => ({
            name: cert.name,
            organization: cert.organization
        })),

        Skills: (profileInfo.Skills || []).map(skill => ({
            name: skill.name,
            proficiency: skill.proficiency
        }))
    };
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
}
