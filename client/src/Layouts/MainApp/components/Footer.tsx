import { NavLink } from 'react-router'

export function Footer() {
  return (
    <footer
      id="contact"
      className="py-4"
      style={{ background: '#f4f4f4' }}
    >
      <div className="w-full max-w-xl m-auto justify-between items-center flex  md:flex-row flex-col ">
        <NavLink
          to="/privacy"
          className="p-text-secondary scroll-auto"
        >
          Privacy Policy
        </NavLink>
        <NavLink
          to="/terms"
          className="p-text-secondary scroll-auto"
        >
          Terms of Service
        </NavLink>
        <NavLink
          to="/contact"
          className="p-text-secondary scroll-auto"
        >
          Contact
        </NavLink>
      </div>
    </footer>
  )
}
