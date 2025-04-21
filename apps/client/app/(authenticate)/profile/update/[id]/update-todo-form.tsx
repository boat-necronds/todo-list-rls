"use client"

import { useEffect, useRef, useState } from "react"
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
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Input } from "@workspace/ui/components/input"
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
import { getSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

import { todoTaskInput, todoTaskInputSchema } from "@/features/todo/schema"
import { fetchTodo, updateTodo } from "@/features/todo/actions/todo-action"

interface UpdateTodoFormProps {
  id: string
}

export function UpdateTodoForm({ id }: UpdateTodoFormProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [fetchLoading, setFetchLoading] = useState<boolean>(true)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const [jwtdata, setJwtdata] = useState<string | null>(null)

  const form = useForm<todoTaskInput>({
    resolver: zodResolver(todoTaskInputSchema),
    defaultValues: {
      task: "",
    },
  })

  useEffect(() => {
    async function fetchJwtAndTodo() {
      try {
        await getSession({
          fetchOptions: {
            onSuccess: async (ctx) => {
              const jwt = ctx.response.headers.get("set-auth-jwt")
              console.log("jwt:", jwt)
              setJwtdata(jwt)

              if (jwt) {
                const todo = await fetchTodo(jwt, id)
                if (todo) {
                  form.reset({ task: todo.task })
                }
                setFetchLoading(false)
              }
            },
          },
        })
      } catch (error) {
        console.log("error:", error)
        setFetchLoading(false)
      }
    }

    fetchJwtAndTodo()
  }, [id, form])

  async function onSubmit(values: todoTaskInput) {
    setLoading(true)
    try {
      const updateTask = await updateTodo(jwtdata ?? "", values.task, id)
      console.log(updateTask)
      router.push("/profile")
    } catch (error) {
      console.log("error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 w-full">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <CardHeader className="p-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
              <CardTitle className="text-2xl font-bold">Edit Task</CardTitle>
              <CardDescription className="text-sm text-white">
                Update your task details below.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {fetchLoading ? (
                <div className="flex flex-col justify-center space-y-3">
                  <FormLabel>Task</FormLabel>
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="grid w-full items-center gap-4">
                  <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your task"
                            aria-label="Task"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="p-6 flex justify-between items-center">
              <Link href="/profile">
                <Button variant="ghost" className="text-purple-600">
                  Back
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={fetchLoading || loading}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Task"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
