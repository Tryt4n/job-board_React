import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

export function useAuth() {
  const auth = useContext(AuthContext);

  if (auth == null) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return auth;
}
