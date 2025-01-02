

exports.linkedinMiddleware = async (req, res, next) => {
  try {
    const code = await req.query.code;
    const accessData = await getAccessToken(code);
    const userInfo = await getUserInfo(accessData.access_token);

    if (!userInfo) {
      // throw ...
    }

    const data = {
      first_name: userInfo.given_name ? userInfo.given_name : "",
      last_name: userInfo.family_name ? userInfo.family_name : "",
      email: userInfo.email ? userInfo.email : null,
      accessToken: accessData.access_token,
      provider: "linkedin",
    };

    req.body = data;
    next();
  } catch (error) {
    console.log("Error:getUserInfo", error);
  }
};
