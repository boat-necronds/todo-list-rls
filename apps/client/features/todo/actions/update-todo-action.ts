'use server';

import 'server-only';
import { redirect } from 'next/navigation';
import { todos } from '../../../app/(authenticate)/profile/components/schema';
import { eq } from 'drizzle-orm';
import { getSql } from '@/lib/db';

export async function updateTodo(jwt: string, task: string, id: string) {
  const sql = getSql(jwt);

  try {
    const updated = await sql
      .update(todos)
      .set({
        task: task,
        isComplete: true,
      })
      .where(eq(todos.id, id))
      .returning();
    console.log('✅ Updated todo:', updated);

    return updated;
  } catch (err) {
    console.error('Error updating user role:', err);
  }
  redirect('/profile');
}
