import { describe, expect, it } from 'vitest'
import { Timestamp } from 'firebase/firestore'
import { BACKUP_FORMAT, checkBackup, fromPlain, restoreCount, toPlain } from './backup'

describe('backup file format', () => {
  it('keeps exact timestamps through JSON, including inside nested maps', () => {
    const at = new Timestamp(1795158000, 123456000)
    const data = { issuedAt: at, issuedBy: { email: 'a@b.c', when: at }, list: [at, 'x'], n: 3, none: null }
    const back = fromPlain(JSON.parse(JSON.stringify(toPlain(data))))
    expect(back.issuedAt).toBeInstanceOf(Timestamp)
    expect(back.issuedAt.isEqual(at)).toBe(true)
    expect(back.issuedBy.when.isEqual(at)).toBe(true)
    expect(back.list[0].isEqual(at)).toBe(true)
    expect(back).toMatchObject({ n: 3, none: null, list: [expect.anything(), 'x'] })
  })

  it('rejects files that are not a backup, or are damaged', () => {
    expect(() => checkBackup({ letters: [] })).toThrow(/not a letter system backup/)
    expect(() => checkBackup({ format: BACKUP_FORMAT, version: 1, collections: { letters: [{ id: 'a/b', data: {} }] } })).toThrow(/damaged/)
    expect(() => checkBackup({ format: BACKUP_FORMAT, version: 99, collections: {} })).toThrow(/newer version/)
    const ok = { format: BACKUP_FORMAT, version: 1, collections: { letters: [{ id: '2026-1', data: {} }] } }
    expect(checkBackup(ok)).toBe(ok)
  })

  it('counts what a restore would add', () => {
    expect(restoreCount([{ missing: [1, 2], raise: [] }, { missing: [], raise: [1] }])).toBe(3)
  })
})
