# This project

This repository's own instructions: its conventions, the commands that build and test it, the domain it serves, and any standing tasks or prompts that belong to this project and no other. `CLAUDE.md` loads this file and every session reads it after the kit's rules.

The project-process kit writes this file once and never touches it again, and `CLAUDE.md` is the kit's, replaced whole every time the bootstrap runs, so anything written there is lost. Write here instead. Where this file and the kit disagree about this project, this file wins, except that nothing here lifts the branch rule: the work still happens on a branch and ends as a pull request.

## Jewel Property Serve website

The public site at jewelps.co.uk: SvelteKit 2 with Svelte 5 and Tailwind CSS v3, deployed on Vercel from `main`. Source is plain JavaScript (`jsconfig.json`), so the audit's `sourceGlobs` in `tools/refactor/rules.json` include `src/**/*.js` as well as `.ts` and `.svelte`.

- `npm run dev` serves the site locally; `npm run build` builds it; `npm run check` runs svelte-check.
- `README.md` has the full route list, environment variables, the admin area and the brochure generator.
- Duplication measurement needs jscpd (`npm install -g jscpd`); install it before retaking the baseline.
