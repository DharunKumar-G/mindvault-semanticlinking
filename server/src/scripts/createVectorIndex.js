/**
 * Script to create MongoDB Atlas Vector Search Index
 * 
 * NOTE: Vector Search indexes must be created through the MongoDB Atlas UI
 * or using the Atlas Admin API. This script provides the index definition
 * that you need to create manually.
 * 
 * Steps to create the Vector Search Index:
 * 
 * 1. Go to your MongoDB Atlas cluster
 * 2. Navigate to "Atlas Search" tab
 * 3. Click "Create Search Index"
 * 4. Choose "JSON Editor"
 * 5. Select your database and collection (mindvault.notes)
 * 6. Use the index definition below
 */

const VECTOR_INDEX_DEFINITION = {
  "name": "vector_index",
  "type": "vectorSearch",
  "definition": {
    "fields": [
      {
        "type": "vector",
        "path": "embedding",
        "numDimensions": 1536,
        "similarity": "cosine"
      }
    ]
  }
};

console.log('='.repeat(60));
console.log('MongoDB Atlas Vector Search Index Definition');
console.log('='.repeat(60));
console.log('\nCreate this index in your MongoDB Atlas cluster:');
console.log('\n1. Go to Atlas Search in your cluster');
console.log('2. Click "Create Search Index"');
console.log('3. Choose "JSON Editor"');
console.log('4. Select database: mindvault');
console.log('5. Select collection: notes');
console.log('6. Set index name: vector_index');
console.log('\n7. Use this definition:\n');
console.log(JSON.stringify(VECTOR_INDEX_DEFINITION.definition, null, 2));
console.log('\n' + '='.repeat(60));
console.log('\nAlternatively, you can use the Atlas Admin API:');
console.log('\nPOST /api/atlas/v2/groups/{groupId}/clusters/{clusterName}/fts/indexes');
console.log('\nWith body:');
console.log(JSON.stringify({
  collectionName: "notes",
  database: "mindvault",
  ...VECTOR_INDEX_DEFINITION
}, null, 2));
console.log('\n' + '='.repeat(60));
