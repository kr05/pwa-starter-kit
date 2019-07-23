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
const workboxBuild = require('workbox-build');

gulp.task('prpl-server:copy-files', () => {
  return gulp.src([
    'images/**',
    'manifest.json',
    'push-manifest.json',
    'node_modules/regenerator-runtime/runtime.js',
    'node_modules/systemjs/dist/s.min.js',
    'node_modules/@webcomponents/webcomponentsjs/**'
  ], {base: '.'})
  .pipe(gulp.dest('build'));
});

gulp.task('prpl-server:replace-env', () => {
  return gulp.src(['index.html'])
    .pipe(replace('NODE_ENVIRONMENT', 'production'))
    .pipe(gulp.dest('build'));
});

/**
 * Cleans the prpl-server build in the server directory.
 */
gulp.task('prpl-server:clean', () => {
  return del('server/build');
});

gulp.task('prpl-server:service-worker', () => {
  const swSrc = 'service-worker.js';
  const swDest = 'build/service-worker.js';

  return workboxBuild.injectManifest({
    swSrc,
    swDest,
    // Other configuration options...
    globDirectory: 'build',
    globPatterns: [
      '**/*.{html,js,css,ico,png,json}',
    ]
  }).then(({count, size}) => {
    console.log(`Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`);
  });
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

gulp.task('prpl-server', gulp.series(
  'prpl-server:copy-files',
  'prpl-server:replace-env',
  'prpl-server:clean',
  'prpl-server:service-worker',
  'prpl-server:build'
));