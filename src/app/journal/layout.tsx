"use client";

import { useEffect, useState } from "react";
import { PasswordGate } from "@/components/password-gate";
import { LogoutButton } from "@/components/logout-button";

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedHash = localStorage.getItem("journal_password_hash");
    const expectedHash = process.env.NEXT_PUBLIC_JOURNAL_PASSWORD_HASH;

    if (storedHash && expectedHash && storedHash === expectedHash) {
      setIsAuthenticated(true);
    }
    setIsMounted(true);
  }, []);

  // Avoid flash of login form during initial hydration/mounting
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="size-6 animate-pulse rounded-full bg-muted/60" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasswordGate onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="relative">
      <div className="absolute -top-1.5 right-0 z-10">
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
