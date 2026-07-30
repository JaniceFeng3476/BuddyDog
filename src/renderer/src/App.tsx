import { useRef } from 'react'
import { APP_NAME } from '../../shared/appInfo'

export function App(): React.JSX.Element {
  const dragging = useRef(false)

  const finishDragging = (event: React.PointerEvent<HTMLElement>): void => {
    if (!dragging.current) {
      return
    }

    dragging.current = false
    window.buddyDog.windowDrag.update('end', {
      x: event.screenX,
      y: event.screenY
    })
  }

  return (
    <main className="pet-stage">
      <section
        className="pet-placeholder"
        aria-labelledby="app-title"
        onPointerDown={(event) => {
          if (event.button !== 0) {
            return
          }

          dragging.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          window.buddyDog.windowDrag.update('start', {
            x: event.screenX,
            y: event.screenY
          })
        }}
        onPointerMove={(event) => {
          if (!dragging.current) {
            return
          }

          window.buddyDog.windowDrag.update('move', {
            x: event.screenX,
            y: event.screenY
          })
        }}
        onPointerUp={finishDragging}
        onPointerCancel={finishDragging}
        onLostPointerCapture={finishDragging}
        onWheel={(event) => {
          if (!event.ctrlKey || event.deltaY === 0) {
            return
          }

          event.preventDefault()
          window.buddyDog.windowScale.adjust(
            event.deltaY < 0 ? 'increase' : 'decrease'
          )
        }}
      >
        <div className="pet-face" aria-hidden="true">
          🐶
        </div>
        <h1 id="app-title">{APP_NAME}</h1>
        <p>Sprint 2</p>
      </section>
    </main>
  )
}
