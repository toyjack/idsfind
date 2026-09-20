import assert from "node:assert/strict";
import { test } from "node:test";
import { getCjkviIDS, getTotalStrokes, idsfind } from "../dist/index.mjs";

test("finds hanzi containing a single IDS component, with no duplicates", () => {
  const results = idsfind("口");
  assert.ok(Array.isArray(results));
  assert.ok(results.length > 0);
  assert.equal(new Set(results).size, results.length);
});

test("filters by remaining stroke count", () => {
  const remaining = 5;
  const results = idsfind(`口${remaining}`);
  assert.ok(results.length > 0);
  const componentStrokes = getTotalStrokes("口");
  for (const hanzi of results) {
    assert.equal(getTotalStrokes(hanzi), componentStrokes + remaining);
  }
});

test("intersects multi-component queries", () => {
  const single = new Set(idsfind("口"));
  const multi = idsfind("口木");
  assert.ok(multi.length > 0);
  for (const hanzi of multi) {
    assert.ok(single.has(hanzi));
  }
});

test("components absent from the index return [] instead of throwing", () => {
  assert.deepEqual(idsfind("a"), []);
  assert.deepEqual(idsfind("a3"), []);
  assert.deepEqual(idsfind("口a"), []);
  assert.deepEqual(idsfind(""), []);
});

test("getTotalStrokes / getCjkviIDS", () => {
  assert.equal(typeof getTotalStrokes("口"), "number");
  assert.ok(Number.isNaN(getTotalStrokes("a")));
  assert.equal(typeof getCjkviIDS("口"), "string");
  assert.equal(getCjkviIDS("a"), undefined);
});
