"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordGateProps {
  onUnlock: () => void;
}

// Compute SHA-256 hash using browser's native Web Crypto API
async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const enteredHash = await sha256(password);
      const expectedHash = process.env.NEXT_PUBLIC_JOURNAL_PASSWORD_HASH;

      if (enteredHash === expectedHash) {
        // Store password hash in localStorage for session persistence
        localStorage.setItem("journal_password_hash", enteredHash);
        onUnlock();
      } else {
        setError("Incorrect password");
        setIsError(true);
        // Clear shake state after animation runs
        setTimeout(() => setIsError(false), 500);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Glowing Animated Icon Container */}
          <motion.div
            animate={isError ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
            className={`flex items-center justify-center size-16 rounded-full border bg-muted/30 transition-all duration-300 ${
              isError 
                ? "border-destructive/50 text-destructive bg-destructive/10" 
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lock className="size-6 stroke-[1.5]" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-xl font-medium tracking-tight">journal access</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              This section is password protected. Enter the password to view the contents.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4 pt-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                disabled={isLoading}
                className={`w-full h-11 px-4 pr-12 rounded-lg border bg-background/50 backdrop-blur-sm text-sm transition-all focus:outline-none focus:ring-1 ${
                  error 
                    ? "border-destructive focus:ring-destructive" 
                    : "border-input focus:border-foreground focus:ring-ring"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {showPassword ? (
                  <EyeOff className="size-4 stroke-[1.5]" />
                ) : (
                  <Eye className="size-4 stroke-[1.5]" />
                )}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-destructive text-left font-medium pl-1"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-lg text-sm transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin text-primary-foreground" />
              ) : (
                <>
                  <span>Unlock Journal</span>
                  <ArrowRight className="size-4 stroke-[1.5]" />
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
