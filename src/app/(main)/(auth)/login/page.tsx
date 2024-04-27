import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "../components/loginForm";

export default function LoginPage() {
  return (
    <Card className="mx-auto w-[32rem] max-w-lg">
      <CardHeader>
        <CardTitle>Welcome back!</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div>
          <span>Don{"'"}t have an account? </span>
          <Link className="text-blue-600 underline" href="/register">
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
