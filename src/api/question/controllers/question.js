'use strict';

/**
 * question controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::question.question', ({ strapi }) => ({
    async create(ctx, next) {
        const user = ctx.state.user

        const data = {
            ...ctx.request.body.data,
            users_permissions_user: user
        }

        const response = await strapi.entityService.create('api::question.question', {data})
        return response
    }
}));
