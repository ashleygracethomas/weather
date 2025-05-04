import React from "react";
import FlowCanvas from "../FlowEditor/FlowCanvas";
import NodePanel from "../FlowEditor/NodePanel";
import Toolbar from "../FlowEditor/Toolbar";
import NodeEditorPanel from '../flowbuilder/NodeEditorPanel';

const FlowPage = () => {
  return (
    <div className="flow-editor-container">
      <Toolbar />
      <div className="editor-content">
        <NodePanel />
        <div className="flow-canvas-container">
          <FlowCanvas />
        </div>
        <NodeEditorPanel />

      </div>
    </div>
  );
};

export default FlowPage;
