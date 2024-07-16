'use strict';
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse-fork');

const projectDirectory = path.resolve(__dirname);
const pdfDir = path.join(projectDirectory, '../pdf_files');
const extDir = path.join(projectDirectory, '../extracted_text');

/**
 * Extracts text from a PDF file.
 * @param {string} pdfPath - The path to the PDF file.
 * @returns {Promise<string>} The extracted text from the PDF file.
 */
async function textExtraction(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text;
}

/**
 * Reads all PDF files in a directory, extracts their text, and saves it into a single text file.
 * @param {string} pdfDir - The path to the directory containing the PDF files.
 * @param {string} extDir - The path to the directory where the combined text file will be saved.
 */
async function processPDFs(pdfDir, extDir) {
    try {
        const files = fs.readdirSync(pdfDir);
        let combinedText = '';

        for (const filename of files) {
            if (filename.endsWith('.pdf')) {
                const pdfPath = path.join(pdfDir, filename);
                try {
                    const text = await textExtraction(pdfPath);
                    combinedText += `File: ${filename}\n${text}\n`;
                    console.log(`Extracted text from ${filename}`);
                } catch (error) {
                    console.error(`Error processing ${filename}:`, error);
                }
            }
        }

        const txtFilePath = path.join(extDir, 'combined_text.txt');
        fs.writeFileSync(txtFilePath, combinedText);
        console.log(`Saved combined extracted text to ${txtFilePath}`);
        return txtFilePath;
    } catch (error) {
        console.error('Error reading directory:', error);
    }
}

// Run the process
processPDFs(pdfDir, extDir);
