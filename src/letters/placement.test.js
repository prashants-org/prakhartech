import { describe, expect, it } from 'vitest'
import { MAX_HEIGHT, drawnWidth, maxWidth, placeSignature, placeStamp, withFit } from './placement'

describe('drawnWidth', () => {
  it('narrows a tall signature so it stays within the height limit', () => {
    const tall = 232 / 262 // taller than wide
    const w = drawnWidth('signature', { w: 42, fit: true }, tall)
    expect(w).toBeCloseTo(MAX_HEIGHT.signature * tall)
    expect(w / tall).toBeCloseTo(MAX_HEIGHT.signature)
  })
  it('leaves a wide signature at the chosen width', () => {
    expect(drawnWidth('signature', { w: 42, fit: true }, 3)).toBe(42)
  })
  it('ignores the limit when fit is off, and for letters issued before it existed', () => {
    expect(drawnWidth('signature', { w: 42, fit: false }, 0.5)).toBe(42)
    expect(drawnWidth('signature', { w: 42 }, 0.5)).toBe(42)
  })
})

describe('maxWidth / withFit', () => {
  it('caps the slider at the width where the height limit is reached', () => {
    expect(maxWidth('stamp', true, 1)).toBe(MAX_HEIGHT.stamp)
    expect(maxWidth('stamp', false, 1)).toBe(50)
  })
  it('shrinks the width when fit is turned on', () => {
    expect(withFit('stamp', { w: 45, fit: false }, true, 1)).toMatchObject({ w: 32, fit: true })
    expect(withFit('stamp', { w: 32, fit: true }, false, 1)).toMatchObject({ w: 32, fit: false })
  })
})

describe('placeStamp', () => {
  it('sits just after the signature, centred in the signing space', () => {
    const signature = placeSignature('sig')
    const stamp = placeStamp('st', { signature, signatureAspect: 3, stampAspect: 1, contentWidth: 160, textEnd: 20 })
    const sigEnd = signature.x + drawnWidth('signature', signature, 3)
    expect(stamp.x).toBeCloseTo(sigEnd - 4)
    expect(stamp.y).toBeCloseTo((22 - 32) / 2)
    expect(stamp).toMatchObject({ assetId: 'st', fit: true })
  })
  it('stays inside the text area', () => {
    const signature = { x: 120, y: 1, w: 70, fit: false }
    const stamp = placeStamp('st', { signature, signatureAspect: 3, stampAspect: 1, contentWidth: 160 })
    expect(stamp.x + stamp.w).toBeLessThanOrEqual(160)
  })
  it('moves clear of the name when the name is longer than the signature', () => {
    const signature = placeSignature('sig')
    const stamp = placeStamp('st', { signature, signatureAspect: 0.9, stampAspect: 1, contentWidth: 160, textEnd: 50 })
    expect(stamp.x).toBe(54)
  })
  it('has a sensible spot without a signature', () => {
    expect(placeStamp('st', { signature: null, stampAspect: 1, contentWidth: 160 }).x).toBe(45)
  })
})
