import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hemophilia Emergency Planner",
  description: "Prototype app for family emergency planning and hemophilia go-bag readiness.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
