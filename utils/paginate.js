module.exports = (collection, collectionKey, total, limit, page) => {
  const pageVal = page || 0;
  const obj = { pageInfo: { total: 0, currentPage: 0, totalPages: 0 } };

  obj[collectionKey] = [];
  if (collection.length) {
    obj[collectionKey] = collection;
    obj.pageInfo.total = total;
    obj.pageInfo.currentPage = pageVal || 1;
    obj.pageInfo.totalPages = Math.ceil(total / limit);
  }

  return obj;
};
