'use client';

import { getSession } from '@/lib/auth-client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { postsInput } from '@/features/post/schema';
import { deletePost } from '@/features/post/actions/post-action';

export default function PostsList() {
  const [jwtdata, setJwtdata] = useState<string | null>(null);
  const [postsData, setPostsData] = useState<Array<postsInput> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchJwt() {
      try {
        await getSession({
          fetchOptions: {
            onSuccess: (ctx) => {
              const jwt = ctx.response.headers.get('set-auth-jwt');
              console.log('jwt:', jwt);
              setJwtdata(jwt);
            },
          },
        });
      } catch (error) {
        console.log('error:', error);
      }
    }

    fetchJwt();
  }, []);

  useEffect(() => {
    if (!jwtdata) return;

    async function fetchPosts() {
      if (!jwtdata) return;
      const response = await fetch('/api/posts', {
        headers: {
          'auth-jwt': jwtdata,
        },
      });
      const postsList = (await response.json()) as Array<postsInput>;
      setPostsData(postsList);
    }

    fetchPosts();
  }, [jwtdata]);

  console.log(
    'postsData title:',
    postsData?.map((post) => post.post)
  );

  console.log(postsData?.map((post) => post.userId));

  async function deletePostItem(id: string) {
    setLoading(true);
    try {
      const deleted = await deletePost(jwtdata ?? '', id);
      console.log(deleted);
      window.location.reload();
    } catch (error) {
      console.log('error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold">Posts List</h1>
        <div className="flex gap-4">
          <Link href="/profile/create-post">
            <Button>Create Post</Button>
          </Link>
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
                <TableCell>{post.post}</TableCell>
                <TableCell>
                  {new Date(post.insertedAt).toLocaleString()}
                </TableCell>
                <TableCell className="flex gap-4">
                  <Link href={`/profile/update-post/${post.id}`}>
                    <Button>Edit</Button>
                  </Link>
                  <Button
                    onClick={() => deletePostItem(post.id)}
                    variant="destructive"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No posts ...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
