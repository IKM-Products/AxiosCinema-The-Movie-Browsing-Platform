<<<<<<< HEAD
# 🎬 AxiosCinema – The Movie Browsing Platform
<img width="1920" height="925" alt="Screenshot (320)" src="https://github.com/user-attachments/assets/1d033b9f-bb15-4a27-a4c4-d41f8a6a2577" />
<img width="1920" height="931" alt="Screenshot (321)" src="https://github.com/user-attachments/assets/46a791a5-1329-472b-a10e-79c12a2fff53" />
<img width="1920" height="922" alt="Screenshot (323)" src="https://github.com/user-attachments/assets/fd36efce-e069-46c2-92b5-630766b0b493" />


**AxiosCinema** is a modern movie browsing platform built with React, TypeScript, Tailwind CSS, Firebase (Authentication and Cloud Firestore), and TMDB API. The application allows users to explore trending and popular movies, search for titles, browse movies by categories, view detailed movie information, and create a personalized movie queue.

## 🚀 Features

* **🔐 User Authentication** – Secure signup, login, logout, and password recovery using Firebase Authentication.
* **🎥 Discover Movies** – Browse trending and popular movies from TMDB.
* **🔍 Advanced Search** – Search movies instantly by title.
* **🏷️ Movie Categories** – Explore movies by genre and category.
* **📄 Movie Details** – View detailed information including ratings, release date, overview, language, and genres.
* **❤️ My Queue** – Save favorite movies and manage a personal watchlist.
* **👤 User Profile** – Manage account details and profile information.

## 🛠️ Technologies Used

* **Frontend:** React, TypeScript, Tailwind CSS, Shadcn/ui
* **Backend:** Firebase Authentication, Cloud Firestore
* **API:** TMDB (The Movie Database) API
* **Code Editor:** Visual Studio Code

## 📱 How It Works

1. User creates an account and signs in.
2. AxiosCinema fetches movie data from the TMDB API.
3. Users can discover trending movies, search titles, and browse categories.
4. Movie details are displayed when a movie is selected.
5. Users can save movies to My Queue and manage their profile.
   
## 🎯 Objective

The main objective of **AxiosCinema** is to provide movie enthusiasts with a seamless platform to discover, explore, and organize movies while offering a modern user experience and secure account management.

## 📧 Contact
For questions or feedback, please open an issue on GitHub.

------

⭐ If you found this project helpful, please consider giving it a star!
=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
>>>>>>> c1c2947 (Final Commit)
