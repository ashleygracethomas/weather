import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlow } from '../../context/FlowContext';

const nodeTypes = {
  // Add any custom node types here
};

const FlowCanvas = () => {
  const {
    nodes: contextNodes,
    setNodes: setContextNodes,
    edges: contextEdges,
    setEdges: setContextEdges,
    deleteNode,
    updateNode,
    selectedNode,
    setSelectedNode,
  } = useFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(contextNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(contextEdges);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const newEdges = addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: { strokeWidth: 2 },
          },
          eds
        );
        setContextEdges(newEdges);
        return newEdges;
      });
    },
    [setEdges, setContextEdges]
  );

  const onNodesChangeWrapper = useCallback(
    (changes) => {
      onNodesChange(changes);
      setContextNodes(nodes);
    },
    [nodes, onNodesChange, setContextNodes]
  );

  const onEdgesChangeWrapper = useCallback(
    (changes) => {
      onEdgesChange(changes);
      setContextEdges(edges);
    },
    [edges, onEdgesChange, setContextEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('text/plain');

      const position = {
        x: event.clientX,
        y: event.clientY,
      };

      const newNode = {
        id: `${Date.now()}`,
        type,
        position,
        data: { label },
      };

      setNodes((nds) => {
        const newNodes = nds.concat(newNode);
        setContextNodes(newNodes);
        return newNodes;
      });
    },
    [setNodes, setContextNodes]
  );

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  // Handle delete key
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Delete' && selectedNode) {
        deleteNode(selectedNode.id);
        setSelectedNode(null);
      }
    },
    [selectedNode, deleteNode, setSelectedNode]
  );

  // Set up global key listener
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div className="w-full h-full" tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeWrapper}
        onEdgesChange={onEdgesChangeWrapper}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
