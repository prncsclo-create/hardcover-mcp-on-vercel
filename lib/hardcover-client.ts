```typescript
import { GraphQLClient } from 'graphql-request';
import {
SEARCHBOOKSQUERY,
GETBOOKDETAILS_QUERY,
GETUSERLIBRARY_QUERY
} from './queries';
import {
HardcoverBook,
SearchBooksResponse,
GetBookResponse,
UserLibraryResponse
} from './types';

export class HardcoverClient {
private client: GraphQLClient;

constructor(apiKey: string) {
this.client = new GraphQLClient('https://api.hardcover.app/v1/graphql', {
headers: {
'Authorization': `Bearer ${apiKey}`,
'Content-Type': 'application/json',
},
});
}

async searchBooks(query: string, limit = 10): Promise {
try {
const variables = {
query: `%${query}%`,
limit
};

const response: SearchBooksResponse = await this.client.request(
SEARCHBOOKSQUERY,
variables
);

return response.books || [];
} catch (error) {
console.error('Error searching books:', error);
throw new Error(`Failed to search books: ${error.message}`);
}
}

async getBookDetails(bookId: number): Promise {
try {
const variables = { id: bookId };

const response: GetBookResponse = await this.client.request(
GETBOOKDETAILS_QUERY,
variables
);

return response.booksbypk || null;
} catch (error) {
console.error('Error getting book details:', error);
throw new Error(`Failed to get book details: ${error.message}`);
}
}

async getUserLibrary(userId?: number): Promise {
try {
const variables = userId ? { userId } : {};

const response: UserLibraryResponse = await this.client.request(
GETUSERLIBRARY_QUERY,
variables
);

return response.user_books || [];
} catch (error) {
console.error('Error getting user library:', error);
throw new Error(`Failed to get user library: ${error.message}`);
}
}
}
```
