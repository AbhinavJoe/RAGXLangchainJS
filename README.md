# RAGxLangChainJS

This project is a JavaScript-based implementation using the innovative Retrieval-Augmented Generation (RAG) architecture through LangChainJS. This system effectively combines a document retriever and a response generator to handle complex queries with high accuracy. The "Retriever" component acts like a precision search tool within a document corpus, extracting the most relevant information based on user queries. Following retrieval, the "Generator" synthesizes this information into coherent and contextually relevant responses. This dual-component approach is ideal for tasks that require deep content synthesis and understanding, such as generating detailed summaries or answering multifaceted questions from a broad array of document sources. This application handles numerous documents and complex queries with ease, making it a valuable tool for researchers, content creators, and data analysts.

https://github.com/user-attachments/assets/e505d8d5-4719-454d-a025-41ac74f3ad9a

## Features

- **Dynamic Text Retrieval**: Efficiently retrieves text data from a pool of documents based on query relevance.
- **Advanced Text Processing**: Utilizes advanced NLP techniques for text parsing, segmentation, and embedding.
- **Contextual Response Generation**: Generates responses that are context-aware, ensuring high relevance and accuracy.

## Pre-requisites

- The project uses Ollama with LangChainJS, so make sure you have Ollama installed. After installing, run

    ```
    $ ollama pull gemma:2b-instruct-q5_0
    $ ollama pull nomic-embed-text
    ```
    in powershell.

- The project also uses ChromaDB as the database for vector storage, so download and install Docker from https://www.docker.com/ and run

  ```
  $ docker pull chromadb/chroma
  $ docker run -p 8000:8000 chromadb/chroma
  ```

  in powershell to pull a chromaDB image and initiate a chromaDB container. The embeddings will be created and stored inside the chromaDB container that is created in docker.

## Installation

- Clone the repository using `git clone`.

- After cloning, go the root directory and run `npm install` in the terminal for installing the packages.

- After the packages are successfully installed, run `npm start` in the terminal. You'll get an error the first time, then run `npm start` again for the code to work.

## Contributing

Contributions to the project are welcome! Please create Pull Requests, or submit issues to suggest changes to the repository, or report bugs.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
