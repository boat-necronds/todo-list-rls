import NoneAuthPostslist from "./components/none-auth-posts"

export default async function page() {
  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      <NoneAuthPostslist />
    </div>
  )
}
