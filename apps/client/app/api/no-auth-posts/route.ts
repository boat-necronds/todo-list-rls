import { getSql } from "@/lib/db"
import { posts } from "@/db/schema"

export async function GET() {
  const sql = getSql()
  const postsList = await sql.select().from(posts)

  return Response.json(postsList)
}
