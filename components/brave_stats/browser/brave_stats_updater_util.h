/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_COMPONENTS_BRAVE_STATS_BROWSER_BRAVE_STATS_UPDATER_UTIL_H_
#define BRAVE_COMPONENTS_BRAVE_STATS_BROWSER_BRAVE_STATS_UPDATER_UTIL_H_

#include <string>

#include "base/time/time.h"
#include "base/system/sys_info.h"
#include "components/prefs/pref_service.h"

namespace brave_stats {

std::string GetDateAsYMD(const base::Time& time);

std::string GetPlatformIdentifier();

int GetIsoWeekNumber(const base::Time& time);

base::Time GetYMDAsDate(const base::StringPiece& ymd);

std::string GetAPIKey();

}  // namespace brave_stats

#endif  // BRAVE_COMPONENTS_BRAVE_STATS_BROWSER_BRAVE_STATS_UPDATER_UTIL_H_
