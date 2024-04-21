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

function RegisterForm() {
  const $post = client.api.auth.register.$post;

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
        form: {
          ...input,
        },
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    },
    onSuccess: (_, { email }) => {
      //   toast.success("Verification code sent");
      console.log("success 🟢: ", email);
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
                  <Input type="password" placeholder="********" {...field} />
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
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">
          <Loader2
            className={cn("mr-2 size-4 animate-spin", {
              [`inline`]: false,
              [`hidden`]: true,
            })}
          />
          Continue
        </Button>
      </form>
    </Form>
  );
}

export default RegisterForm;
