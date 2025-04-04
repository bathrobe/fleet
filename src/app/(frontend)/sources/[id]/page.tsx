import { fetchSource, getSimilarVectors } from '@/app/(frontend)/actions/atoms'
import { SourceDetail } from '../../components/sources/SourceDetail'
import { SourceRelatedSidebar } from '../../components/common/RelatedItemsSidebar'
import { notFound } from 'next/navigation'
import { Source } from '@/payload-types'

export default async function SourceDetailPage({ params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const source = await fetchSource(id)

    if (!source) {
      notFound()
    }

    // Fetch similar sources if this source has a pineconeId
    let similarSources: Source[] = []
    if (source.pineconeId) {
      try {
        console.log(
          `Finding similar sources for source ${source.id} with pineconeId: ${source.pineconeId}`,
        )
        const result = await getSimilarVectors(source.pineconeId, 'sources')

        // Limit to 3 similar sources
        similarSources = (result.docs as Source[]).slice(0, 3)

        console.log(`Found ${similarSources.length} similar sources`)
      } catch (error) {
        console.error('Error fetching similar sources:', error)
      }
    } else {
      console.log(`Source ${source.id} has no pineconeId, can't find similar sources`)
    }

    return (
      <div className="flex h-full overflow-hidden">
        <div className="flex-1 overflow-auto">
          <SourceDetail source={source} />
        </div>
        <SourceRelatedSidebar source={source} similarSources={similarSources} />
      </div>
    )
  } catch (error) {
    console.error(`Error loading source ${params.id}:`, error)
    throw new Error('Failed to load source')
  }
}
