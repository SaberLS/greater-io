import React from 'react'
import { NavLink, NavLinkProps } from 'react-router'

interface NavLinkButtonProps {
  navlink: NavLinkProps
  label?: string
  className?: string
  ref?: React.Ref<HTMLAnchorElement>
}

function NavLinkButton({
  navlink,
  label,
  children,
  className,
  ref,
}: React.PropsWithChildren<NavLinkButtonProps>) {
  return (
    <NavLink
      ref={ref}
      {...navlink}
      aria-label={label}
      className={(className ?? '') + ' text-center p-button p-component'}
      data-pc-name="button"
      data-pc-section="root"
    >
      <span
        className="p-button-label p-center"
        data-pc-section="label"
      >
        {label && label}
      </span>
      {children}
    </NavLink>
  )
}

export { NavLinkButton }
