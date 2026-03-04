import { useSelector } from 'react-redux'
import { LoginButton, NavLinkButton } from '../../../../common'
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
      {loggedIn ?
        <NavLinkButton
          navlink={{
            to: '/play',
          }}
          className="w-50"
          label="Play!"
        />
      : <NavLinkButton
          navlink={{
            to: '/preview',
          }}
          className="w-50"
          label="Give it a try!"
        />
      }
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
