import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterForm from "../components/registerForm";

export default function RegisterPage() {
  return (
    <Card className="mx-auto w-[32rem] max-w-lg">
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
        <CardDescription>Welcome!</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div>
          <span>Already have an account? </span>
          <Link className="text-blue-600 underline" href="/login">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
