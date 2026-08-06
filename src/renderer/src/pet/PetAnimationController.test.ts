import { describe, expect, it, vi } from 'vitest'
import {
  PetAnimationController,
  PetAnimationNotFoundError,
  type AnimationPlayer
} from './PetAnimationController'

const createPlayer = (): AnimationPlayer<string> => ({
  configure: vi.fn(),
  play: vi.fn(),
  stop: vi.fn(),
  destroy: vi.fn()
})

describe('PetAnimationController', () => {
  it('transitions between stopped and playing states', () => {
    const player = createPlayer()
    const controller = new PetAnimationController(
      { idle: { frames: ['frame-1'], fps: 8, loop: true } },
      player
    )

    controller.play('idle')
    expect(controller.state).toEqual({
      status: 'playing',
      animationName: 'idle'
    })
    expect(player.configure).toHaveBeenCalledWith({
      frames: ['frame-1'],
      fps: 8,
      loop: true
    })

    controller.stop()
    expect(controller.state).toEqual({
      status: 'stopped',
      animationName: 'idle'
    })
  })

  it('reports an animation name that does not exist', () => {
    const controller = new PetAnimationController({}, createPlayer())

    expect(() => controller.play('walkLeft')).toThrow(
      PetAnimationNotFoundError
    )
  })

  it('rejects an animation with no frames', () => {
    const controller = new PetAnimationController(
      { idle: { frames: [], fps: 8, loop: true } },
      createPlayer()
    )

    expect(() => controller.play('idle')).toThrow(
      'Pet animation has no frames: idle'
    )
  })

  it('stops and destroys its player exactly once', () => {
    const player = createPlayer()
    const controller = new PetAnimationController(
      { idle: { frames: ['frame-1'], fps: 8, loop: true } },
      player
    )

    controller.destroy()
    controller.destroy()

    expect(controller.state).toEqual({ status: 'destroyed' })
    expect(player.destroy).toHaveBeenCalledTimes(1)
  })
})
