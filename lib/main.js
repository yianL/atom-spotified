'use babel'

import AtomSpotifiedPoller from './spotify-poller'
import AtomSpotifiedView from './views/atom-spotified-view'
import StatusBarView from './views/status-bar-view'
import conifgSchema from './config-schema'

export default AtomSpotified = {
  config: conifgSchema,

  activate: (state) => {
    this.showStatus = false
    this.poller = new AtomSpotifiedPoller()

    this.atomSpotifiedView = new AtomSpotifiedView()
    this.atomSpotifiedView.show()

    this.statusBarView = new StatusBarView()
    this.statusBarView.initialize()

    this.poller.addSubscriber(this.atomSpotifiedView.update)
    this.poller.addSubscriber(this.statusBarView.update)

    // Register command that toggles this view
    // this.subscriptions = atom.commands.add('atom-workspace', 'atom-spotified:toggle', () => {
    //   this.atomSpotifiedView.isVisible ? this.atomSpotifiedView.hide() : this.atomSpotifiedView.show()
    // })

    this.subscriptions = atom.commands.onDidDispatch((command) => {
      if (command.type === 'tree-view:toggle') {
        if (this.showStatus) {
          this.statusBarTile.destroy()
          this.statusBarTile = null
          this.showStatus = false
        } else {
          this.statusBarTile = this.statusBar.addRightTile({
            item: this.statusBarView,
            priority: 1000,
          })
          this.showStatus = true
        }
      }
    })

    this.poller.start()
  },

  deactivate: () => {
    this.subscriptions.dispose()
    this.atomSpotifiedView.destroy()
    this.statusBarView.destroy()
  },

  serialize: () => ({}),

  consumeStatusBar: (statusBar) => {
    this.statusBar = statusBar
  },
}
