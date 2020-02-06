/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "brave/components/omnibox/browser/brave_autocomplete_controller.h"
#include "chrome/browser/autocomplete/chrome_autocomplete_provider_client.h"
#include "components/omnibox/browser/autocomplete_controller.h"
#include "brave/browser/autocomplete/brave_autocomplete_scheme_classifier.h"

#define ChromeAutocompleteSchemeClassifier BraveAutocompleteSchemeClassifier
#define AutocompleteController BraveAutocompleteController
#include "../../../../../../../chrome/browser/ui/webui/omnibox/omnibox_page_handler.cc"
#undef AutocompleteController
#undef ChromeAutocompleteSchemeClassifier
