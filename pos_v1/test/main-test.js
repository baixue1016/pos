'use strict';

describe('pos', () => {

  it('should print formattedTags', () => {
    const tags = [
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

    let formattedTags = getFormattedTags(tags);

    const expectTags = [{barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 1}];

    expect(formattedTags).toEqual(expectTags);
  });
});

describe("pos", () => {
  it("should print countedBarcodes", () => {
    const formattedTags = [{barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000001', count: 1},
      {barcode: 'ITEM000003', count: 2},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 1},
      {barcode: 'ITEM000005', count: 1}];

    let countedBarcodes = getCountBarcodes(formattedTags);

    const expectCounts = [{barcode: 'ITEM000001', count: 5},
      {barcode: 'ITEM000003', count: 2},
      {barcode: 'ITEM000005', count: 3}];

    expect(countedBarcodes).toEqual(expectCounts);
  });
});

describe("pos", () => {
  it("should print cartItems", () => {
    const countedBarcodes = [{barcode: 'ITEM000001', count: 5},
      {barcode: 'ITEM000003', count: 2},
      {barcode: 'ITEM000005', count: 3}];
    const allItems = loadAllItems();

    let cartItems = buildCartItems(countedBarcodes, allItems);

    const expectItems = [{
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      category: '食品',
      subCategory: '碳酸饮料',
      price: 3,
      count: 5
    },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        category: '食品',
        subCategory: '水果',
        price: 15,
        count: 2
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        category: '食品',
        subCategory: '零食',
        price: 4.5,
        count: 3
      }];

    expect(cartItems).toEqual(expectItems);
  });
});

describe("pos", () => {
  it("should print promotedItems", () => {
    const promotions = loadPromotions();
    const cartItems = [{
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      category: '食品',
      subCategory: '碳酸饮料',
      price: 3,
      count: 5
    },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        category: '食品',
        subCategory: '水果',
        price: 15,
        count: 2
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        category: '食品',
        subCategory: '零食',
        price: 4.5,
        count: 3
      }];

    let promotedItems = buildPromotedItems(cartItems, promotions);

    const expectPromotedItems = [{
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3,
      category: '食品',
      subCategory: '碳酸饮料',
      count: 5,
      payPrice: 15,
      saved: 0
    },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15,
        category: '食品',
        subCategory: '水果',
        count: 2,
        payPrice: 30,
        saved: 0
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.5,
        category: '食品',
        subCategory: '零食',
        count: 3,
        payPrice: 13.5,
        saved: 0
      }];

    expect(promotedItems).toEqual(expectPromotedItems);
  });
});

describe("pos", () => {
  it("should print totalPrices", () => {
    const promotedItems = [{
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3,
      category: '食品',
      subCategory: '碳酸饮料',
      count: 5,
      payPrice: 15,
      saved: 0
    },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15,
        category: '食品',
        subCategory: '水果',
        count: 2,
        payPrice: 30,
        saved: 0
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.5,
        category: '食品',
        subCategory: '零食',
        count: 3,
        payPrice: 13.5,
        saved: 0
      }];

    let totalPrices = calculateTotalPrices(promotedItems);

    const expectTotalPrices = {
      totalPayPrice: 58.5,
      totalSaved: 0
    };

    expect(totalPrices).toEqual(expectTotalPrices);
  });
});

describe("pos", () => {
  it("should print receipt", () => {
    const promotedItems = [{
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3,
      category: '食品',
      subCategory: '碳酸饮料',
      count: 5,
      payPrice: 15,
      saved: 0
    },
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15,
        category: '食品',
        subCategory: '水果',
        count: 2,
        payPrice: 30,
        saved: 0
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.5,
        category: '食品',
        subCategory: '零食',
        count: 3,
        payPrice: 13.5,
        saved: 0
      }];
    const totalPrices = {
      totalPayPrice: 58.5,
      totalSaved: 0
    };

    let receipt = buildReceipt(promotedItems, totalPrices);

    const expectReceipt = {
      promotedItems: [{name: '雪碧', unit: '瓶', price: 3, count: 5, payPrice: 15, saved: 0},
        {name: '荔枝', unit: '斤', price: 15, count: 2, payPrice: 30, saved: 0},
        {name: '方便面', unit: '袋', price: 4.5, count: 3, payPrice: 13.5, saved: 0}],
      savedItems: [],
      totalPayPrice: 58.5,
      totalSaved: 0
    }

    expect(receipt).toEqual(expectReceipt);
  });
});

// it('buildReceipt without saved', () => {
//   let promotedItems = [
//     {
//       barcode: 'ITEM000000', name: '可口可乐', unit: '瓶', price: 3.00, count: 10,
//       payPrice: 30, saved: 0
//     }
//   ];
//   let totalPrices = {
//     totalPayPrice: 30,
//     totalSaved: 0
//   };
//   let receipt = buildReceipt(promotedItems, totalPrices);
//   let expected = {
//     promotedItems: [
//       {
//         name: '可口可乐', unit: '瓶', price: 3.00, count: 10, payPrice: 30, saved: 0
//       }
//     ],
//     savedItems: [],
//     totalPayPrice: 30,
//     totalSaved: 0
//   };
//   expect(receipt).toEqual(expected);
// });
//
// it('buildReceipt with saved items', () => {
//   let promotedItems = [
//     {
//       barcode: 'ITEM000000', name: '可口可乐', unit: '瓶', price: 3.00, count: 11,
//       payPrice: 31.35, saved: 1.65
//     }
//   ];
//   let totalPrices = {
//     totalPayPrice: 31.35,
//     totalSaved: 1.65
//   };
//   let receipt = buildReceipt(promotedItems, totalPrices);
//   let expected = {
//     promotedItems: [
//       {
//         name: '可口可乐', unit: '瓶', price: 3.00, count: 11,
//         payPrice: 31.35, saved: 1.65
//       }
//     ],
//     savedItems: [{
//       name: '可口可乐',
//       count: 11,
//       unit: '瓶'
//     }],
//     totalPayPrice: 31.35,
//     totalSaved: 1.65
//   };
//   expect(receipt).toEqual(expected);
// });

it('should print text for items has promoted', () => {
  const tags = [
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

  spyOn(console, 'log');

  printReceipt(tags);

  const expectText = `***<没钱赚商店>***
名称：雪碧, 数量：11瓶, 单价：3.00(元), 小计：31.35(元),优惠：1.65(元)
名称：荔枝, 数量：2斤, 单价：15.00(元), 小计：30.00(元)
名称：方便面, 数量：3袋, 单价：4.50(元), 小计：13.50(元)
-----------------
批发价出售商品：
名称：雪碧,数量：11瓶
-----------------
总计：74.85(元)
节省：1.65(元)
*****************`;

  expect(console.log).toHaveBeenCalledWith(expectText);
});

it('should print text for items with no one has promoted', () => {

  const tags = [
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

  spyOn(console, 'log');

  printReceipt(tags);

  const expectText = `***<没钱赚商店>***
名称：雪碧, 数量：5瓶, 单价：3.00(元), 小计：15.00(元)
名称：荔枝, 数量：2斤, 单价：15.00(元), 小计：30.00(元)
名称：方便面, 数量：3袋, 单价：4.50(元), 小计：13.50(元)
-----------------
总计：58.50(元)
*****************`;

  expect(console.log).toHaveBeenCalledWith(expectText);
});





