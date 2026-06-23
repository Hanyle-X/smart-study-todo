import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <AppSidebar />
      <main className="mx-auto w-full max-w-[1220px] px-5 lg:ml-72 lg:px-8 xl:px-10">
        <Header />
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
