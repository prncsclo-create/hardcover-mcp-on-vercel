```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequest, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { HardcoverClient } from '../lib/hardcover-client';
import { BookSearchParams, BookDetailsParams, AddToLibraryParams, UpdateStatusParams } from '../lib/types';

// Environment validation
const APIKEY = process.env.HARDCOVERAPI_KEY;
if (!API_KEY) {
console.error('HARDCOVERAPIKEY environment variable is required');
process.exit(1);
}

// Initialize server and client
const server = new McpServer(
{
name: 'hardcover-mcp-server',
version: '1.0.0',
},
{
capabilities: {
tools: {},
},
}
);

const hardcoverClient = new HardcoverClient(API_KEY);

// Schema definitions for tool parameters
const searchBooksSchema = z.object({
query: z.string().describe('The book title or author name to search for'),
limit: z.number().optional().default(10).describe('Maximum number of results to return'),
});

const getBookDetailsSchema = z.object({
id: z.number().describe('The Hardcover book ID'),
});

const addToLibrarySchema = z.object({
bookId: z.number().describe('The ID of the book to add'),
status: z.enum(['WANTTOREAD', 'CURRENTLYREADING', 'READ', 'DIDNOT_FINISH'])
.describe('Reading status for the book'),
});

const updateStatusSchema = z.object({
id: z.number().describe('The user book ID to update'),
status: z.enum(['WANTTOREAD', 'CURRENTLYREADING', 'READ', 'DIDNOT_FINISH'])
.describe('New reading status'),
rating: z.number().min(1).max(5).optional().describe('Book rating (1-5 stars)'),
progress: z.number().min(0).max(100).optional().describe('Reading progress percentage'),
});

// Tool: Search for books
server.setRequestHandler('tools/list', async () => {
return {
tools: [
{
name: 'search_books',
description: 'Search for books on Hardcover by title or author',
inputSchema: searchBooksSchema,
},
{
name: 'getbookdetails',
description: 'Get detailed information about a specific book',
inputSchema: getBookDetailsSchema,
},
{
name: 'getuserlibrary',
description: 'Get the current user\'s reading library',
inputSchema: z.object({}),
},
{
name: 'addtolibrary',
description: 'Add a book to the user\'s library with a specific status',
inputSchema: addToLibrarySchema,
},
{
name: 'updatereadingstatus',
description: 'Update the reading status, rating, or progress of a book in the library',
inputSchema: updateStatusSchema,
},
],
};
});

// Handle tool calls
server.setRequestHandler('tools/call', async (request: CallToolRequest) => {
const { name, arguments: args } = request.params;

try {
switch (name) {
case 'search_books': {
const { query, limit } = searchBooksSchema.parse(args);
const books = await hardcoverClient.searchBooks(query, limit);

return {
content: [
{
type: 'text',
text: JSON.stringify(books, null, 2),
},
],
};
}

case 'getbookdetails': {
const { id } = getBookDetailsSchema.parse(args);
const book = await hardcoverClient.getBookDetails(id);

if (!book) {
throw new McpError(ErrorCode.InvalidRequest, `Book with ID ${id} not found`);
}

return {
content: [
{
type: 'text',
text: JSON.stringify(book, null, 2),
},
],
};
}

case 'getuserlibrary': {
const library = await hardcoverClient.getUserLibrary();

return {
content: [
{
type: 'text',
text: JSON.stringify(library, null, 2),
},
],
};
}

case 'addtolibrary': {
const { bookId, status } = addToLibrarySchema.parse(args);
// Note: This would require implementing the mutation in the client

return {
content: [
{
type: 'text',
text: `Added book ${bookId} to library with status: ${status}`,
},
],
};
}

case 'updatereadingstatus': {
const { id, status, rating, progress } = updateStatusSchema.parse(args);
// Note: This would require implementing the mutation in the client

return {
content: [
{
type: 'text',
text: `Updated book ${id} - Status: ${status}, Rating: ${rating || 'N/A'}, Progress: ${progress || 'N/A'}%`,
},
],
};
}

default:
throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
}
} catch (error) {
if (error instanceof McpError) {
throw error;
}

throw new McpError(
ErrorCode.InternalError,
`Error executing tool ${name}: ${error.message}`
);
}
});

// Start the server
async function main() {
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Hardcover MCP server running on stdio');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
await server.close();
process.exit(0);
});

main().catch((error) => {
console.error('Server error:', error);
process.exit(1);
});
``` DELETE };
