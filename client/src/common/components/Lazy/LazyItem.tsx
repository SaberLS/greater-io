import { HTMLAttributes, ReactNode, Suspense, useRef } from 'react'
import { useIntersectionObserver } from '../../hooks'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  fallback?: ReactNode
  options?: Omit<
    Parameters<typeof useIntersectionObserver<HTMLDivElement>>['1'],
    'once'
  >
}

function LazyItem({
  children,
  fallback,
  options,
  style = { minHeight: 1 },
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const inView = useIntersectionObserver(ref, {
    options,
    once: true,
  })

  return (
    <div
      className="lazy-item-container"
      ref={ref}
      style={style}
      {...rest}
    >
      {inView ?
        <Suspense fallback={fallback}>{children}</Suspense>
      : 'nothing'}
    </div>
  )
}

export { LazyItem }
