import { useState } from 'react';
import { useCalculationTree } from '../api/hooks';
import type { CalculationNode } from '../types/calculation';
import { useAuth } from '../context/AuthContext';
import { RespondForm } from './RespondForm';

const formatTimestamp = (value: string) => new Date(value).toLocaleString();

const NodeCard = ({ node, depth }: { node: CalculationNode; depth: number }) => {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className="node" style={{ marginLeft: depth * 16 }}>
      <div className="node-header">
        <div>
          <strong>{node.operation === 'START' ? 'Start' : node.operation}</strong>
          <span> · Result: {node.result}</span>
          {node.operand !== null && <span> · Operand: {node.operand}</span>}
        </div>
        <small>
          by {node.author.username} on {formatTimestamp(node.createdAt)}
        </small>
      </div>
      {user && (
        <button className="btn tiny" type="button" onClick={() => setIsReplying((prev) => !prev)}>
          {isReplying ? 'Close' : 'Reply'}
        </button>
      )}
      {isReplying && <RespondForm calculationId={node.id} onClose={() => setIsReplying(false)} />}
      {node.children.length > 0 && (
        <div className="node-children">
          {node.children.map((child) => (
            <NodeCard key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const CalculationTree = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useCalculationTree();

  if (isLoading) {
    return <p>Loading calculation tree…</p>;
  }

  if (isError) {
    return (
      <div className="card">
        <p className="error-text">{error instanceof Error ? error.message : 'Failed to load tree'}</p>
        <button className="btn" type="button" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p>No discussions yet. Be the first to start one!</p>;
  }

  return (
    <div>
      <div className="tree-header">
        <h2>Calculation Tree</h2>
        <button className="btn" type="button" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      <div className="tree">
        {data.map((node) => (
          <NodeCard key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
};
