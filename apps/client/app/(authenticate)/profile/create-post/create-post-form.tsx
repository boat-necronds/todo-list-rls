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
import { createPost } from '@/features/post/actions/post-action';

export function CreatePostForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [jwtdata, setJwtdata] = useState<string | null>(null);

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

  const form = useForm<postFormInput>({
    resolver: zodResolver(postFormInputSchema),
    defaultValues: {
      post: '',
    },
  });

  async function onSubmit(values: postFormInput) {
    setLoading(true);
    try {
      const createPostResult = await createPost(jwtdata ?? '', values.post);
      console.log(createPostResult);
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
            <CardTitle>Create Post</CardTitle>
            <CardDescription>
              Share your new post with the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/profile">
              <Button variant="ghost">Back</Button>
            </Link>
            <Button type="submit">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Post...
                </>
              ) : (
                'Create Post'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
