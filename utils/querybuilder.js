let FETCHLIMIT = process.env.DEFAULTFETCHLIMIT;
const _ = require('underscore');

module.exports = (params, _config) => {
  const config = _config || {};

  const replacementParams = _.omit(params, config.excludes || []);
  const { page } = params;
  FETCHLIMIT = FETCHLIMIT || config.per_page || 10;

  const query = { where: replacementParams, raw: true, limit: FETCHLIMIT };
  const offset = page ? (page - 1) * FETCHLIMIT : false;
  if (offset) {
    query.offset = offset;
  }

  // Process to and from
  if (params.from) {
    if (!replacementParams.createdAt) {
      replacementParams.createdAt = {};
    }
    replacementParams.createdAt.$gte = `${params.from} 00:00:00`;
  }

  if (params.to) {
    if (!replacementParams.createdAt) {
      replacementParams.createdAt = {};
    }
    replacementParams.createdAt.$lte = `${params.to} 23:59:59`;
  }

  /* if(params.q){

        params.$or = [
            {email:{
                $like:'%'+params.q+'%'
            }},
            {phone:{
                $like:'%'+params.q+'%'
            }},
            {fullName:{
                $like:'%'+params.q+'%'
            }}
        ];

    }
    delete params.q; */
  query.order = config.order || [['createdAt', 'DESC']];
  query.buider_options = {
    page: page || 1,
    per_page: FETCHLIMIT,
  };

  // logger(query);
  return query;
};
