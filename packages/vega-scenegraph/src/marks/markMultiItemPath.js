import boundStroke from '../bound/boundStroke';
import context from '../bound/boundContext';
import { intersectPoint } from '../util/intersect';
import { drawOne } from '../util/canvas/draw';
import { hitPath } from '../util/canvas/pick';
import id from '../util/id'

export default function (type, shape, tip) {

  function attr(emit, item) {
    var items = item.mark.items;
    if (items.length) {
      emit('d', shape(null, items));
      emit('id', id.getMarkId(id.getMarkClass(item.mark)))
      emit('class', `mark ${id.getMarkClass(item.mark)} path`)
      emit('data-datum', JSON.stringify(items.map(i => {
        return {
          _TYPE: 'path',
          _MARKID: id.getMarkClass(item.mark),
          _x: item.x,
          _y: item.y,
          ...i.datum
        }
      })))
    }
  }

  function bound(bounds, mark) {
    var items = mark.items;
    if (items.length === 0) {
      return bounds;
    } else {
      shape(context(bounds), items);
      return boundStroke(bounds, items[0]);
    }
  }

  function draw(context, items) {
    context.beginPath();
    shape(context, items);
  }

  var hit = hitPath(draw);

  function pick(context, scene, x, y, gx, gy) {
    var items = scene.items,
      b = scene.bounds;

    if (!items || !items.length || b && !b.contains(gx, gy)) {
      return null;
    }

    x *= context.pixelRatio;
    y *= context.pixelRatio;
    return hit(context, items, x, y) ? items[0] : null;
  }

  return {
    type: type,
    tag: 'path',
    nested: true,
    attr: attr,
    bound: bound,
    draw: drawOne(draw),
    pick: pick,
    isect: intersectPoint,
    tip: tip
  };

}


