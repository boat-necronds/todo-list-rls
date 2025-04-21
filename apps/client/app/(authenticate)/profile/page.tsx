import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import Todolist from "./components/todolist"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import Postslist from "./components/postlist"
import Link from "next/link"
import LogoutButton from "./components/logout-button"
import { User, Mail, Shield } from "lucide-react"

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    console.log("ไม่เจอ session")
  }
  console.log(session)

  return (
    <div className="min-h-[100vh] bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center p-6">
      <div className="w-full max-w-4xl space-y-10">
        {/* Profile Card */}
        <Card className="shadow-xl rounded-lg overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-6">
            <CardTitle className="text-3xl font-bold">👤 Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
              <User className="text-blue-500 w-6 h-6" />
              <div className="font-semibold text-gray-700">Id:</div>
              <div className="text-gray-900">{session?.user.id}</div>
            </div>
            <div className="flex items-center space-x-4">
              <User className="text-blue-500 w-6 h-6" />
              <div className="font-semibold text-gray-700">Name:</div>
              <div className="text-gray-900">{session?.user.name}</div>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="text-blue-500 w-6 h-6" />
              <div className="font-semibold text-gray-700">Email:</div>
              <div className="text-gray-900">{session?.user.email}</div>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="text-blue-500 w-6 h-6" />
              <div className="font-semibold text-gray-700">Role:</div>
              <div className="text-gray-900">{session?.user.role}</div>
            </div>
          </CardContent>
          <CardFooter className="p-6 bg-gray-50 flex justify-end">
            <LogoutButton />
          </CardFooter>
        </Card>

        {/* Todo List */}
        <div className="bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Todo List</h2>
          <Todolist />
        </div>

        {/* Posts List */}
        <div className="bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📬 Posts List</h2>
          <Postslist />
        </div>
      </div>
    </div>
  )
}
