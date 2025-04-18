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

import {
  todoInput,
  todoSchema,
  todoTaskInput,
  todoTaskInputSchema,
} from "@/features/todo/schema"
import { Label } from "@workspace/ui/components/label"
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
                // update defaultValues with fetched todo
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
    <Card className="min-w-[350px]">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
            <CardDescription>Edit your task here.</CardDescription>
          </CardHeader>
          <CardContent>
            {fetchLoading ? (
              <div className="flex flex-col justify-center space-y-3">
                <Label>Task</Label>
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Task"
                            aria-label="task"
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
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/profile">
              <Button variant="ghost">Back</Button>
            </Link>
            <Button type="submit" disabled={fetchLoading || loading}>
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
  )
}
