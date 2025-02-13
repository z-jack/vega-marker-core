import boundStroke from '../bound/boundStroke';
import { intersectRule } from '../util/intersect';
import { visit } from '../util/visit';
import { pick } from '../util/canvas/pick';
import stroke from '../util/canvas/stroke';
import { translateItem } from '../util/svg/transform';
import id from '../util/id'

function attr(emit, item) {
  emit('transform', translateItem(item));
  emit('x2', item.x2 != null ? item.x2 + Math.random() / 1e2 - (item.x || 0) : Math.random() / 1e2);
  emit('y2', item.y2 != null ? item.y2 + Math.random() / 1e2 - (item.y || 0) : Math.random() / 1e2);
  if (item.mark.role.startsWith('mark')) {
    emit('id', id.getMarkId(id.getMarkClass(item.mark)))
    emit('class', `mark ${id.getMarkClass(item.mark)} rule`)
    emit('data-datum', JSON.stringify({
      _TYPE: 'rule',
      _MARKID: id.getMarkClass(item.mark),
      _x: item.x,
      _y: item.y,
      ...item.datum
    }))
  }
}

function bound(bounds, item) {
  var x1, y1;
  return boundStroke(bounds.set(
    x1 = item.x || 0,
    y1 = item.y || 0,
    item.x2 != null ? item.x2 : x1,
    item.y2 != null ? item.y2 : y1
  ), item);
}

function path(context, item, opacity) {
  var x1, y1, x2, y2;

  if (item.stroke && stroke(context, item, opacity)) {
    x1 = item.x || 0;
    y1 = item.y || 0;
    x2 = item.x2 != null ? item.x2 : x1;
    y2 = item.y2 != null ? item.y2 : y1;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    return true;
  }
  return false;
}

function draw(context, scene, bounds) {
  visit(scene, function (item) {
    if (bounds && !bounds.intersects(item.bounds)) return; // bounds check
    var opacity = item.opacity == null ? 1 : item.opacity;
    if (opacity && path(context, item, opacity)) {
      context.stroke();
    }
  });
}

function hit(context, item, x, y) {
  if (!context.isPointInStroke) return false;
  return path(context, item, 1) && context.isPointInStroke(x, y);
}

export default {
  type: 'rule',
  tag: 'line',
  nested: false,
  attr: attr,
  bound: bound,
  draw: draw,
  pick: pick(hit),
  isect: intersectRule
};
