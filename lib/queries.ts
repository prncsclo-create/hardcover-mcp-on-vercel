```typescript
import { gql } from 'graphql-request';

export const SEARCHBOOKSQUERY = gql`
query SearchBooks($query: String!, $limit: Int = 10) {
books(
where: {
_or: [
{ title: { _ilike: $query } }
{ authorusers: { user: { name: { ilike: $query } } } }
]
}
limit: $limit
orderby: { usersread_count: desc }
) {
id
title
description
release_date
rating
usersreadcount
cached_tags
images {
url
width
height
}
author_users {
user {
id
name
}
}
series_books {
series {
name
id
}
position
}
}
}
`;

export const GETBOOKDETAILS_QUERY = gql`
query GetBook($id: Int!) {
booksbypk(id: $id) {
id
title
description
release_date
rating
usersreadcount
pages
language
isbn_10
isbn_13
cached_tags
images {
url
width
height
}
author_users {
user {
id
name
bio
}
}
series_books {
series {
id
name
description
}
position
}
reviews(limit: 5, orderby: { createdat: desc }) {
id
body
rating
user {
name
}
created_at
}
}
}
`;

export const GETUSERLIBRARY_QUERY = gql`
query GetUserLibrary($userId: Int) {
user_books(
where: { userid: { eq: $userId } }
orderby: { updatedat: desc }
) {
id
status
rating
progress
created_at
updated_at
book {
id
title
description
release_date
rating
pages
images {
url
}
author_users {
user {
name
}
}
}
}
}
`;

export const ADDBOOKTOLIBRARYMUTATION = gql`
mutation AddBookToLibrary($bookId: Int!, $status: String!) {
insertuserbooksone(object: { bookid: $bookId, status: $status }) {
id
status
book {
id
title
}
}
}
`;

export const UPDATEREADINGSTATUS_MUTATION = gql`
mutation UpdateReadingStatus($id: Int!, $status: String!, $rating: Int, $progress: Int) {
updateuserbooksbypk(
pk_columns: { id: $id }
_set: { status: $status, rating: $rating, progress: $progress }
) {
id
status
rating
progress
}
}
`;
```
