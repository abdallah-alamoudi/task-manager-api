const parseFilter = (userId, query) => {
  const filter = {};
  filter.author = userId;
  const truePattern = /^(t|tr|tru|true)$/i;
  if (query.completed !== undefined) {
    filter.completed = truePattern.test(query.completed);
  }
  return filter;
};
const parsePagination = (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  return { skip, limit, page };
};
const parseSort = (query) => {
  const sortObj = {};
  const descPattern = /^(d|de|des|desc|descen|descending|ds)$/i;
  const allowedFields = ["description", "completed"];
  if (query.sortBy) {
    const sortCriteria = query.sortBy.split(",");
    sortCriteria.forEach((criteria) => {
      let [field, direction] = criteria.split("_");
      if (allowedFields.includes(field)) {
        direction = descPattern.test(direction) ? -1 : 1;
        sortObj[field] = direction;
      }
    });
  }
  console.log(sortObj);
  return sortObj;
};
module.exports = {
  parseFilter,
  parsePagination,
  parseSort,
};
