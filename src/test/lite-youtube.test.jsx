import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LiteYouTube from '../components/LiteYouTube'

describe('LiteYouTube', () => {
  it('loads no player until clicked, then the privacy-enhanced embed', async () => {
    const { container } = render(<LiteYouTube id="abc123" title="Demo" />)
    expect(container.querySelector('iframe')).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: /play video: demo/i }))

    const iframe = screen.getByTitle('Demo')
    expect(iframe.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/abc123?autoplay=1&rel=0')
  })
})
