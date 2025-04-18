export default async function page() {
  console.log(process.env.BETTER_AUTH_SECRET)
  return (
    <div>
      <h1>My Todos</h1>
      <ul></ul>
    </div>
  )
}
