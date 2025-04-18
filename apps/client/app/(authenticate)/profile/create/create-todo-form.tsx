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

import { todoInput, todoSchema, todoTaskInput, todoTaskInputSchema } from '@/features/todo/schema';
import { createTodo } from '@/features/todo/actions/todo-action';

export function CreateTodoForm() {
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

  const form = useForm<todoTaskInput>({
    resolver: zodResolver(todoTaskInputSchema),
    defaultValues: {
      task: '',
    },
  });

  async function onSubmit(values: todoTaskInput) {
    setLoading(true);
    try {
      const createTask = await createTodo(jwtdata ?? '', values.task);
      console.log(createTask);
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
            <CardTitle>Create Task</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/profile">
              <Button variant="ghost">Back</Button>
            </Link>
            <Button type="submit">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
