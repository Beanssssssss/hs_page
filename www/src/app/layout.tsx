import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Hateslop",
  description: "AI Generation Archive & Demo Showcase",
};

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="mt-40 border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-12 py-20">
        <div className="flex flex-col gap-16 sm:flex-row sm:justify-between">
          
          {/* Branding */}
          <div className="space-y-5">
            <p className="text-[22px] font-semibold">Hateslop</p>
            <p className="text-[17px] text-zinc-500 leading-relaxed">
              AI Generation Archive <br />
              & Demo Showcase
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 text-[17px] text-zinc-600">
            <Link
              href="https://www.instagram.com/your_instagram_id"
              target="_blank"
              className="hover:text-zinc-900 transition"
            >
              Instagram
            </Link>
            <Link
              href="https://github.com/your_github_id"
              target="_blank"
              className="hover:text-zinc-900 transition"
            >
              GitHub
            </Link>
            <Link
              href="mailto:your@email.com"
              className="hover:text-zinc-900 transition"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-16 border-t pt-10 text-[15px] tracking-wide text-zinc-400">
          © 2025 Hateslop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Root Layout ---------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-bogle min-h-screen flex flex-col text-[19px]">
        <Providers>

          {/* Header / Navigation */}
          <header className="border-b px-12 py-8">
            <nav className="flex items-center justify-between text-[22px] font-medium">
              
              {/* Left Nav */}
              <div className="flex gap-16 tracking-normal">
                <Link href="/">Home</Link>
                <Link href="/intro">Introduce</Link>
                <Link href="/recruit">Recruit</Link>
                <Link href="/projects">Projects</Link>
              </div>

              {/* Right Nav (Admin) */}
              <div>
                {/* ✅ 개발용 */}
                <a
                  href="http://localhost:3001/login"
                  className="text-[18px] text-zinc-500 hover:text-zinc-900 transition"
                >
                  Admin
                </a>

                {/* ✅ 배포용 */}
                {/* <a
                  href="https://admin.hateslop.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[18px] text-zinc-500 hover:text-zinc-900 transition"
                >
                  Admin
                </a> */}
              </div>

            </nav>
          </header>

          {/* Main */}
          <main className="flex-1 px-8 sm:px-12 py-24 leading-relaxed">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}