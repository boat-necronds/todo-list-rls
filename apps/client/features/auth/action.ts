"use server";

import { changeUserRole } from "@/prisma/src/user";
import { redirect } from "next/navigation";
import "server-only";

export async function updateRole(role: string, userId: string) {
  try {
    console.log("user id in action : ", userId);
    const user = await changeUserRole(role, userId);

    console.log("user change role", user);
    return user;
  } catch (err) {
    console.error("Error updating user role:", err);
  }
  redirect("/profile");
}

/* export async function signupAction(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
  let result: FormState = {
    status: "idle",
    message: undefined,
    errors: undefined,
    errorDetails: undefined,
    data: undefined,
  }
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  const userRole = cookieStore.get("userRole")?.value

  const validatedResult = userSignUpInputSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedResult.success) {
    result = {
      status: "error",
      message: "Invalid user data",
      errors: validatedResult.error.flatten().fieldErrors,
    }
    return result
  }

  const validatedData = validatedResult.data
  console.log("validatedData:", validatedData)

  const { user, error } = await createUser(
    validatedData.id ?? "",
    validatedData.username,
    validatedData.password ?? "",
    validatedData.role ?? "",
    userId ?? "",
    userRole ?? ""
  )

  console.log("user:", user)

  if (error) {
    result = {
      status: "error",
      message: "User creation failed",
    }
    return result
  }

  if (user) {
    result = {
      status: "success",
      message: "User created successfully",
      data: user,
    }
    redirect("/profile")
  }

  return result
} */

/* export async function signinAction(formData: FormData) {
  const data = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  }

  const result = userSignInInputSchema.safeParse(data)
  if (!result.success) {
    return { errors: result.error.format() }
  }

  const { user, error } = await loginUser(result.data.username)

  if (error) {
    return { error }
  }

  const cookieStore = await cookies()

  if (user) {
    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    if (user.role) {
      cookieStore.set("userRole", user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
    } else {
      console.error("User role is undefined or null!")
    }
  } else {
    console.error("User is undefined!")
  }

  redirect("/profile")
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("userId")
  redirect("/sign-in")
} */
