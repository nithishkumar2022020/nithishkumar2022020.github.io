# Synqra portfolio demo

Built from https://github.com/nithishkumar2022020/Synqra at commit 593e8f4cc950373e446300e0fdb72434aad538c1.

The original Flutter screens are reused without redesign. `demo_main.dart` replaces startup only: no Firebase, in-memory forced-demo settings, existing mock corpus and telemetry, and a streaming wrapper that always selects the existing offline simulation. No real uploads or AI calls. Sample answer is fixed, as in the source app.

To rebuild in a checkout of that source revision:

1. Copy `demo_main.dart` to `lib/demo_main.dart` and `portfolio_demo_test.dart` to `test/portfolio_demo_test.dart`.
2. Copy `fonts/` to `assets/fonts/` and apply `offline-fonts.patch` with `git apply`. These are locally bundled versions of the app’s Fraunces, Newsreader and JetBrains Mono fonts, plus Noto Sans Symbols 2 for Android-style symbol fallback, with OFL licenses. The patch also adds an 8px gap between Matrix card labels and Inspect buttons.
3. Run `flutter pub get` and `flutter test test/portfolio_demo_test.dart`.
4. Run `flutter build web --release --target lib/demo_main.dart --base-href /synqra-preview/ --no-web-resources-cdn`.
5. Replace this portfolio's `synqra-preview/` with `build/web/` (omit symbol files). Retain the demo CSP meta tag in the generated index to restrict connections to same-origin static assets. Use `_flutter.loader.load()` without `serviceWorkerSettings` in `flutter_bootstrap.js`; copy `demo-cache-reset.js` into the output and load it from `index.html` instead of loading the bootstrap directly. It unregisters only this demo’s previous service worker so old PWA assets do not survive updates.

`/synqra-demo.html` supplies the responsive phone frame and reset control. All app/runtime assets are served locally. The source project's regular mobile startup remains unchanged.

The demo loader reports `synqra-demo-ready` to its same-origin parent after Flutter’s `flutter-first-frame` event. The wrapper waits for this signal before fading from its loading screen to the app; retain this handshake when rebuilding. The shared demo navigation assets add the portfolio exit and demo entrance animations, with reduced-motion support.
