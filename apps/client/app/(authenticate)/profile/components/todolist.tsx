"use client"

import { getSession } from "@/lib/auth-client"
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

  console.log(todosData)
  return (
    <div>
      {/* {todosData?.map((todo, index) => <div key={index}>{todo.task}</div>)} */}
      <h1 className="text-3xl font-bold">Todo List</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Task Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Complete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todosData?.map((todo: any) => (
            <TableRow key={todo.id.toString()}>
              <TableCell>{todo.id}</TableCell>
              <TableCell>{todo.userId}</TableCell>
              <TableCell>{todo.task}</TableCell>
              <TableCell>
                {new Date(todo.insertedAt).toLocaleString()}
              </TableCell>
              <TableCell>
                {todo.isComplete ? "✅ Done" : "⏳ Pending"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
