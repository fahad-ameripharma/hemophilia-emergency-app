import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hemophilia Emergency Planner",
  description: "Prototype app for family emergency planning and hemophilia go-bag readiness.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="w-full border-b bg-white" style={{ paddingTop: "30px" }}>
          <div className="container mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-8">
            <img
              src="https://go.ameripharmaspecialty.com/wp-content/uploads/2023/03/Specialty-Color-%C2%AE-Logo-1.png"
              alt="AmeriPharma Specialty Logo"
              className="h-8 w-auto object-contain"
              style={{ width: "280px" }}
            />
            <div className="h-6 w-px bg-slate-200" />
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
