import { getSql } from '@/lib/db';
import { posts } from '@/db/schema';

export async function GET(request: Request) {
  const jwt = request.headers.get('auth-jwt');
  if (!jwt) {
    return new Response('Unauthorized', { status: 401 });
  }

  const sql = getSql(jwt);
  const postsList = await sql.select().from(posts);

  return Response.json(postsList);
}
