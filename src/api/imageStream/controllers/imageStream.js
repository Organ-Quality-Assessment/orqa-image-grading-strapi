'use strict';

/**
 * A set of functions called "actions" for `imageStream`
 */

module.exports = {
  getImage: async (ctx, next) => {
   
    try {
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
