import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { isLoggedIn } from '../../store/slices'
import { NavLinkButton, NavLinkButtonProps } from './NavLinkButton'

function PlayButton(props: Partial<NavLinkButtonProps>) {
  const loggedIn = useSelector(isLoggedIn)

  const [label, to] = useMemo(
    () => (loggedIn ? ['Play!', '/lobby'] : ['Give it a try!', '/preview']),
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

export { PlayButton }
