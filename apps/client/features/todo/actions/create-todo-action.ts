'use server';

import 'server-only';
import { redirect } from 'next/navigation';
import { todos } from '../../../app/(authenticate)/profile/components/schema';
import { getSql } from '@/lib/db';

export async function createTodo(jwt: string, task: string) {
  const sql = getSql(jwt);

  try {
    const inserted = await sql
      .insert(todos)
      .values({
        task: task,
        isComplete: false,
      })
      .returning();
    console.log('✅ Inserted todo:', inserted);

    return inserted;
  } catch (err) {
    console.error('Error updating user role:', err);
  }
  redirect('/profile');
}
