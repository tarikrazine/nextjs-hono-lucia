import TanstackProviders from "@/components/providers/tanstack-provider";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TanstackProviders><Toaster />{children}</TanstackProviders>;
}
