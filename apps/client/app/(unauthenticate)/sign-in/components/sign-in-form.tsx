"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { InputPassword } from "@workspace/ui/components/input-password"
import { Input } from "@workspace/ui/components/input"
import { signInInput, signInSchema } from "@/features/auth/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function SignInForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const form = useForm<signInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: signInInput) {
    setLoading(true)
    try {
      const signinResult = await signIn.email({
        email: values.email,
        password: values.password,
      })
      router.push("/profile")
    } catch (error) {
      console.log("error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6 w-full">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="p-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription className="text-sm text-white">
            Access your account and manage your projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="grid w-full items-center gap-4">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          aria-label="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <InputPassword
                          placeholder="Enter your password"
                          aria-label="Password"
                          {...field}
                          showStrength={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <CardFooter className="flex justify-between items-center">
                <Link href="/sign-up">
                  <Button variant="ghost" className="text-purple-600">
                    Go to Sign Up
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
