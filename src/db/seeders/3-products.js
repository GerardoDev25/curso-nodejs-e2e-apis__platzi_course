const { PRODUCT_TABLE } = require('../models/product.model');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(PRODUCT_TABLE, [
      {
        name: 'Product 1',
        description: 'bla bla',
        price: 100,
        category_id: '1',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        created_at: new Date(),
      },
      {
        name: 'Product 2',
        description: 'bla bla',
        price: 109,
        category_id: '1',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        created_at: new Date(),
      },
      {
        name: 'Product 3',
        description: 'bla bla',
        price: 160,
        category_id: '1',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        created_at: new Date(),
      },

      {
        name: 'Product 4',
        description: 'bla bla',
        price: 12,
        category_id: '2',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        created_at: new Date(),
      },
      {
        name: 'Product 5',
        description: 'bla bla',
        price: 234,
        category_id: '2',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        created_at: new Date(),
      },
      {
        name: 'Product 6',
        description: 'bla bla',
        price: 400,
        category_id: '2',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        created_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete(PRODUCT_TABLE, null, {});
  },
};
