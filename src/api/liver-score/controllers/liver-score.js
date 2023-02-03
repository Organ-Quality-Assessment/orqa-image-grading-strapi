'use strict';

/**
 * liver-score controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::liver-score.liver-score', ({ strapi }) => ({
    async create(ctx, next) {
        const user = ctx.state.user

        const data = {
            ...ctx.request.body.data,
            users_permissions_user: user
        }
        console.log(data)
        const response = await strapi.entityService.create('api::liver-score.liver-score', {data})
        // const response = await super.create(ctx)
        return response
    }
}));
