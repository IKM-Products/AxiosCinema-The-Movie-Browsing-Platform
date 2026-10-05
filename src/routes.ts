<<<<<<< HEAD
import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    index("./routes/discover.tsx"),
    route("search", "./routes/search.tsx"),
    route("favorites", "./routes/favorites.tsx"),
    route("categories", "./routes/categories.tsx"),
  ]),

  layout("./routes/auth-layout.tsx", [
    route("auth/login", "./routes/login.tsx"),
    route("auth/signup", "./routes/signup.tsx"),
    route("auth/forgot-password", "./routes/forgot-password.tsx"),
  ]),
=======
import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    index("./routes/discover.tsx"),
    route("search", "./routes/search.tsx"),
    route("favorites", "./routes/favorites.tsx"),
    route("categories", "./routes/categories.tsx"),
  ]),

  layout("./routes/auth-layout.tsx", [
    route("auth/login", "./routes/login.tsx"),
    route("auth/signup", "./routes/signup.tsx"),
    route("auth/forgot-password", "./routes/forgot-password.tsx"),
  ]),
>>>>>>> c1c2947 (Final Commit)
] satisfies RouteConfig;