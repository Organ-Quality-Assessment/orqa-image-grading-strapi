'use strict';

/**
 * score controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::score.score', ({ strapi }) => ({
    async create(ctx, next) {
        const user = ctx.state.user

        const data = {
            ...ctx.request.body.data,
            users_permissions_user: user
        }
      
        const response = await strapi.entityService.create('api::score.score', {data})
        // const response = await super.create(ctx)
        return response
    }
}));