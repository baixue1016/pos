// let tags = [
//   'ITEM000001',
//   'ITEM000001',
//   'ITEM000001',
//   'ITEM000001',
//   'ITEM000001',
//   'ITEM000003-2',
//   'ITEM000005',
//   'ITEM000005',
//   'ITEM000005'
// ];
tags = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2',
  'ITEM000005',
  'ITEM000005',
  'ITEM000005'
];

function getFormattedTags(tags) {
  return tags.map((tag)=> {
    if (tag.includes('-')) {
      let [barcode, count] = tag.split('-');
      return {
        barcode,
        count: parseFloat(count)
      }
    } else {
      return {
        barcode: tag,
        count: 1
      }
    }
  })
  // let result = [];
  // for (let tag of tags) {
  //   if (tag.includes('-')) {
  //     let temps = tag.split('-');
  //     result.push({barcode: temps[0], count: parseInt(temps[1])});
  //   } else {
  //     result.push({barcode: tag, count: 1});
  //   }
  // }
  // return result;
}

function getExistByBarcode(array, barcode) {
  for (let countItem of array) {
    if (countItem.barcode == barcode) {
      return countItem;
    }
  }
  return null;
}

function getCountBarcodes(formattedTags) {
  let result = [];
  for (let formattedTag of formattedTags) {
    let countItem = getExistByBarcode(result, formattedTag.barcode);
    if (countItem === null) {
      result.push({barcode: formattedTag.barcode, count: formattedTag.count});
    } else {
      countItem.count += formattedTag.count;
    }
  }
  return result;
}

function buildCartItems(countedBarcodes, allItems) {
  let result = [];
  for (let countedBarcode of countedBarcodes) {
    let item = getExistByBarcode(allItems, countedBarcode.barcode);
    let cartItem = {
      barcode: item.barcode,
      name: item.name,
      unit: item.unit,
      category: item.category,
      subCategory: item.subCategory,
      price: item.price,
      count: countedBarcode.count
    }
    result.push(cartItem);
  }
  return result;
}

function _fixPrice(number) {
  return parseFloat(number.toFixed(2))
}

function buildPromotedItems(cartItems, promotions) {
  let currentPromotion = promotions.find((promotion) => promotion.type === '单品批发价出售')
  return cartItems.map((cartItem)=> {
    let hasPromoted = currentPromotion.barcodes.includes(cartItem.barcode) && cartItem.count > 10;
    let totalPrice = cartItem.price * cartItem.count;
    let saved = hasPromoted ? totalPrice * 0.05 : 0;
    let payPrice = totalPrice - saved;
    return Object.assign({}, cartItem, {
      payPrice, saved: _fixPrice(saved)
    })
  })
}

function calculateTotalPrices(promotedItems) {
  return promotedItems.reduce((result, {payPrice, saved})=> {
    result.totalPayPrice += payPrice;
    result.totalSaved += saved;
    return result;
  }, {totalPayPrice: 0, totalSaved: 0})
}

function buildReceipt(promotedItems, {totalPayPrice, totalSaved}) {
  let savedItems = promotedItems.filter((promotedItem)=> promotedItem.saved > 0)
    .map(({name, count, unit})=> {
      return {name, count, unit}
    });
  return {
    promotedItems: promotedItems.map(({name, unit, price, count, payPrice, saved})=> {
      return {name, unit, price, count, payPrice, saved}
    }),
    savedItems,
    totalPayPrice, totalSaved
  }

}

function buildReceiptString(receiptModel) {
  let lines = ["***<没钱赚商店>***"];
  for (let {name, count, unit, price, payPrice, saved} of receiptModel.promotedItems){
    let line = `名称：${name}, 数量：${count}${unit}, 单价：${price.toFixed(2)}(元), 小计：${payPrice.toFixed(2)}(元)`;
    if(saved > 0){
      line += `,优惠：${saved.toFixed(2)}(元)`
    }
    lines.push(line)
  }

  let hasSaved = receiptModel.savedItems.length > 0;
  if(hasSaved){
    lines.push('-----------------');
    lines.push('批发价出售商品：');
    for(let {name, count, unit} of receiptModel.savedItems){
      lines.push(`名称：${name},数量：${count}${unit}`);
    }
  }

  lines.push('-----------------');
  lines.push(`总计：${receiptModel.totalPayPrice.toFixed(2)}(元)`);
  if(hasSaved){
    lines.push(`节省：${receiptModel.totalSaved}(元)`);
  }
  lines.push('*****************');

  let receiptString = lines.join('\n');
  console.log(receiptString);
}

function printReceipt(tags) {
  let formattedTags = getFormattedTags(tags);
  let countedBarcodes = getCountBarcodes(formattedTags);
  let allItems = loadAllItems();
  let cartItems = buildCartItems(countedBarcodes, allItems);
  let promotions = loadPromotions();
  let promotedItems = buildPromotedItems(cartItems, promotions);
  let totalPrices = calculateTotalPrices(promotedItems);
  let receiptModel = buildReceipt(promotedItems, totalPrices);
  let receiptString = buildReceiptString(receiptModel);
//  console.log(receiptString);
}

printReceipt(tags);

// function loadAllItems() {
//   return [
//     {
//       barcode: 'ITEM000000',
//       name: '可口可乐',
//       unit: '瓶',
//       category: '食品',
//       subCategory: '碳酸饮料',
//       price: 3.00
//     },
//     {
//       barcode: 'ITEM000001',
//       name: '雪碧',
//       unit: '瓶',
//       category: '食品',
//       subCategory: '碳酸饮料',
//       price: 3.00
//     },
//     {
//       barcode: 'ITEM000002',
//       name: '苹果',
//       unit: '斤',
//       category: '食品',
//       subCategory: '水果',
//       price: 5.50
//     },
//     {
//       barcode: 'ITEM000003',
//       name: '荔枝',
//       unit: '斤',
//       category: '食品',
//       subCategory: '水果',
//       price: 15.00
//     },
//     {
//       barcode: 'ITEM000004',
//       name: '电池',
//       unit: '个',
//       category: '日用品',
//       subCategory: '充电',
//       price: 2.00
//     },
//     {
//       barcode: 'ITEM000005',
//       name: '方便面',
//       unit: '袋',
//       category: '食品',
//       subCategory: '零食',
//       price: 4.50
//     }
//   ];
// }
//
// function loadPromotions() {
//   return [
//     {
//       type: '单品批发价出售',
//       barcodes: [
//         'ITEM000000',
//         'ITEM000001'
//       ]
//     },
//     {
//       type: 'OTHER_PROMOTION',
//       barcodes: [
//         'ITEM000003',
//         'ITEM000004'
//       ]
//     }
//   ]
// }
