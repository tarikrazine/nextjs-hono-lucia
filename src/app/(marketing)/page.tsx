import { validateRequest } from "@/lib/user.server";
import { LogIn, User2 } from "lucide-react";
import Link from "next/link";

export const runtime = "edge";

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <main className="flex justify-center items-center h-screen">
      {user ? (
        <div className="flex flex-col gap-y-4">
          <p className="text-2xl font-bold">Welcome {user.email}</p>
          {user && JSON.stringify(user, null, 2)}
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          <Link href="/register" className="flex bg-zinc-900 text-zinc-100 p-4 rounded-md"><User2 className="w-6 h-6 mr-2" />Register</Link>
          <Link href="/login" className="flex bg-zinc-900 text-zinc-100 p-4 rounded-md"><LogIn className="w-6 h-6 mr-2" />Login</Link>
        </div>
      )}
    </main>
  );
}
