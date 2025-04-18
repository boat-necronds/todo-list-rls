import { getSql } from '@/lib/db';
import { todos } from '@/db/schema';

export async function GET(request: Request) {
  const jwt = request.headers.get('auth-jwt');
  if (!jwt) {
    return new Response('Unauthorized', { status: 401 });
  }

  const sql = getSql(jwt);
  const todosList = await sql.select().from(todos);

  return Response.json(todosList);
}
