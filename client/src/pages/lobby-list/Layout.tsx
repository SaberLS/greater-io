import { PropsWithChildren } from 'react'
import { ContentSection } from '../../common'

function Layout(props: PropsWithChildren) {
  return (
    <div className="play-layout">
      <ContentSection className="min-h-screen flex flex-col justify-center">
        {props.children}
      </ContentSection>
    </div>
  )
}

export { Layout }
