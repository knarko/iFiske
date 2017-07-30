if (ionic.Platform.isWebView()) {
  Raven
    .config('https://d5046a5f211a4bf1bb17e5c758c0c152@sentry.io/197411')
    .addPlugin(Raven.Plugins.Angular)
    .install();
  window.onunhandledrejection = function(evt) {
    Raven.captureException(evt.reason);
  };
}
