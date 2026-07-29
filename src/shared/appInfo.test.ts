import { describe, expect, it } from 'vitest'
import { APP_NAME, createWelcomeMessage } from './appInfo'

describe('createWelcomeMessage', () => {
  it('includes the application name', () => {
    expect(createWelcomeMessage(APP_NAME)).toContain(APP_NAME)
  })
})

