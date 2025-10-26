"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOutIcon, User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const supabase = createClient();
  const r = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [supabase]);

  return (
    <div>
      <header className="flex items-center h-16 shrink-0 border-b px-4 w-full sticky top-0 bg-background/10 backdrop-blur-xl">
        <div className="container mx-auto flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight">
            Mini Job Board
          </h2>
          <div className="flex items-center gap-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Avatar>
                    <AvatarFallback>
                      {user?.user_metadata?.full_name ? (
                        user.user_metadata.full_name
                          .split(" ")
                          .slice(0, 2)
                          .map((n: string) => n[0].toUpperCase())
                          .join("")
                      ) : (
                        <User2Icon />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {user?.user_metadata?.full_name ? (
                          user.user_metadata.full_name
                            .split(" ")
                            .slice(0, 2)
                            .map((n: string) => n[0].toUpperCase())
                            .join("")
                        ) : (
                          <User2Icon />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user?.user_metadata?.full_name}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={async () => {
                    await supabase.auth.signOut();
                    r.refresh();
                  }}
                >
                  <LogOutIcon />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 h-screen">Dashboard Home</main>
    </div>
  );
}
