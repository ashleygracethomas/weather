import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';

let nodeId = 1;

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [savedFlows, setSavedFlows] = useState([]);
  const [flowName, setFlowName] = useState('');
  const [flowId, setFlowId] = useState(null); // 👈 track current flow

  const addNode = () => {
    const id = `${Date.now()}`;
    const newNode = {
      id,
      type: 'default',
      position: { x: Math.random() * 800, y: Math.random() * 600 },
      data: {
        label: (
          <input
            style={{ padding: '2px' }}
            defaultValue={`Node ${nodeId++}`}
            onChange={(e) => onNodeLabelChange(id, e.target.value)}
          />
        )
      }
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const onNodeLabelChange = (id, label) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label } } : node
      )
    );
  };

  const deleteNode = (id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  const clearFlow = () => {
    setNodes([]);
    setEdges([]);
    setFlowName('');
    setFlowId(null);
  };

  const saveFlow = async () => {
    if (!flowName.trim()) return alert('Enter a flow name');
    const payload = { name: flowName, nodes, edges };

    if (flowId) {
      await axios.put(`http://localhost:5000/api/flow/${flowId}`, payload);
    } else {
      await axios.post('http://localhost:5000/api/flow/save', payload);
    }

    setFlowName('');
    setFlowId(null);
    fetchSavedFlows();
  };

  const loadFlow = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/flow/${id}`);
    setNodes(res.data.nodes);
    setEdges(res.data.edges);
    setFlowName(res.data.name);
    setFlowId(res.data._id);
  };

  const deleteFlow = async (id) => {
    await axios.delete(`http://localhost:5000/api/flow/${id}`);
    fetchSavedFlows();
    if (flowId === id) clearFlow();
  };

  const fetchSavedFlows = async () => {
    const res = await axios.get('http://localhost:5000/api/flow/list');
    setSavedFlows(res.data);
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  useEffect(() => {
    fetchSavedFlows();
  }, []);

  return (
    <div style={{ height: '100vh', padding: '10px' }}>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={addNode}>+ Add Node</button>
        <input
          type="text"
          placeholder="Flow Name"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
        />
        <button onClick={saveFlow}>💾 Save Flow</button>
        <button onClick={clearFlow}>🗑️ Clear Flow</button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <h3>Saved Flows</h3>
        {savedFlows.map((flow) => (
          <div key={flow._id}>
            <button onClick={() => loadFlow(flow._id)}>{flow.name}</button>
            <button onClick={() => deleteFlow(flow._id)}>❌ Delete</button>
          </div>
        ))}
      </div>

      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            label: (
              <div>
                <input
                  defaultValue={typeof node.data.label === 'string' ? node.data.label : ''}
                  onChange={(e) => onNodeLabelChange(node.id, e.target.value)}
                />
                <button onClick={() => deleteNode(node.id)}>🗑️</button>
              </div>
            )
          }
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}