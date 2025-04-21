import NoneAuthPostslist from "./none-auth-posts-lists"

export default function ProfilePage() {
  return (
    <div className="min-h-[100vh] bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center w-full">
      <div className="w-full max-w-4xl space-y-10">
        {/* Posts List */}
        <div className="bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📬 Posts List (No Authnticate)
          </h2>
          <NoneAuthPostslist />
        </div>
      </div>
    </div>
  )
}
