<p>
  <a href="https://npm-stat.com/charts.html?package=draggable-lst">
    <img alt="Downloads" src="https://img.shields.io/npm/dm/draggable-lst.svg">
  </a>
  <a href="https://www.npmjs.com/package/draggable-lst">
    <img alt="Version" src="https://img.shields.io/npm/v/draggable-lst.svg"/>
  </a>
</p>

# draggable-lst

Make array elements draggable

# Usage

**HTML**
```html
<div id="content"></div>
```

**JavaScript**
```js
import Draggable from 'draggable'

new Draggable({
  groupElement: document.getElementById('content'),
  dragElement: (e) => {
    return e.target
  },
  dragEnd: (olddom, newdom) => {
    ...
  }
})
```

# Options

| **option** | **type** | **default** | **Description** |
|-------------|--------------|--------------|--------------|
| `groupElement` | `HTMLElement` | - | List parent element |
| `scrollElement` | `HTMLElement` | - | List scroll element. If not passed, the default is the same as the groupElement |
| `dragElement` | `Function` | (e) => e.target | Element node selected when dragging |
| `dragEnd` | `Function` | (old, new) => {} | The callback function when the drag is completed |
| `cloneElementStyle` | `Object` | {} | The style of the mask element when dragging |
| `cloneElementClass` | `String` | '' | The class of the mask element when dragging |
| `delay` | `Number` | 300 | animation delay |
