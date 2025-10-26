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
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import {
  CheckIcon,
  ComputerIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MailIcon,
  MoonStarIcon,
  SunIcon,
  User2Icon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const supabase = createClient();
  const r = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [supabase]);

  return (
    <header className="flex items-center h-16 shrink-0 border-b px-4 w-full sticky top-0 bg-background/10 backdrop-blur-xl">
      <div className="container mx-auto flex items-center gap-2">
        <Link href={user ? "/dashboard" : "/"}>
          <h2 className="text-lg font-semibold tracking-tight">
            Mini Job Board
          </h2>
        </Link>
        {user !== undefined ? (
          <div className="flex items-center gap-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  {theme === "system" ? (
                    <ComputerIcon />
                  ) : theme === "light" ? (
                    <SunIcon />
                  ) : (
                    <MoonStarIcon />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setTheme("system")}>
                  <ComputerIcon />
                  System
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      theme === "system" ? "opacity-100" : "opacity-0",
                    )}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTheme("light")}>
                  <SunIcon />
                  Light
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      theme === "light" ? "opacity-100" : "opacity-0",
                    )}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTheme("dark")}>
                  <MoonStarIcon />
                  Dark
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      theme === "dark" ? "opacity-100" : "opacity-0",
                    )}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {user ? (
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
                  <Link href="/dashboard">
                    <DropdownMenuItem>
                      <HomeIcon />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/account">
                    <DropdownMenuItem>
                      <User2Icon />
                      Account
                    </DropdownMenuItem>
                  </Link>
                  <Link href="mailto:hi@lang.ski">
                    <DropdownMenuItem>
                      <MailIcon />
                      Contact Support
                    </DropdownMenuItem>
                  </Link>
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
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Avatar>
                      <AvatarFallback>
                        <User2Icon />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/auth">
                    <DropdownMenuItem>
                      <LogInIcon />
                      Login
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
