"use server"

import { redirect } from "next/navigation"
import "server-only"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { todos } from "../../../app/(authenticate)/profile/components/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const getDb = (token: string) =>
  neon(
    "postgresql://authenticated@ep-little-waterfall-a4kayg2c.us-east-1.aws.neon.tech/authdb?sslmode=require",
    {
      authToken: token,
    }
  )

export async function deleteTodo(jwt: string, id: string) {
  const sql = drizzle(getDb(jwt), {
    logger: true,
  })

  try {
    const deleted = await sql.delete(todos).where(eq(todos.id, id)).returning()
    console.log("✅ Deleted todo:", deleted)

    return deleted
  } catch (err) {
    console.error("Error updating user role:", err)
  }
  revalidatePath("/profile")
}
