const passport = require("passport");
const axios = require("axios");
const boom = require("@hapi/boom");
const { OAuth2Strategy: GoogleStrategy } = require("passport-google-oauth");
const { config } = require("../../../config");

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, cb) => {
      const { data, status } = await axios({
        url: `${config.apiUrl}/api/auth/sign-provider`,
        method: "post",
        data: {
          name: profile._json.name,
          email: profile._json.email,
          password: profile.id,
          apiKeyToken: config.apiKeyToken,
        }
      });

      if (!data || status !== 200) {
        return cb(boom.unauthorized(), false);
      }

      return cb(null, data);
    }
  )
);
