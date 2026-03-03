import type { RefObject } from 'react'

interface ButtonsProps {
  loginButtonRef: RefObject<HTMLAnchorElement | null>
}

interface MenuProps {
  buttons: ButtonsProps
}

export type { ButtonsProps, MenuProps }
