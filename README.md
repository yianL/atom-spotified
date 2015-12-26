# Atom-Spotified

For all the Atom & Spotify lovers out there. This plugin shows the song currently playing in Spotify at the bottom of your treeView.

Switch between the tree view:
![TreeView mode](https://raw.githubusercontent.com/yianL/atom-spotified/master/screenshots/atom-spotified-1.png)

or the status bar view, when the tree view is hidden:
![StatusBar mode](https://raw.githubusercontent.com/yianL/atom-spotified/master/screenshots/atom-spotified-2.png)

## Usage

Currently this plugin is only supported in OS X since it's using AppleScript to interact with Spotify.

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
`atom-spotified:showEqualizer` | `boolean` | `true` | Whether to show the equalizer animation or not.

## Contributing

PRs, bug reports, and feature requests are always welcomed!

## Screenshots

![A screenshot of your package](https://raw.githubusercontent.com/yianL/atom-spotified/master/screenshots/atom-spotified-screenshot.png)

## License

[MIT License](http://opensource.org/licenses/MIT) - see the [LICENSE](https://github.com/yianL/atom-spotified/blob/master/LICENSE.md) for more details.
