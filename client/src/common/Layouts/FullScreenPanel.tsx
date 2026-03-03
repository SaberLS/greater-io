import { Panel } from 'primereact/panel'
import React from 'react'

export interface FullScreenPanelProps {
  title: string
  subtitle?: string
}

export function FullScreenPanel(
  props: React.PropsWithChildren<FullScreenPanelProps>
) {
  return (
    <div className="flex justify-center p-4">
      <Panel
        className="max-w-5xl w-full"
        header={
          <div>
            <h2 className="text-4xl font-bold">{props.title}</h2>
            {props.subtitle && (
              <h4 className="text-2xl font-semibold">{props.subtitle}</h4>
            )}
          </div>
        }
      >
        <pre className="overflow-x-auto whitespace-pre-wrap break-words">
          {props.children}
        </pre>
      </Panel>
    </div>
  )
}
