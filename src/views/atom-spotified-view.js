'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import DOMListener from 'dom-listener'
import classNames from 'classnames'
import { CompositeDisposable } from 'atom'

/*
propTypes = {
  showSoundBar: bool,
  showLargeCover: bool,
  visible: bool,
  trackInfo: {
    name: string,
    artist: string,
    cover: string,
    state: oneOf('playing', 'paused', 'error')
  }
}
*/
export default class AtomSpotifiedView {

  constructor (props, children) {
    this.props = {
      showSoundBar: atom.config.get('atom-spotified.showSoundBar'),
      showLargeCover: false,
      visible: true,
      trackInfo: {},
    }

    // initial render of component
    etch.initialize(this)

    // setup event listeners
    this.listener = new DOMListener(this.element)
    this.listener.add('.toggle', 'click', this.toggleCover.bind(this))

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
    const { showSoundBar, visible, showLargeCover } = this.props
    const { name, cover, artist, state } = this.props.trackInfo

    return (
      <div className={classNames('atom-spotified', {hidden: !visible, ['large-cover']: showLargeCover})}>
        <div className={classNames('cover-2', {hidden: !showLargeCover})}>
          {cover
            ? <img className='album-art' src={cover} />
            : <i className='fa fa-spotify' />}
          <div className='toggle'>
            <span className='icon icon-chevron-down' />
          </div>
        </div>
        <div className='info'>
          <div className={classNames('cover', {hidden: showLargeCover})}>
            {cover
              ? <img className='album-art' src={cover} />
              : <i className='fa fa-spotify' />}
            <div className='toggle'>
              <span className='icon icon-chevron-up' />
            </div>
          </div>

          <div className='track-info'>
            <div ref='name' className='name'>
              {name || 'Spotified'}
            </div>
            <div className='artist'>
              {artist || 'Atom'}
            </div>
          </div>
          <img
            className={classNames('player-state', {hidden: !showSoundBar})}
            src={state === 'playing'
              ? 'atom://atom-spotified/assets/equalizer_white.gif'
              : 'atom://atom-spotified/assets/equalizer_white_pause.gif'}
          />
        </div>
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
