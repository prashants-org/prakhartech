import { useState } from 'react'
import { useSession } from '../context'
import { emptyLetter } from '../defaults'
import { deleteSavedDraft, loadDraft, openSavedDraft } from '../drafts'
import { firstLine, formatDateTime, isBlankLayout, isDraftEmpty, letterTitle } from '../lib'
import { useSavedDrafts } from '../hooks'
import { go } from '../router'
import Icon from '../components/Icon'
import { Badge, Button, Card, Dialog, Empty, PageHeader } from '../components/ui'

const titleOf = (letter) => (letterTitle(letter) === 'Letter' ? 'Untitled letter' : letterTitle(letter))
const toLine = (letter) => (isBlankLayout(letter) ? 'Blank letter (no To or Subject)' : firstLine(letter.recipient) ? `To ${firstLine(letter.recipient)}` : 'No recipient yet')

export default function Drafts() {
  const { who, profile } = useSession()
  const drafts = useSavedDrafts(who.email)
  const current = loadDraft(who.email, profile)
  const hasCurrent = !isDraftEmpty(current, emptyLetter(profile))
  const [deleting, setDeleting] = useState(null)

  const open = (id) => {
    openSavedDraft(who.email, profile, id)
    go('/new')
  }

  return (
    <>
      <PageHeader
        title="Drafts"
        lead="Letters you started and put aside. Starting a new letter or using a template saves the one you were writing here. Drafts are kept in this browser on this computer until you issue them."
        actions={
          <Button variant="primary" icon="plus" href="#/new">
            Back to writing
          </Button>
        }
      />

      {hasCurrent && (
        <Card title="Open now" icon="pen">
          <div className="lt-draft-row">
            <div className="lt-draft-main">
              <b>{titleOf(current)}</b>
              <span className="lt-sub">{toLine(current)}</span>
            </div>
            <Button variant="secondary" href="#/new">
              Continue writing
            </Button>
          </div>
        </Card>
      )}

      <Card title={`Saved drafts (${drafts.length})`} icon="inbox" flush>
        {drafts.length === 0 ? (
          <Empty icon="inbox">No saved drafts. When you start a new letter or use a template, the letter you were writing is kept here.</Empty>
        ) : (
          <ul className="lt-draft-list">
            {drafts.map((d) => (
              <li key={d.id} className="lt-draft-row">
                <div className="lt-draft-main">
                  <b>
                    {titleOf(d.letter)} {isBlankLayout(d.letter) && <Badge tone="accent">Blank letter</Badge>}
                  </b>
                  <span className="lt-sub">
                    {toLine(d.letter)} · signed by {d.letter.signatoryName || 'no one yet'}
                  </span>
                  <span className="lt-sub">
                    <Icon name="history" size={13} /> Saved {formatDateTime(new Date(d.savedAt))}
                  </span>
                </div>
                <div className="lt-actions">
                  <Button size="sm" variant="primary" icon="pen" onClick={() => open(d.id)}>
                    Open
                  </Button>
                  <Button size="sm" variant="ghost" icon="trash" onClick={() => setDeleting(d)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {deleting && (
        <Dialog
          title="Delete this draft?"
          onClose={() => setDeleting(null)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setDeleting(null)}>
                Keep it
              </Button>
              <Button
                variant="danger-solid"
                icon="trash"
                onClick={() => {
                  deleteSavedDraft(who.email, deleting.id)
                  setDeleting(null)
                }}
              >
                Delete draft
              </Button>
            </>
          }
        >
          <p>
            “{titleOf(deleting.letter)}” will be removed from this computer. It was never issued, so no reference number is affected. This can’t be undone.
          </p>
        </Dialog>
      )}
    </>
  )
}
