import { beforeEach, describe, expect, it } from 'vitest'
import { deleteSavedDraft, loadDraft, loadSavedDrafts, openSavedDraft, saveDraft, startNewDraft, takeStashNote } from './drafts'

const email = 'writer@example.com'
const profile = { name: 'Asha Rao', designation: 'Manager' }

describe('drafts', () => {
  beforeEach(() => localStorage.clear())

  it('puts the open letter aside when a new one is started, and starts with the writer’s own name', () => {
    saveDraft(email, { ...loadDraft(email, profile), subject: 'Quote for pumps', signatoryName: 'Someone Else' })
    const next = startNewDraft(email, profile, loadDraft(email, profile), { recipient: 'A', subject: 'Offer', bodyHtml: '<p>Hi</p>', closing: 'Regards,' })
    expect(next).toMatchObject({ subject: 'Offer', signatoryName: 'Asha Rao', designation: 'Manager\nPrakhar Technology' })
    expect(takeStashNote()).toBe(true)
    expect(takeStashNote()).toBe(false)
    const saved = loadSavedDrafts(email)
    expect(saved).toHaveLength(1)
    expect(saved[0].letter).toMatchObject({ subject: 'Quote for pumps', signatoryName: 'Someone Else' })
  })

  it('does not keep an untouched letter', () => {
    startNewDraft(email, profile, loadDraft(email, profile), null)
    expect(loadSavedDrafts(email)).toHaveLength(0)
    expect(takeStashNote()).toBe(false)
  })

  it('opens a saved draft, putting the open one aside, without duplicating either', () => {
    saveDraft(email, { ...loadDraft(email, profile), subject: 'First' })
    startNewDraft(email, profile, loadDraft(email, profile), null)
    saveDraft(email, { ...loadDraft(email, profile), subject: 'Second' })
    const [first] = loadSavedDrafts(email)
    openSavedDraft(email, profile, first.id)
    expect(loadDraft(email, profile).subject).toBe('First')
    expect(loadSavedDrafts(email).map((d) => d.letter.subject)).toEqual(['Second'])
    // Putting "First" aside again replaces nothing else and keeps one copy of it.
    startNewDraft(email, profile, loadDraft(email, profile), null)
    expect(loadSavedDrafts(email).map((d) => d.letter.subject).sort()).toEqual(['First', 'Second'])
  })

  it('deletes a saved draft', () => {
    saveDraft(email, { ...loadDraft(email, profile), subject: 'Gone' })
    startNewDraft(email, profile, loadDraft(email, profile), null)
    deleteSavedDraft(email, loadSavedDrafts(email)[0].id)
    expect(loadSavedDrafts(email)).toHaveLength(0)
  })
})
