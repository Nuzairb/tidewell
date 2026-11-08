import { AppShell } from "@/components/dashboard/app-shell"

export default function AppLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>
}
