// Config for PWA (Progressive Web App)
const path = require('path')

const modifyBuilder = require('razzle-plugin-pwa').default

const pwaConfig = {
  swDest: 'sw.js',
}

// Add a manifest for the progressive web app
const manifestConfig = {
  filename: 'manifest.json',
  name: 'Vibemap',
  short_name: 'Vibemap',
  description: 'Find your vibe',
  orientation: 'portrait',
  display: 'fullscreen',
  start_url: '.',
  theme_color: '#ffffff',
  background_color: '#ffffff',
  related_applications: [],
}

const modify = modifyBuilder({ pwaConfig, manifestConfig })

module.exports = {
  plugins: [
    'bundle-analyzer',
    'compression',
    'scss', 
    'compression', 
    // TODO: Add back css purge but without breaking teh styles.
    //{ func: modify }
  ]
}
