'use client';
import { useState } from 'react';

// Add this new component at the top of the file
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
        </svg>
      )}
    </button>
  );
};

interface EnhancedOutput {
  enhancedPrompt: string;
  originalPrompt: string;
  instagramCaption: string;
  tags: string[];
  musicRecommendation: {
    songTitle: string;
    artist: string;
  };
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [enhancedOutput, setEnhancedOutput] = useState<EnhancedOutput | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleEnhancePrompt = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setEnhancedOutput(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log({ enhancedOutput });

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-3xl space-y-8 backdrop-blur-sm bg-white/30 p-8 rounded-2xl shadow-xl">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Prompt Enhancer
        </h1>

        <div className="space-y-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white/50 backdrop-blur-sm shadow-inner transition-all"
          />

          <button
            onClick={handleEnhancePrompt}
            disabled={loading || !prompt}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? 'Enhancing...' : 'Enhance Prompt'}
          </button>
        </div>
        {enhancedOutput && (
          <div className="space-y-6">
            <div className="p-8 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Original Prompt</h2>
                <CopyButton text={enhancedOutput.originalPrompt} />
              </div>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {enhancedOutput.originalPrompt}
              </p>
            </div>

            <div className="p-8 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Enhanced Prompt
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {enhancedOutput.enhancedPrompt}
              </p>
            </div>

            <div className="p-8 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Instagram Caption
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {enhancedOutput.instagramCaption}
              </p>
            </div>

            <div className="p-8 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Suggested Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {enhancedOutput.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-8 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Music Recommendation
              </h2>
              <p className="text-gray-700">
                <span className="font-medium">Song:</span>{' '}
                {enhancedOutput.musicRecommendation?.songTitle}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Artist:</span>{' '}
                {enhancedOutput.musicRecommendation?.artist}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
