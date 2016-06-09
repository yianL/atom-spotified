'use babel'

import { CompositeDisposable } from 'atom'

import AtomSpotifiedPoller from './utils/spotify-poller'
import AtomSpotifiedView from './views/atom-spotified-view'
import StatusBarView from './views/status-bar-view'

const AtomSpotified = {

  activate: (state) => {
    this.subscriptions = new CompositeDisposable()

    this.poller = new AtomSpotifiedPoller()
    this.atomSpotifiedView = new AtomSpotifiedView()
    this.statusBarView = new StatusBarView()

    this.poller.addSubscriber(this.atomSpotifiedView.update.bind(this.atomSpotifiedView))
    this.poller.addSubscriber(this.statusBarView.update.bind(this.statusBarView))

    this.showStatus = false
    this.viewAppended = false
    this.visible = true

    const addStatusBarView = () => {
      const tile = {
        item: this.statusBarView.element,
        priority: atom.config.get('atom-spotified.statusBarViewPriority')
      }

      return atom.config.get('atom-spotified.statusBarViewPosition') === 'right'
        ? this.statusBar.addRightTile(tile)
        : this.statusBar.addLeftTile(tile)
    }

    const updateStatusView = () => {
      if (this.showStatus) {
        this.statusBarTile.destroy()
        this.statusBarTile = addStatusBarView()
      }
    }

    atom.packages
      .activatePackage('tree-view')
      .then((treeViewPkg) => {
        this.treeViewPkg = treeViewPkg

        if (treeViewPkg.mainModule.treeView) {
          treeViewPkg.mainModule.treeView.append(this.atomSpotifiedView.element)
          this.viewAppended = true
          this.showStatus = false
        } else {
          this.statusBarTile = addStatusBarView()
          this.showStatus = true
        }
      })

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', 'atom-spotified:toggle', () => {
      this.visible = !this.visible
      return this.showStatus
        ? this.statusBarView.update({visible: this.visible})
        : this.atomSpotifiedView.update({visible: this.visible})
    }))

    this.subscriptions.add(atom.commands.onDidDispatch((command) => {
      if (command.type !== 'tree-view:toggle') return

      if (this.showStatus) {
        if (!this.viewAppended) {
          this.treeViewPkg.mainModule.treeView.append(this.atomSpotifiedView.element)
        }
        this.statusBarTile.destroy()
        this.statusBarTile = null
      } else {
        this.statusBarTile = addStatusBarView()
      }

      this.showStatus = !this.showStatus
    }))

    atom.config.observe('atom-spotified.statusBarViewPosition', updateStatusView)
    atom.config.observe('atom-spotified.statusBarViewPriority', updateStatusView)

    this.poller.start()
  },

  deactivate: () => {
    this.subscriptions.dispose()
    this.atomSpotifiedView.destroy()
    this.statusBarTile && this.statusBarTile.destroy()
    this.statusBarView.destroy()
  },

  serialize: () => ({}),

  consumeStatusBar: (statusBar) => {
    this.statusBar = statusBar
  }
}

export default AtomSpotified
