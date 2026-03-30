import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router"
import appCss from "~/styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tribunal" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap",
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-surface text-ink">
        <header className="flex items-center justify-between px-8 py-6 md:px-12 lg:px-16">
          <a
            href="/"
            className="font-serif text-xl font-bold italic tracking-tight text-ink no-underline"
          >
            Tribunal.
          </a>
          <nav className="flex gap-10">
            <a
              href="/"
              className="text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-ink-muted no-underline transition-colors hover:text-ink"
            >
              New Case
            </a>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-8 pb-24 pt-8 md:px-12 lg:px-8">
          <Outlet />
        </main>
        <Scripts />
      </body>
    </html>
  )
}
