// Copyright (c) 2020 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

import * as React from 'react'
import * as BraveTodayElement from './default'
import CardIntro from './cards/cardIntro'
import CardLoading from './cards/cardLoading'
import { ReadFeedItemPayload } from '../../../actions/today_actions'
const Content = React.lazy(() => import('./content'))

type State = {
  hasInteractionStarted: boolean
}

export type OnReadFeedItem = (args: ReadFeedItemPayload) => any
export type OnSetPublisherPref = (publisherId: string, enabled: boolean) => any

export type Props = {
  isFetching: boolean
  isUpdateAvailable: boolean
  feed?: BraveToday.Feed
  publishers?: BraveToday.Publishers
  articleToScrollTo?: BraveToday.FeedItem
  displayedPageCount: number
  onInteracting: (interacting: boolean) => any
  onReadFeedItem: OnReadFeedItem
  onSetPublisherPref: OnSetPublisherPref
  onAnotherPageNeeded: () => any
  onCustomizeBraveToday: () => any
  onRefresh: () => any
  onCheckForUpdate: () => any
}

class BraveToday extends React.PureComponent<Props, State> {
  braveTodayHitsViewportObserver: IntersectionObserver
  scrollTriggerToFocusBraveToday: any // React.RefObject<any>

  state = {
    hasInteractionStarted: false
  }

  componentDidMount () {
    const options = { root: null, rootMargin: '0px', threshold: 0.25 }

    this.braveTodayHitsViewportObserver = new
      IntersectionObserver(this.handleBraveTodayHitsViewportObserver, options)

    // Handle first card showing up so we can hide secondary UI
    this.braveTodayHitsViewportObserver.observe(this.scrollTriggerToFocusBraveToday)
  }

  handleBraveTodayHitsViewportObserver = (entries: IntersectionObserverEntry[]) => {
    const isIntersecting = entries.some(entry => entry.isIntersecting)
    this.props.onInteracting(isIntersecting)
    if (isIntersecting) {
      this.setState({ hasInteractionStarted: true })
    }
  }

  render () {
    const shouldDisplayContent =
      this.state.hasInteractionStarted ||
      !!this.props.articleToScrollTo

    return (
      <BraveTodayElement.Section>
        <div
          ref={scrollTrigger => (this.scrollTriggerToFocusBraveToday = scrollTrigger)}
          style={{ position: 'sticky', top: '100px' }}
        />

        <CardIntro />

        { shouldDisplayContent &&
        <React.Suspense fallback={(<CardLoading />)}>
          <Content {...this.props} />
        </React.Suspense>
        }

      </BraveTodayElement.Section>
    )
  }
}

export default BraveToday
