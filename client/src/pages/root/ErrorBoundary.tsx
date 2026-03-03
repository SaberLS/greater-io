import { isRouteErrorResponse, useRouteError } from 'react-router'
import { FullScreenPanel } from '../../common/Layouts/FullScreenPanel'

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <FullScreenPanel
        title={error.statusText}
        subtitle={error.status.toString()}
      >
        {error.data}
      </FullScreenPanel>
    )
  } else if (error instanceof Error) {
    return (
      <FullScreenPanel
        title={error.name}
        subtitle={error.message}
      >
        {error.stack}
      </FullScreenPanel>
    )
  } else {
    return (
      <FullScreenPanel title="Unknown Error">
        {JSON.stringify(error)}
      </FullScreenPanel>
    )
  }
}
