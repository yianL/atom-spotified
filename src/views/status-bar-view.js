'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import DOMListener from 'dom-listener'
import classNames from 'classnames'
import { CompositeDisposable } from 'atom'

/*
propTypes = {
  showSoundBar: bool,
  visible: bool,
  trackInfo: {
    name: string,
    artist: string,
    cover: string,
    state: oneOf('playing', 'paused', 'error')
  }
}
*/
export default class StatusBarView {

  constructor (props, children) {
    this.props = {
      showSoundBar: atom.config.get('atom-spotified.showSoundBar'),
      visible: true,
      trackInfo: {},
    }

    // initial render of component
    etch.initialize(this)

    atom.config.observe('atom-spotified.showSoundBar', (value) => this.update({showSoundBar: value}))

    // setup subscriptions
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(
      atom.tooltips.add(this.refs.name, {
        title: () => this.props.message || `${this.props.trackInfo.name} - ${this.props.trackInfo.artist}`
      })
    )
  }

  toggleCover () {
    const { showLargeCover } = this.props
    this.update({showLargeCover: !showLargeCover})
  }

  render () {
    const { showSoundBar, visible } = this.props
    const { name, cover, artist, state } = this.props.trackInfo

    const soundbarImg = state === 'playing'
      ? 'atom://atom-spotified/assets/equalizer_white.gif'
      : 'atom://atom-spotified/assets/equalizer_white_pause.gif'

    return (
      <div className={classNames('atom-spotified-status', 'inline-block', {hidden: !visible})}>
        {showSoundBar
          ? <img className='player-state' src={soundbarImg} />
          : <i className='fa fa-spotify' />}
        <a
          ref='name'
          className='inline-block'
          href='#'>
          {name ? `${name} - ${artist}` : 'Atom Spotified'}
        </a>
      </div>
    )
  }

  update (props, children) {
    // shallow update
    for (var key in props) {
      this.props[key] = props[key]
    }
    return etch.update(this)
  }

  async destroy () {
    await etch.destroy(this)
    this.subscriptions.dispose()
  }
}
