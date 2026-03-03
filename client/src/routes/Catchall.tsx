import { NavLinkButton } from '../common'

export default function Catchall() {
  return (
    <section className="flex flex-col items-center justify-center min-h-80 h-screen p-6">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
      <p className="text-(--text-color-secondary) mb-6">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <NavLinkButton
        label="Go Home"
        className="p-button-primary"
        navlink={{ to: '/' }}
      />
    </section>
  )
}
