import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEME_OPTIONS } from "@/constants/constants";
import { useAuth } from "@/features/authentication";
import { useTheme } from "@/hooks/useTheme";
import { ChevronDown, Menu, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-10 border-b p-4 bg-white dark:bg-slate-950">
      <div className="container flex items-center justify-between gap-4">
        <span
          className="text-lg"
          role="img"
          aria-label="Logo"
        >
          WDS App
        </span>
        <div className="flex">
          <ThemeToggleButton />

          <div className="hidden sm:flex">
            <NavItem
              to={"/tasks"}
              label={"Task Board"}
            />
            <NavItem
              to={"/jobs"}
              label={"Job Listings"}
            />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 cursor-pointer"
                  >
                    <span>{user.email}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link to={"/my-listings"}>My Listings</Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavItem
                to={"/login"}
                label={"Login"}
              />
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="flex sm:hidden"
            >
              <Button
                variant="ghost"
                size={"icon"}
                className="data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                asChild
                className="cursor-pointer"
              >
                <Link to={"/tasks"}>Task Board</Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="cursor-pointer"
              >
                <Link to={"/jobs"}>Job Listing</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {user ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    asChild
                    className="cursor-pointer"
                  >
                    <span className="mr-auto">{user.email}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </DropdownMenuSubTrigger>

                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer"
                      >
                        <Link to={"/my-listings"}>My Listings</Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={logout}
                        className="cursor-pointer"
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to={"/login"}>Login</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

type NavItemPropsType = {
  to: string;
  label: string;
};

function NavItem({ to, label }: NavItemPropsType) {
  return (
    <Button
      asChild
      variant={"ghost"}
    >
      <Link to={to}>{label}</Link>
    </Button>
  );
}

function ThemeToggleButton() {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 cursor-pointer"
        >
          {isDark ? (
            <Sun className="h-5 w-5 transition-all animate-out" />
          ) : (
            <Moon className="h-5 w-5 transition-all animate-out" />
          )}
          <span className="sr-only">Toggle Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEME_OPTIONS.map((option) => (
          <DropdownMenuItem
            className="cursor-pointer capitalize"
            key={option}
            disabled={theme === option}
            aria-selected={theme === option}
            onClick={() => setTheme(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
