'use server';

import 'server-only';
import { todos } from '../../../app/(authenticate)/profile/components/schema';
import { getSql } from '@/lib/db';
import { eq } from 'drizzle-orm';

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
