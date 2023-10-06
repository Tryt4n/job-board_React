import { ReactElement, createContext, useEffect, useState } from "react";
import { User } from "../constants/types";
import {
  signup as signupService,
  login as loginService,
  logout as logoutService,
  getLoggedInUser,
} from "../services/authentication";
import { useLocation, useNavigate } from "react-router-dom";
import { LogoutDialog } from "../components/LogoutDialog";

type AuthProviderPropsType = {
  children?: ReactElement | ReactElement[];
};

type AuthContextType = {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  isLoadingUser: boolean;
  user?: User;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderPropsType) {
  const [user, setUser] = useState<User>();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoadingUser(true);

    getLoggedInUser()
      .then(setUser)
      .finally(() => {
        setIsLoadingUser(false);
      });
  }, []);

  function login(email: string, password: string) {
    return loginService(email, password).then((user) => {
      setUser(user);
      navigate(location.state?.location ?? "/");
    });
  }

  function signup(email: string, password: string) {
    return signupService(email, password).then((user) => {
      setUser(user);
      navigate(location.state?.location ?? "/");
    });
  }

  function logout() {
    setIsLogoutModalOpen(true);

    return logoutService()
      .then(() => {
        setUser(undefined);
      })
      .finally(() => setIsLogoutModalOpen(false));
  }

  const contextValue = {
    login,
    signup,
    logout,
    isLoggedIn: user !== null,
    isLoadingUser,
    user,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <LogoutDialog
        isOpen={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
      ></LogoutDialog>
    </AuthContext.Provider>
  );
}
