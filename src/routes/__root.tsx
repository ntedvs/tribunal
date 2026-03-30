import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router"
import "@fontsource-variable/playfair-display/wght-italic.css"
import appCss from "~/styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tribunal" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col bg-surface text-ink">
        <header className="flex items-center justify-between px-8 py-6 md:px-12 lg:px-16">
          <a
            href="/"
            className="font-serif text-xl font-bold tracking-tight text-ink italic no-underline"
          >
            Tribunal.
          </a>
          <nav className="flex gap-10">
            <a
              href="/"
              className="text-[0.6875rem] font-medium tracking-[0.15em] text-ink-muted uppercase no-underline transition-colors hover:text-ink"
            >
              New Case
            </a>
          </nav>
        </header>
        <main className="mx-auto px-8 pt-8 pb-24 md:px-12 lg:px-16">
          <Outlet />
        </main>
        <footer className="mt-auto border-t border-border px-8 py-6 md:px-12 lg:px-16">
          <div className="flex items-center justify-between text-[0.6875rem] tracking-wide text-ink-faint">
            <span>&copy; {new Date().getFullYear()} Tribunal</span>
            <a
              href="https://github.com/ntedvs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-faint no-underline transition-colors hover:text-ink-muted"
            >
              Made by Nate
            </a>
          </div>
        </footer>
        <Scripts />
      </body>
    </html>
  )
}
