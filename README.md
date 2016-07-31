# :musical_note: Atom-Spotified [![Build Status](https://travis-ci.org/yianL/atom-spotified.svg?branch=master)](https://travis-ci.org/yianL/atom-spotified)

For all the Atom & Spotify lovers out there! This plugin shows the song currently playing in Spotify.
Switch between the tree view, or the status bar view, when the tree view is hidden:

Tree (Spotify style)   | Status Bar
-----------------------|-------------------
![TreeView mode](https://raw.githubusercontent.com/yianL/atom-spotified/master/assets/screenshots/atom-spotified-1.png) | ![StatusBar mode](https://raw.githubusercontent.com/yianL/atom-spotified/master/assets/screenshots/atom-spotified-2.png)

## Usage

Only OSX is supported at this moment since I'm using AppleScript to interact with Spotify.

### Commands

Command                 | Description
------------------------|--------------
`atom-spotified:toggle` | Toggles (show/hide) the widget that displays the current track and album art.

### Keybindings

Command            | Linux  | OS X  | Windows
-------------------|--------|-------|----------
`atom-spotified:toggle` | *Not Supported* | <kbd>Ctrl-Alt-q</kbd> | *Not Supported*

Custom keybindings can be added by referencing the above commands.

### Configuration

Configuration Key Path      | Type | Default | Description
----------------------------|------|---------|------------
`atom-spotified:mode` | `string` | `Auto` | <ul><li>`Auto(default)` - Toggle between treeView and statusBarView automatically</li><li>`Tree` - TreeView only</li><li>`Status` - StatusBarView only</li></ul>
`atom-spotified:showSoundBar` | `boolean` | `true` | Whether to show the equalizer animation or not.
`atom-spotified:statusBarViewPosition` | `string` | `right` | Position of the statusBarView
`atom-spotified:statusBarViewPriority` | `integer` | `1000` | Affects the order of which statusBarView appears in the status bar

## Contributing

PRs, bug reports, and feature requests are always welcomed!

## License

[MIT License](http://opensource.org/licenses/MIT) - see the [LICENSE](https://github.com/yianL/atom-spotified/blob/master/LICENSE.md) for more details.
