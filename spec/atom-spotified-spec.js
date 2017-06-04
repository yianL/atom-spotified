'use babel'

describe('AtomSpotified', () => {
  let workspaceElement

  beforeEach(() => {
    waitsForPromise(() => atom.packages.activatePackage('tree-view'))
    waitsForPromise(() => atom.packages.activatePackage('status-bar'))

    workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)

    waitsForPromise(() => atom.packages.activatePackage('atom-spotified'))
  })

  describe('when TreeView is active', () => {
    it('shows the atom-spotified-view', () => {
      const elem = workspaceElement.querySelector('.atom-spotified')
      expect(elem).toBeVisible()
    })

    it('does not show the status-bar-view', () => {
      const elem = workspaceElement.querySelector('.atom-spotified-status')
      expect(elem).toBe(null)
    })

    // describe('when atom-spotified:toggle event is triggered', () => {
    //   beforeEach(async () => {
    //     await atom.commands.dispatch(workspaceElement, 'atom-spotified:toggle')
    //   })
    //
    //   it('hides the view', () => {
    //     const elem = workspaceElement.querySelector('.atom-spotified')
    //     expect(elem).not.toBeVisible()
    //   })
    // })
  })

  describe('when TreeView is inactive', () => {
    beforeEach(() => {
      // toggle the tree view to hide it
      atom.commands.dispatch(workspaceElement, 'tree-view:toggle')
    })

    // it('does not show the atom-spotified-view', () => {
    //   const elem = workspaceElement.querySelector('.atom-spotified')
    //   expect(elem).toBe(null)
    // })

    it('shows the status-bar-view', () => {
      const elem = workspaceElement.querySelector('.atom-spotified-status')
      expect(elem).toBeVisible()
    })

    // describe('when atom-spotified:toggle event is triggered', () => {
    //   it('hides and shows the view', () => {
    //     const elem = workspaceElement.querySelector('.atom-spotified-status')
    //     expect(elem).toBeVisible()
    //     atom.commands.dispatch(workspaceElement, 'atom-spotified:toggle')
    //     expect(elem).not.toBeVisible()
    //   })
    // })
  })
})
