import { useEffect, useRef, useState } from 'react'
import { PixiPetStage } from './PixiPetStage'
import type { PetHitbox } from './PetManifest'

const getPlaceholderManifestUrl = (): string =>
  new URL(
    `${import.meta.env.BASE_URL}pets/placeholder/manifest.json`,
    window.location.href
  ).toString()

interface PetStageProps {
  readonly onHitAreaChange: (hitArea: PetHitbox | undefined) => void
}

export function PetStage({ onHitAreaChange }: PetStageProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const stage = new PixiPetStage(container, {
      manifestUrl: getPlaceholderManifestUrl(),
      onHitAreaChange
    })

    void stage.initialize().catch((error: unknown) => {
      console.error('[BuddyDog] Pet renderer initialization failed', error)
      setErrorMessage('宠物动画暂时无法显示')
      onHitAreaChange(undefined)
    })

    return () => {
      stage.dispose()
      onHitAreaChange(undefined)
    }
  }, [onHitAreaChange])

  return (
    <div ref={containerRef} className="pet-renderer" aria-label="BuddyDog">
      {errorMessage ? (
        <div className="pet-error" role="status">
          <span aria-hidden="true">!</span>
          <p>{errorMessage}</p>
        </div>
      ) : null}
    </div>
  )
}
