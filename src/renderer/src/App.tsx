import { VERSION as pixiVersion } from 'pixi.js'
import { APP_NAME, createWelcomeMessage } from '../../shared/appInfo'

export function App(): React.JSX.Element {
  return (
    <main className="app-shell">
      <section className="status-card" aria-labelledby="app-title">
        <p className="eyebrow">Phase 1 · Sprint 1</p>
        <h1 id="app-title">{APP_NAME}</h1>
        <p>{createWelcomeMessage(APP_NAME)}</p>
        <dl>
          <div>
            <dt>Electron</dt>
            <dd>{window.buddyDog.versions.electron}</dd>
          </div>
          <div>
            <dt>PixiJS</dt>
            <dd>{pixiVersion}</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}

