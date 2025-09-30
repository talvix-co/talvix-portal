import mammoth from "mammoth";
import pdfToText from "react-pdftotext";

export const extractTextFromDocx = async (file: File): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export const extractTextFromPDF = async (file: File): Promise<string> => {
  return await pdfToText(file);
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  if (file.type === "application/pdf") {
    return await extractTextFromPDF(file);
  } else {
    return await extractTextFromDocx(file);
  }
};