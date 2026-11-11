# Maintaining the Opportunities guide

Continue editing GitHub as before. Both existing Azure workflows run the existing build script, which now also validates the opportunity directory and generates its no-JavaScript version. No API key, account service, or paid map subscription is required for this implementation.

## Editing programs

- `opportunities-data.mjs` is the single directory. Update the provider URL, description, grade range, fees, eligibility, status, dates, and source links there.
- Keep `reviewedOn` and the visible review date in `opportunities.html` aligned with an actual review.
- Use only official provider sources for eligibility, dates, and prices. The linked Summit directory is an additional discovery resource, not an authority for current dates or acceptance rates.
- Record past-cycle dates as past. Use `upcoming` only for a provider-announced future cycle, `closed` for an ended cycle, `verify` when the current offering needs confirmation, and `archived` for a discontinued program.
- `opens` is an exact confirmed opening date, if available. It only changes the prompt to check the announced window; it never automatically claims that applications are open. Do not invent a day when only a month is announced.
- `grades` means grade at program start, including the rising grade for summer programs; `13` represents a recent high school graduate. It is a discovery filter, not a guarantee of eligibility. Read the program's eligibility notes for citizenship, prerequisites, local restrictions, and cycle-specific rules.
- `price: null` means a current comparable fee is not known. Those entries are excluded by the fee ceiling. `tuitionFree` does not mean travel, application, or confirmation fees are covered; retain the full cost note.
- Map pins are approximate campus coordinates. Online-only entries have `coordinates: null`. Several programs at an identical campus share a single pin with all programs listed in its popup. Discontinued programs are not pinned.

The initial release accounts for all 16 programs in the supplied message. Duke's discontinued academy remains clearly marked, with its separate Summer Session included as an alternative. DSAP and OSU's old robotics listing are retained with explicit availability caveats. World Science Scholars is operated by World Science Festival, not the UN.

## Behavior

The ten-question finder applies subject, grade, minimum age, setting, budget, region, season, and duration preferences. Goal and experience order the results and produce readable match reasons. It never fabricates acceptance percentages or personal admission odds. Optional answers remain in memory for the visit; only bookmarked program IDs are saved to the browser. A storage failure leaves bookmarks working for that visit.

The suggestion form prepares an email to the contact address already published on the main site. It does not claim submission. The visitor reviews and sends the email in their own client; a text download is available if no email client is configured.

The compass uses inline SVG and event-driven CSS transforms. There is no additional 3D engine, image download, or continuously running animation loop. The map loads the pinned, local Leaflet 1.9.4 library only when the visitor selects Map. OpenStreetMap tiles then load normally with visible attribution, browser caching, and the site's existing referrer policy. There is no bulk tile prefetch or precise-location request. A visible failure message preserves the usable directory if maps cannot load. For substantially higher traffic, review the OSM tile policy and select an appropriate tile provider.

- Leaflet: https://leafletjs.com/examples/quick-start/
- Tile policy: https://operations.osmfoundation.org/policies/tiles/
- Leaflet license: `assets/vendor/leaflet/LICENSE`

## Checks

Run `node .github/scripts/build-opportunities.mjs` for directory validation, matching regression checks, startup budgets, and the generated fallback page. Run `bash .github/scripts/build-effects.sh` for the complete image/globe build and regression checks. Do not edit `opportunities-directory.html` directly; it is generated.

Before publishing, test desktop and mobile, the full finder, combinations with no results, shortlist persistence, detail dialogs, keyboard focus, program links, geographic pins, map filters, and the suggestion draft. The homepage and existing globe implementation remain separate from these page-specific files.

## Application-fit assessment

Program details now offer a separate, on-demand assessment. `opportunities-fit-data.mjs` contains the provider-informed questions, source URLs, and editorial weights. `opportunities-fit.js` renders the questionnaire and point breakdown; its style and modules load only when an assessment is opened. No server, account, model, or analytics endpoint receives the answers. Answers are kept per program in tab memory, not browser storage, and disappear on reload.

There are 13 scored rubrics. The discontinued Duke academy and the three offerings marked unconfirmed (OSU robotics, DSAP and UA Little Rock) explain why no score is available. Enrollment and introductory programs use exploration-fit questions rather than rewarding prior research, awards, or expensive extracurriculars.

For each scored item, the answer earns 0, 0.5, or 1 times its weight. Weights total 100. A final score requires all scoring items answered and all eligibility checks marked Yes. No/unknown eligibility suppresses the final score; it cannot be overridden by points. Missing and “Not sure” responses remain unknown, never zero. When eligibility is confirmed but answers are missing, the UI shows the possible point range without renormalizing the answered portion. That range is not a statistical confidence interval.

75–100 is labeled strong checklist alignment, 45 to below 75 some alignment, and below 45 room to prepare. Half-point totals are preserved so the breakdown adds up exactly. These weights and thresholds are STEM2Connect's editorial choices, not university admissions weights, a research-validated predictor, or percentages of acceptance. They are displayed in the methodology section. Scores are specific to each checklist and should not be compared across programs. No demographic characteristics, income amounts, exact grades, essays, names, transcripts, or recommendation contents are collected. The full provider context and requirements still matter.

Keep each new question tied to a provider URL and record the review date and method version. Distinguish explicit admissions criteria from inferred preparation or activity fit. Do not add supposed acceptance rates from cohort sizes or unofficial anecdotes. Update the published date/eligibility fields alongside a rubric when sources change. The SUMMET entry was corrected after its official FAQ confirmed that it has no residency restriction.

Run `node .github/scripts/check-opportunities-fit.mjs` for formula and loading regression checks; the full existing build also runs it. Browser checks should include missing answers, a failed requirement with otherwise maximum points, changing an answer after a result, per-program answer isolation, clear/reopen behavior, source links, keyboard dismissal, and narrow screens.
