import { describe, test, expect } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils/e2e'

describe('Nuxt app tests', async () => {
  await setup({
    server: true,
    browser: false,
    setupTimeout: 60000
  })

  test('App successfully builds and starts', () => {
    expect(true).toBeTruthy()
  })

  test('Проверка статуса страницы', async () => {
    const response = await fetch('/')
    expect(response.status).toBe(200)
    const html = await response.text()
    expect(html).toContain('<!DOCTYPE html>')
  })
})
