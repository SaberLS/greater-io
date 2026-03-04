import { LoginButton, NavLinkButton } from '../../../../common'
import { ButtonsProps } from './types'

function Buttons(props: ButtonsProps) {
  return (
    <>
      <LoginButton
        ref={props.loginButtonRef}
        className="w-50"
      />
      <NavLinkButton
        navlink={{
          to: '/preview',
        }}
        className="w-50"
        label="Give it a try!"
      />
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
function selectIsLoggedIn(state: unknown): unknown {
  throw new Error('Function not implemented.')
}
