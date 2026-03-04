import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { isLoggedIn } from '../../store/slices'
import { NavLinkButton, NavLinkButtonProps } from './NavLinkButton'

const LoginButton = (props: Partial<NavLinkButtonProps>) => {
  const loggedIn = useSelector(isLoggedIn)

  const [label, to] = useMemo(
    () => (loggedIn ? ['My Account', '/me'] : ['Login', '/login']),
    [loggedIn]
  )

  return (
    <NavLinkButton
      {...props}
      navlink={{
        ...props.navlink,
        to: to,
      }}
      label={label}
    />
  )
}

export { LoginButton }
