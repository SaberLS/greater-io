import { LoginButton, NavLinkButton, PlayButton } from '../../../../common'
import { ButtonsProps } from './types'

function Buttons(props: ButtonsProps) {
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
