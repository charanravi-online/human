"use client";

import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    try {
      localStorage.removeItem("journal_password_hash");
      // Force page reload to clear state and re-render login gate
      window.location.reload();
    } catch (err) {
      console.error("Failed to lock journal", err);
      setIsLoading(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          disabled={isLoading}
          className="size-9 rounded-full text-muted-foreground hover:text-foreground transition-colors"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Lock className="size-4 stroke-[1.5]" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Lock journal</p>
      </TooltipContent>
    </Tooltip>
  );
}
