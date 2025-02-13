import boundStroke from '../bound/boundStroke';
import context from '../bound/boundContext';
import pathParse from '../path/parse';
import pathRender from '../path/render';
import { intersectPath } from '../util/intersect';
import { drawAll } from '../util/canvas/draw';
import { pickPath } from '../util/canvas/pick';
import { translateItem } from '../util/svg/transform';
import id from '../util/id'

function attr(emit, item) {
  emit('transform', translateItem(item));
  emit('d', item.path);
  if (item.mark.role.startsWith('mark')) {
    emit('id', id.getMarkId(id.getMarkClass(item.mark)))
    emit('class', `mark ${id.getMarkClass(item.mark)} path`)
    emit('data-datum', JSON.stringify({
      _TYPE: 'path',
      _MARKID: id.getMarkClass(item.mark),
      _x: item.x,
      _y: item.y,
      ...item.datum
    }))
  }
}

function path(context, item) {
  var path = item.path;
  if (path == null) return true;

  var cache = item.pathCache;
  if (!cache || cache.path !== path) {
    (item.pathCache = cache = pathParse(path)).path = path;
  }
  pathRender(context, cache, item.x, item.y);
}

function bound(bounds, item) {
  return path(context(bounds), item)
    ? bounds.set(0, 0, 0, 0)
    : boundStroke(bounds, item);
}

export default {
  type: 'path',
  tag: 'path',
  nested: false,
  attr: attr,
  bound: bound,
  draw: drawAll(path),
  pick: pickPath(path),
  isect: intersectPath(path)
};
