/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const del = require('del');
const manifest = require('gulp-http2-push-manifest');
const workboxBuild = require('workbox-build');

/**
 * Cleans the prpl-server build in the server directory.
 */
gulp.task('prpl-server:clean', () => {
  return del('server/build');
});

/**
 * Copies the prpl-server build to the server directory while renaming the
 * node_modules directory so services like App Engine will upload it.
 */
gulp.task('prpl-server:build', () => {
  const pattern = 'node_modules';
  const replacement = 'node_assets';

  return gulp.src('build/**')
    .pipe(rename(((path) => {
      path.basename = path.basename.replace(pattern, replacement);
      path.dirname = path.dirname.replace(pattern, replacement);
    })))
    .pipe(replace(pattern, replacement))
    .pipe(gulp.dest('server/build'));
});

/**
 * Creates push-manifest.
 */
gulp.task('prpl-server:push-manifest', () => {
  return gulp.src("server/build/index.html")
  .pipe(manifest());
});

/**
 * Copies assets not handled by rollup into the public/ directory.
 */
// gulp.task('prpl-server:rollup', () => {
//   return gulp.src([
//     'push-manifest.json',
//     'node_modules/regenerator-runtime/runtime.js',
//     'node_modules/systemjs/dist/s.min.js',
//     'node_modules/@webcomponents/webcomponentsjs/**'
//   ], {base: '.'})
//   .pipe(gulp.dest('build/esm-bundled'))
//   .pipe(gulp.dest('build/es5-bundled'));
// });

gulp.task('prpl-server:common-files', () => {
  return gulp.src([
    'index.html',
    'images/**',
    'manifest.json',
    'push-manifest.json',
    'node_modules/regenerator-runtime/runtime.js',
    'node_modules/systemjs/dist/s.min.js',
    'node_modules/@webcomponents/webcomponentsjs/**'
  ], {base: '.'})
  .pipe(gulp.dest('build'));
});

// gulp.task('service-worker', () => {
//   return workboxBuild.generateSW({
//     globDirectory: 'build',
//     globPatterns: [
//       '**/*.{html,js,css}',
//     ],
//     swDest: 'build/service-worker.js',
//   }).then(() => {
//     console.log(`Generated new service worker.`);
//   }).catch((err) => {
//     console.error(`Unable to generate a new service worker.`, err);
//   });
// });

gulp.task('service-worker', () => {
  const swSrc = './service-worker.js';
  const swDest = 'build/service-worker.js';

  return workboxBuild.injectManifest({
    swSrc,
    swDest,
    // Other configuration options...
    globDirectory: 'build',
    globPatterns: [
      '**/*.{html,js,css}',
    ]
  }).then(({count, size}) => {
    console.log(`Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`);
  });
});

gulp.task('prpl-server', gulp.series(
  'prpl-server:common-files',
  'prpl-server:clean',
  'service-worker',
  'prpl-server:build'
));