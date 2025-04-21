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
import { postInput } from "@/features/posts/schema"

export default function NoneAuthPostslist() {
  const [jwtdata, setJwtdata] = useState<string | null>(null)
  const [postsData, setPostsData] = useState<Array<postInput> | null>(null)
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
    async function fetchPosts() {
      const response = await fetch("/api/no-auth-posts")
      const postList = (await response.json()) as Array<postInput>
      setPostsData(postList)
    }

    fetchPosts()
  }, [])

  console.log("Posts : ", postsData)

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
        <h1 className="text-3xl font-bold">Posts List</h1>
        <div className="flex gap-4">
          <Link href="/profile/create">
            <Button>Create Posts</Button>
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
            <TableHead>Post ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Post</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {postsData && postsData.length > 0 ? (
            postsData.map((post) => (
              <TableRow key={post.id.toString()}>
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.userId}</TableCell>
                <TableCell>{post.post} </TableCell>
                <TableCell>
                  {new Date(post.insertedAt).toLocaleString()}
                </TableCell>
                <TableCell className="flex gap-4">
                  <Link href={`/profile/update/${post.id}`}>
                    <Button>Edit</Button>
                  </Link>
                  <Button
                    onClick={() => deleteTask(post.id)}
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
                No post ...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
