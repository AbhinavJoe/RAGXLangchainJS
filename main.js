'use strict';
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { Ollama } from "@langchain/community/llms/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { cosineSimilarity } from "langchain/util/math";

/**
 * Creates a new instance of OllamaEmbeddings with the specified base URL and model.
 * @param {string} baseUrl - The base URL of the Ollama service.
 * @param {string} model - The name of the model to use for embeddings.
 * @returns {OllamaEmbeddings} An instance of OllamaEmbeddings.
 */
const ollamaEmbeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
});


/**
 * Creates a new instance of Ollama with the specified base URL, model, temperature, and top-k.
 * @param {string} baseUrl - The base URL of the Ollama service.
 * @param {string} model - The name of the model to use for the LLM.
 * @param {number} temperature - The temperature value to use for sampling.
 * @param {number} topK - The number of top tokens to consider for sampling.
 * @returns {Ollama} An instance of Ollama.
 */
const ollamaLlm = new Ollama({
    model: "gemma:2b-instruct-q5_0",
    temperature: 0.2,
    topK: 5,
    topP: 0.1,
});

/**
 * Retrieves an instance of the vector store from an existing Chroma collection.
 * @param {OllamaEmbeddings} embeddings - The embeddings object to use for the vector store.
 * @param {Object} options - An object containing options for the vector store.
 * @param {string} options.collectionName - The name of the Chroma collection.
 * @returns {Promise<Chroma>} A Promise that resolves to an instance of Chroma.
 */
const vectorStore = await Chroma.fromExistingCollection(
    ollamaEmbeddings,
    { collectionName: "myRag", },
);

const collectionId = vectorStore.collection.id
console.log("Collection ID:", collectionId)

// const chromaRetriever = vectorStore.asRetriever();
const chromaRetriever = vectorStore.asRetriever({ k: 5, searchType: cosineSimilarity }); // Other search types are euclideanDistance, SimilarityMetric, ElasticVectorSearch, cosineSimilarity

const prompt = ChatPromptTemplate.fromMessages([
    ["system", `Use the following pieces of context to answer the question at the end. Don't use your own knowledge base.
If you don't know the answer, just say that you don't know, don't try to make up an answer. Also, dont give information about the context if it does not match with the question and replace 'context' with 'document' in your answer.
----------------
{context}`],
    ["human", "{input}"],
]);

// Define the document chain
const combineDocsChain = await createStuffDocumentsChain({
    llm: ollamaLlm,
    prompt: prompt,
}
);

// Define the retrieval chain
const retrievalChain = await createRetrievalChain({
    retriever: chromaRetriever,
    combineDocsChain: combineDocsChain,
}); // Context can also be passed possibly in this chain along with inputs and chat history.

const input = "What is the top speed of Tata Nexon? Also which one is better among Nexon, Nano, and Punch, and why?";

const response = await retrievalChain.invoke({ input: input });
console.log(response.context);
console.log(response.answer);