import React from 'react';
import { CreateTodoForm } from './create-todo-form';

export default function Page() {
  return (
    <div className="min-h-[100vh] flex justify-center items-center flex-col bg-black text-white space-y-10">
      <h1 className="text-3xl font-bold">Create Todo</h1>
      <CreateTodoForm />
    </div>
  );
}
