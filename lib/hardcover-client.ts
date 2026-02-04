`typescript
import { GraphQLClient } from 'graphql-request';
interface QueryVariables {
interface QueryVariables {
private client: GraphQLClient;
constructor(apiKey: string) {
this.client = new GraphQLClient('https://api.hardcover.app/v1/graphql', {
headers: {
Authorization: apiKey, // Should be "Bearer "
},
timeout: 30000,
});
async query(query: string, variables?: QueryVariables) {
try {
const result = await this.client.request(query, variables);
return result;
} catch (error) {
console.error('Hardcover API Error:', error);
throw new Error(GraphQL query failed: ${error});
export { HardcoverClient };
