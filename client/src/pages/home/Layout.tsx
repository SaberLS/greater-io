import React from 'react'

import { ContentSection } from '../../common'
import { Menu } from './components/Menu'

function Layout(props: React.PropsWithChildren) {
  return (
    <section className="home-layout">
      <header className="min-h-screen flex flex-col">
        <ContentSection className="flex items-center justify-center">
          <Menu />
        </ContentSection>
      </header>
      <main>
        <ContentSection className="flex-1 flex flex-col items-center justify-center gap-y-12 ">
          {props.children}
        </ContentSection>
      </main>
    </section>
  )
}

export { Layout }
