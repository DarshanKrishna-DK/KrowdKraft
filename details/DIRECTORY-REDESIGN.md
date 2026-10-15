# Directory page design

The events, builds and leaderboard pages share the main site's dark plum surface (#131017), raised glass (#211b28), warm ivory (#fae9e7), pale pink (#e0adc3) and muted text (#bfaebc). They inherit the approved display font; labels and body copy retain the readable sans-serif face.

Each page opens with a compact, left-aligned heading and a pale isometric object on the right. The event calendar, code window and activity blocks are original SVG illustrations. They depict what the page contains without fabricated activity or decorative statistics.

Events: `[heading / calendar]`, `[search + time + format + year]`, `[hackathons]`, `[other gatherings]`. With filters active, one matching-results grid replaces the two default groups. Dropdowns use a custom styled listbox with keyboard selection, Escape, outside click and focus support. Results update as controls change; searching waits briefly for typing to pause.

Builds: `[heading + share action / code window]`, then approved projects or one clear invitation to submit the first build. Existing server pagination and review wording remain.

Leaderboard: `[heading + GitHub action / activity blocks]`, then the real monthly ranking beside a compact scoring explanation. Month and year selections update the saved month URL. Empty months show no synthetic competitors or podium numbers.

Review against the brief: use physical cream objects and restrained glass, not black diagrams. Keep the content broad across the screen, make mobile controls full width, and avoid hover movement that separates an arrow from its text. Motion is limited to a short illustration entrance and direct control feedback; reduced motion removes the entrance.

Local verification on 15 October 2026: TypeScript passed. In Chrome, keyboard selection of Hackathons updated the URL and returned the two real matching events; a debounced x402 search returned one; Clear filters restored both default sections and all nine events. Escape closed the styled listbox. September selection updated the monthly leaderboard without a submit button, and the scoring disclosure opened. The builds page rendered its real empty state. The inspected desktop page had no horizontal overflow, missing images or browser errors. Responsive integration checks are recorded separately in the overall verification notes.

Screenshots: `artifacts/verification/directory-events-filter.png`, `artifacts/verification/directory-leaderboard.png`, and `artifacts/verification/directory-builds.png`.
