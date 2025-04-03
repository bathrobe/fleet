/**
 * Utility functions for graph data and dimensional reduction
 */

// Simple type for the reduced data expected by the graph components
type ReducedVectorData = {
  id: string
  position: number[]
  metadata?: any
  originalVector?: number[]
  atomData?: any | null
}

/**
 * Returns sample reduced graph data for development
 * This avoids the need for a Pinecone connection during development
 */
export async function getReducedGraphData(): Promise<ReducedVectorData[]> {
  // Generate mock nodes with reasonable 2D positions
  const mockData: ReducedVectorData[] = []

  // Add some mock nodes with actual names (more entries for better testing)
  const atomNodes = [
    { id: '1', title: 'Agency-First Economic Therapy' },
    { id: '2', title: 'Algorithmic Social Shadow Co-ops' },
    { id: '3', title: 'Artificial Acceleration of Natural Systems' },
    { id: '4', title: 'Beliefs Shape Economic Reality' },
    { id: '5', title: 'Borderless Value Testing Zones' },
    { id: '6', title: 'Capital Seeds Social Mobility' },
    { id: '7', title: 'Cities Are Living Geological Entities' },
    { id: '8', title: 'Cities Outperform Countries As Units' },
    { id: '9', title: 'Commercial Data Brokers Enable Markets' },
    { id: '10', title: 'Critical Mass Sustains Reality' },
    { id: '11', title: 'Decentralized Food Production Networks' },
    { id: '12', title: 'Digital Micro-Sovereignty Networks' },
    { id: '13', title: 'Cognitive Infrastructure Shapes Perception' },
    { id: '14', title: 'Abundance Requires Redesigned Institutions' },
    { id: '15', title: 'Civilization Pivots Demand New Coordination' },
    { id: '16', title: 'Complex Systems Defy Management' },
    { id: '17', title: 'Organizational Transparency Creates Accountability' },
    { id: '18', title: 'Wealth Creation Depends on Coordination Methods' },
    { id: '19', title: 'Future Generations Need Present Advocates' },
    { id: '20', title: 'Markets Embed Cultural Assumptions' },
  ]

  // Add synthetic atom nodes
  const syntheticNodes = [
    { id: '101', title: 'Digital Shadows Enable Intelligence' },
    { id: '102', title: 'Digital Tribes Materialize Physical Reality' },
    { id: '103', title: 'Distributed Content Moderation Systems' },
    { id: '104', title: 'Empowered Bureaucrats Create Safety' },
    { id: '105', title: 'Networked Institutions Outcompete Nation States' },
    { id: '106', title: 'Self-Sovereign Identity Enables New Communities' },
    { id: '107', title: 'Information Granularity Defines Power Structures' },
    { id: '108', title: 'Reality Tunnels Shape Political Conviction' },
    { id: '109', title: 'Recursive Public Infrastructure Regenerates' },
    { id: '110', title: 'Civilization Sustainability Requires New Mythmaking' },
  ]

  // Generate positions for regular atom nodes
  atomNodes.forEach((atom, i) => {
    // Create positions in a circular pattern for better visualization
    const angle = (i / atomNodes.length) * Math.PI * 2
    const radius = 3 + Math.random()
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    mockData.push({
      id: atom.id,
      position: [x, y],
      metadata: {
        type: 'regular',
        title: atom.title,
      },
    })
  })

  // Generate positions for synthetic atom nodes
  syntheticNodes.forEach((atom, i) => {
    // Position synthetic atoms more centrally
    const angle = (i / syntheticNodes.length) * Math.PI * 2
    const radius = 1.5 + Math.random()
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    mockData.push({
      id: atom.id,
      position: [x, y],
      metadata: {
        type: 'synthesized',
        title: atom.title,
      },
    })
  })

  return mockData
}
