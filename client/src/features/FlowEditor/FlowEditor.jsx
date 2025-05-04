import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom Node Components
const WeatherNode = ({ data, selected }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-yellow-400' : 'border-blue-400'}`}>
    <div className="flex">
      <div className="ml-2">
        <div className="text-lg font-bold">{data.label}</div>
        {data.weatherType && (
          <div className="text-xs text-gray-500">Type: {data.weatherType}</div>
        )}
      </div>
    </div>
  </div>
);

const TemperatureNode = ({ data, selected }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-yellow-400' : 'border-red-400'}`}>
    <div className="flex items-center">
      <span className="mr-2 text-xl">🌡️</span>
      <div>
        <div className="text-lg font-bold">{data.label}</div>
        <div className="text-xs text-gray-500">Temperature Node</div>
      </div>
    </div>
  </div>
);

const RainfallNode = ({ data, selected }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-yellow-400' : 'border-blue-600'}`}>
    <div className="flex items-center">
      <span className="mr-2 text-xl">🌧️</span>
      <div>
        <div className="text-lg font-bold">{data.label}</div>
        <div className="text-xs text-gray-500">Rainfall Node</div>
      </div>
    </div>
  </div>
);

const HumidityNode = ({ data, selected }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-yellow-400' : 'border-green-400'}`}>
    <div className="flex items-center">
      <span className="mr-2 text-xl">💧</span>
      <div>
        <div className="text-lg font-bold">{data.label}</div>
        <div className="text-xs text-gray-500">Humidity Node</div>
      </div>
    </div>
  </div>
);

const WindNode = ({ data, selected }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${selected ? 'border-yellow-400' : 'border-gray-400'}`}>
    <div className="flex items-center">
      <span className="mr-2 text-xl">🌬️</span>
      <div>
        <div className="text-lg font-bold">{data.label}</div>
        <div className="text-xs text-gray-500">Wind Node</div>
      </div>
    </div>
  </div>
);

const nodeTypes = {
  weather: WeatherNode,
  temperature: TemperatureNode,
  rainfall: RainfallNode,
  humidity: HumidityNode,
  wind: WindNode
};

const FlowEditor = ({ weatherType = 'general' }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [savedFlows, setSavedFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved flows for this weather type
  useEffect(() => {
    const loadFlows = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/flow/load/${weatherType}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to load flows');
        }
        
        setSavedFlows(result.data);
      } catch (err) {
        console.error('Error loading flows:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFlows();
  }, [weatherType]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(
      { ...params, markerEnd: { type: MarkerType.ArrowClosed } }, 
      eds
    )),
    []
  );

  const onNodesDelete = useCallback((deletedNodes) => {
    if (selectedFlow) {
      // If a flow is selected, delete from backend
      deletedNodes.forEach(node => {
        fetch(`/api/flow/${selectedFlow._id}/delete-node/${node.id}`, {
          method: 'PUT'
        })
        .then(response => response.json())
        .then(result => {
          if (!result.success) {
            throw new Error(result.error);
          }
          // Refresh the flow after deletion
          return fetch(`/api/flow/${selectedFlow._id}`);
        })
        .then(response => response.json())
        .then(result => {
          if (!result.success) {
            throw new Error(result.error);
          }
          setNodes(result.data.nodes);
          setEdges(result.data.edges);
        })
        .catch(err => {
          console.error('Error deleting node:', err);
          setError(err.message);
        });
      });
    } else {
      // If no flow selected, just delete locally
      setNodes((nds) => nds.filter((n) => !deletedNodes.some((dn) => dn.id === n.id)));
      setEdges((eds) => eds.filter(
        (edge) => !deletedNodes.some(
          node => edge.source === node.id || edge.target === node.id
        )
      ));
    }
  }, [selectedFlow]);

  const onSave = async () => {
    if (!flowName) {
      setError('Please enter a flow name');
      return;
    }
    if (nodes.length === 0) {
      setError('Please add at least one node');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/flow/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: flowName,
          description: flowDescription,
          nodes,
          edges,
          weatherType
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save flow');
      }
      
      setSavedFlows(prev => [result.data, ...prev]);
      setFlowName('');
      setFlowDescription('');
      setSelectedFlow(null);
    } catch (err) {
      console.error('Error saving flow:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdate = async () => {
    if (!selectedFlow) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/flow/update/${selectedFlow._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: flowName,
          description: flowDescription,
          nodes, 
          edges 
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update flow');
      }
      
      setSavedFlows(prev => 
        prev.map(flow => 
          flow._id === result.data._id ? result.data : flow
        )
      );
    } catch (err) {
      console.error('Error updating flow:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onLoad = (flow) => {
    setNodes(flow.nodes);
    setEdges(flow.edges);
    setSelectedFlow(flow);
    setFlowName(flow.name);
    setFlowDescription(flow.description || '');
    setError(null);
  };

  const onDelete = async () => {
    if (!selectedFlow) return;
    
    if (window.confirm('Are you sure you want to delete this flow?')) {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:5000/api/flow/delete/${selectedFlow._id}`, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to delete flow');
        }
        
        setSavedFlows(prev => prev.filter(flow => flow._id !== selectedFlow._id));
        setNodes([]);
        setEdges([]);
        setFlowName('');
        setFlowDescription('');
        setSelectedFlow(null);
      } catch (err) {
        console.error('Error deleting flow:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onAddNode = (type) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { 
        x: Math.random() * 500, 
        y: Math.random() * 500 
      },
      data: { 
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        weatherType 
      }
    };
    
    setNodes((nds) => [...nds, newNode]);
  };

  const onClear = () => {
    setNodes([]);
    setEdges([]);
    setFlowName('');
    setFlowDescription('');
    setSelectedFlow(null);
    setError(null);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
        
        {/* Top Left Panel - Node Controls */}
        <Panel position="top-left" className="bg-white p-4 rounded shadow-md space-y-2">
          <h3 className="font-bold">Weather Flow: {weatherType}</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => onAddNode('temperature')}
              className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
            >
              Add Temp Node
            </button>
            <button 
              onClick={() => onAddNode('rainfall')}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              Add Rain Node
            </button>
            <button 
              onClick={() => onAddNode('humidity')}
              className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
            >
              Add Humidity Node
            </button>
            <button 
              onClick={() => onAddNode('wind')}
              className="px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            >
              Add Wind Node
            </button>
            <button 
              onClick={() => onAddNode('weather')}
              className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
            >
              Add Generic Node
            </button>
          </div>
        </Panel>
        
        {/* Top Right Panel - Flow Controls */}
        <Panel position="top-right" className="bg-white p-4 rounded shadow-md space-y-3 w-72">
          <div>
            <label className="block text-sm font-medium">Flow Name*</label>
            <input
              type="text"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="w-full p-1 border rounded"
              placeholder="Enter flow name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={flowDescription}
              onChange={(e) => setFlowDescription(e.target.value)}
              className="w-full p-1 border rounded"
              rows={2}
              placeholder="Optional description"
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onSave}
              disabled={!flowName || nodes.length === 0 || isLoading}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 flex-1"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            {selectedFlow && (
              <>
                <button
                  onClick={onUpdate}
                  disabled={isLoading}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 flex-1"
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={onDelete}
                  disabled={isLoading}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 flex-1"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
            <button
              onClick={onClear}
              disabled={nodes.length === 0 || isLoading}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 flex-1"
            >
              Clear
            </button>
          </div>
        </Panel>
        
        {/* Bottom Left Panel - Saved Flows */}
        <Panel position="bottom-left" className="bg-white p-4 rounded shadow-md max-h-60 overflow-y-auto w-72">
          <h4 className="font-bold mb-2">Saved Flows</h4>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : savedFlows.length === 0 ? (
            <p className="text-sm text-gray-500">No saved flows yet</p>
          ) : (
            <ul className="space-y-2">
              {savedFlows.map((flow) => (
                <li key={flow._id} className="border-b pb-2">
                  <button
                    onClick={() => onLoad(flow)}
                    className={`text-left w-full p-1 rounded ${selectedFlow?._id === flow._id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  >
                    <div className="font-medium truncate">{flow.name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(flow.updatedAt).toLocaleDateString()} - {flow.nodes.length} nodes
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FlowEditor;