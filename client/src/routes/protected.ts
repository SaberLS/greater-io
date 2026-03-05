import type { ClientLoaderFunctionArgs } from 'react-router'
import { redirect } from 'react-router'
import { store } from '../store'
import { isLoggedIn } from '../store/slices'

async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const state = store.getState()

  if (!isLoggedIn(state)) throw redirect('/home')

  return null
}

export { MinimalOutlet as default } from '../common/components/MinimalOutlet'
export { clientLoader }
