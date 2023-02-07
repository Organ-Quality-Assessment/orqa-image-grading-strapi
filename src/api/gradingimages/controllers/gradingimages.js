'use strict';

/**
 * A set of functions called "actions" for `gradingimages`
 */

module.exports = {
  gradingImages: async (ctx, next) => {

    

    try {
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
