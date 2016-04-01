'use babel'

import AtomSpotified from '../src/main'

describe('AtomSpotified', () => {
  let activationPromise, workspaceElement

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('atom-spotified')
  })

  describe('when the atom-spotified:toggle event is triggered', () => {
    beforeEach(() => {
      waitsForPromise(() => activationPromise)
    })

    it('hides and shows the view', () => {
      jasmine.attachToDOM(workspaceElement)

      expect(atom.packages.isPackageActive('atom-spotified')).toBe(true)

      runs(() => {
        const myAtomPackageElement = workspaceElement.querySelector('.atom-spotified')

        expect(myAtomPackageElement).toBeVisible()

        atom.commands.dispatch(workspaceElement, 'atom-spotified:toggle')
        expect(myAtomPackageElement).not.toBeVisible()
      })
    })
  })
})
