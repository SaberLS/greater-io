import React from 'react'

type ContentSectionProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLElement>
>

export function ContentSection({ children, ...rest }: ContentSectionProps) {
  return (
    <section
      {...rest}
      className={`m-auto w-full max-w-4xl min-h-screen p-4 ${rest.className ?? ''}`}
    >
      {children}
    </section>
  )
}
