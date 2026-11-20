import { useMemo, useState } from 'react'
import { useSession } from '../context'
import { useLiveQuery } from '../data'
import { historyQuery } from '../queries'
import { COLLECTIONS, checkBackup, countRecords, createBackup, logBackupDownload, planRestore, restoreCount, runRestore } from '../backup'
import { downloadFile, formatDateTime } from '../lib'
import { useAction } from '../hooks'
import Icon from '../components/Icon'
import { Button, Card, Dialog, FileInput, Notice, PageHeader } from '../components/ui'

const LABEL = Object.fromEntries(COLLECTIONS.map((c) => [c.name, c.label]))
const stamp = () => new Date().toISOString().slice(0, 10)

export default function Backup() {
  const { who } = useSession()
  const { data: history } = useLiveQuery(historyQuery, 'history')
  const lastDownload = useMemo(() => (history || []).find((h) => h.action === 'backup.downloaded'), [history])
  const download = useAction()

  const takeBackup = () =>
    download.run(async () => {
      const backup = await createBackup(who)
      const counts = countRecords(backup)
      downloadFile(`letters-full-backup-${stamp()}.json`, JSON.stringify(backup), 'application/json')
      await logBackupDownload(who, counts)
      return counts
    })

  return (
    <>
      <PageHeader
        title="Backup and restore"
        lead="The free Firebase plan keeps no backups of its own. Download a full backup regularly (for example every month) and keep it somewhere safe, such as the company Google Drive."
      />

      <div className="lt-grid-2">
        <Card title="Download a full backup" icon="download">
          <p className="lt-muted lt-small">
            One file with every letter (issued and cancelled), the reference number counters, all letterhead designs, signatures and stamps, saved letter
            templates, settings, the history log and the list of allowed users.
          </p>
          <Notice>
            The file contains everyone’s signatures and every letter’s contents. Store it only where the right people can open it.
          </Notice>
          <Button variant="primary" icon="download" disabled={download.busy} onClick={takeBackup}>
            {download.busy ? 'Preparing backup…' : 'Download full backup'}
          </Button>
          {download.error && <Notice kind="error">{download.error}</Notice>}
          {download.done && <Notice kind="ok">Backup downloaded.</Notice>}
          <p className="lt-hint">
            <Icon name="history" size={15} />
            {lastDownload ? `Last backup: ${formatDateTime(lastDownload.at)} by ${lastDownload.by?.name}` : 'No backup has been downloaded yet.'}
          </p>
        </Card>

        <Restore who={who} />
      </div>
    </>
  )
}

function Restore({ who }) {
  const [file, setFile] = useState(null) // { name, backup, plan }
  const [confirming, setConfirming] = useState(false)
  const [progress, setProgress] = useState(null)
  const check = useAction()
  const restore = useAction()

  const pick = (f) => {
    setFile(null)
    restore.reset()
    check.run(async () => {
      if (f.size > 60 * 1024 * 1024) throw new Error('This file is too large to be a letter system backup.')
      let parsed
      try {
        parsed = JSON.parse(await f.text())
      } catch {
        throw new Error('This file could not be read. Choose the .json file downloaded from this page.')
      }
      const backup = checkBackup(parsed)
      setFile({ name: f.name, backup, plan: await planRestore(backup) })
    })
  }

  const run = async () => {
    setConfirming(false)
    setProgress({ done: 0, total: restoreCount(file.plan) })
    const ok = await restore.run(() => runRestore(file.plan, who, (done, total) => setProgress({ done, total })))
    if (ok) setFile((f) => ({ ...f, plan: null }))
  }

  const toAdd = file?.plan ? restoreCount(file.plan) : 0

  return (
    <Card title="Restore from a backup" icon="upload">
      <p className="lt-muted lt-small">
        Puts back anything that is missing from the system, for example after records were deleted in the Firebase console. It only ever <b>adds</b> missing
        records: nothing already here is changed or replaced. Restored records are marked as restored, with who did it and when.
      </p>
      <FileInput label="Choose a backup file (.json)" accept="application/json,.json" onFile={pick} />
      {check.busy && <Notice>Checking the backup against the system…</Notice>}
      {check.error && <Notice kind="error">{check.error}</Notice>}

      {file?.plan && (
        <>
          <p className="lt-small">
            <b>{file.name}</b>, made {formatDateTime(new Date(file.backup.exportedAt))} by {file.backup.exportedBy?.name || 'unknown'}.
          </p>
          <div className="lt-table-wrap lt-plan">
            <table className="lt-table">
              <thead>
                <tr>
                  <th>Records</th>
                  <th>In backup</th>
                  <th>To add</th>
                </tr>
              </thead>
              <tbody>
                {file.plan.map((c) => (
                  <tr key={c.name}>
                    <td>{c.label}</td>
                    <td>{c.inBackup}</td>
                    <td>
                      {c.restore === false ? (
                        <span className="lt-sub">Add in Firebase console</span>
                      ) : (
                        <>
                          <b className="lt-strong">{c.missing.length}</b>
                          {c.raise.length > 0 && <span className="lt-sub">+ {c.raise.length} counter(s) raised</span>}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {toAdd === 0 ? (
            <Notice kind="ok">Nothing is missing: everything in this backup is already in the system.</Notice>
          ) : (
            <Button variant="primary" icon="upload" disabled={restore.busy} onClick={() => setConfirming(true)}>
              Restore {toAdd} missing record{toAdd === 1 ? '' : 's'}
            </Button>
          )}
        </>
      )}

      {restore.busy && progress && (
        <Notice>
          Restoring… {progress.done} of {progress.total}
        </Notice>
      )}
      {restore.error && <Notice kind="error">{restore.error} Records restored before the problem have been kept; run the restore again to finish.</Notice>}
      {restore.done && file && !file.plan && <Notice kind="ok">Restore complete. The missing records are back, marked as restored.</Notice>}

      {confirming && (
        <Dialog
          title={`Restore ${toAdd} record${toAdd === 1 ? '' : 's'}?`}
          onClose={() => setConfirming(false)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
              <Button variant="primary" icon="upload" onClick={run}>
                Restore
              </Button>
            </>
          }
        >
          <p>
            These will be added: {file.plan.filter((c) => c.missing.length || c.raise.length).map((c) => `${LABEL[c.name]} (${c.missing.length + c.raise.length})`).join(', ')}.
          </p>
          <p>Nothing already in the system is changed. Restored records can’t be removed from the app afterwards.</p>
        </Dialog>
      )}
    </Card>
  )
}
