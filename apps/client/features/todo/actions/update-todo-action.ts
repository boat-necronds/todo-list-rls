"use server"

import { redirect } from "next/navigation"
import "server-only"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { todos } from "../../../app/(authenticate)/profile/components/schema"
import { eq } from "drizzle-orm"

const getDb = (token: string) =>
  neon(
    "postgresql://authenticated@ep-little-waterfall-a4kayg2c.us-east-1.aws.neon.tech/authdb?sslmode=require",
    {
      authToken: token,
    }
  )

export async function updateTodo(jwt: string, task: string, id: string) {
  const sql = drizzle(getDb(jwt), {
    logger: true,
  })

  try {
    const updated = await sql
      .update(todos)
      .set({
        task: task,
        isComplete: true,
      })
      .where(eq(todos.id, id))
      .returning()
    console.log("✅ Updated todo:", updated)

    return updated
  } catch (err) {
    console.error("Error updating user role:", err)
  }
  redirect("/profile")
}
