// lib/auth/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabaseBrowser } from './supabaseBrowser'

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginToken: string | null;
  signOut: () => Promise<void>;
  refreshLoginToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_STORAGE_KEY = "eswap.loginToken";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loginToken, setLoginToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = supabaseBrowser();

  const persistToken = useCallback((token: string | null) => {
    setLoginToken(token);

    if (typeof window === "undefined") {
        return;
    }

    if (token) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
}, []);

const createLoginToken = useCallback(
    async (currentUser: User) => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: currentUser.id,
                    email: currentUser.email ?? undefined,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create login token: ${response.status}`);
            }

            const data = (await response.json()) as { token?: string };

            if (!data.token || typeof data.token !== "string") {
                throw new Error("Invalid login token response");
            }

            persistToken(data.token);
        } catch (error) {
            console.error("Failed to create login token:", error);
            persistToken(null);
        }
    },
    [persistToken]
);

const handleUserStateChange = useCallback(
    async (currentUser: User | null) => {
        setUser(currentUser);

        if (currentUser) {
            await createLoginToken(currentUser);
        } else {
            persistToken(null);
        }
    },
    [createLoginToken, persistToken]
);

useEffect(() => {
    if (typeof window === "undefined") {
        return;
    }

    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
        setLoginToken(storedToken);
    }
}, []);

useEffect(() => {
    const getSession = async () => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            await handleUserStateChange(session?.user ?? null);
        } catch (error) {
            console.error("Failed to get initial session:", error);
            setUser(null);
            persistToken(null);
        } finally {
            setLoading(false);
        }
    };

    getSession();

    // Listen for auth changes
    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
        await handleUserStateChange(session?.user ?? null);
        setLoading(false);
    });

    return () => subscription.unsubscribe();
}, [handleUserStateChange, persistToken]);

// Ensure loginToken exists after OAuth redirect if user is present
useEffect(() => {
    const ensureLoginToken = async () => {
        if (user && !loginToken) {
            await createLoginToken(user);
        }
    };
    void ensureLoginToken();
}, [user, loginToken, createLoginToken]);

const signOut = async () => {
    try {
        await supabase.auth.signOut();
        persistToken(null);
        setUser(null);
    } catch (error) {
        console.error("Failed to sign out:", error);
        throw error;
    }
};


const refreshLoginToken = useCallback(async () => {
    if (!user) {
        persistToken(null);
        return;
    }

    await createLoginToken(user);
}, [createLoginToken, persistToken, user]);

return (
    <AuthContext.Provider
        value={{ user, loading, loginToken, signOut, refreshLoginToken }}
    >
        {children}
    </AuthContext.Provider>
);
}

export function useAuth() {
const context = useContext(AuthContext);
if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
}
return context;
}
