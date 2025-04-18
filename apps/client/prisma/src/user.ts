"use server"

import { db } from "./client"

export async function changeUserRole(role: string, userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return { error: "User not found" }
    }

    await db.user.update({
      where: { id: user.id },
      data: { role: role },
    })

    return { user }
  } catch (error) {
    return { error }
  }
}
