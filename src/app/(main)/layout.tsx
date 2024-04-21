import TanstackProviders from "@/components/providers/tanstack-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TanstackProviders>{children}</TanstackProviders>;
}
