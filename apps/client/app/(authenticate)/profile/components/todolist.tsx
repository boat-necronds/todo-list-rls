"use client"

import { getSession, signOut } from "@/lib/auth-client"
import React, { useEffect, useState } from "react"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { todos } from "./schema"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { deleteTodo } from "@/features/todo/actions/delete-todo-action"
import { useRouter } from "next/navigation"

const getDb = (token: string) =>
  neon(
    "postgresql://authenticated@ep-little-waterfall-a4kayg2c.us-east-1.aws.neon.tech/authdb?sslmode=require",
    {
      authToken: token,
    }
  )

export default function Todolist() {
  const [jwtdata, setJwtdata] = useState<string | null>(null)
  const [todosData, setTodosData] = useState<Array<any> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  useEffect(() => {
    async function fetchJwt() {
      try {
        await getSession({
          fetchOptions: {
            onSuccess: (ctx) => {
              const jwt = ctx.response.headers.get("set-auth-jwt")
              console.log("jwt:", jwt)
              setJwtdata(jwt)
            },
          },
        })
      } catch (error) {
        console.log("error:", error)
      }
    }

    fetchJwt()
  }, [])

  useEffect(() => {
    if (!jwtdata) return

    const sql = drizzle(getDb(jwtdata), {
      logger: true,
    })

    async function fetchTodos() {
      const todosList = await sql.select().from(todos)
      console.log("todos:", todosList)
      setTodosData(todosList)
    }

    fetchTodos()
  }, [jwtdata])
  console.log(
    "todosData task :",
    todosData?.map((todo) => todo.task)
  )

  console.log(todosData?.map((todo) => todo.userId))

  async function deleteTask(id: string) {
    setLoading(true)
    try {
      const deleted = await deleteTodo(jwtdata ?? "", id)
      console.log(deleted)
      window.location.reload()
    } catch (error) {
      console.log("error:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    setLoading(true)
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in")
          },
        },
      })
    } catch (error) {
      console.log("error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* {todosData?.map((todo, index) => <div key={index}>{todo.task}</div>)} */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold">Todo List</h1>
        <div className="flex gap-4">
          <Link href="/profile/create">
            <Button>Create Task</Button>
          </Link>
          <Button onClick={handleLogout} variant="ghost">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Sign Out"
            )}
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Task Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Complete</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todosData && todosData.length > 0 ? (
            todosData.map((todo: any) => (
              <TableRow key={todo.id.toString()}>
                <TableCell>{todo.id}</TableCell>
                <TableCell>{todo.userId}</TableCell>
                <TableCell>{todo.task} </TableCell>
                <TableCell>
                  {new Date(todo.insertedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {todo.isComplete ? "✅ Done" : "⏳ Pending"}
                </TableCell>
                <TableCell className="flex gap-4">
                  <Link href={`/profile/update/${todo.id}`}>
                    <Button>Edit</Button>
                  </Link>
                  <Button
                    onClick={() => deleteTask(todo.id)}
                    variant="destructive"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No task ...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
