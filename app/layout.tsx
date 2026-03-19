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
          <div className="flex items-center justify-between px-6 py-4 border-b">
    <img
      src="https://go.ameripharmaspecialty.com/wp-content/uploads/2023/03/Specialty-Color-%C2%AE-Logo-1.png"
      alt="AmeriPharma Specialty Logo"
      className="h-10 object-contain"
    />
    <span className="text-lg font-semibold">
      Emergency Prep Planner
    </span>
  </div>
        {children}</body>
    </html>
  );
}
