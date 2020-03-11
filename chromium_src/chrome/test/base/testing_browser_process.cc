/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "chrome/test/base/testing_browser_process.h"
#include "brave/browser/brave_browser_process_impl.h"

#define BrowserProcessImpl BraveBrowserProcessImpl
#include "../../../../../chrome/test/base/testing_browser_process.cc"
#undef BrowserProcessImpl
