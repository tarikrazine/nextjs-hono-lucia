import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VerifyForm from "../components/verifyForm";

export default function VerifyPage() {
  return (
    <Card className="mx-auto w-[32rem] max-w-lg">
      <CardHeader>
        <CardTitle>Verify your account!</CardTitle>
      </CardHeader>
      <CardContent>
        <VerifyForm />
      </CardContent>
    </Card>
  );
}
