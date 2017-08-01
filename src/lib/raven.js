Raven
  .config('https://ee3e07b53128430a9d9375c36b5da9aa@sentry.io/198506', {
    dataCallback: function(data) {
      function normalize(filename) {
        return filename.split('/www/', 2)[1];
      }

      if (data && data.stacktrace && Array.isArray(data.stacktrace.frames)) {
        data.stacktrace.frames.forEach(function(frame) {
          frame.filename = normalize(frame.filename);
        });
        data.culprit = data.stacktrace.frames[0].filename;
      } else if (data && data.exception) {
        data.exception.values[0].stacktrace.frames.forEach(function(frame) {
          frame.filename = normalize(frame.filename);
        });

        data.culprit = data.exception.values[0].stacktrace.frames[0].filename;
      }

      return data;
    },
    release: '__REPLACE_WITH_APP_VERSION__',
  })
  .addPlugin(Raven.Plugins.Angular)
  .install();
window.onunhandledrejection = function(evt) {
  Raven.captureException(evt.reason);
};
