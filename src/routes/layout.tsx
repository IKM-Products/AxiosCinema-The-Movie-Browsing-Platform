// src/routes/layout.tsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  Form,
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { signOut } from "firebase/auth";
import {
  Calendar,
  Compass,
  Film,
  Globe,
  Heart,
  LayoutGrid,
  LogOut,
  Search,
  Star,
  User,
} from "lucide-react";

import type { Movie } from "@/lib/api";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const Badge = ({
  children,
  className = "",
  variant,
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "secondary" | string;
}) => {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-[10px]";

  const variantClass =
    variant === "secondary"
      ? "bg-secondary text-secondary-foreground"
      : "bg-primary text-primary-foreground";

  return (
    <span className={`${base} ${variantClass} ${className}`}>
      {children}
    </span>
  );
};

export interface FavoritesContextType {
  favorites: Movie[];
  toggleFavorite: (movie: Movie) => void;
  setSelectedMovie: (movie: Movie | null) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within FavoritesContext");
  }

  return context;
}

const navItems: {
  to: string;
  label: string;
  icon: ReactNode;
}[] = [
  {
    to: "/",
    label: "Discover",
    icon: <Compass className="h-4 w-4" />,
  },
  {
    to: "/search",
    label: "Search",
    icon: <Search className="h-4 w-4" />,
  },
  {
    to: "/favorites",
    label: "My Queue",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    to: "/categories",
    label: "Categories",
    icon: <LayoutGrid className="h-4 w-4" />,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: <User className="h-4 w-4" />,
  },
];

export default function Layout() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [searchParams] = useSearchParams();
  const location = useLocation();

  const currentQuery = searchParams.get("q") || "";

  const currentUser = auth.currentUser;

  const userInitial =
    currentUser?.displayName?.charAt(0).toUpperCase() ||
    currentUser?.email?.charAt(0).toUpperCase() ||
    "U";

  const showProfileAvatar =
    location.pathname === "/" ||
    location.pathname === "/search" ||
    location.pathname === "/favorites" ||
    location.pathname === "/categories";

  useEffect(() => {
    const storedFavorites = localStorage.getItem("axioscinema_favs");

    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  function toggleFavorite(movie: Movie) {
    const updatedFavorites = favorites.some((fav) => fav.id === movie.id)
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];

    setFavorites(updatedFavorites);
    localStorage.setItem("axioscinema_favs", JSON.stringify(updatedFavorites));
  }

  async function handleLogout() {
    try{
      await signOut(auth);

      toast.success("Signed out successfully!");
      setTimeout(() => {
        navigate("/auth/login");
      }, 1000);
    } catch(error) {
      console.error("Logout failed:", error);
      toast.error("Failed to sign out.");
    }
  }

  function isActive(path: string) {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, setSelectedMovie }}
    >
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-7 md:flex">
          <Link to="/" className="mb-9 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Film className="h-4 w-4" />
            </div>

            <span className="text-lg font-extrabold tracking-tight">
              Axios<span className="text-primary">Cinema</span>
            </span>
          </Link>

          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Browse
          </p>

          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.icon}

                  <span className="flex-1">{item.label}</span>

                  {item.to === "/favorites" && favorites.length > 0 && (
                    <Badge
                      variant={active ? "secondary" : "default"}
                      className="h-5 px-2 text-[10px]"
                    >
                      {favorites.length}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-17 min-h-17 items-center gap-4 border-b border-border bg-background/90 px-4 backdrop-blur md:px-8">
            <Form
              action="/search"
              method="get"
              className="flex w-full max-w-xl gap-2"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type="search"
                  name="q"
                  defaultValue={currentQuery}
                  placeholder="Search movies..."
                  className="pl-10"
                />
              </div>

              <Button type="submit">Search</Button>
            </Form>

            {showProfileAvatar && (
              <Button
                asChild
                variant="ghost"
                className="ml-auto hidden h-10 w-10 overflow-hidden rounded-full border border-border p-0 md:inline-flex"
              >
                <Link to="/profile" aria-label="Open profile">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                      {userInitial}
                    </span>
                  )}
                </Link>
              </Button>
            )}
          </header>

          <ScrollArea className="flex-1">
            <main className="p-4 md:p-8">
              <Outlet />
            </main>
          </ScrollArea>
        </div>
      </div>

      <Dialog
        open={Boolean(selectedMovie)}
        onOpenChange={(open) => {
          if (!open) setSelectedMovie(null);
        }}
      >
        {selectedMovie && (
          <DialogContent className="max-w-3xl overflow-hidden border-border bg-card p-0 text-card-foreground">
            <div className="relative h-60 overflow-hidden bg-muted">
              {selectedMovie.backdrop_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w780${selectedMovie.backdrop_path}`}
                  alt={selectedMovie.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-50"
                />
              )}

              <div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />
            </div>

            <div className="relative -mt-20 flex gap-6 px-7 pb-7">
              <img
                src={
                  selectedMovie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`
                    : "https://placehold.co/300x450?text=No+Poster"
                }
                alt={selectedMovie.title}
                className="hidden aspect-2/3 w-32 shrink-0 rounded-xl border border-border object-cover shadow-2xl sm:block"
              />

              <div className="flex-1 pt-20 sm:pt-16">
                <DialogTitle className="text-2xl font-black tracking-tight">
                  {selectedMovie.title}
                </DialogTitle>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    {selectedMovie.release_date?.substring(0, 4) || "—"}
                  </span>

                  <span className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-primary" />
                    {selectedMovie.original_language?.toUpperCase()}
                  </span>
                </div>

                <div className="my-5 flex flex-wrap items-center gap-4 border-y border-border py-4">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-xl font-black">
                      {selectedMovie.vote_average?.toFixed(1)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    from{" "}
                    <strong className="text-foreground">
                      {selectedMovie.vote_count?.toLocaleString()}
                    </strong>{" "}
                    ratings
                  </p>

                  <Button
                    size="sm"
                    className="ml-auto gap-2"
                    variant={
                      favorites.some((fav) => fav.id === selectedMovie.id)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => toggleFavorite(selectedMovie)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.some((fav) => fav.id === selectedMovie.id)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                    {favorites.some((fav) => fav.id === selectedMovie.id)
                      ? "In Queue"
                      : "Add to Queue"}
                  </Button>
                </div>

                <p className="text-sm leading-7 text-muted-foreground">
                  {selectedMovie.overview || "No overview available."}
                </p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </FavoritesContext.Provider>
  );
}