import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
// @ts-expect-error
import Logo from '../../../assets/Logo.svg'
import { LoginButton, NavLinkButton } from '../../../common'
import { isLoggedIn } from '../../../store/slices'

export function NavBar({ showLoginButton }: { showLoginButton: boolean }) {
  const loggedIn = useSelector(isLoggedIn)

  return (
    <div className="!grid grid-cols-3 items-center w-full h-full px-4">
      {/* Logo */}
      <motion.div
        className={
          'min-w-50 flex justify-center ' +
          (showLoginButton ?
            'col-start-1 justify-self-start'
          : 'col-start-2 !justify-self-center')
        }
        // @ts-expect-error it's a motion prop
        layout={true}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <Link
          to="/"
          className="flex items-center"
        >
          <img
            src={Logo}
            alt="Logo"
            className="!h-10"
          />
          <h2 className="ml-2 text-3xl font-bold text-(--primary-color)">
            greater.io
          </h2>
        </Link>
      </motion.div>

      {/* Login button */}
      <AnimatePresence initial={true}>
        {showLoginButton && (
          <motion.div
            className="col-start-3  justify-self-end"
            // @ts-expect-error motion props
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <div className="flex gap-x-3">
              <LoginButton />
              {loggedIn && (
                <NavLinkButton
                  navlink={{
                    to: '/logout',
                  }}
                  label="logout"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
