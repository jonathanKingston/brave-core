/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "brave/browser/browsing_data/counters/shields_settings_counter.h"

#include <string>

#include "components/browsing_data/core/pref_names.h"
#include "components/content_settings/core/browser/content_settings_registry.h"
#include "components/content_settings/core/common/content_settings_pattern.h"

ShieldsSettingsCounter::ShieldsSettingsCounter(
    HostContentSettingsMap* map,
    PrefService* pref_service)
    : map_(map),
      pref_service_(pref_service) {
  DCHECK(map_);
  DCHECK(pref_service_);
}

ShieldsSettingsCounter::~ShieldsSettingsCounter() = default;

void ShieldsSettingsCounter::OnInitialized() {}

const char* ShieldsSettingsCounter::GetPrefName() const {
  return browsing_data::prefs::kDeleteSiteSettings;
}

void ShieldsSettingsCounter::Count() {
  ReportResult(0);
}
