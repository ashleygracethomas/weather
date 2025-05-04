// client/src/components/FlowEditor/Toolbar.jsx
import React, { useState } from 'react';
import { useFlow } from '../../context/FlowContext';
import { useNavigate } from 'react-router-dom';

const Toolbar = () => {
  const { 
    saveFlow, 
    resetFlow, 
    selectedFlow 
  } = useFlow(); // Now properly destructured from context
  
  const [flowName, setFlowName] = useState(selectedFlow?.name || '');
  const [flowDescription, setFlowDescription] = useState(selectedFlow?.description || '');
  const navigate = useNavigate();

  const handleSave = () => {
    if (!saveFlow) {
      console.error('saveFlow is undefined');
      return;
    }
    saveFlow(flowName, flowDescription);
  };

  return (
    <div className="flex justify-between items-center p-2 bg-gray-100 border-b border-gray-300">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Flow name"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={flowDescription}
          onChange={(e) => setFlowDescription(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded"
        />
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={handleSave}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button 
          onClick={resetFlow}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          New
        </button>
        <button 
          onClick={() => navigate('/flows')}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default Toolbar;