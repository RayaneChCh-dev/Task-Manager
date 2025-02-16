import { JSONRPCClient } from 'json-rpc-2.0';

const API_BASE_URL = 'http://localhost:8080';

const rpcClient = new JSONRPCClient((jsonRPCRequest) =>
  fetch(`${API_BASE_URL}/rpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonRPCRequest),
  }).then((response) => {
    if (!response.ok) throw new Error('RPC call failed');
    if (response.status === 204) return null; // No content
    return response.json();
  })
);

// RPC functions that the frontend will call
export const rpc = {
    toggleTask: (id: number): Promise<any> => Promise.resolve(rpcClient.request('toggleTask', { id })), // Toggle task completion
    getTaskStats: (): Promise<{ total: number; completed: number; pending: number }> =>
        rpcClient.request('getTaskStats', []) as Promise<{ total: number; completed: number; pending: number }>,
};

export default rpcClient;
