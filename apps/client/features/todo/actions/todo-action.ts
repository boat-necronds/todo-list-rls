'use server';

import 'server-only';
import { redirect } from 'next/navigation';
import { todos } from '@/db/schema';
import { getSql } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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

export async function fetchTodo(jwt: string, id: string) {
  const sql = getSql(jwt);

  try {
    const select = await sql
      .select()
      .from(todos)
      .where(eq(todos.id, id))
      .limit(1);

    console.log('✅ Select todo:', select);

    if (select.length === 0) {
      throw new Error('Todo not found');
    }

    return select[0];
  } catch (err) {
    console.error('Error fetching todo:', err);
    throw err;
  }
}

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

export async function deleteTodo(jwt: string, id: string) {
  const sql = getSql(jwt);

  try {
    const deleted = await sql.delete(todos).where(eq(todos.id, id)).returning();
    console.log('✅ Deleted todo:', deleted);

    return deleted;
  } catch (err) {
    console.error('Error updating user role:', err);
  }
  revalidatePath('/profile');
}
