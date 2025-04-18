import { NextResponse } from "next/server"
import { changeUserRole } from "@/prisma/src/user"

export async function POST(req: Request) {
  const { userId, role } = await req.json()

  const result = await changeUserRole(role, userId)

  return NextResponse.json(result)
}