import test from "node:test";
import assert from "node:assert/strict";
import {
  chapterAt,
  chapterFrame,
  progressFromScroll,
  scrollForChapter,
} from "../lib/gallery.mjs";

test("gallery clamps overscroll to the first and last projects", () => {
  assert.equal(chapterAt(-1, 4), 0);
  assert.equal(chapterAt(2, 4), 3);
  assert.equal(chapterAt(0.5, 4), 2);
});
test("selected project is fully visible and neighboring projects are offstage", () => {
  assert.deepEqual(chapterFrame(1 / 3, 1, 4), {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    z: 0,
  });
  assert.equal(chapterFrame(1 / 3, 0, 4).opacity, 0);
  assert.equal(chapterFrame(1 / 3, 2, 4).opacity, 0);
});
test("scroll controls and chapter progress agree for every project", () => {
  for (let index = 0; index < 4; index++) {
    const scroll = scrollForChapter(index, 4, 1200, 3800);
    assert.equal(chapterAt(progressFromScroll(scroll, 1200, 3800), 4), index);
  }
});
test("zero scroll range and single project stay finite", () => {
  assert.equal(progressFromScroll(100, 100, 0), 0);
  assert.equal(chapterAt(0.8, 1), 0);
  assert.equal(scrollForChapter(0, 1, 100, 0), 100);
  assert.equal(chapterFrame(0.5, 0, 1).opacity, 1);
});
