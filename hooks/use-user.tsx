"use client";

import { createClient } from "@/lib/supabase/client";
import { AuthUser, User } from "@supabase/supabase-js";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";

export const UserContext = createContext<{
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<AuthUser | null | undefined>>;
  fetchUser: () => void;
}>({
  user: undefined,
  setUser: () => {},
  fetchUser: () => {},
});

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children, ...props }: UserProviderProps) {
  const supabase = createClient();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  const fetchUser = useCallback(() => {
    supabase.auth
      .getUser()
      .then(({ data: { user }, error }) => {
        if (error) throw error;
        setUser(user || null);
      })
      .catch(() => setUser(null));
  }, [supabase]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider {...props} value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => use(UserContext);
