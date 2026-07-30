interface Window {
  readonly buddyDog: {
    readonly windowDrag: {
      readonly update: (
        phase: 'start' | 'move' | 'end',
        point: Readonly<{ x: number; y: number }>
      ) => void
    }
    readonly windowScale: {
      readonly adjust: (
        command: 'increase' | 'decrease' | 'reset'
      ) => void
    }
    readonly versions: {
      readonly electron: string
    }
  }
}
