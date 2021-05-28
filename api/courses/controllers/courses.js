"use strict";
const { sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      //whatever user is
      data.user = ctx.state.user.id;
      entity = await strapi.services.courses.create(data, { files });
    } else {
      //change user here too
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.courses.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.courses });
  },
  // Dont allow others to update
  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [courses] = await strapi.services.courses.find({
      id: ctx.params.id,
      "user.id": ctx.state.user.id,
    });

    if (!courses) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.courses.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.courses.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.courses });
  },

  //Delete a user's event
  async delete(ctx) {
    const { id } = ctx.params;

    const [courses] = await strapi.services.courses.find({
      id: ctx.params.id,
      //   "user.id": ctx.state.user.id,
    });

    if (!courses) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    const entity = await strapi.services.courses.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.courses });
  },

  //New Routes
  //Get logged in user
  //   async me(ctx) {
  //     const user = ctx.state.user;

  //     if (!user) {
  //       return ctx.badRequest(null, [
  //         { messages: [{ id: "No authorization header was found" }] },
  //       ]);
  //     }

  //     const data = await strapi.services.courses.find({ user: user.id });

  //     if (!data) {
  //       return ctx.notfound();
  //     }

  //     return sanitizeEntity(data, { model: strapi.models.courses });
  //   },
};
