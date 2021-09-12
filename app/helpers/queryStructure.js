const queryStructure = {
  // Filter response data query helper
  filterResponse: (queryData) => {
    return new Promise((resolve, reject) => {
      let obj = {};
      let sort = true;
      if (
        queryData?.sortValue === undefined ||
        queryData?.sortColumn === undefined
      ) {
        sort = false;
        obj.sortValue = '-1';
        obj.sortColumn = 'createdDate';
      }
      obj = {
        pageSize: queryData?.pageSize ?? 10,
        pageNo: queryData?.pageNo || 1,
        sortValue: sort ? queryData?.sortValue : obj.sortValue,
        sortColumn: sort ? queryData?.sortColumn : obj?.sortColumn,
      };
      if (queryData.filterColumn && queryData.filterValue) {
        obj.query = { [queryData.filterColumn]: queryData.filterValue };
      }
      resolve(obj);
    });
  },
};
module.exports = queryStructure;
