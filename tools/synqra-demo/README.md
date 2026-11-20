# Synqra portfolio demo

Built from https://github.com/nithishkumar2022020/Synqra at commit 593e8f4cc950373e446300e0fdb72434aad538c1.

The original Flutter screens are reused without redesign. `demo_main.dart` replaces startup only: no Firebase, in-memory forced-demo settings, existing mock corpus and telemetry, and a streaming wrapper that always selects the existing offline simulation. No real uploads or AI calls. Sample answer is fixed, as in the source app.

To rebuild in a checkout of that source revision:

1. Copy `demo_main.dart` to `lib/demo_main.dart` and `portfolio_demo_test.dart` to `test/portfolio_demo_test.dart`.
2. Copy `fonts/` to `assets/fonts/` and apply `offline-fonts.patch` with `git apply`. These are locally bundled versions of the app’s Fraunces, Newsreader and JetBrains Mono fonts, with OFL licenses.
3. Run `flutter pub get` and `flutter test test/portfolio_demo_test.dart`.
4. Run `flutter build web --release --target lib/demo_main.dart --base-href /synqra-app/ --no-web-resources-cdn`.
5. Replace this portfolio's `synqra-app/` with `build/web/` (omit symbol files). Retain the demo CSP meta tag in the generated index to restrict connections to same-origin static assets.

`/synqra-demo.html` supplies the responsive phone frame and reset control. All app/runtime assets are served locally. The source project's regular mobile startup remains unchanged.
