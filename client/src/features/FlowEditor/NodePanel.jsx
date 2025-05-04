import React from 'react';

const nodeTypes = [
  { type: 'input', label: 'Input Node' },
  { type: 'default', label: 'Default Node' },
  { type: 'output', label: 'Output Node' },
  // Add more custom node types as needed
];

const NodePanel = () => {
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('text/plain', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-48 p-2 bg-gray-100 border-r border-gray-300">
      <h3 className="text-lg font-semibold mb-2">Nodes</h3>
      <div className="space-y-2">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="p-2 bg-white border border-gray-300 rounded cursor-grab hover:bg-gray-50"
            draggable
            onDragStart={(event) => onDragStart(event, node.type, node.label)}
          >
            {node.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodePanel;