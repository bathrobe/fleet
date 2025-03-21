import { ConceptGraphContainer } from '../components/ConceptGraph/ConceptGraphContainer'

export default function VectorSpacePage() {
  return (
    <div className="container mx-auto py-8">
      <ConceptGraphContainer />
    </div>
  )
}

export const metadata = {
  title: 'Vector Space Visualization',
  description: 'Visualizing concept vectors in 2D space',
}
