
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// The pdf.js worker was failing to load from a CDN. We now import it directly
// from the installed package. Vite's `?url` suffix provides a stable URL to the worker file.
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          throw new Error('Could not read file.');
        }

        if (file.type === 'application/pdf') {
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const numPages = pdf.numPages;
          const textPromises = [];

          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            textPromises.push(page.getTextContent());
          }

          const textContents = await Promise.all(textPromises);
          const fullText = textContents
            .map(content =>
              content.items
                .map(item => ('str' in item ? item.str : ''))
                .join(' ')
            )
            .join('\n');
            
          resolve(fullText);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } else {
          // Plain text
          const decoder = new TextDecoder();
          resolve(decoder.decode(arrayBuffer));
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        reject('Failed to parse file. Please ensure it is a valid PDF, DOCX, or TXT file.');
      }
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject('Error reading file.');
    };

    reader.readAsArrayBuffer(file);
  });
};
