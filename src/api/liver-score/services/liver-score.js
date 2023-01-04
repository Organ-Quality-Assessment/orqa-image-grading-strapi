'use strict';

/**
 * liver-score service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::liver-score.liver-score');
