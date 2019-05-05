/**
 * @typedef {Object} itemData
 * @property {string} name
 * @property {number} sellIn
 * @property {number} quality
 */

const MIN_QUALITY = 0;
const MAX_QUALITY = 50;

const CONJURED_PREFIX = "Conjured ";
const CONJURED_RE = new RegExp("^" + CONJURED_PREFIX);

const AGED_BRIE_TITLE = "Aged Brie";
const SULFURAS_TITLE = "Sulfuras, Hand of Ragnaros";
const BACKSTAGE_PASS_TITLE = "Backstage passes to a TAFKAL80ETC concert";

/**
 * Helper that creates RegExp for check of item type, regardless of it being conjured or not.
 * @param {string} itemName
 * @returns {RegExp}
 */
function constructItemRe (itemName) {
  return new RegExp("^(" + CONJURED_PREFIX + ")?" + itemName + "$");
}

/**
 * Checks whether item is of conjured type.
 * @param {itemData} item
 * @returns {boolean}
 */
function isItemConjured ({ name }) {
  return CONJURED_RE.test(name);
}

/**
 * Checks whether item is aged brie.
 * @param {itemData} item
 * @returns {boolean}
 */
function isAgedBrie ({ name }) {
  return constructItemRe(AGED_BRIE_TITLE).test(name);
}

/**
 * Checks whether item is Sulfuras.
 * @param {itemData} item
 * @returns {boolean}
 */
function isSulfuras ({ name }) {
  return constructItemRe(SULFURAS_TITLE).test(name);
}

/**
 * Checks whether item is backstage pass.
 * @param {itemData} item
 * @returns {boolean}
 */
function isBackstagePass ({ name }) {
  return constructItemRe(BACKSTAGE_PASS_TITLE).test(name);
}

/**
 * Calculates delta for updating quality property of backstage pass.
 * @param {itemData} item
 * @returns {number}
 */
function getBackstagePassQualityDelta (item) {
  const { sellIn, quality } = item;

  if (sellIn < 0) {
    return 0 - quality;
  }

  if (sellIn < 5) {
    return 3;
  }

  if (sellIn < 10) {
    return 2;
  }

  return 1;
}

/**
 * Calculates delta for updating quality property of regular item.
 * @param {itemData} item
 * @returns {number}
 */
function getRegularItemQualityDelta (item) {
  const { sellIn } = item;

  let delta = -1;

  if (isAgedBrie(item)) {
    delta = delta * -1;
  }

  if (sellIn < 0) {
    delta = delta * 2;
  }

  return delta;
}

/**
 * Calculates delta for updating quality property of the item.
 * @param {itemData} item
 * @returns {number}
 */
function getQualityDelta (item) {
  let delta = isBackstagePass(item)
    ? getBackstagePassQualityDelta(item)
    : getRegularItemQualityDelta(item);

  if (isItemConjured(item)) {
    delta = delta * 2;
  }

  return delta;
}

/**
 * Makes sure that quality is always within allowed range.
 * @param {number} quality
 * @returns {number}
 */
function applyQualityRangeCap (quality) {
  if (quality < MIN_QUALITY) {
    return MIN_QUALITY;
  }

  if (quality > MAX_QUALITY) {
    return MAX_QUALITY;
  }

  return quality;
}

/**
 * Updates `quality` property of item.
 * @param {itemData} item
 * @returns {itemData}
 */
function updateItemQuality (item) {
  const { quality } = item;

  item.quality = applyQualityRangeCap(quality + getQualityDelta(item));

  return item;
}

/**
 * Updates `sellIn` property of item.
 * @param {itemData} item
 * @returns {itemData}
 */
function updateItemSellIn (item) {
  const { sellIn } = item;
  item.sellIn = sellIn - 1;
  return item;
}

/**
 * Updates data of single item.
 * @param {itemData} item
 * @returns {itemData}
 */
function updateItem (item) {
  if (!isSulfuras(item)) {
    updateItemSellIn(item);
    updateItemQuality(item);
  }
  return item;
}

/**
 * Updates data of provided list of items.
 * @param {Array.<itemData>} items
 * @returns {Array.<itemData>}
 */
function updateQuality (items) {
  return items.map(updateItem);
}

module.exports = updateQuality;
