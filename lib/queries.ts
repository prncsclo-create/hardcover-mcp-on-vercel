export const BOOKSBYTITLE_QUERY = 
  query BooksByTitle($title: String!, $limit: Int!, $offset: Int!) {
  books(
    where: { title: { _ilike: $title } 
            limit: $limit
offset: $offset
            orderby: { taggingsaggregate: { count: desc } }
            ) {
              id
              title
              subtitle
              description
              isbn_10
              isbn_13
              pages
              publication_date
              image
              usersbooksaggregate {
                aggregate {
                  avg {
                    rating
                    contributions(where: { role: { name: { _eq: "Author" } } }) {
person {
  name
  `;
  export const BOOKSBYGENRE_QUERY = `
  query BooksByGenre(
    $genre: [String!]!
    $limit: Int!
  $offset: Int!
  $rating_minimum: Int!
  $taggingcountminimum: Int!
  $min_year: Int!
  $max_year: Int!
  where: {
    _and: [
      { taggings: { tag: { name: { _in: $genre } } } }
     { usersbooksaggregate: { aggregate: { avg: { rating: { gte: $rating_minimum } } } } }
    { taggingsaggregate: { aggregate: { count: { gte: $taggingcountminimum } } } }
    { publicationdate: { gte: $min_year } }
    { publicationdate: { lte: $max_year } }
    ]
  }
  `
  
    
