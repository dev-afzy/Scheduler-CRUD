console.log(process.env.BASE_API_URL);
exports.api = {
  baseUrl: process.env.BASE_API_URL,
  port: process.env.PORT,
};

exports.mail = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  user: process.env.MAIL_ID,
  password: process.env.MAIL_PASSWORD,
};

exports.mongodb = {
  DATABASE_URL: process.env.DATABASE_URL,
};

exports.redis = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
};

exports.jwt = {
  secret: process.env.JWT_SECRET,
  refreshToken: process.env.JWT_REFRESH_SECRET,
  passwordResetToken: process.env.JWT_PASSWORD_RESET_SECRET,
};
