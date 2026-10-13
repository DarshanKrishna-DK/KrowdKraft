# Krafty, the duck guide

Krafty is an original SVG character, drawn for this site with a violet cap, a soft cream body and six expressions. The reference avatar lab informed the idea of a responsive character; no source code, assets, faces or sounds were copied from it.

The small launcher opens an optional guide with section-aware copy, a next-stop link and shortcuts to events, collaboration and joining. It works on the community page and event detail pages. Escape closes the guide and restores launcher focus. Hide duck leaves a quiet Guide button for reopening. The panel does not trap scrolling or seize keyboard focus as the visitor moves through the page.

Sound starts off every visit. Only the sound button creates an AudioContext. Quacks are short, low-volume synthesized tones, with no audio download, speech service or microphone permission. They follow explicit guide actions, with a two-note response only after an opted-in visitor's mail submission is accepted. Muting or hiding the duck closes its audio context. Audio failure leaves navigation usable and displays a status message.

Expressions respond to sections and mail outcomes. They never imply successful delivery when mail is unconfigured or failed. Reduced motion removes the small greeting gesture; there is no idle animation loop, WebGL, tracking, AI chat or external API. With JavaScript disabled the guide is hidden and the full page remains readable.
