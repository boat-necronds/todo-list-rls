'use server';

import 'server-only';
import { redirect } from 'next/navigation';
import { posts } from '@/db/schema';
import { getSql } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createPost(jwt: string, post: string) {
  const sql = getSql(jwt);

  try {
    const inserted = await sql
      .insert(posts)
      .values({
        post: post,
      })
      .returning();
    console.log('✅ Inserted post:', inserted);

    return inserted;
  } catch (err) {
    console.error('Error creating post:', err);
  }
  redirect('/profile');
}

export async function fetchPost(jwt: string, id: string) {
  const sql = getSql(jwt);

  try {
    const select = await sql
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    console.log('✅ Select post:', select);

    if (select.length === 0) {
      throw new Error('Post not found');
    }

    return select[0];
  } catch (err) {
    console.error('Error fetching post:', err);
    throw err;
  }
}

export async function updatePost(jwt: string, post: string, id: string) {
  const sql = getSql(jwt);

  try {
    const updated = await sql
      .update(posts)
      .set({
        post: post,
      })
      .where(eq(posts.id, id))
      .returning();
    console.log('✅ Updated post:', updated);

    return updated;
  } catch (err) {
    console.error('Error updating post:', err);
  }
  redirect('/profile');
}

export async function deletePost(jwt: string, id: string) {
  const sql = getSql(jwt);

  try {
    const deleted = await sql.delete(posts).where(eq(posts.id, id)).returning();
    console.log('✅ Deleted post:', deleted);

    return deleted;
  } catch (err) {
    console.error('Error deleting post:', err);
  }
  revalidatePath('/profile');
}
