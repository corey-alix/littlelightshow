interface ServiceWorkerGlobalScope {
  addEventListener(
    name: string,
    callback: (event: any) => void
  ): void;
}

interface FetchEvent {
  waitUntil(
    cb: () => Promise<any>
  ): void;
  respondWith(
    arg0: Response | Promise<Response>
  ): void;
  request: RequestInfo & {
    url: string;
  };
}

class WorkerActivator {
  constructor(
    private options: {
      version: number;
      cacheName: string;
      databaseName: string;
    }
  ) {
    this.upgradeDatabase();
  }

  private upgradeDatabase() {}
}

class WorkerInstaller {
  constructor(
    private options: {
      version: number;
      cacheName: string;
      databaseName: string;
    }
  ) {}
}

class WorkerFetcher {
  constructor(
    private options: {
      version: number;
      cacheName: string;
      databaseName: string;
      update: boolean;
    },
    event: FetchEvent
  ) {
    if (
      event.request.url.includes(
        "fauna.com"
      )
    ) {
      event.respondWith(
        this.fetchFromServerOnly(event)
      );
    } else {
      event.respondWith(
        this.fetchFromCacheFirst(
          this.options.cacheName,
          event
        )
      );
    }
  }

  /**
   * Yes: Cache only
   * Yes: Cache and update
   * No: cache, update and refresh
   * Yes: embedded fallback
   * No: push and retrieve payload
   * No: Push payload
   * ...
   * Yes: offline status
   * Yes: offline fallback
   * @param cacheName
   * @param event
   */
  private fetchFromCacheFirst(
    cacheName: string,
    event: FetchEvent
  ) {
    const { update } = this.options;
    const request = event.request;
    const { url } = request;
    console.log(url);

    // ignore query strings
    const hasQueryString =
      0 < url.indexOf("?");
    const queryFreeUrl = !hasQueryString
      ? url
      : url.substring(
          0,
          url.indexOf("?")
        );

    return <
      Response | Promise<Response>
    >(async () => {
      const cache = await caches.open(
        cacheName
      );
      let response = await cache.match(
        queryFreeUrl
      );
      if (response) {
        if (update)
          fetch(event.request).then(
            (response) => {
              cache.put(
                event.request,
                response
              );
            }
          );
      } else {
        response = await fetch(request);
        cache.put(
          queryFreeUrl,
          response.clone()
        );
      }
      return response;
    })();
  }

  private fetchFromServerOnly(
    event: FetchEvent
  ) {
    const request = event.request;
    return fetch(request);
  }
}

class OfflineWorker {
  constructor(private options: {}) {}

  async runEvent(event: any) {
    switch (event.tag) {
      case "offline":
        console.log(
          "offline event running"
        );
    }
    throw `unknown event name: ${event.tag}`;
  }
}

class AppServiceWorker {
  constructor(
    private options: {
      version: number;
      cacheName: string;
      databaseName: string;
      update: boolean;
    }
  ) {
    const worker =
      self as any as ServiceWorkerGlobalScope;

    worker.addEventListener(
      "activate",
      () => {
        new WorkerActivator(
          this.options
        );
      }
    );

    worker.addEventListener(
      "install",
      (event: FetchEvent) => {
        new WorkerInstaller(
          this.options
        );
        event.waitUntil(async () => {
          const cache =
            await caches.open(
              this.options.cacheName
            );
          await cache.addAll([
            "/app/index.html",
          ]);
        });
      }
    );

    worker.addEventListener(
      "fetch",
      (event: FetchEvent) => {
        new WorkerFetcher(
          this.options,
          event
        );
      }
    );

    const offlineWorker =
      new OfflineWorker({});

    worker.addEventListener(
      "sync",
      (event: any) => {
        console.log(
          "sync event handled"
        );
        offlineWorker.runEvent(event);
      }
    );
  }
}

function run() {
  new AppServiceWorker({
    version: 1,
    cacheName: "cache",
    databaseName: "meta",
    update: true,
  });
}

run();
