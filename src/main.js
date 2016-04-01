'use babel'

import { CompositeDisposable } from 'atom'

import AtomSpotifiedPoller from './spotify-poller'
import AtomSpotifiedView from './views/atom-spotified-view'
import StatusBarView from './views/status-bar-view'

export default AtomSpotified = {

  activate: (state) => {
    this.subscriptions = new CompositeDisposable()

    this.poller = new AtomSpotifiedPoller()
    this.atomSpotifiedView = new AtomSpotifiedView()
    this.atomSpotifiedView.initialize()
    this.statusBarView = new StatusBarView()
    this.statusBarView.initialize()

    this.poller.addSubscriber(this.atomSpotifiedView.update)
    this.poller.addSubscriber(this.statusBarView.update)

    this.showStatus = false
    this.viewAppended = false

    atom.packages
      .activatePackage('tree-view')
      .then((treeViewPkg) => {
        this.treeViewPkg = treeViewPkg
        if (treeViewPkg.mainModule.treeView) {
          treeViewPkg.mainModule.treeView.append(this.atomSpotifiedView)
          this.viewAppended = true
          this.showStatus = false
        } else {
          this.statusBarTile = this.statusBar.addRightTile({
            item: this.statusBarView,
            priority: 1000,
          })
          this.showStatus = true
        }
      })

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', 'atom-spotified:toggle', () => {
      this.atomSpotifiedView.toggle()
      this.statusBarView.toggle()
    }))

    this.subscriptions.add(atom.commands.onDidDispatch((command) => {
      if (command.type !== 'tree-view:toggle') return

      if (this.showStatus) {
        if (!this.viewAppended) {
          this.treeViewPkg.mainModule.treeView.append(this.atomSpotifiedView)
        }
        this.statusBarTile.destroy()
        this.statusBarTile = null
      } else {
        this.statusBarTile = this.statusBar.addRightTile({
          item: this.statusBarView,
          priority: 1000,
        })
      }
      this.showStatus = !this.showStatus
    }))

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
