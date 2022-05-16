import 'dotenv/config';

console.log(process.env.jwtSecret, '3333333333333333333333');
export const jwtConstants = {
  secret: process.env.jwtSecret,
};
