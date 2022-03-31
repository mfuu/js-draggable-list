/*!
 * js-draggable-list v0.0.1
 * open source under the MIT license
 * https://github.com/mfuu/js-draggable-list#readme
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.draggable = factory());
})(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var Draggable = /*#__PURE__*/function () {
    function Draggable(options) {
      _classCallCheck(this, Draggable);

      this.parent = options.groupElement; // 父级元素

      this.scrollElement = options.scrollElement || options.groupElement; // 滚动节点

      this.dragElement = options.dragElement; // 必须为函数且必须返回一个 HTMLElement (e) => return e.target

      this.dragEnd = options.dragEnd; // 拖拽完成时的回调函数，返回两个值(olddom, newdom) => {}

      this.cloneElementStyle = options.cloneElementStyle; // 克隆元素包含的属性

      this.cloneElementClass = options.cloneElementClass; // 克隆元素的类名

      this.rectList = []; // 用于保存拖拽项getBoundingClientRect()方法获得的数据

      this.delay = options.delay || 300;
      this.isMousedown = false; // 记录鼠标按下

      this.drag = {
        element: null,
        index: 0,
        lastIndex: 0
      }; // 拖拽元素

      this.drop = {
        element: null,
        index: 0,
        lastIndex: 0
      }; // 释放元素

      this.clone = {
        element: null,
        x: 0,
        y: 0
      }; // 拖拽蒙版

      this.diff = {
        old: {
          node: null,
          rect: {}
        },
        "new": {
          node: null,
          rect: {}
        }
      }; // 记录拖拽前后差异

      this.init();
    }

    _createClass(Draggable, [{
      key: "init",
      value: function init() {
        if (!this.parent) console.error('Error: groupElement is required');

        this._bindEventListener();

        this._getChildrenRect();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._unbindEventListener();

        this._resetState();
      } // 获取元素位置信息

    }, {
      key: "_getChildrenRect",
      value: function _getChildrenRect() {
        this.rectList.length = 0;

        var _iterator = _createForOfIteratorHelper(this.parent.children),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            this.rectList.push(item.getBoundingClientRect());
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "_handleMousedown",
      value: function _handleMousedown(e) {
        var _this = this;

        if (e.button !== 0) return true;
        if (e.target === this.parent) return true;
        if (!e.target.getAttribute('draggable')) return true;
        this.isMousedown = true; // 记录拖拽移动时坐标

        var calcXY = {
          x: e.clientX,
          y: e.clientY
        }; // 获取拖拽元素

        this.drag.element = this.dragElement ? this.dragElement(e) : e.target; // 将拖拽元素克隆一份作为蒙版

        this.clone.element = this.drag.element.cloneNode(true); // 获取当前元素在列表中的位置

        var index = this._getElementIndex();

        this.diff.old.rect = this.rectList[index];
        this.clone.x = this.rectList[index].left;
        this.clone.y = this.rectList[index].top;
        this.drag.index = index;
        this.drag.lastIndex = index;

        this._initCloneElement();

        this._handleCloneMove();

        document.onmousemove = function (e) {
          e.preventDefault();
          if (!_this.isMousedown) return true;
          _this.clone.x += e.clientX - calcXY.x;
          _this.clone.y += e.clientY - calcXY.y;
          calcXY.x = e.clientX;
          calcXY.y = e.clientY;

          _this._handleCloneMove();

          for (var i = 0; i < _this.rectList.length; i++) {
            var _this$rectList$i = _this.rectList[i],
                left = _this$rectList$i.left,
                right = _this$rectList$i.right,
                top = _this$rectList$i.top,
                bottom = _this$rectList$i.bottom;

            if (e.clientX > left && e.clientX < right && e.clientY > top && e.clientY < bottom) {
              _this.drop.element = _this.parent.children[i];
              _this.drop.lastIndex = i;

              if (_this.drag.element !== _this.drop.element) {
                if (_this.drag.index < i) {
                  _this.parent.insertBefore(_this.drag.element, _this.drop.element.nextElementSibling);

                  _this.drop.index = i - 1;
                } else {
                  _this.parent.insertBefore(_this.drag.element, _this.drop.element);

                  _this.drop.index = i + 1;
                }

                _this.drag.index = i; // 设置动画

                _this._animate(_this.drag.element, _this.rectList[_this.drag.index], _this.rectList[_this.drag.lastIndex]);

                _this._animate(_this.drop.element, _this.rectList[_this.drop.index], _this.rectList[_this.drop.lastIndex]);

                _this.drag.lastIndex = i;
                _this.diff.old.node = _this.drag.element;
                _this.diff["new"].node = _this.drop.element;
              }

              _this.diff["new"].rect = _this.rectList[i];
              break;
            }
          }
        };

        document.onmouseup = function () {
          if (_this.isMousedown) {
            // 拖拽完成触发回调函数
            if (_this.dragEnd) _this.dragEnd(_this.diff.old, _this.diff["new"]);
            _this.isMousedown = false;

            _this.clone.element.remove();

            _this._clearDiff();
          }
        };
      }
    }, {
      key: "_handleMousecancel",
      value: function _handleMousecancel() {
        if (this.isMousedown) {
          this.isMousedown = false;
          this.clone.element.remove();
        }
      }
    }, {
      key: "_initCloneElement",
      value: function _initCloneElement() {
        this.clone.element["class"] = this.cloneElementClass;
        this.clone.element.style.transition = 'none';
        this.clone.element.style.position = 'fixed';
        this.clone.element.style.left = 0;
        this.clone.element.style.top = 0;

        for (var key in this.cloneElementStyle) {
          this._styled(this.clone.element, key, this.cloneElementStyle[key]);
        }

        document.body.appendChild(this.clone.element);
      }
    }, {
      key: "_handleCloneMove",
      value: function _handleCloneMove() {
        this.clone.element.style.transform = "translate3d(".concat(this.clone.x, "px, ").concat(this.clone.y, "px, 0)");
      }
    }, {
      key: "_getElementIndex",
      value: function _getElementIndex() {
        var children = Array.from(this.parent.children);
        var element = this.drag.element; // 如果能直接在子元素中找到，返回对应的index

        var index = children.indexOf(element);
        if (index > -1) return index; // children 中无法直接找到对应的dom时，需要向下寻找

        for (var i = 0; i < children.length; i++) {
          if (this._isChildOf(element, children[i])) return i;
        }
      } // 判断子元素是否包含在父元素中

    }, {
      key: "_isChildOf",
      value: function _isChildOf(child, parent) {
        var parentNode;

        if (child && parent) {
          parentNode = child.parentNode;

          while (parentNode) {
            if (parent === parentNode) return true;
            parentNode = parentNode.parentNode;
          }
        }

        return false;
      }
    }, {
      key: "_animate",
      value: function _animate(element, rect, lastRect) {
        var _this2 = this;

        this._styled(element, 'transition', 'none');

        this._styled(element, 'transform', "translate3d(".concat(lastRect.left - rect.left, "px, ").concat(lastRect.top - rect.top, "px, 0)"));

        element.offsetLeft; // 触发重绘

        this._styled(element, 'transition', "all ".concat(this.delay, "ms"));

        this._styled(element, 'transform', 'translate3d(0px, 0px, 0px)');

        clearTimeout(element.animated);
        element.animated = setTimeout(function () {
          _this2._styled(element, 'transition', '');

          _this2._styled(element, 'transform', '');

          element.animated = null;
        }, this.delay);
      }
    }, {
      key: "_styled",
      value: function _styled(el, prop, val) {
        var style = el && el.style;

        if (style) {
          if (val === void 0) {
            if (document.defaultView && document.defaultView.getComputedStyle) val = document.defaultView.getComputedStyle(el, '');else if (el.currentStyle) val = el.currentStyle;
            return prop === void 0 ? val : val[prop];
          } else {
            if (!(prop in style)) prop = '-webkit-' + prop;
            style[prop] = val + (typeof val === 'string' ? '' : 'px');
          }
        }
      }
    }, {
      key: "_resetState",
      value: function _resetState() {
        this.isMousedown = false;
        this.rectList = [];
        this.clone = {
          element: null,
          x: 0,
          y: 0
        };
        this.drag = {
          element: null,
          index: 0,
          lastIndex: 0
        };
        this.drop = {
          element: null,
          index: 0,
          lastIndex: 0
        };

        this._clearDiff();
      }
    }, {
      key: "_clearDiff",
      value: function _clearDiff() {
        this.diff = {
          old: {
            node: null,
            rect: {}
          },
          "new": {
            node: null,
            rect: {}
          }
        };
      }
    }, {
      key: "_bindEventListener",
      value: function _bindEventListener() {
        this._handleMousedown = this._handleMousedown.bind(this);
        this._getChildrenRect = this._getChildrenRect.bind(this);
        this.parent.addEventListener('mousedown', this._handleMousedown);
        this.scrollElement.addEventListener('scroll', this._debounce(this._getChildrenRect, 50));
        window.addEventListener('scroll', this._debounce(this._getChildrenRect, 50));
        window.addEventListener('resize', this._debounce(this._getChildrenRect, 50));
        window.addEventListener('orientationchange', this._debounce(this._getChildrenRect, 50));
      }
    }, {
      key: "_unbindEventListener",
      value: function _unbindEventListener() {
        this.parent.removeEventListener('mousedown', this._handleMousecancel);
        this.scrollElement.removeEventListener('scroll', this._getChildrenRect);
        window.removeEventListener('scroll', this._getChildrenRect);
        window.removeEventListener('resize', this._getChildrenRect);
        window.removeEventListener('orientationchange', this._getChildrenRect);
      }
    }, {
      key: "_debounce",
      value: function _debounce(fn, delay) {
        return function () {
          var _this3 = this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          clearTimeout(fn.id);
          fn.id = setTimeout(function () {
            fn.call.apply(fn, [_this3].concat(args));
          }, delay);
        };
      }
    }]);

    return Draggable;
  }();

  return Draggable;

}));
