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
import {
  UserInputSignInForm,
  userSignInInputSchema,
} from "@/features/auth/schema"
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
import { signUp } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { updateRole } from "@/features/auth/action"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export function SignUpForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const form = useForm<UserInputSignInForm>({
    resolver: zodResolver(userSignInInputSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "user",
    },
  })

  async function onSubmit(values: UserInputSignInForm) {
    setLoading(true)
    try {
      const signupResult = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      })

      const updateroleResult = await fetch("/api/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: signupResult.data?.user.id,
          role: values.role,
        }),
      })

      console.log("updateroleResult", updateroleResult)
      router.push("/profile")
    } catch (error) {
      console.log("error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="min-w-[350px]">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="email"
                          aria-label="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <InputPassword
                          placeholder="Password"
                          aria-label="Password"
                          {...field}
                          showStrength={false}
                        />
                      </FormControl>
                      <FormMessage />
                      {form.formState.errors.root && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.root.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name"
                          aria-label="Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      {form.formState.errors.root && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.root.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/sign-in">
              <Button variant="ghost">Go to Sign In</Button>
            </Link>
            <Button type="submit">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
