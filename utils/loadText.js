'use strict';
import path from 'path';
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

/**
 * Initializes an instance of the OllamaEmbeddings with the specified model configuration.
 * @returns {OllamaEmbeddings} An instance of OllamaEmbeddings.
 */
function initializeOllamaEmbeddings() {
    return new OllamaEmbeddings({
        model: "nomic-embed-text"
    });
}

/**
 * Dynamically constructs the full path to a text file based on a relative path and loads the document.
 * @param {string} relativePath - The relative path from the current working directory to the text file.
 * @returns {Promise<Document[]>} A promise that resolves to an array of Document objects loaded from the text file.
 */
async function loadDocuments(relativePath) {
    // Resolves the full path to the file from the relative path provided.
    const basePath = path.resolve();  // Retrieves the current working directory.
    const filePath = path.join(basePath, relativePath);  // Joins the base path with the relative path to form a full path.
    const loader = new TextLoader(filePath);
    return loader.load();
}

/**
 * Creates an instance of RecursiveCharacterTextSplitter with predefined options for splitting text into manageable chunks.
 * @returns {RecursiveCharacterTextSplitter} An instance of RecursiveCharacterTextSplitter.
 */
function createTextSplitter() {
    return new RecursiveCharacterTextSplitter({
        chunkSize: 1000,  // Maximum length of each text chunk.
        separators: ['\n\n', '\n', ' ', ''],  // Separators to use for splitting the text.
        chunkOverlap: 100  // Number of characters to overlap between chunks to maintain context.
    });
}

// Define the relative path to the text file.
const relativePath = "extracted_text/combined_text.txt";

// Async function to orchestrate the loading, splitting, and vectorization of documents.
async function processDocuments() {
    const ollamaEmbeddings = initializeOllamaEmbeddings();
    const docs = await loadDocuments(relativePath);
    const splitter = createTextSplitter();
    const splitDocuments = await splitter.splitDocuments(docs);

    // Creates a Chroma vector store from the split documents using the OllamaEmbeddings instance.
    return Chroma.fromDocuments(splitDocuments, ollamaEmbeddings, {
        collectionName: "myRag"
    });
}

// Exporting the vector store after processing the documents.
export const vectorStore = processDocuments();
