async findBySearch(filter) {
  const result = await Product.aggregate([
      { $match: { $text: { $search: filter } } },
      { $addFields: { score: { $meta: 'textScore' } } },
      { $unionWith: {
          coll: 'products',
          pipeline: [
            { $match: {
                $or: [
                  { field1: { $regex: `${filter}` } },
                  { field2: { $regex: `${filter}` } },
                  { field3_array: { $elemMatch: { $regex: `${filter}` } } },
                ],
            }},
            { $addFields: { score: 1 } },
          ],
      }},
      { $sort: { score: -1 } },
      { $group: {
          _id: '$_id',
          field1: { $first: '$field1' },
          ...,
          score: { $sum: '$score' },
      }},
    ]);
  return product;
}
