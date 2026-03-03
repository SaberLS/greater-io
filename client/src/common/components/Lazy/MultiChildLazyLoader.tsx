import React, { ReactNode } from 'react'
import { LazyItem } from './LazyItem'

interface MultiChildLazyLoaderProps extends React.PropsWithChildren {
  fallback?: ReactNode
  rootMargin?: string
}

function MultiChildLazyLoader({
  children,
  fallback = <div>Loading...</div>,
  rootMargin = '200px',
}: MultiChildLazyLoaderProps) {
  const childArray = React.Children.toArray(children)

  return (
    <>
      {childArray.map((child, index) => (
        <LazyItem
          key={index}
          fallback={fallback}
          options={{ rootMargin }}
        >
          {child}
        </LazyItem>
      ))}
    </>
  )
}

export { MultiChildLazyLoader }
