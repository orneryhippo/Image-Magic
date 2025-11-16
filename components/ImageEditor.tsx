import React, { useState, useCallback } from 'react';
import type { ImageData } from '../types';
import { editImage } from '../services/geminiService';
import ImageUpload from './ImageUpload';
import SparklesIcon from './icons/SparklesIcon';

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((imageData: ImageData) => {
    setImage(imageData);
    setGeneratedImage(null);
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!image || !prompt.trim()) {
      setError("Please upload an image and enter a prompt.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await editImage(image, prompt);
      setGeneratedImage(`data:image/jpeg;base64,${resultBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [image, prompt]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-200">1. Upload your Image</h2>
          <ImageUpload
            onImageUpload={handleImageUpload}
            title="Click or Drag & Drop Image"
            description="to start editing"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-200">2. Describe your Edit</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Add a retro filter, make it look like a watercolor painting, remove the person in the background..."
            className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            disabled={!image || isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={!image || !prompt.trim() || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                Apply Edit
              </>
            )}
          </button>
        </div>
      </div>

      {error && <div className="text-center text-red-400 p-3 bg-red-900/50 rounded-lg">{error}</div>}

      {(image || generatedImage) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2 text-center">Original</h3>
            {image && <img src={URL.createObjectURL(image.file)} alt="Original" className="w-full h-auto object-contain rounded-lg shadow-lg bg-gray-800" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2 text-center">Result</h3>
            <div className="w-full h-full min-h-[200px] bg-gray-800 rounded-lg shadow-lg flex items-center justify-center">
              {generatedImage && <img src={generatedImage} alt="Generated" className="w-full h-auto object-contain rounded-lg" />}
              {isLoading && <p className="text-gray-400">Generating image...</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
