/* eslint-disable turbo/no-undeclared-env-vars */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export const getDb = (token: string) => {
  if (!process.env.DATABASE_AUTHENTICATED_URL) {
    throw new Error(
      'DATABASE_AUTHENTICATED_URL is not defined in environment variables'
    );
  }
  return neon(process.env.DATABASE_AUTHENTICATED_URL, {
    authToken: token,
  });
};

export const getSql = (jwt: string) =>
  drizzle(getDb(jwt), {
    logger: true,
  });
