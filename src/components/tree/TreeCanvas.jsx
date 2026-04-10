import { useCallback, useEffect, useRef } from 'react'
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import PersonCard from './PersonCard'
import useStore from '../../store/useStore'
import { getAuthenticatedClient } from '../../lib/supabaseClient'
import { useAuth } from '@clerk/clerk-react'
import { debounce } from './debounce'

const nodeTypes = { personCard: PersonCard }

function membersToNodes(members, callbacks) {
  return members.map((m) => ({
    id: m.id,
    type: 'personCard',
    position: { x: m.position_x ?? 0, y: m.position_y ?? 0 },
    data: { member: m, ...callbacks },
  }))
}

function relationshipsToEdges(relationships) {
  return relationships.map((r) => ({
    id: r.id,
    source: r.from_member_id,
    target: r.to_member_id,
    type: 'smoothstep',
    style: r.type === 'partner'
      ? { stroke: '#9ca3af', strokeDasharray: '6 3', strokeWidth: 2 }
      : { stroke: '#2563eb', strokeWidth: 2 },
    markerEnd: r.type === 'child'
      ? { type: MarkerType.ArrowClosed, color: '#2563eb', width: 16, height: 16 }
      : undefined,
  }))
}

export default function TreeCanvas({ onEdit, onAddPartner, onAddChild, reactFlowRef }) {
  const members = useStore((s) => s.members)
  const relationships = useStore((s) => s.relationships)
  const removeMember = useStore((s) => s.removeMember)
  const removeRelationship = useStore((s) => s.removeRelationship)
  const showToast = useStore((s) => s.showToast)
  const activeTree = useStore((s) => s.activeTree)
  const { getToken } = useAuth()

  const callbacks = {
    onEdit,
    onAddPartner,
    onAddChild,
    onDelete: handleDelete,
  }

  const [nodes, setNodes, onNodesChange] = useNodesState(membersToNodes(members, callbacks))
  const [edges, setEdges, onEdgesChange] = useEdgesState(relationshipsToEdges(relationships))

  // Sync nodes/edges when store changes
  useEffect(() => {
    setNodes(membersToNodes(members, { onEdit, onAddPartner, onAddChild, onDelete: handleDelete }))
  }, [members]) // eslint-disable-line

  useEffect(() => {
    setEdges(relationshipsToEdges(relationships))
  }, [relationships]) // eslint-disable-line

  // Debounced position save
  const savePosition = useCallback(
    debounce(async (id, x, y) => {
      try {
        const token = await getToken({ template: 'supabase' })
        const client = getAuthenticatedClient(token)
        await client.from('members').update({ position_x: x, position_y: y }).eq('id', id)
      } catch {
        // Non-critical — silently fail
      }
    }, 800),
    [getToken]
  )

  function onNodeDragStop(_, node) {
    savePosition(node.id, node.position.x, node.position.y)
  }

  async function handleDelete(member) {
    try {
      const token = await getToken({ template: 'supabase' })
      const client = getAuthenticatedClient(token)

      // Delete relationships first (FK cascade handles it, but be explicit)
      await client
        .from('relationships')
        .delete()
        .or(`from_member_id.eq.${member.id},to_member_id.eq.${member.id}`)

      const { error } = await client.from('members').delete().eq('id', member.id)
      if (error) throw error

      removeMember(member.id)
      showToast(`${member.name} removed from tree.`, 'success')
    } catch {
      showToast('Failed to delete person. Please try again.', 'error')
    }
  }

  return (
    <div className="flex-1 h-full" ref={reactFlowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeDragStop={onNodeDragStop}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        deleteKeyCode={null}
      >
        <Background color="#e5e7eb" gap={24} size={1} />
        <Controls showInteractive={false} className="bg-white shadow-card border border-gray-100 rounded-xl overflow-hidden" />
      </ReactFlow>
    </div>
  )
}
