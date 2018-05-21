module.exports = {
  copyImages: {
    src: ['{{ROOT}}/node_modules/leaflet/dist/images/**/*', '{{ROOT}}/node_modules/drmonty-leaflet-awesome-markers/css/images/**/*'],
    dest: '{{WWW}}/build/images',
  },
  copyFontAwesome: {
    src: ['{{ROOT}}/node_modules/font-awesome/fonts/**/*'],
    dest: '{{WWW}}/assets/fonts',
  },
};
