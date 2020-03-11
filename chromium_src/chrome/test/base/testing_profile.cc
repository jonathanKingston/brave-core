/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "brave/browser/profiles/profile_util.h"
#include "brave/browser/brave_profile_prefs.h"
#include "brave/browser/brave_local_state_prefs.h"
#include "brave/components/brave_rewards/browser/rewards_service.h"

#define RegisterUserProfilePrefs RegisterUserProfilePrefs_ChromiumImpl
#include "../../../../chrome/browser/prefs/browser_prefs.cc"  // NOLINT
#undef RegisterUserProfilePrefs

void RegisterUserProfilePrefs(user_prefs::PrefRegistrySyncable* registry) {
  RegisterUserProfilePrefs_ChromiumImpl(registry);
  brave::RegisterProfilePrefs(registry);
  brave_rewards::RewardsService::RegisterProfilePrefs(registry);
}

void RegisterUserProfilePrefs(user_prefs::PrefRegistrySyncable* registry,
                              const std::string& locale) {
  RegisterUserProfilePrefs_ChromiumImpl(registry, locale);
}

#include "brave/browser/browser_context_keyed_service_factories.h"
#include "chrome/browser/profiles/chrome_browser_main_extra_parts_profiles.h"
namespace {

class BraveBrowserMainExtraPartsProfiles
    : public ChromeBrowserMainExtraPartsProfiles {
 public:
  BraveBrowserMainExtraPartsProfiles() = default;
  ~BraveBrowserMainExtraPartsProfiles() override = default;

  static void EnsureBrowserContextKeyedServiceFactoriesBuilt() {
    ChromeBrowserMainExtraPartsProfiles::
        EnsureBrowserContextKeyedServiceFactoriesBuilt();
    brave::EnsureBrowserContextKeyedServiceFactoriesBuilt();
  }

 private:
  DISALLOW_COPY_AND_ASSIGN(BraveBrowserMainExtraPartsProfiles);
};

}  // namespace

#define BRAVE_INIT                            \
  if (brave::IsSessionProfilePath(GetPath())) \
    brave::CreateParentProfileData(this);     \
  else

#define ChromeBrowserMainExtraPartsProfiles BraveBrowserMainExtraPartsProfiles
#include "../../../../../chrome/test/base/testing_profile.cc"
#undef ChromeBrowserMainExtraPartsProfiles
#undef BRAVE_INIT
