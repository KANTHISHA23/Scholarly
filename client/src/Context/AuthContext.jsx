import { createContext } from "react";

export const AuthContext = createContext(null);
//to share authentication state (user, signOutFunc, authLoading, etc.) across the entire app without prop‑drilling.
