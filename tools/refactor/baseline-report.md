# Refactor audit

Generated 2026-10-09 13:48 UTC.

## Headline

**Code quality score 65.7%.** **29 of 75 source files are over the 100-line limit (38.7%)**; the worst file is 1,028 lines.

## Code quality score

| Element | Reading | Score | Weight | 0% at |
| --- | --- | --- | --- | --- |
| **Standard baseline checks** | | **56.7%** | **60** | |
| Files over the line limit | 29 in 75 files | 22.7% | 10 | 50% of files |
| Worst file, in limits over | 9.28 | 0.0% | 5 | 9 |
| Functions over the line limit | 6 in 131 functions | 81.7% | 8 | 25% of functions |
| Else blocks | 8 in 269 branches | 94.1% | 5 | 50% of branches |
| Duplication % | 0.94 | 95.3% | 8 | 20 |
| Explanatory comment lines | 106 in 10.29 thousand lines | 79.4% | 4 | 50 per thousand lines |
| Inline magic values | 131 in 10.29 thousand lines | 36.3% | 4 | 20 per thousand lines |
| Orphan components and functions | 11 in 152 components and functions | 27.6% | 4 | 10% of components and functions |
| Long member chain lines | 67 in 10.29 thousand lines | 78.3% | 4 | 30 per thousand lines |
| Deeply indented lines | 522 in 10.29 thousand lines | 0.0% | 4 | 30 per thousand lines |
| Overlong function names | 0 in 131 functions | 100.0% | 4 | 10% of functions |
| **Design pattern file count** | | **100.0%** | **10** | |
| Files the patterns predict but are missing | 0 in 11 predicted files | 100.0% | 10 | 50% of predicted files |
| Entities outside their expected file count | not measured | not measured | — | 50% of entities |
| **Prose** | | **75.5%** | **20** | |
| Conditions with calls tangled inside calls | 15 in 269 branches | 77.7% | 8 | 25% of branches |
| Conditions compared to a raw literal | 35 in 269 branches | 48.0% | 6 | 25% of branches |
| Accessor names that want to be a property | 0 in 131 functions | 100.0% | 6 | 10% of functions |
| **Widget adoption** | | **not measured** | **0** | |
| Markup written by hand where a widget should be | not measured | not measured | — | 50% of widget slots |
| **Input validation** | | **not measured** | **0** | |
| Doors that write without checking their input against the columns | not measured | not measured | — | 50% of write doors |

Each element scores 100% with no offenders and falls in a straight line to 0% when its offenders, measured against the size of the codebase, reach the figure in the last column. The score is the weighted average of the elements that could be measured; an element that could not be measured lends its weight to the rest. Weights and zero points are set in `tools/refactor/rules.json` under `score.elements`. The offenders behind every reading are in `tools/refactor/audit-output/audit.json`.

## The repository by area

| Area | Files | Of which audited source | Source lines |
| --- | --- | --- | --- |
| frontend | 127 | 42 | 7,229 |
| backend | 20 | 20 | 1,816 |
| infrastructure | 10 | 0 | 0 |
| api | 7 | 7 | 229 |
| shared | 5 | 5 | 1,012 |
| tooling | 3 | 0 | 0 |
| database | 3 | 0 | 0 |
| other | 2 | 1 | 4 |
| docs | 1 | 0 | 0 |
| **whole repository** | **178** | **75** | **10,290** |

## Summary

| Check | Key figures |
| --- | --- |
| fileLength | limit: 100, filesOverLimit: 29, totalFiles: 75, totalLines: 10290, worstFileLines: 1028, worstFileTimesOverLimit: 9.28 |
| functionShape | limit: 30, functionsOverLimit: 6, totalFunctions: 131, elseBlocks: 8, ifBlocks: 269, measurementIsHeuristic: True |
| functionNames | overlongFunctionNames: 0, maxWords: 5, maxLength: 40 |
| accessorNames | gluedAccessorNames: 0, measurementIsHeuristic: True |
| duplication | clones: 9, duplicatedLines: 145, totalLines: 15451, duplicatedPercentage: 0.94 |
| naming | bannedAbbreviationHits: 143, unprefixedBooleans: 21 |
| comments | explanatoryCommentLines: 106, filesWithComments: 26, taskMarkers: 0 |
| magicValues | inlineHexColours: 95, inlineStyleAttributes: 6, repeatedStringLiterals: 30 |
| prose | longMemberChainLines: 67, deeplyIndentedLines: 522, overlongLines: 122, measurementIsHeuristic: True |
| conditions | tangledConditionLines: 15, literalComparisonLines: 35, measurementIsHeuristic: True |
| orphans | orphanFunctions: 0, functionsExamined: 131 |
| designPatterns | roleFamilies: 3, predictedFiles: 11, predictedFilesMissing: 0, entities: 0, entitiesOutOfRange: 0, measurementIsHeuristic: True |
| inventory | pages: 18, components: 21, orphanComponents: 11, averagePageLines: 289 |
| siteDefinition | skipped: no siteDefinition catalogue in rules.json |
| inputValidation | schemaTables: 2, limitedColumns: 0, writeDoors: 0, unvalidatedDoors: 0, looserLimits: 0 |
| fileAreas | totalFiles: 178, frontend: 127, backend: 20, infrastructure: 10, api: 7, shared: 5, tooling: 3, database: 3, other: 2, docs: 1 |

## Against the baseline

No `baseline.json` beside the audit — nothing to ratchet against.

## Worst files by length

| File | Lines |
| --- | --- |
| src/routes/rtw/+page.svelte | 1028 |
| src/routes/admin/brochure/[id]/page/[pageId]/+page.svelte | 708 |
| src/routes/admin/enquiries/+page.svelte | 543 |
| src/routes/admin/+page.svelte | 470 |
| src/routes/admin/brochure/[id]/+page.svelte | 379 |
| src/lib/server/brochures.js | 316 |
| src/routes/admin/brochure/+page.svelte | 312 |
| src/routes/admin/media/+page.svelte | 301 |
| src/lib/site.js | 292 |
| src/routes/+page.svelte | 283 |
| src/lib/brochure/templates.js | 282 |
| src/routes/admin/rtw/+page.svelte | 253 |
| src/lib/components/admin/ImagePicker.svelte | 241 |
| src/lib/server/db.js | 230 |
| src/routes/+layout.svelte | 222 |
| src/routes/admin/+layout.svelte | 207 |
| src/routes/contact/+page.svelte | 188 |
| src/lib/brochure/defaults.js | 186 |
| src/routes/admin/login/+page.svelte | 179 |
| src/lib/motion.js | 168 |

Full detail, including every offender list, is in `audit.json`.
