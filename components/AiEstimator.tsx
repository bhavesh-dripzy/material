import React from 'react';

interface AiEstimatorProps {
  query: string;
  onQueryChange: (val: string) => void;
  onEstimate: () => void;
  response: string | null;
  isLoading: boolean;
}

const AiEstimator: React.FC<AiEstimatorProps> = ({ query, onQueryChange, onEstimate, response, isLoading }) => {
  return (
    <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-3 shadow-sm">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-[9px]">AI</div>
        <h4 className="text-[11px] font-black text-blue-900 uppercase">Construction Estimator</h4>
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Bricks for 10ft wall?"
          className="flex-grow bg-white border border-blue-200 rounded-lg px-3 py-2 text-[11px] focus:outline-none"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onEstimate()}
        />
        <button 
          onClick={onEstimate} 
          disabled={isLoading}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-[10px] font-black active:scale-95 disabled:opacity-50"
        >
          {isLoading ? '...' : 'ASK'}
        </button>
      </div>
      {response && (
        <div className="mt-2 p-2 bg-white border border-blue-50 rounded-lg text-[10px] text-gray-700 leading-tight font-medium animate-in fade-in slide-in-from-top-1">
          {response}
        </div>
      )}
    </div>
  );
};

export default AiEstimator;