## 0.8.1
* Remove Spotify Web Api call. (#13)

## 0.8.0
* Fix compatibility issue with Atom 1.17 and up. (#12)
* Display non-square cover art without stretching. (#11)

## 0.7.1
* Fix compatibility issue with Nuclide 0.189.0 and up.
  
## 0.7.0
* **atom-spotified** now plays nicely with [Nuclide](https://nuclide.io/) file tree. :tada:
  
  I've switched to Nuclide months ago, and really enjoyed some of the features it provides such as flow integration, working sets, and smarter autocomplete suggestions (thanks to flow). But Nuclide comes with a different tree-view implementation that is a completely separate package from the native atom file-tree, and prevented this package from working properly. 
  
  Worry no more! This update fixes the issue with `nuclide-file-tree` and you can continue to enjoy your spotify view along with the awesome Nuclide file tree!

## 0.6.0
* Using "atom-spotified" package will no longer auto-start Spotify for you (#8)
* Status of atom-spotified will be surfaced through hover tooltips (Spotify is running/not running)

**chores**:
* Removed dependency `spotify-node-applescript`, and reimplemented similar functionality with Promise-based API.

## 0.5.0
* Add `mode` option

## 0.4.0
* UI components rewritten in atom/etch, so they are way easier to exxtend & customize now
* Added spotify style cover-art toggle. Probably not too useful, but it's super cool :tada:
* Hide soundbar animation config now affect statusBarView as well

## 0.3.1 - Patch Release
* Remove document.registerElement() to prevent namespace collision when upgrading package

## 0.3.0 - Minor Release
* Add CI
* Add more config options for status bar view

## 0.2.1 - Patch Release
* Recover from error state automatically

## 0.2.0 - Minor Release
* Add status bar view (when treeView is hidden)
* Add Spotify poller service (not exposed as external service yet)

## 0.1.2 - Patch Release
* Rewrite in ES6

## 0.1.1 - Patch Release
* Improve offline handling

## 0.1.0 - First Release
* Show current song & album art at the bottom of tree view
