// Root.tsx

import { PrimeReactProvider } from 'primereact/api'
import { Provider } from 'react-redux'
import { Outlet } from 'react-router'
import { store } from '../../store/store'

export default function Root() {
  return (
    <PrimeReactProvider value={{ unstyled: false }}>
      <Provider store={store}>
        <Outlet />
      </Provider>
    </PrimeReactProvider>
  )
}
