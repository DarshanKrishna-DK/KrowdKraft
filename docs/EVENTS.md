# Organizer events

There is no CMS or organizer endpoint. The local CLI edits `src/data/events.json` after explicit approval. Commit and review the data change to publish it through the site's normal Git workflow.

```
npm run event:add -- "https://example.com/event"
npm run event:add
npm run event:list
npm run event:edit -- event-slug
npm run event:remove -- event-slug
npm run event:validate
```

Adding with a URL fetches one public HTML page and previews JSON-LD Event, Open Graph and ordinary page metadata. It never runs the page's scripts. Review source metadata, KrowdKraft's involvement and every field; missing values require manual entry. A page rendered only by JavaScript may have little extractable metadata: use manual entry rather than inventing information. Multiple structured events produce a warning and preview the first. Offset timestamps are converted to the Asia/Kolkata date.

Enter keeps a displayed value. `-` clears optional fields. `Save event? (y/N)` and `Save changes? (y/N)` default to cancellation. The schema checks real dates, supported formats and relationships, safe URLs and unique identities before writing.

Images require separate approval. `Save image locally? (y/N)` downloads a raster image, applies orientation, scales it within 1600 × 1000 and writes WebP under `public/events/`. Declining omits it unless you explicitly type `Keep remote URL`. Remote images contact that host from visitors' browsers; use a local image when possible. Existing assets are never overwritten, and removing a record retains its assets. Download failures abort the operation. A newly downloaded asset is removed if the JSON write fails.

Downloads are bounded to 2 MB for HTML and 8 MB for images, with a 15-second overall fetch signal and at most four redirects. Each destination is checked for public addresses, and the connection uses those checked DNS results. Credentials in URLs, private/local network destinations, non-HTTP schemes and executable image formats are rejected. This downloader is a local organizer utility, not a public network proxy.

Writes use a short-lived lock, compare against the version you reviewed and replace JSON atomically. If another edit changes the file, the CLI refuses to overwrite it. After a forced process termination, inspect for an abandoned `src/data/events.json.lock` and remove only that lock once no organizer process is running. Manual JSON edits are supported but must pass `event:validate`.

The shipped event list is empty. Automated tests use isolated temporary files; a real repository add/list/remove round trip was also verified and its fixture removed. The site computes upcoming from the start date against today's Asia/Kolkata date, exactly as specified in the brief.
