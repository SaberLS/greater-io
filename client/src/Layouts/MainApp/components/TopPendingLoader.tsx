import { AnimatePresence, motion } from 'motion/react'
import { ProgressBar } from 'primereact/progressbar'
import { useNavigation } from 'react-router'

export function TopPagePendingLoader() {
  const navigation = useNavigation()
  const isPending = navigation.state !== 'idle'

  return (
    <div className="absolute top-0 z-51 left-0  w-full max-w-screen  overflow-x-hidden">
      <AnimatePresence>
        {isPending && (
          <motion.div
            key="top-loader"
            // @ts-expect-error motion prop
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            <ProgressBar
              mode="indeterminate"
              className="w-full"
              style={{
                height: '6px',
                color: 'var(--primary-color)',
                background: 'none',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
