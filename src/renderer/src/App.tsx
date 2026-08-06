import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties
} from 'react'
import { PetStage } from './pet/PetStage'
import type { PetHitbox } from './pet/PetManifest'

export function App(): React.JSX.Element {
  const dragging = useRef(false)
  const [hitArea, setHitArea] = useState<PetHitbox>()
  const handleHitAreaChange = useCallback(
    (nextHitArea: PetHitbox | undefined): void => {
      setHitArea(nextHitArea)
    },
    []
  )

  useEffect(() => {
    const handleWheel = (event: WheelEvent): void => {
      if (!event.ctrlKey || event.deltaY === 0) {
        return
      }

      event.preventDefault()
      window.buddyDog.windowScale.adjust(
        event.deltaY < 0 ? 'increase' : 'decrease'
      )
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

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

  const hitAreaStyle: CSSProperties | undefined = hitArea
    ? {
        left: hitArea.x,
        top: hitArea.y,
        width: hitArea.width,
        height: hitArea.height
      }
    : undefined

  return (
    <main className="pet-stage">
      <PetStage onHitAreaChange={handleHitAreaChange} />
      <div
        className={`pet-hit-area${hitArea ? '' : ' pet-hit-area--fallback'}`}
        style={hitAreaStyle}
        aria-label="拖动 BuddyDog"
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
      />
    </main>
  )
}
