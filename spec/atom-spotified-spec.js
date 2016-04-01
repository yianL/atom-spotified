'use babel'

import AtomSpotified from '../src/main'

describe('AtomSpotified', () => {
  let activationPromise, ref, workspaceElement
  ref = [], workspaceElement = ref[0], activationPromise = ref[1]

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('atom-spotified')
  })

  describe('when the atom-spotified:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      expect(workspaceElement.querySelector('.atom-spotified')).not.toExist()
      atom.commands.dispatch(workspaceElement, 'atom-spotified:toggle')

      waitsForPromise(() => activationPromise)

      runs(() => {
        var myAtomPackageElement, myAtomPackagePanel
        expect(workspaceElement.querySelector('.atom-spotified')).toExist()
        myAtomPackageElement = workspaceElement.querySelector('.atom-spotified')

        expect(myAtomPackageElement).toExist()
        myAtomPackagePanel = atom.workspace.panelForItem(myAtomPackageElement)

        expect(myAtomPackagePanel.isVisible()).toBe(true)
        atom.commands.dispatch(workspaceElement, 'atom-spotified:toggle')

        expect(myAtomPackagePanel.isVisible()).toBe(false)
      })
    })

    it('hides and shows the view', () => {
      jasmine.attachToDOM(workspaceElement)
      expect(workspaceElement.querySelector('.atom-spotified')).not.toExist()
      atom.commands.dispatch(workspaceElement, 'atom-spotified:toggle')

      waitsForPromise(() => activationPromise)

      runs(() => {
        var myAtomPackageElement
        myAtomPackageElement = workspaceElement.querySelector('.atom-spotified')
        expect(myAtomPackageElement).toBeVisible()
        atom.commands.dispatch(workspaceElement, 'atom-spotified:toggle')
        expect(myAtomPackageElement).not.toBeVisible()
      })
    })
  })
})
