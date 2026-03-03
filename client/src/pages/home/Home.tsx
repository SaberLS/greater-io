import { lazy } from 'react'

import { MultiChildLazyLoader } from '../../common/components/Lazy/MultiChildLazyLoader'
import { Layout } from './Layout'

const Body = lazy(() => import('./components/Body'))

function Home() {
  return (
    <Layout>
      <MultiChildLazyLoader fallback={<div>Loading section...</div>}>
        <Body />
      </MultiChildLazyLoader>
    </Layout>
  )
}

export { Home }
