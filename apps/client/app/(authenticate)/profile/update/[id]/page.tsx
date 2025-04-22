import { UpdateTodoForm } from './update-todo-form';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="min-h-[100vh] flex justify-center items-center flex-col bg-black text-white space-y-10">
      <h1 className="text-3xl font-bold">Update Todo</h1>
      <UpdateTodoForm id={id} />
    </div>
  );
}
