# littlelightshow

littlelightshow

## Change Log

- 2021-12-22: create storage API (persist local, sync remotely)

# todo

## Offline Support

- Works when the network is unavailable (Network tab is "offline")
- Robust data sync to pull in changes made by others
- Always push changes unless "work_offline" is true

Utilize an image optimizer service

Unable to use ESM syntax in netlify functions,
see https://answers.netlify.com/t/lambda-function-es-module-support/30673/12
for thoughts on modifyint netlify.toml to use esbuild

Ideally everything would be typescript
I'd have a unit-test suite and linter
netlify would transpile typescript and deploy app

## Links

https://lightshow.netlify.app
