'use strict';

/**
 * comparison controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::comparison.comparison', ({ strapi }) => ({
    async create(ctx, next) {
        const user = ctx.state.user

        const data = {
            ...ctx.request.body.data,
            users_permissions_user: user
        }

        const response = await strapi.entityService.create('api::comparison.comparison', {data})
        return response
    }
}));
