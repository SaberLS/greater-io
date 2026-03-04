import { useSelector } from 'react-redux'
import { LoginButton, NavLinkButton, PlayButton } from '../../../../common'
import { isLoggedIn } from '../../../../store/slices'
import { ButtonsProps } from './types'

function Buttons(props: ButtonsProps) {
  const loggedIn = useSelector(isLoggedIn)

  return (
    <>
      <LoginButton
        ref={props.loginButtonRef}
        className="w-50"
      />
      <PlayButton className="w-50" />
      <NavLinkButton
        navlink={{
          to: '/about',
        }}
        className="w-50"
        label="Learn more"
      />
      <NavLinkButton
        navlink={{
          to: '/#contact',
        }}
        className="w-50"
        label="Contact"
      />
    </>
  )
}

export { Buttons }
