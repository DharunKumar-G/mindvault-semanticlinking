import { useState, useEffect, useCallback, useRef } from 'react';
import { Network, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import { notesApi } from '../services/api';

export default function GraphView() {
  const [isOpen, setIsOpen] = useState(false);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const graphRef = useRef();

  useEffect(() => {
    if (isOpen) {
      loadGraphData();
    }
  }, [isOpen]);

  const loadGraphData = async () => {
    try {
      setLoading(true);
      const notes = await notesApi.getAll();
      
      // Create nodes from notes
      const nodes = notes.map(note => ({
        id: note.id,
        name: note.title,
        val: 10 + (note.content.length / 100), // Node size based on content length
        color: getColorForTags(note.tags),
        tags: note.tags || []
      }));

      // Create links based on related notes
      const links = [];
      const linkPromises = notes.map(async note => {
        try {
          const related = await notesApi.getRelated(note.id, 3);
          return related.map(rel => ({
            source: note.id,
            target: rel.id,
            value: rel.score * 5 // Link thickness based on similarity
          }));
        } catch {
          return [];
        }
      });

      const allLinks = (await Promise.all(linkPromises)).flat();
      
      // Remove duplicate links
      const uniqueLinks = [];
      const seen = new Set();
      allLinks.forEach(link => {
        const key = `${Math.min(link.source, link.target)}-${Math.max(link.source, link.target)}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueLinks.push(link);
        }
      });

      setGraphData({ nodes, links: uniqueLinks });
    } catch (error) {
      console.error('Error loading graph data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getColorForTags = (tags) => {
    if (!tags || tags.length === 0) return '#94a3b8';
    
    const tagColorMap = {
      'Work': '#3b82f6',
      'Personal': '#a855f7',
      'Learning': '#10b981',
      'Ideas': '#f59e0b',
      'Goals': '#ef4444',
      'Travel': '#06b6d4',
      'Health': '#84cc16',
      'Finance': '#14b8a6',
      'Technology': '#6366f1'
    };
    
    return tagColorMap[tags[0]] || '#7c3aed';
  };

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    // Center on node
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2, 1000);
    }
  }, []);

  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 1.5, 500);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() / 1.5, 500);
    }
  };

  const handleFitView = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 50);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all z-40 hover:scale-110"
        title="Graph view"
      >
        <Network className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Network className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Knowledge Graph</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {graphData.nodes.length} notes, {graphData.links.length} connections
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={handleFitView}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Fit view"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setSelectedNode(null);
              }}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Graph */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Building graph...</p>
              </div>
            </div>
          ) : (
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeLabel="name"
              nodeColor="color"
              nodeVal="val"
              linkWidth={link => link.value || 1}
              linkColor={() => 'rgba(100, 116, 139, 0.3)'}
              onNodeClick={handleNodeClick}
              nodeCanvasObjectMode={() => 'after'}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, node.x, node.y + 15 / globalScale);
              }}
              cooldownTicks={100}
              onEngineStop={() => handleFitView()}
            />
          )}
        </div>

        {/* Node Info Panel */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border border-slate-200 dark:border-slate-700 max-w-md">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{selectedNode.name}</h3>
            {selectedNode.tags && selectedNode.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {selectedNode.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <a
                href={`/note/${selectedNode.id}`}
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center text-sm"
              >
                View Note
              </a>
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-20 left-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-3 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Legend</p>
          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <span>Notes (size = content length)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-slate-400"></div>
              <span>Semantic connections</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
