# littlelightshow

littlelightshow

[![Netlify Status](https://api.netlify.com/api/v1/badges/07115bde-5926-46c8-a1b4-7275dba80ae9/deploy-status)](https://app.netlify.com/sites/lightshow/deploys)

## Change Log

- 2022-01-04: added Service Worker to cache web resources (html, js, css)
- 2022-01-03: v1.0.5 branch deploys with textier
- 2022-01-02: Introduce v1.0.5 branch
- 2022-01-01: Introduce v1.0.4 branch
- 2021-12-26: Show balance due on invoices
- 2021-12-26: hyperlink GL entries
- 2021-12-25: create "desktop" layout for GL and AR (invoice)
- 2021-12-22: use storage API for sale items and account codes (always offline)
- 2021-12-22: error reporting via toaster
- 2021-12-22: create storage API (persist local, sync remotely)

## v1.0.5

- Add TODO support
- Add PWA offline support

## v1.0.4

- Add inventory module

## v1.0.3

- Show dates on GL account report

## v1.0.2

- adds GL hyperlinks to drill into ledgers
- adds offline to reduce data usage

## TODOs

- Profit/Loss vs Asset/Liability -- how to organize accounts?
- Invoice summary report should show dates if space permits
  The issue will be that date should be optional yet not in the last column
- Use PWA tech for offline detection

## Offline Support

The admin panel has an offline mode that will not communicate with the database
but still requires internet connectivity

### Offline storage and data sync

This sync algorithm captures local changes before pulling remote changes
but pushes local changes after merging remote changes.
Local changes will have an `update_date` beyond the `sync_time`, which means
the subsequent sync process will pull them from the server.
Any server-side processing will not be evident until the second sync process.
This is wasteful if there is no server-side processing but there seems to be no better solution.

- capture last sync time from `sync_time` into `lower_bound`
- capture current server time into `sync_time` and into `upper_bound`
- capture local changes between [`lower_bound`, `upper_bound`) into `outbound`
- capture server changes between [`lower_bound`, `upper_bound`) into `inbound`
- `inbound` deleted records are removed from cache, otherwise cache is updated
- advance the `lower_bound` and capture into `sync_time`
- resolve merge conflicts (TODO)
- push `outbound` to server, `update_date` will be after `sync_time`
- TODO: Works when the network is unavailable (Network tab is "offline")

### Build Process

- TODO: Build artifacts on Netlify (compressed with .js.map file)
- Unable to use ESM syntax in netlify functions,
  see https://answers.netlify.com/t/lambda-function-es-module-support/30673/12
  for thoughts on modifyint netlify.toml to use esbuild
- unit-test suite and linter
- netlify to run build and deploy scripts

## Portfolio

- TODO: Utilize an image optimizer service (Cloudinary)

## Links

- [Next Light Show](https://v1-0-5--lightshow.netlify.app/)
- [Live Site](https://lightshow.netlify.app)
- [Shopify Site](https://littlelightshow.com)
