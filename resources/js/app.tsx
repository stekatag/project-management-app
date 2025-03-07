import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";
import { ThemeProvider } from "./Layouts/ThemeProvider";
import { Toaster } from "./Components/ui/toaster";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob("./Pages/**/*.tsx"),
    ),
  setup({ el, App, props }) {
    if (import.meta.env.SSR) {
      hydrateRoot(
        el,
        <ThemeProvider storageKey="vite-ui-theme">
          <App {...props} />
          <Toaster />
        </ThemeProvider>,
      );
      return;
    }

    createRoot(el).render(
      <ThemeProvider storageKey="vite-ui-theme">
        <App {...props} />
        <Toaster />
      </ThemeProvider>,
    );
  },
  progress: {
    color: "#7c3aed",
  },
});
