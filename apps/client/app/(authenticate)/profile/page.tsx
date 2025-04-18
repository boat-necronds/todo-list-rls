import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import Todolist from './components/todolist';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import PostsList from './components/post-list';
import SignOut from './components/sign-out';

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    console.log('ไม่เจอ session');
  }
  console.log(session);

  return (
    <div className="min-h-[100vh] flex justify-center items-center flex-col bg-black text-white space-y-10">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 items-center">
            <div>Id : </div>
            <div>{session?.user.id}</div>
          </div>
          <div className="flex space-x-2 items-center">
            <div>Name : </div>
            <div>{session?.user.name}</div>
          </div>
          <div className="flex space-x-2 items-center">
            <div>Email : </div>
            <div>{session?.user.email}</div>
          </div>
          <div className="flex space-x-2 items-center">
            <div>Role : </div>
            <div>{session?.user.role}</div>
          </div>
          <SignOut />
        </CardContent>
      </Card>

      <div className="flex flex-col w-full px-4 md:px-[10%] space-y-16">
        <Todolist />
        <Separator className="my-4" />
        <PostsList />
      </div>
    </div>
  );
}
