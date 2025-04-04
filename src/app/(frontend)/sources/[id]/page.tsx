import { fetchSource } from '@/app/(frontend)/actions/atoms'
import { SourceDetail } from '../../components/sources/SourceDetail'
import { SourceRelatedSidebar } from '../../components/common/RelatedItemsSidebar'
import { notFound } from 'next/navigation'

export default async function SourceDetailPage({ params }: { params: { id: string } }) {
  try {
    const source = await fetchSource(params.id)

    if (!source) {
      notFound()
    }

    return (
      <div className="flex h-full overflow-hidden">
        <div className="flex-1 overflow-auto">
          <SourceDetail source={source} />
        </div>
        <SourceRelatedSidebar source={source} />
      </div>
    )
  } catch (error) {
    console.error(`Error loading source ${params.id}:`, error)
    throw new Error('Failed to load source')
  }
}
