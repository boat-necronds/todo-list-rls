import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "../prisma/src/client"
import { admin, jwt } from "better-auth/plugins"
import { toNextJsHandler } from "better-auth/next-js"

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: 'iLEDrVZfXGXLv2Ilt2xwlpyPQ6Mk1am1',
  plugins: [
    jwt({
      jwks: {
        keyPairConfig: {
          alg: "RS256",
        },
      },
    }),
    admin(),
  ],
})

type Session = typeof auth.$Infer.Session

export type { Session }

export { toNextJsHandler }
