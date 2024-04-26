"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterSchema, RegisterSchemaType } from "@/schemas/registerSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { client } from "@/server/client";
import { useRouter } from "next/navigation";

function RegisterForm() {
  const router = useRouter()
  
  const $post = (client as any).api.auth.register.$post;

  const { mutate, isPending } = useMutation<
    unknown,
    Error,
    RegisterSchemaType,
    unknown
  >({
    mutationKey: ["register"],
    mutationFn: async (input) => {
      console.log(input);

      const response = await $post({
        json: {
          ...input,
        },
      });

      if (!response.ok) {
        throw new Error(response);
      }

      return await response.json();
    },
    onSuccess: (_, { email }) => {
      //   toast.success("Verification code sent");
      console.log("success 🟢: ", email);
      form.reset();
      // router.push("/login")  
    },
    onError: (error) => {
      //   toast.error("Failed to send verification code");
      console.log("error 🔴: ", error);
    },
  });

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((values) => mutate(values))}
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Confirmation</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">
          <Loader2
            className={cn("mr-2 size-4 animate-spin", {
              [`inline`]: isPending,
              [`hidden`]: !isPending,
            })}
          />
          Register
        </Button>
      </form>
    </Form>
  );
}

export default RegisterForm;




