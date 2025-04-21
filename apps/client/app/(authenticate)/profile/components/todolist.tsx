"use client"

import { getSession, signOut } from "@/lib/auth-client"
import React, { useEffect, useState } from "react"
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
  const [jwtdata, setJwtdata] = useState<string | null>(null)
  const [todosData, setTodosData] = useState<Array<todoInput> | null>(null)
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

    async function fetchTodos() {
      if (!jwtdata) return
      const response = await fetch("/api/todos", {
        headers: {
          "auth-jwt": jwtdata,
        },
      })
      const todosList = (await response.json()) as Array<todoInput>
      setTodosData(todosList)
    }

    fetchTodos()
  }, [jwtdata])

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

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex w-full items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
          <h1 className="text-2xl font-bold">📝 Todo List</h1>
          <Link href="/profile/create">
            <Button className="bg-white text-purple-600 hover:bg-gray-200">
              Create Task
            </Button>
          </Link>
        </div>

        {/* Table */}
        <Table className="w-full border-collapse">
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="px-4 py-2 text-left text-white">
                Task ID
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-white">
                User ID
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-white">
                Task Name
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-white">
                Date
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-white">
                Complete
              </TableHead>
              <TableHead className="px-4 py-2 text-left text-white">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todosData && todosData.length > 0 ? (
              todosData.map((todo, index) => (
                <TableRow
                  key={todo.id.toString()}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition-colors`}
                >
                  <TableCell className="px-4 py-2 border-b">
                    {todo.id}
                  </TableCell>
                  <TableCell className="px-4 py-2 border-b">
                    {todo.userId}
                  </TableCell>
                  <TableCell className="px-4 py-2 border-b">
                    {todo.task}
                  </TableCell>
                  <TableCell className="px-4 py-2 border-b">
                    {new Date(todo.insertedAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-2 border-b">
                    {todo.isComplete ? "✅ Done" : "⏳ Pending"}
                  </TableCell>
                  <TableCell className="flex gap-4">
                    <Link href={`/profile/update/${todo.id}`}>
                      <Button className="bg-white text-purple-600 hover:bg-gray-200">
                        Edit
                      </Button>
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
                <TableCell colSpan={6} className="text-center py-4">
                  No tasks available...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
