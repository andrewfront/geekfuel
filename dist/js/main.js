/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/js/modules/burger.js":
/*!**********************************!*\
  !*** ./app/js/modules/burger.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const burger = () => {
    const burgerBtn = document.querySelector('.burger')
    const navMenu = document.querySelector('.nav')
    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('burger__active')
        if (burgerBtn.classList.contains('burger__active')) {
            navMenu.classList.add('activenav')
        } else {
            navMenu.classList.remove('activenav')
        }
    })
}
/* harmony default export */ __webpack_exports__["default"] = (burger);

/***/ }),

/***/ "./app/js/modules/dynamic.js":
/*!***********************************!*\
  !*** ./app/js/modules/dynamic.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const dynamic = () => {
    function DynamicAdapt(type) {
        this.type = type;
    }

    DynamicAdapt.prototype.init = function () {
        const _this = this;
        // массив объектов
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        // массив DOM-элементов
        this.nodes = document.querySelectorAll("[data-da]");

        // наполнение оbjects объктами
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }

        this.arraySort(this.оbjects);

        // массив уникальных медиа-запросов
        this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
            return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }, this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        });

        // навешивание слушателя на медиа-запрос
        // и вызов обработчика при первом запуске
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ',');
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];

            // массив объектов с подходящим брейкпоинтом
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
                return item.breakpoint === mediaBreakpoint;
            });
            matchMedia.addListener(function () {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            });
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };

    DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
        if (matchMedia.matches) {
            for (let i = 0; i < оbjects.length; i++) {
                const оbject = оbjects[i];
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            }
        } else {
            for (let i = 0; i < оbjects.length; i++) {
                const оbject = оbjects[i];
                if (оbject.element.classList.contains(this.daClassname)) {
                    this.moveBack(оbject.parent, оbject.element, оbject.index);
                }
            }
        }
    };

    // Функция перемещения
    DynamicAdapt.prototype.moveTo = function (place, element, destination) {
        element.classList.add(this.daClassname);
        if (place === 'last' || place >= destination.children.length) {
            destination.insertAdjacentElement('beforeend', element);
            return;
        }
        if (place === 'first') {
            destination.insertAdjacentElement('afterbegin', element);
            return;
        }
        destination.children[place].insertAdjacentElement('beforebegin', element);
    }

    // Функция возврата
    DynamicAdapt.prototype.moveBack = function (parent, element, index) {
        element.classList.remove(this.daClassname);
        if (parent.children[index] !== undefined) {
            parent.children[index].insertAdjacentElement('beforebegin', element);
        } else {
            parent.insertAdjacentElement('beforeend', element);
        }
    }

    // Функция получения индекса внутри родителя
    DynamicAdapt.prototype.indexInParent = function (parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };

    // Функция сортировки массива по breakpoint и place
    // по возрастанию для this.type = min
    // по убыванию для this.type = max
    DynamicAdapt.prototype.arraySort = function (arr) {
        if (this.type === "min") {
            Array.prototype.sort.call(arr, function (a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }

                    if (a.place === "first" || b.place === "last") {
                        return -1;
                    }

                    if (a.place === "last" || b.place === "first") {
                        return 1;
                    }

                    return a.place - b.place;
                }

                return a.breakpoint - b.breakpoint;
            });
        } else {
            Array.prototype.sort.call(arr, function (a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }

                    if (a.place === "first" || b.place === "last") {
                        return 1;
                    }

                    if (a.place === "last" || b.place === "first") {
                        return -1;
                    }

                    return b.place - a.place;
                }

                return b.breakpoint - a.breakpoint;
            });
            return;
        }
    };

    const da = new DynamicAdapt("max");
    da.init();
}
/* harmony default export */ __webpack_exports__["default"] = (dynamic);

/***/ }),

/***/ "./app/js/modules/search.js":
/*!**********************************!*\
  !*** ./app/js/modules/search.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const search = () => {
const findBtn = document.querySelector('.header__search')
const findInput = document.querySelector('.header__find-input')
const cartBtn = document.querySelector('.header__cart')
const cartOverlay = document.querySelector('.header__cart-overlay')
const cartClose = document.querySelector('.header__cart-close')
let findActive = false
findBtn.addEventListener('click', (e) => {
    if (!findActive) {
        findInput.classList.add('findActiveBtn')
        findActive = true
    } else {
        findInput.classList.remove('findActiveBtn')
        findActive = false
    }
})
cartBtn.addEventListener('click', (e) => {
    cartOverlay.classList.toggle('showcart')
})
cartClose.addEventListener('click', (e) => {
    cartOverlay.classList.remove('showcart')
})
}
/* harmony default export */ __webpack_exports__["default"] = (search);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!************************!*\
  !*** ./app/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_dynamic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/dynamic */ "./app/js/modules/dynamic.js");
/* harmony import */ var _modules_search__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/search */ "./app/js/modules/search.js");
/* harmony import */ var _modules_burger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/burger */ "./app/js/modules/burger.js");




window.addEventListener('DOMContentLoaded', () => {
    (0,_modules_dynamic__WEBPACK_IMPORTED_MODULE_0__["default"])()
    ;(0,_modules_search__WEBPACK_IMPORTED_MODULE_1__["default"])()
    ;(0,_modules_burger__WEBPACK_IMPORTED_MODULE_2__["default"])()
})
}();
/******/ })()
;
//# sourceMappingURL=main.js.map