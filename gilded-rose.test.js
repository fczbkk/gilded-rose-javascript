import test from "ava";
import updateQuality from "./gilded-rose.js";

test("At the end of each day lower `sellIn`", t => {
  const items = [
    { name: "test item", sellIn: 10, quality: 20 }
  ];
  updateQuality(items);
  t.is(items[0].sellIn, 9);
});

test("At the end of each day lower `quality`", t => {
  const items = [
    { name: "test item", sellIn: 10, quality: 20 }
  ];
  updateQuality(items);
  t.is(items[0].quality, 19);
});

test("Once `sellIn` is less then zero, `quality` degrades twice as fast", t => {
  const items = [
    { name: "test item", sellIn: -1, quality: 20 }
  ];
  updateQuality(items);
  t.is(items[0].quality, 18);
});

test("The `quality` of an item is never negative", t => {
  const items = [
    { name: "test item", sellIn: 10, quality: 0 }
  ];
  updateQuality(items);
  t.is(items[0].quality, 0);
});

test("\"Aged Brie\" actually increases in quality the older it gets", t => {
  const items = [
    { name: "Aged Brie", sellIn: 10, quality: 20 }
  ];
  updateQuality(items);
  t.is(items[0].quality, 21);
});

test("The quality of an item is never more than 50", t => {
  const items = [
    { name: "Aged Brie", sellIn: 10, quality: 50 }
  ];
  updateQuality(items);
  t.is(items[0].quality, 50);
});

test("\"Sulfuras\" never has to be sold", t => {
  const items = [
    { name: "Sulfuras, Hand of Ragnaros", sellIn: 10, quality: 20 }
  ];
  updateQuality(items);
  t.is(items[0].sellIn, 10);
});

test("\"Sulfuras\" never decreases in quality", t => {
  const items = [
    { name: "Sulfuras, Hand of Ragnaros", sellIn: 10, quality: 20 }
  ];
  updateQuality(items);
  t.is(items[0].quality, 20);
});

test("\"Sulfuras\" quality never alters, even if it is above 50", t => {
  const items = [
    { name: "Sulfuras, Hand of Ragnaros", sellIn: 10, quality: 80 }
  ];
  updateQuality(items);
  t.is(items[0].quality, 80);
});

test("\"Backstage passes\" increases in quality", t => {
  const items = [
    {
      name: "Backstage passes to a TAFKAL80ETC concert",
      sellIn: 20,
      quality: 20
    }
  ];
  updateQuality(items);
  t.is(items[0].quality, 21);
});

test("\"Backstage passes\" increases in quality by 2 when there are 10 days or less left", t => {
  const items = [
    {
      name: "Backstage passes to a TAFKAL80ETC concert",
      sellIn: 10,
      quality: 20
    },
    {
      name: "Backstage passes to a TAFKAL80ETC concert",
      sellIn: 9,
      quality: 20
    }
  ];
  updateQuality(items);
  t.is(items[0].quality, 22);
  t.is(items[1].quality, 22);
});

test("\"Backstage passes\" increases in quality by 3 when there are 5 days or less left", t => {
  const items = [
    {
      name: "Backstage passes to a TAFKAL80ETC concert",
      sellIn: 5,
      quality: 20
    },
    {
      name: "Backstage passes to a TAFKAL80ETC concert",
      sellIn: 4,
      quality: 20
    }
  ];
  updateQuality(items);
  t.is(items[0].quality, 23);
  t.is(items[1].quality, 23);
});

test("\"Backstage passes\" quality drops to 0 after the concert", t => {
  const items = [
    {
      name: "Backstage passes to a TAFKAL80ETC concert",
      sellIn: 0,
      quality: 20
    },
    {
      name: "Backstage passes to a TAFKAL80ETC concert",
      sellIn: -1,
      quality: 20
    }
  ];
  updateQuality(items);
  t.is(items[0].quality, 0);
  t.is(items[1].quality, 0);
});
