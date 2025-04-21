"use client"

import { getSession } from "@/lib/auth-client"
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
import { postInput } from "@/features/posts/schema"

export default function Postslist() {
  const [jwtdata, setJwtdata] = useState<string | null>(null)
  const [postsData, setPostsData] = useState<Array<postInput> | null>(null)

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
  }, [jwtdata])

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex w-full items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
          <h1 className="text-2xl font-bold">📬 Posts List</h1>
          {/* <Link href="/profile/create-post">
            <Button className="bg-white text-purple-600 hover:bg-gray-200">
              Create Post
            </Button>
          </Link> */}
        </div>

        {/* Table */}
        <Table className="w-full border-collapse">
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="px-4 py-2 text-left  text-white">
                Post ID
              </TableHead>
              <TableHead className="px-4 py-2 text-left  text-white">
                User ID
              </TableHead>
              <TableHead className="px-4 py-2 text-left  text-white">
                Post
              </TableHead>
              <TableHead className="px-4 py-2 text-left  text-white">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {postsData && postsData.length > 0 ? (
              postsData.map((post, index) => (
                <TableRow
                  key={post.id.toString()}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition-colors`}
                >
                  <TableCell className="px-4 py-2 border-b">
                    {post.id}
                  </TableCell>
                  <TableCell className="px-4 py-2 border-b">
                    {post.userId}
                  </TableCell>
                  <TableCell className="px-4 py-2 border-b">
                    {post.post}
                  </TableCell>
                  <TableCell className="px-4 py-2 border-b">
                    {new Date(post.insertedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No posts available...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
