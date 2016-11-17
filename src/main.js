'use babel'

import { CompositeDisposable } from 'atom'

import AtomSpotifiedPoller from './utils/spotify-poller'
import AtomSpotifiedView from './views/atom-spotified-view'
import StatusBarView from './views/status-bar-view'
import { Mode } from './utils/constants'

const AtomSpotified = {

  activate: (state) => {
    // initialize variables
    const config = atom.config.get('atom-spotified')

    this.showStatus = false
    this.viewAppended = false
    this.visible = true

    this.subscriptions = new CompositeDisposable()
    this.poller = new AtomSpotifiedPoller()
    this.atomSpotifiedView = new AtomSpotifiedView()
    this.statusBarView = new StatusBarView()
    this.updateStatusView = updateStatusView.bind(this)
    this.handleTreeToggle = handleTreeToggle.bind(this)
    this.addStatusBarView = addStatusBarView.bind(this)
    this.addTreeView = addTreeView.bind(this)

    this.poller.addSubscriber(this.atomSpotifiedView.update.bind(this.atomSpotifiedView))
    this.poller.addSubscriber(this.statusBarView.update.bind(this.statusBarView))

    const packageDependencies = [
      'status-bar',
    ]
    if (atom.packages.isPackageActive('tree-view')) { packageDependencies.push('tree-view') }
    if (atom.packages.isPackageActive('nuclide-file-tree')) { packageDependencies.push('nuclide-file-tree') }

    const packageActivationPromises = packageDependencies.map((packageName) => atom.packages.activatePackage(packageName))

    Promise.all(packageActivationPromises)
      .then(([statusBarPkg]) => {
        switch (config.mode) {
          case Mode.STATUS:
            this.statusBarTile = this.addStatusBarView()
            break

          case Mode.TREE:
            this.addTreeView()
            break

          case Mode.AUTO:
          default:
            const sidePanel = getSidePanel()

            if (sidePanel && sidePanel.clientWidth > 0) {
              this.addTreeView()
            } else {
              this.statusBarTile = this.addStatusBarView()
            }
        }
      })

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'atom-spotified:toggle', () => {
        this.visible = !this.visible

        return this.showStatus
          ? this.statusBarView.update({visible: this.visible})
          : this.atomSpotifiedView.update({visible: this.visible})
      })
    )

    // Monitor tree-view toggle events
    this.subscriptions.add(
      atom.commands.onDidDispatch((command) => {
        if (command.type === 'tree-view:toggle' || command.type === 'nuclide-file-tree:toggle') {
          this.handleTreeToggle()
        }
      })
    )

    atom.config.observe('atom-spotified.statusBarViewPosition', this.updateStatusView)
    atom.config.observe('atom-spotified.statusBarViewPriority', this.updateStatusView)

    this.poller.start()

    function getSidePanel () {
      return document.getElementsByClassName('nuclide-side-bar-tab-container')[0] ||
        document.getElementsByClassName('tree-view-resizer')[0]
    }

    function addTreeView () {
      const sidePanel = getSidePanel()
      if (sidePanel) {
        sidePanel.appendChild(this.atomSpotifiedView.element)
        this.viewAppended = true
        this.showStatus = false
      }
    }

    function handleTreeToggle () {
      switch (config.mode) {
        case Mode.TREE:
          if (!this.viewAppended) { this.addTreeView() }
          break

        case Mode.STATUS:
          break

        case Mode.AUTO:
        default:
          if (this.showStatus) {
            if (!this.viewAppended) { this.addTreeView() }
            this.statusBarTile && this.statusBarTile.destroy()
            this.statusBarTile = null
            this.showStatus = false
          } else {
            this.statusBarTile = this.addStatusBarView()
          }
      }
    }

    function addStatusBarView () {
      const tile = {
        item: this.statusBarView.element,
        priority: atom.config.get('atom-spotified.statusBarViewPriority')
      }
      this.showStatus = true

      return atom.config.get('atom-spotified.statusBarViewPosition') === 'right'
        ? this.statusBar.addRightTile(tile)
        : this.statusBar.addLeftTile(tile)
    }

    function updateStatusView () {
      if (this.showStatus) {
        this.statusBarTile && this.statusBarTile.destroy()
        this.statusBarTile = this.addStatusBarView()
      }
    }
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
