import Link from "next/link";
import Logo from "./Logo";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4 py-10">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="mb-8 flex items-center justify-center">
          <Logo size={36} textSize={18} />
        </Link>
        <div
          className="rounded-[20px] bg-white p-7"
          style={{ border: "1px solid rgba(15,23,42,0.09)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
