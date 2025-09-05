if (!self.define) {
  let e,
    s = {};
  const c = (c, a) => (
    (c = new URL(c + ".js", a).href),
    s[c] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = c), (e.onload = s), document.head.appendChild(e));
        } else ((e = c), importScripts(c), s());
      }).then(() => {
        let e = s[c];
        if (!e) throw new Error(`Module ${c} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, t) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let n = {};
    const r = (e) => c(e, i),
      b = { module: { uri: i }, exports: n, require: r };
    s[i] = Promise.all(a.map((e) => b[e] || r(e))).then((e) => (t(...e), n));
  };
}
define(["./workbox-14aa2a4a"], function (e) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "86a7ab277852110f3543c705a9b18f54",
        },
        {
          url: "/_next/static/Q0ImnqqaTUBDHUT_lKLa-/_buildManifest.js",
          revision: "2e3a4ee8441f58acf32922e896087ebd",
        },
        {
          url: "/_next/static/Q0ImnqqaTUBDHUT_lKLa-/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/103.95b6112ca34c0ef6.js",
          revision: "95b6112ca34c0ef6",
        },
        {
          url: "/_next/static/chunks/10660a55-d1d12433de66b511.js",
          revision: "d1d12433de66b511",
        },
        {
          url: "/_next/static/chunks/1146.b101aba187510bab.js",
          revision: "b101aba187510bab",
        },
        {
          url: "/_next/static/chunks/1255-ec7308b4b33b0303.js",
          revision: "ec7308b4b33b0303",
        },
        {
          url: "/_next/static/chunks/1332.3c4b2a3f537a77e6.js",
          revision: "3c4b2a3f537a77e6",
        },
        {
          url: "/_next/static/chunks/1386.2f30e2ed26f180e6.js",
          revision: "2f30e2ed26f180e6",
        },
        {
          url: "/_next/static/chunks/1413.f8262e69b4b284ad.js",
          revision: "f8262e69b4b284ad",
        },
        {
          url: "/_next/static/chunks/1460.15de3504f0f33f24.js",
          revision: "15de3504f0f33f24",
        },
        {
          url: "/_next/static/chunks/1529.32b6431ec0b61d50.js",
          revision: "32b6431ec0b61d50",
        },
        {
          url: "/_next/static/chunks/1631.460e5910a6f04664.js",
          revision: "460e5910a6f04664",
        },
        {
          url: "/_next/static/chunks/1788.02e947b57b019bce.js",
          revision: "02e947b57b019bce",
        },
        {
          url: "/_next/static/chunks/1827.6e9ec0fcfca5058c.js",
          revision: "6e9ec0fcfca5058c",
        },
        {
          url: "/_next/static/chunks/1840.7120552126f0c395.js",
          revision: "7120552126f0c395",
        },
        {
          url: "/_next/static/chunks/1962.c26e882b68726b5e.js",
          revision: "c26e882b68726b5e",
        },
        {
          url: "/_next/static/chunks/1995.21baffd12594646a.js",
          revision: "21baffd12594646a",
        },
        {
          url: "/_next/static/chunks/2157.b8e7088ce1e9fbda.js",
          revision: "b8e7088ce1e9fbda",
        },
        {
          url: "/_next/static/chunks/2183.e6960bea649de5e4.js",
          revision: "e6960bea649de5e4",
        },
        {
          url: "/_next/static/chunks/2394.6582649cf9dc51a0.js",
          revision: "6582649cf9dc51a0",
        },
        {
          url: "/_next/static/chunks/2443.332fe201c5bd345e.js",
          revision: "332fe201c5bd345e",
        },
        {
          url: "/_next/static/chunks/2473.fa0fb43b003dadf7.js",
          revision: "fa0fb43b003dadf7",
        },
        {
          url: "/_next/static/chunks/2508.e5fc6a089aec8f76.js",
          revision: "e5fc6a089aec8f76",
        },
        {
          url: "/_next/static/chunks/261.4356a129c3118aac.js",
          revision: "4356a129c3118aac",
        },
        {
          url: "/_next/static/chunks/2627.ca723742050b5d46.js",
          revision: "ca723742050b5d46",
        },
        {
          url: "/_next/static/chunks/2694.01eb1c31d034745b.js",
          revision: "01eb1c31d034745b",
        },
        {
          url: "/_next/static/chunks/2788.2c1730896c949f56.js",
          revision: "2c1730896c949f56",
        },
        {
          url: "/_next/static/chunks/2899.31d10b7095cc6a4b.js",
          revision: "31d10b7095cc6a4b",
        },
        {
          url: "/_next/static/chunks/3020.2702b3597f39d14b.js",
          revision: "2702b3597f39d14b",
        },
        {
          url: "/_next/static/chunks/3321.ad0f3ae63d81637a.js",
          revision: "ad0f3ae63d81637a",
        },
        {
          url: "/_next/static/chunks/3324.152970364660e0c4.js",
          revision: "152970364660e0c4",
        },
        {
          url: "/_next/static/chunks/3341-c2afed224093bfb7.js",
          revision: "c2afed224093bfb7",
        },
        {
          url: "/_next/static/chunks/3397.efb42397430c6444.js",
          revision: "efb42397430c6444",
        },
        {
          url: "/_next/static/chunks/3413.d53d4c8eaea7bd8a.js",
          revision: "d53d4c8eaea7bd8a",
        },
        {
          url: "/_next/static/chunks/372.b1cf7c3281c1dfd5.js",
          revision: "b1cf7c3281c1dfd5",
        },
        {
          url: "/_next/static/chunks/3777.b61953510d6979db.js",
          revision: "b61953510d6979db",
        },
        {
          url: "/_next/static/chunks/3784.0f94cd8ca81ef0dd.js",
          revision: "0f94cd8ca81ef0dd",
        },
        {
          url: "/_next/static/chunks/3909.39563da87ccc9dab.js",
          revision: "39563da87ccc9dab",
        },
        {
          url: "/_next/static/chunks/3a91511d-72a74ea1553c2dd6.js",
          revision: "72a74ea1553c2dd6",
        },
        {
          url: "/_next/static/chunks/4078.2ff22c4126d025c6.js",
          revision: "2ff22c4126d025c6",
        },
        {
          url: "/_next/static/chunks/411.b64550ef9c7bb653.js",
          revision: "b64550ef9c7bb653",
        },
        {
          url: "/_next/static/chunks/4257.b8614cb8ecaab9c9.js",
          revision: "b8614cb8ecaab9c9",
        },
        {
          url: "/_next/static/chunks/430.4ba36190e8174911.js",
          revision: "4ba36190e8174911",
        },
        {
          url: "/_next/static/chunks/4385.4b03011fe5772412.js",
          revision: "4b03011fe5772412",
        },
        {
          url: "/_next/static/chunks/4510.0f316cc374445142.js",
          revision: "0f316cc374445142",
        },
        {
          url: "/_next/static/chunks/4757.bf098a11e81b6d4a.js",
          revision: "bf098a11e81b6d4a",
        },
        {
          url: "/_next/static/chunks/4778.be732145be14e594.js",
          revision: "be732145be14e594",
        },
        {
          url: "/_next/static/chunks/4803.60c568259a00cdc4.js",
          revision: "60c568259a00cdc4",
        },
        {
          url: "/_next/static/chunks/4bd1b696-182b6b13bdad92e3.js",
          revision: "182b6b13bdad92e3",
        },
        {
          url: "/_next/static/chunks/5088.a11caf4b8d7100b2.js",
          revision: "a11caf4b8d7100b2",
        },
        {
          url: "/_next/static/chunks/5093.a7581ed1023d3613.js",
          revision: "a7581ed1023d3613",
        },
        {
          url: "/_next/static/chunks/5171.3c1bc8abff383d81.js",
          revision: "3c1bc8abff383d81",
        },
        {
          url: "/_next/static/chunks/5327.8eace5637bea7a3f.js",
          revision: "8eace5637bea7a3f",
        },
        {
          url: "/_next/static/chunks/5378.be107e3d44d05fc9.js",
          revision: "be107e3d44d05fc9",
        },
        {
          url: "/_next/static/chunks/5520.e503ab85bfa77c1e.js",
          revision: "e503ab85bfa77c1e",
        },
        {
          url: "/_next/static/chunks/5643.b0b6d52f54cbcaf6.js",
          revision: "b0b6d52f54cbcaf6",
        },
        {
          url: "/_next/static/chunks/5668.787695560ea3d14e.js",
          revision: "787695560ea3d14e",
        },
        {
          url: "/_next/static/chunks/573.0e749c0c6d4c1d55.js",
          revision: "0e749c0c6d4c1d55",
        },
        {
          url: "/_next/static/chunks/5779.d77ea5fa7d676f7f.js",
          revision: "d77ea5fa7d676f7f",
        },
        {
          url: "/_next/static/chunks/5796.19bbe03ca73dbd1d.js",
          revision: "19bbe03ca73dbd1d",
        },
        {
          url: "/_next/static/chunks/5950-3462cfbe972638f0.js",
          revision: "3462cfbe972638f0",
        },
        {
          url: "/_next/static/chunks/612.45bb73c60e63173b.js",
          revision: "45bb73c60e63173b",
        },
        {
          url: "/_next/static/chunks/6253.07084e57cf1af72b.js",
          revision: "07084e57cf1af72b",
        },
        {
          url: "/_next/static/chunks/63.462b8c3e7c5f91a7.js",
          revision: "462b8c3e7c5f91a7",
        },
        {
          url: "/_next/static/chunks/634.71f01b5ff0783b78.js",
          revision: "71f01b5ff0783b78",
        },
        {
          url: "/_next/static/chunks/6514.bd8bc9d5e5a06f04.js",
          revision: "bd8bc9d5e5a06f04",
        },
        {
          url: "/_next/static/chunks/6528.b84c367d16f129d6.js",
          revision: "b84c367d16f129d6",
        },
        {
          url: "/_next/static/chunks/6576.355ef690e18030f3.js",
          revision: "355ef690e18030f3",
        },
        {
          url: "/_next/static/chunks/6594.54ab535d0733b609.js",
          revision: "54ab535d0733b609",
        },
        {
          url: "/_next/static/chunks/6753.48fcd673dc3f676a.js",
          revision: "48fcd673dc3f676a",
        },
        {
          url: "/_next/static/chunks/6782.6518450dc9afe740.js",
          revision: "6518450dc9afe740",
        },
        {
          url: "/_next/static/chunks/683.bea7b4d3d276675b.js",
          revision: "bea7b4d3d276675b",
        },
        {
          url: "/_next/static/chunks/6964.352df3c575726c4d.js",
          revision: "352df3c575726c4d",
        },
        {
          url: "/_next/static/chunks/7090.9abde5a0c8bf91e6.js",
          revision: "9abde5a0c8bf91e6",
        },
        {
          url: "/_next/static/chunks/7149.d0310a60161e9122.js",
          revision: "d0310a60161e9122",
        },
        {
          url: "/_next/static/chunks/7175.fffbf9f3a5bbeb0a.js",
          revision: "fffbf9f3a5bbeb0a",
        },
        {
          url: "/_next/static/chunks/740.1eae2ff7a9bebfb0.js",
          revision: "1eae2ff7a9bebfb0",
        },
        {
          url: "/_next/static/chunks/7730.7f231ab792eb27b7.js",
          revision: "7f231ab792eb27b7",
        },
        {
          url: "/_next/static/chunks/7905.654cfc2c213fb1d8.js",
          revision: "654cfc2c213fb1d8",
        },
        {
          url: "/_next/static/chunks/8147.b6ff8d19227f0ede.js",
          revision: "b6ff8d19227f0ede",
        },
        {
          url: "/_next/static/chunks/8153.362937717ea05c64.js",
          revision: "362937717ea05c64",
        },
        {
          url: "/_next/static/chunks/8167.cd3d13e11cd84416.js",
          revision: "cd3d13e11cd84416",
        },
        {
          url: "/_next/static/chunks/8245.4aeaca47d24bba28.js",
          revision: "4aeaca47d24bba28",
        },
        {
          url: "/_next/static/chunks/8474.51af8f33093788bb.js",
          revision: "51af8f33093788bb",
        },
        {
          url: "/_next/static/chunks/8558.b65830e66739a022.js",
          revision: "b65830e66739a022",
        },
        {
          url: "/_next/static/chunks/8606.8ea74ab2d538f478.js",
          revision: "8ea74ab2d538f478",
        },
        {
          url: "/_next/static/chunks/8659-b28b9a2c74f8bedd.js",
          revision: "b28b9a2c74f8bedd",
        },
        {
          url: "/_next/static/chunks/872.0306da06d217cf2d.js",
          revision: "0306da06d217cf2d",
        },
        {
          url: "/_next/static/chunks/8817.e661844de9876a3f.js",
          revision: "e661844de9876a3f",
        },
        {
          url: "/_next/static/chunks/8cc6faea-06177138421f2356.js",
          revision: "06177138421f2356",
        },
        {
          url: "/_next/static/chunks/905.b0f2b9362cea9096.js",
          revision: "b0f2b9362cea9096",
        },
        {
          url: "/_next/static/chunks/9354.2181432b97c26e6a.js",
          revision: "2181432b97c26e6a",
        },
        {
          url: "/_next/static/chunks/9355.2296f499acc125e9.js",
          revision: "2296f499acc125e9",
        },
        {
          url: "/_next/static/chunks/9403.6f586c670e2689f1.js",
          revision: "6f586c670e2689f1",
        },
        {
          url: "/_next/static/chunks/9499.ee4e78aaebdd6242.js",
          revision: "ee4e78aaebdd6242",
        },
        {
          url: "/_next/static/chunks/9556.b359dcfce548d244.js",
          revision: "b359dcfce548d244",
        },
        {
          url: "/_next/static/chunks/9624.e6807031123e017d.js",
          revision: "e6807031123e017d",
        },
        {
          url: "/_next/static/chunks/9663-b30ad94646640294.js",
          revision: "b30ad94646640294",
        },
        {
          url: "/_next/static/chunks/9723.f38524d24d8d4d24.js",
          revision: "f38524d24d8d4d24",
        },
        {
          url: "/_next/static/chunks/9778.772e4be0b1040517.js",
          revision: "772e4be0b1040517",
        },
        {
          url: "/_next/static/chunks/aea36d77.851c7f03d14ecc36.js",
          revision: "851c7f03d14ecc36",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-325c783ca7788cc1.js",
          revision: "325c783ca7788cc1",
        },
        {
          url: "/_next/static/chunks/app/api/ai/generate-script/route-30d464ab4815a586.js",
          revision: "30d464ab4815a586",
        },
        {
          url: "/_next/static/chunks/app/api/auth/user/route-30d464ab4815a586.js",
          revision: "30d464ab4815a586",
        },
        {
          url: "/_next/static/chunks/app/api/contacts/route-30d464ab4815a586.js",
          revision: "30d464ab4815a586",
        },
        {
          url: "/_next/static/chunks/app/api/guides/route-30d464ab4815a586.js",
          revision: "30d464ab4815a586",
        },
        {
          url: "/_next/static/chunks/app/api/incidents/route-30d464ab4815a586.js",
          revision: "30d464ab4815a586",
        },
        {
          url: "/_next/static/chunks/app/api/payments/create-intent/route-30d464ab4815a586.js",
          revision: "30d464ab4815a586",
        },
        {
          url: "/_next/static/chunks/app/api/webhooks/stripe/route-30d464ab4815a586.js",
          revision: "30d464ab4815a586",
        },
        {
          url: "/_next/static/chunks/app/error-90df4f99e5fdb264.js",
          revision: "90df4f99e5fdb264",
        },
        {
          url: "/_next/static/chunks/app/layout-0c566840a1e60f5a.js",
          revision: "0c566840a1e60f5a",
        },
        {
          url: "/_next/static/chunks/app/loading-30d464ab4815a586.js",
          revision: "30d464ab4815a586",
        },
        {
          url: "/_next/static/chunks/app/page-2b691672d6897f56.js",
          revision: "2b691672d6897f56",
        },
        {
          url: "/_next/static/chunks/c16f53c3-409df1246fc2628c.js",
          revision: "409df1246fc2628c",
        },
        {
          url: "/_next/static/chunks/d648eb28-05c9445a2e0b2734.js",
          revision: "05c9445a2e0b2734",
        },
        {
          url: "/_next/static/chunks/framework-b9fd9bcc3ecde907.js",
          revision: "b9fd9bcc3ecde907",
        },
        {
          url: "/_next/static/chunks/main-app-caaa77f4592270bd.js",
          revision: "caaa77f4592270bd",
        },
        {
          url: "/_next/static/chunks/main-f939593fb8e9a6df.js",
          revision: "f939593fb8e9a6df",
        },
        {
          url: "/_next/static/chunks/pages/_app-4b3fb5e477a0267f.js",
          revision: "4b3fb5e477a0267f",
        },
        {
          url: "/_next/static/chunks/pages/_error-c970d8b55ace1b48.js",
          revision: "c970d8b55ace1b48",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-e98ab23d1dbcbb9f.js",
          revision: "e98ab23d1dbcbb9f",
        },
        {
          url: "/_next/static/css/3d34d39b7036da8c.css",
          revision: "3d34d39b7036da8c",
        },
        {
          url: "/_next/static/media/26a46d62cd723877-s.woff2",
          revision: "befd9c0fdfa3d8a645d5f95717ed6420",
        },
        {
          url: "/_next/static/media/55c55f0601d81cf3-s.woff2",
          revision: "43828e14271c77b87e3ed582dbff9f74",
        },
        {
          url: "/_next/static/media/581909926a08bbc8-s.woff2",
          revision: "f0b86e7c24f455280b8df606b89af891",
        },
        {
          url: "/_next/static/media/8e9860b6e62d6359-s.woff2",
          revision: "01ba6c2a184b8cba08b0d57167664d75",
        },
        {
          url: "/_next/static/media/97e0cb1ae144a2a9-s.woff2",
          revision: "e360c61c5bd8d90639fd4503c829c2dc",
        },
        {
          url: "/_next/static/media/df0a9ae256c0569c-s.woff2",
          revision: "d54db44de5ccb18886ece2fda72bdfe0",
        },
        {
          url: "/_next/static/media/e4af272ccee01ff0-s.p.woff2",
          revision: "65850a373e258f1c897a2b3d75eb74de",
        },
        { url: "/manifest.json", revision: "432ceeb040b6a41a11b76567fcee65c5" },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: c,
              state: a,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.googleapis\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.gstatic\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-static",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js|css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-resources",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e }) => "document" === e.destination,
      new e.NetworkFirst({
        cacheName: "documents",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/api\/guides/,
      new e.StaleWhileRevalidate({
        cacheName: "api-guides",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ));
});
