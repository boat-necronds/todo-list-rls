'use server';

import 'server-only';
import { todos } from '../../../app/(authenticate)/profile/components/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getSql } from '@/lib/db';

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
