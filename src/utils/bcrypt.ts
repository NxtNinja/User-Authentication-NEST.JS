import * as bcrypt from 'bcrypt';

export const hashPassword = async (userPassword: string) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(userPassword, salt);
};

export const comparePasswords = async (userPassword: string, hash: string) => {
  return bcrypt.compare(userPassword, hash);
};

export const compareRefreshTokens = async (
  refresh_token: string,
  hashRt: string,
) => {
  return bcrypt.compare(refresh_token, hashRt);
};
