export interface AnimationDefinition<TFrame> {
  readonly frames: readonly TFrame[]
  readonly fps: number
  readonly loop: boolean
}

export interface AnimationPlayer<TFrame> {
  configure(definition: AnimationDefinition<TFrame>): void
  play(): void
  stop(): void
  destroy(): void
}

export type PetAnimationState =
  | Readonly<{ status: 'stopped'; animationName?: string }>
  | Readonly<{ status: 'playing'; animationName: string }>
  | Readonly<{ status: 'destroyed' }>

export class PetAnimationNotFoundError extends Error {
  constructor(animationName: string) {
    super(`Pet animation does not exist: ${animationName}`)
    this.name = 'PetAnimationNotFoundError'
  }
}

export class PetAnimationController<TFrame> {
  private currentState: PetAnimationState = { status: 'stopped' }

  constructor(
    private readonly animations: Readonly<
      Record<string, AnimationDefinition<TFrame>>
    >,
    private readonly player: AnimationPlayer<TFrame>
  ) {}

  get state(): PetAnimationState {
    return this.currentState
  }

  play(animationName: string): void {
    this.ensureActive()
    const animation = this.animations[animationName]

    if (!animation) {
      throw new PetAnimationNotFoundError(animationName)
    }

    if (animation.frames.length === 0) {
      throw new Error(`Pet animation has no frames: ${animationName}`)
    }

    this.player.configure(animation)
    this.player.play()
    this.currentState = { status: 'playing', animationName }
  }

  stop(): void {
    this.ensureActive()
    const animationName =
      this.currentState.status === 'destroyed'
        ? undefined
        : this.currentState.animationName
    this.player.stop()
    this.currentState = {
      status: 'stopped',
      animationName
    }
  }

  destroy(): void {
    if (this.currentState.status === 'destroyed') {
      return
    }

    this.player.stop()
    this.player.destroy()
    this.currentState = { status: 'destroyed' }
  }

  private ensureActive(): void {
    if (this.currentState.status === 'destroyed') {
      throw new Error('Pet animation controller has been destroyed')
    }
  }
}
