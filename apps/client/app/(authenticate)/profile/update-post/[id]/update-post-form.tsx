'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Input } from '@workspace/ui/components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { getSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { postFormInput, postFormInputSchema } from '@/features/post/schema';
import { fetchPost, updatePost } from '@/features/post/actions/post-action';

interface UpdatePostFormProps {
  id: string;
}

export function UpdatePostForm({ id }: UpdatePostFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [jwtdata, setJwtdata] = useState<string | null>(null);

  const form = useForm<postFormInput>({
    resolver: zodResolver(postFormInputSchema),
    defaultValues: {
      post: '',
    },
  });

  useEffect(() => {
    async function fetchJwtAndPost() {
      try {
        await getSession({
          fetchOptions: {
            onSuccess: async (ctx) => {
              const jwt = ctx.response.headers.get('set-auth-jwt');
              console.log('jwt:', jwt);
              setJwtdata(jwt);

              if (jwt) {
                const post = await fetchPost(jwt, id);
                if (post) {
                  form.reset({ post: post.post });
                }
                setFetchLoading(false);
              }
            },
          },
        });
      } catch (error) {
        console.log('error:', error);
        setFetchLoading(false);
      }
    }

    fetchJwtAndPost();
  }, [id, form]);

  async function onSubmit(values: postFormInput) {
    setLoading(true);
    try {
      const updatePostResult = await updatePost(jwtdata ?? '', values.post, id);
      console.log(updatePostResult);
      router.push('/profile');
    } catch (error) {
      console.log('error:', error);
    } finally {
      setLoading(false);
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
            <CardTitle>Edit Post</CardTitle>
            <CardDescription>Update your post details here.</CardDescription>
          </CardHeader>
          <CardContent>
            {fetchLoading ? (
              <div className="flex flex-col justify-center space-y-3">
                <div>
                  <FormLabel>Title</FormLabel>
                  <Skeleton className="h-8 w-full" />
                </div>
                <div>
                  <FormLabel>Content</FormLabel>
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ) : (
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="post"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Post Title"
                            aria-label="title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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
                'Update Post'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
