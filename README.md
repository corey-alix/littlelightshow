# littlelightshow

littlelightshow

## Change Log

- 2021-12-22: use storage API for sale items and account codes (always offline)
- 2021-12-22: error reporting via toaster
- 2021-12-22: create storage API (persist local, sync remotely)

## Offline Support

- TODO: load GL entries sorted by date desc to see latest activities
  Can now query for changes _since_ a certain time and that time will be when the user last synchronized. The sync process:

  - `next_updatestamp` timestamp is set for future sync
  - server changes since `updatestamp` -> local
  - merge conflicts are reported
  - local changes -> server
  - deleted records must be _marked_ deleted but preserved until all clients sync

- TODO: Works when the network is unavailable (Network tab is "offline")
- TODO: Build artifacts on Netlify (compressed with .js.map file)

## Portfolio

- TODO: Utilize an image optimizer service

Unable to use ESM syntax in netlify functions,
see https://answers.netlify.com/t/lambda-function-es-module-support/30673/12
for thoughts on modifyint netlify.toml to use esbuild

Ideally everything would be typescript
I'd have a unit-test suite and linter
netlify would transpile typescript and deploy app

## Links

https://lightshow.netlify.app
https://littlelightshow.com
