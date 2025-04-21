/* eslint-disable turbo/no-undeclared-env-vars */
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

function getRoleFromJwt(token: string): string | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = parts[1]
      ? JSON.parse(Buffer.from(parts[1], "base64").toString())
      : null

    return payload.role || null
  } catch (error) {
    console.error("Error parsing JWT payload:", error)
    return null
  }
}

export const getDb = (jwt?: string) => {
  let databaseUrl: string

  try {
    if (!jwt) {
      console.log("No JWT provided, using authenticated URL without token")
      if (!process.env.DATABASE_ANONYMOUS_URL) {
        throw new Error("DATABASE_AUTHENTICATED_URL is not defined")
      }
      databaseUrl = process.env.DATABASE_ANONYMOUS_URL
      return neon(databaseUrl)
    }

    const role = getRoleFromJwt(jwt)

    if (role === "superadmin") {
      console.log("Owner", process.env.DATABASE_URL)
      if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined")
      }
      databaseUrl = process.env.DATABASE_URL
      return neon(databaseUrl)
    } else {
      console.log("Authenticate", process.env.DATABASE_AUTHENTICATED_URL)
      if (!process.env.DATABASE_AUTHENTICATED_URL) {
        throw new Error("DATABASE_AUTHENTICATED_URL is not defined")
      }
      databaseUrl = process.env.DATABASE_AUTHENTICATED_URL
      return neon(databaseUrl, {
        authToken: jwt,
      })
    }
  } catch (error) {
    console.error("Error processing database connection:", error)

    if (!process.env.DATABASE_AUTHENTICATED_URL) {
      throw new Error("DATABASE_AUTHENTICATED_URL is not defined")
    }
    databaseUrl = process.env.DATABASE_AUTHENTICATED_URL
    return neon(databaseUrl)
  }
}

export const getSql = (jwt?: string) =>
  drizzle(getDb(jwt), {
    logger: true,
  })
