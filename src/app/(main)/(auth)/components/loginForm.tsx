"use client";

import { useRouter } from "next/navigation";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { client } from "@/server/client";
import { LoginSchema, LoginSchemaType } from "@/schemas/loginSchema";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter()
  
  const $post = client.api.auth.login.$post;

  const { mutate, isPending } = useMutation<
    unknown,
    Error,
    LoginSchemaType,
    unknown
  >({
    mutationKey: ["login"],
    mutationFn: async (input) => {
      console.log(input);

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
      console.log("success 🟢:", data)
      toast.success("Login successful");
      form.reset();
      router.push("/")  
    },
    onError: (error) => {
      toast.error(error.message);
      console.log("error 🔴: ", error.message);
    },
  });

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
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
        </div>
        <Button type="submit">
          <Loader2
            className={cn("mr-2 size-4 animate-spin", {
              [`inline`]: isPending,
              [`hidden`]: !isPending,
            })}
          />
          Login
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;




