// client/src/context/FlowContext.js
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/flowapi";

const FlowContext = createContext();

export const FlowProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null); // Track selected node
  const [selectedEdge, setSelectedEdge] = useState(null); // Track selected edge
  const navigate = useNavigate();

  // Core Flow Functions
  const saveFlow = async (flowName, flowDescription) => {
    try {
      const flowData = {
        name: flowName,
        description: flowDescription,
        nodes,
        edges,
      };

      if (selectedFlow) {
        await api.updateFlow(selectedFlow._id, flowData);
      } else {
        await api.createFlow(flowData);
      }

      navigate("/flows");
    } catch (error) {
      console.error("Error saving flow:", error);
      throw error; // Re-throw to handle in components
    }
  };

  const loadFlow = async (flowId) => {
    try {
      const flow = await api.getFlow(flowId);
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      setSelectedFlow(flow);
      setSelectedNode(null);
      setSelectedEdge(null);
    } catch (error) {
      console.error("Error loading flow:", error);
      throw error;
    }
  };

  const resetFlow = () => {
    setNodes([]);
    setEdges([]);
    setSelectedFlow(null);
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  // Node Operations
  const addNode = (node) => {
    setNodes((nds) => [...nds, node]);
  };

  const deleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    // Remove connected edges
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const updateNode = (nodeId, updates) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, ...updates };
        }
        return node;
      })
    );
    if (selectedNode?.id === nodeId) {
      setSelectedNode({ ...selectedNode, ...updates });
    }
  };

  const duplicateNode = (nodeId) => {
    const nodeToDuplicate = nodes.find((node) => node.id === nodeId);
    if (!nodeToDuplicate) return;

    const newNode = {
      ...nodeToDuplicate,
      id: `${nodeToDuplicate.id}-copy-${Date.now()}`,
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50,
      },
    };

    addNode(newNode);
    return newNode; // Return the new node for further operations
  };

  // Edge Operations
  const addEdge = (edge) => {
    setEdges((eds) => [...eds, edge]);
  };

  const deleteEdge = (edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    if (selectedEdge?.id === edgeId) {
      setSelectedEdge(null);
    }
  };

  const updateEdge = (edgeId, updates) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return { ...edge, ...updates };
        }
        return edge;
      })
    );
    if (selectedEdge?.id === edgeId) {
      setSelectedEdge({ ...selectedEdge, ...updates });
    }
  };

  return (
    <FlowContext.Provider
      value={{
        // State
        nodes,
        edges,
        selectedFlow,
        selectedNode,
        selectedEdge,
        
        // Setters
        setNodes,
        setEdges,
        setSelectedNode,
        setSelectedEdge,
        
        // Flow operations
        saveFlow,
        loadFlow,
        resetFlow,
        
        // Node operations
        addNode,
        deleteNode,
        updateNode,
        duplicateNode,
        
        // Edge operations
        addEdge,
        deleteEdge,
        updateEdge,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
};