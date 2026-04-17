// const rag = require("rag-lite-engine");

// const searchRAG = async (query) => {
//   try {
//     const results = await rag.search(query, {
//       topK: 3,
//     });
//     return results;
//   } catch (err) {
//     console.error("RAG search error:", err);
//     return [];
//   }
// };

// module.exports = { searchRAG };


const rag = require("rag-lite-engine");

const searchRAG = async (userQuery) => {
  try {
    // Check if query exists on the object, otherwise try calling rag directly
    const searchFunc = rag.query || rag; 
    
    if (typeof searchFunc !== 'function') {
      console.error("Could not find a valid search function in rag-lite-engine");
      return [];
    }

    const results = await searchFunc(userQuery);
    return results; 
  } catch (err) {
    console.error("RAG search error:", err);
    return [];
  }
};

module.exports = { searchRAG };