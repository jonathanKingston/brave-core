// Copyright (c) 2020 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

import AsyncActionHandler from '../../common/AsyncActionHandler'
import * as Background from '../../common/Background'
import * as Actions from '../actions/today_actions'
import { ApplicationState } from '../reducers'

function storeInHistoryState (data: Object) {
  const oldHistoryState = (typeof history.state === 'object') ? history.state : {}
  const newHistoryState = { ...oldHistoryState, ...data }
  history.pushState(newHistoryState, document.title)
}

import Messages = BraveToday.Messages
import MessageTypes = Background.MessageTypes.Today

const handler = new AsyncActionHandler()

handler.on(Actions.todayInit.getType(), async (store, payload) => {
  // Let backend know that a UI with today is open, so that it can
  // pre-fetch the feed if it is not already in a cache.
  await Background.send(MessageTypes.indicatingOpen)
})

handler.on(
  [Actions.interactionBegin.getType(), Actions.refresh.getType()],
  async (store) => {
    try {
      const [{ feed }, { publishers }] = await Promise.all([
        Background.send<Messages.GetFeedResponse>(MessageTypes.getFeed),
        Background.send<Messages.GetPublishersResponse>(MessageTypes.getPublishers)
      ])
      store.dispatch(Actions.dataReceived({ feed, publishers }))
    } catch (e) {
      console.error('error receiving feed', e)
      store.dispatch(Actions.errorGettingDataFromBackground(e))
    }
  }
)

handler.on(Actions.ensureSettingsData.getType(), async (store) => {
  const state = store.getState() as ApplicationState
  if (state.today.publishers && Object.keys(state.today.publishers).length) {
    return
  }
  const { publishers } = await Background.send<Messages.GetPublishersResponse>(MessageTypes.getPublishers)
  store.dispatch(Actions.dataReceived({ publishers }))
})

handler.on<Actions.ReadFeedItemPayload>(Actions.readFeedItem.getType(), async (store, payload) => {
  const state = store.getState() as ApplicationState
  const todayPageIndex = state.today.currentPageIndex
  if (!payload.openInNewTab) {
    // remember article so we can scroll to it on "back" navigation
    storeInHistoryState({ todayArticle: payload.item, todayPageIndex })
    // visit article url
    // @ts-ignore
    window.location = payload.item.url
  } else {
    window.open(payload.item.url, '_blank')
  }
})

handler.on<Actions.SetPublisherPrefPayload>(Actions.setPublisherPref.getType(), async (store, payload) => {
  const { publisherId, enabled } = payload
  const { publishers } = await Background.send<Messages.SetPublisherPrefResponse, Messages.SetPublisherPrefPayload>(MessageTypes.setPublisherPref, {
    publisherId,
    enabled
  })
  store.dispatch(Actions.dataReceived({ publishers }))
  store.dispatch(Actions.checkForUpdate())
})

handler.on(Actions.checkForUpdate.getType(), async function (store) {
  const state = store.getState() as ApplicationState
  if (!state.today.feed || !state.today.feed.hash) {
    store.dispatch(Actions.isUpdateAvailable({ isUpdateAvailable: true }))
    return
  }
  const hash = state.today.feed.hash
  const isUpdateAvailable = await Background.send<Messages.IsFeedUpdateAvailableResponse, Messages.IsFeedUpdateAvailablePayload>(MessageTypes.isFeedUpdateAvailable, {
    hash
  })
  store.dispatch(Actions.isUpdateAvailable(isUpdateAvailable))
})

handler.on(Actions.resetTodayPrefsToDefault.getType(), async function (store) {
  const { publishers } = await Background.send<Messages.ClearPrefsResponse>(MessageTypes.resetPrefsToDefault)
  store.dispatch(Actions.dataReceived({ publishers }))
  store.dispatch(Actions.checkForUpdate())
})

handler.on(Actions.anotherPageNeeded.getType(), async function (store) {
  store.dispatch(Actions.checkForUpdate())
})

export default handler.middleware
