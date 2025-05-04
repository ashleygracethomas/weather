// src/features/flowbuilder/components/NodeEditorPanel.jsx
import { useState, useEffect } from 'react';
import { useFlow } from '../../context/FlowContext';

const NodeEditorPanel = () => {
  const { selectedNode, updateNode, duplicateNode, deleteNode } = useFlow();
  const [nodeData, setNodeData] = useState({});

  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data || {});
    }
  }, [selectedNode]);

  const handleUpdate = () => {
    if (selectedNode) {
      updateNode(selectedNode.id, nodeData);
    }
  };

  if (!selectedNode) {
    return (
      <div className="p-4 bg-white border-l border-gray-300 w-64">
        <p className="text-gray-500">Select a node to edit</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border-l border-gray-300 w-64">
      <h3 className="font-bold mb-4">Edit Node</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Label</label>
          <input
            type="text"
            value={nodeData.label || ''}
            onChange={(e) => setNodeData({ ...nodeData, label: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Add more editable fields as needed */}

        <div className="flex space-x-2">
          <button
            onClick={handleUpdate}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update
          </button>
          <button
            onClick={() => duplicateNode(selectedNode.id)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Duplicate
          </button>
          <button
            onClick={() => deleteNode(selectedNode.id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeEditorPanel;