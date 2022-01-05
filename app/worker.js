// app/worker.ts
var WorkerActivator = class {
  constructor(options) {
    this.options = options;
    this.upgradeDatabase();
  }
  upgradeDatabase() {
  }
};
var WorkerInstaller = class {
  constructor(options) {
    this.options = options;
  }
};
var WorkerFetcher = class {
  constructor(options, event) {
    this.options = options;
    if (event.request.url.includes("fauna.com")) {
      event.respondWith(this.fetchFromServerOnly(event));
    } else {
      event.respondWith(this.fetchFromCacheFirst(this.options.cacheName, event));
    }
  }
  fetchFromCacheFirst(cacheName, event) {
    const { update } = this.options;
    const request = event.request;
    const { url } = request;
    console.log(url);
    const hasQueryString = 0 < url.indexOf("?");
    const queryFreeUrl = !hasQueryString ? url : url.substring(0, url.indexOf("?"));
    return (async () => {
      const cache = await caches.open(cacheName);
      let response = await cache.match(queryFreeUrl);
      if (response) {
        if (update)
          fetch(event.request).then((response2) => {
            cache.put(queryFreeUrl, response2);
          });
      } else {
        response = await fetch(request);
        cache.put(queryFreeUrl, response.clone());
      }
      return response;
    })();
  }
  fetchFromServerOnly(event) {
    const request = event.request;
    return fetch(request);
  }
};
var OfflineWorker = class {
  constructor(options) {
    this.options = options;
  }
  async runEvent(event) {
    switch (event.tag) {
      case "offline":
        console.log("offline event running");
    }
    throw `unknown event name: ${event.tag}`;
  }
};
var AppServiceWorker = class {
  constructor(options) {
    this.options = options;
    const worker = self;
    worker.addEventListener("activate", () => {
      new WorkerActivator(this.options);
    });
    worker.addEventListener("install", (event) => {
      new WorkerInstaller(this.options);
      event.waitUntil(async () => {
        const cache = await caches.open(this.options.cacheName);
        await cache.addAll([
          "/app/index.html"
        ]);
      });
    });
    worker.addEventListener("fetch", (event) => {
      new WorkerFetcher(this.options, event);
    });
    const offlineWorker = new OfflineWorker({});
    worker.addEventListener("sync", (event) => {
      console.log("sync event handled");
      offlineWorker.runEvent(event);
    });
  }
};
function run() {
  new AppServiceWorker({
    version: 1,
    cacheName: "cache",
    databaseName: "meta",
    update: true
  });
}
run();
//# sourceMappingURL=worker.js.map
