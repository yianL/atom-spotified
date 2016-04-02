'use babel'

import AtomSpotifiedPoller from '../src/utils/spotify-poller'
const poller = new AtomSpotifiedPoller()

describe('SpotifyPoller', () => {
  it('is well tested', () => {
    expect(typeof poller.start).toBe('function')
  })
})
