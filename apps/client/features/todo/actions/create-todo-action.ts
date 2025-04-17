"use server"

import { redirect } from "next/navigation"
import "server-only"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { todos } from "../../../app/(authenticate)/profile/components/schema"

const getDb = (token: string) =>
  neon(
    "postgresql://authenticated@ep-little-waterfall-a4kayg2c.us-east-1.aws.neon.tech/authdb?sslmode=require",
    {
      authToken: token,
    }
  )

export async function createTodo(jwt: string, task: string) {
  const sql = drizzle(getDb(jwt), {
    logger: true,
  })

  try {
    const inserted = await sql
      .insert(todos)
      .values({
        task: task,
        isComplete: false,
      })
      .returning()
    console.log("✅ Inserted todo:", inserted)

    return inserted
  } catch (err) {
    console.error("Error updating user role:", err)
  }
  redirect("/profile")
}
