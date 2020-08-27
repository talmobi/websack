[![npm](https://img.shields.io/npm/v/websack.svg?maxAge=3600&style=flat-square)](https://www.npmjs.com/package/websack)
[![npm](https://img.shields.io/npm/l/websack.svg?maxAge=3600&style=flat-square)](https://github.com/talmobi/websack/blob/master/LICENSE)

#  websack
Simple unpkg (or any url) file downloader, organizer and bundler.

## Easy to use
```bash
npm install --save-dev websack
```

#### package.json configuration
```javascript
...
"websack": {
  "vendor/dev": {
    "skipped-example": "https://unpkg.com/react@16.7.0/umd/react.development.js",
    "bundle": "vendor-dev.js", /* files after bundle will be added to bundles in order */
    "react": "https://unpkg.com/react@16.7.0/umd/react.development.js",
    "react-dom": "https://unpkg.com/react-dom@16.7.0/umd/react-dom.development.js"
  },
  "vendor/prod": {
    "bundle": "vendor-prod.min.js",
    "react": "https://unpkg.com/react@16.7.0/umd/react.production.min.js",
    "react-dom": "https://unpkg.com/react-dom@16.7.0/umd/react-dom.production.min.js"
  }
},
...
```

#### CLI usage
```javascript
$ websack download
```
```
downloading: https://unpkg.com/react@16.7.0/umd/react.development.js
 file saved: unpkg/vendor/dev/react.js
downloading: https://unpkg.com/react-dom@16.7.0/umd/react-dom.development.js
 file saved: unpkg/vendor/dev/react-dom.js
downloading: https://unpkg.com/react@16.7.0/umd/react.production.min.js
 file saved: unpkg/vendor/prod/react.min.js
downloading: https://unpkg.com/react-dom@16.7.0/umd/react-dom.production.min.js
 file saved: unpkg/vendor/prod/react-dom.min.js
```
```javascript
$ websack bundle
```
```
skipping: websack/vendor/dev/skipped-example.js
bundle saved: websack/bundles/vendor-dev.js
bundle saved: websack/bundles/vendor-prod.min.js
```

## About
Small tool to download and organize vendor files from places like unpkg.com as
specified in the package.json

## Why
To have all vendor dependencies explicitly defined in the package.json as a
single source of truth and installed (and bundled) in the order that they are
configured.

## For who?
Those wanting a simple installation, organization and tracking of
a few external vendor scripts.

## Similar
[bower](https://github.com/bower/bower)

## Test
```
```

