import { getUser } from "@/lib/user.server";

export const runtime = 'edge';

export default async function Home() {
  const user = await getUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(user, null, 2)}
    </main>
  );
}
