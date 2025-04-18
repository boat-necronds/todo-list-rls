import React from 'react';
import { CreatePostForm } from './create-post-form';

export default function Page() {
  return (
    <div className="min-h-[100vh] flex justify-center items-center flex-col bg-black text-white space-y-10">
      <CreatePostForm />
    </div>
  );
}
