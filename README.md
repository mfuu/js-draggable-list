<p>
  <a href="https://npm-stat.com/charts.html?package=js-draggable-list">
    <img alt="Downloads" src="https://img.shields.io/npm/dm/js-draggable-list.svg">
  </a>
  <a href="https://www.npmjs.com/package/js-draggable-list">
    <img alt="Version" src="https://img.shields.io/npm/v/js-draggable-list.svg"/>
  </a>
</p>

# js-draggable-list

Make array elements draggable

# Usage

**HTML**
```html
<div id="content"></div>
```

**JavaScript**
```js
import Draggable from 'js-draggable-list'

var drag = new Draggable({
  groupElement: document.getElementById('content'),
  dragElement: (e) => {
    return e.target
  },
  dragEnd: (pre, cur) => {
    ...
  }
})
```

When the component you created is destroyed, you need to destroy the `drag(new Draggable)`like this

```js
drag.destroy()
```

# Options

| **option** | **type** | **default** | **Description** |
|-------------|--------------|--------------|--------------|
| `groupElement` | `HTMLElement` | - | List parent element |
| `scrollElement` | `HTMLElement` | - | List scroll element. If not passed, the default is the same as the groupElement |
| `dragElement` | `Function` | (e) => e.target | Element node selected when dragging |
| `dragEnd` | `Function` | (pre, cur) => {} | The callback function when the drag is completed |
| `cloneElementStyle` | `Object` | {} | The style of the mask element when dragging |
| `cloneElementClass` | `String` | '' | The class of the mask element when dragging |
| `delay` | `Number` | 300 | animation delay |

# methods

| **method** | **Description** |
|-------------|--------------|
| `destroy` | Destroy the component and empty its contents |
