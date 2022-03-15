const {src, dest, watch, series, parallel} = require('gulp')
const fileinclude = require('gulp-file-include');
const typograf = require('gulp-typograf');
const removeHtmlComments = require('gulp-remove-html-comments');
const stripCssComments = require('gulp-strip-css-comments');
// const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const size = require('gulp-size');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const rename = require("gulp-rename");
const babel = require('gulp-babel')
const webpack = require('webpack-stream')
const webpHTML = require('gulp-webp-html');
const webpCss = require('gulp-webp-css');
const gulpif = require('gulp-if');
//*************************/ is Prod
const isProd = process.argv.includes("--production")
const isDev = !isProd
//*************************/ Пути
const pathApp = './app'
const pathDest = './dist'
const paths = {
    root: pathDest,
    html: {
        app: `${pathApp}/html/*.html`,
        watch: `${pathApp}/html/**/*.html`,
        dest: pathDest,
    },
    css: {
        app: `${pathApp}/css/*.css`,
        watch: `${pathApp}/css/**/*.css`,
        dest: `${pathDest}/css`,
    },
    scss: {
        app: `${pathApp}/sass/*.scss`,
        watch: `${pathApp}/sass/**/*.scss`,
        dest: `${pathDest}/css`,
    },
    js: {
        app: `${pathApp}/js/*.js`,
        watch: `${pathApp}/js/**/*.js`,
        dest: `${pathDest}/js`,
    },
    fonts: {
        app: `${pathApp}/fonts/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}`,
        watch: `${pathApp}/fonts/**/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}`,
        dest: `${pathDest}/fonts`,
    },
    images: {
        app: `${pathApp}/images/**/*.{png,jpg,jpeg,gif,svg}`,
        watch: `${pathApp}/images/**/*.{png,jpg,jpeg,gif,svg}`,
        dest: `${pathDest}/images`,
    },
    svg: {
        app: `${pathApp}/images/svg/*.svg`,
        watch: `${pathApp}/images/svg/**/*.svg`,
        dest: `${pathDest}/images/svg`,
    },
};
//Функции
const html = () => {
    return src(paths.html.app)
    .pipe(plumber({
        errorHandler: notify.onError(error => ({
            title: "HTML",
            message: error.message
        }))
    }))
    .pipe(fileinclude())
    .pipe(webpHTML())
    // .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size())
    .pipe(typograf({
        locale: ['ru', 'en-US']
      }))
    .pipe(removeHtmlComments())
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream())
}
const scss = () => {
    return src(paths.scss.app, {sourcemaps: isProd ? false : isDev})
    .pipe(plumber({
        errorHandler: notify.onError(error => ({
            title: "SCSS",
            message: error.message
        }))
    }))
    .pipe(sass())
    .pipe(concat('main.css'))
    .pipe(autoprefixer())
    .pipe(stripCssComments())
    .pipe(dest(paths.css.dest, {sourcemaps: isProd ? false : isDev}))
    .pipe(rename({suffix: '.min'}))
    .pipe(csso({
        restructure: false,
        debug: true
    }))
    .pipe(webpCss())
    .pipe(stripCssComments())
    .pipe(dest(paths.css.dest, {sourcemaps: isProd ? false : isDev}))
    .pipe(browserSync.stream())
}
const js = () => {
    return src(paths.js.app)
    .pipe(plumber({
        errorHandler: notify.onError(error => ({
            title: "Javascript",
            message: error.message
        }))
    }))
    .pipe(babel())
    .pipe(webpack({
        mode: isProd ? 'production' : 'development',
        devtool: 'source-map'
    }))
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream())
}
const img = () => {
    return src(paths.images.app)
    .pipe(plumber({
        errorHandler: notify.onError(error => ({
            title: "Images",
            message: error.message
        }))
    }))
    .pipe(newer(paths.images.dest))
    .pipe(webp())
    .pipe(dest(paths.images.dest))
    .pipe(src(paths.images.app))
    .pipe(newer(paths.images.dest))
    .pipe(gulpif(isProd, imagemin({
        verbose: true
    })))
    .pipe(dest(paths.images.dest))
    .pipe(browserSync.stream())
}
const svgSprites = () => {
    return src(paths.svg.app)
      .pipe(
        svgmin({
          js2svg: {
            pretty: true,
          },
        })
      )
      .pipe(
        cheerio({
          run: function ($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
          },
          parserOptions: {
            xmlMode: true
          },
        })
      )
      .pipe(replace('&gt;', '>'))
      .pipe(svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg"
          }
        },
      }))
      .pipe(dest(paths.svg.dest));
  }
const fonts = () => {
    return src(paths.fonts.app)
    .pipe(dest(paths.fonts.dest))
    .pipe(browserSync.stream())
}
//Очистка директории dist перед сохранением
const clear = () => {
    return del(paths.root)
}
//Сервер
const server = () => {
    browserSync.init({
        server: {
            baseDir: paths.root,
        }
    })
}
//Отслеживание
const watching = () => {
    watch(paths.html.watch, html);
    watch(paths.scss.watch, scss);
    watch(paths.js.watch, js);
    watch(paths.images.watch, img);
    watch(paths.svg.watch, svgSprites);
}
const build =  series(clear, parallel(html, scss, js, img, svgSprites, fonts))
const dev = series(build, parallel(watching, server))
exports.html = html
exports.scss = scss
exports.js = js
exports.img = img
exports.svgSprites = svgSprites
exports.fonts = fonts
exports.watch = watching
exports.clear = clear
//Сборка
exports.default = isProd ? build : dev;