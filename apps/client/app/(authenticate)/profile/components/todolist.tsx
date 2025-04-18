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
import { useRouter } from "next/navigation"
import { deleteTodo } from "@/features/todo/actions/todo-action"
import { todoInput } from "@/features/todo/schema"

export default function Todolist() {
  const [jwtdata, setJwtdata] = useState<string | null>(null);
  const [todosData, setTodosData] = useState<Array<todoInput> | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();


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


    async function fetchTodos() {
      if (!jwtdata) return;
      const response = await fetch('/api/todos', {
        headers: {
          'auth-jwt': jwtdata,
        },
      });
      const todosList = (await response.json()) as Array<todoInput>;
      setTodosData(todosList);
    }

    fetchTodos();
  }, [jwtdata]);


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
            todosData.map((todo) => (
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
