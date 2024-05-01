"use client";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { VerifySchema, VerifySchemaType } from "@/schemas/verifySchema";
import { client } from "@/server/client";
import { cn } from "@/lib/utils";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { toast } from "sonner";

function VerifyForm() {
  const router = useRouter();

  const form = useForm<VerifySchemaType>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code: "",
    },
  });

  const $post = client.api.auth.verify.$post;

  const { mutate, isPending } = useMutation<
    unknown,
    Error,
    VerifySchemaType,
    unknown
  >({
    mutationKey: ["verify"],
    mutationFn: async (input) => {

      const response = await $post({
        json: {
          ...input,
        },
      });

      const data = await response.json() as any;

      if (data.error) {
        throw new Error(data.error);
      }

      return data
    },
    onSuccess: (data) => {
      toast.success("Verification code verified successfully!");
      console.log("success 🟢: ", data);
      form.reset();
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log("error 🔴: ", error);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="space-y-6"
        >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the 6-digit verification code sent to your email
                address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />

        <Button type="submit" disabled={isPending}>
          <Loader2
            className={cn("mr-2 size-4 animate-spin", {
              [`inline`]: isPending,
              [`hidden`]: !isPending,
            })}
            />
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default VerifyForm;
