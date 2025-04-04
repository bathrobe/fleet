import { fetchAtom } from '@/app/(frontend)/actions/atoms'
import { AtomDetail } from '../../components/atoms/AtomDetail'
import { AtomRelatedSidebar } from '../../components/common/RelatedItemsSidebar'
import { notFound } from 'next/navigation'

export default async function AtomDetailPage({ params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const atom = await fetchAtom(id)

    if (!atom) {
      notFound()
    }

    return (
      <div className="flex h-full overflow-hidden">
        <div className="flex-1 overflow-auto">
          <AtomDetail atom={atom} />
        </div>
        <AtomRelatedSidebar atom={atom} />
      </div>
    )
  } catch (error) {
    console.error(`Error loading atom ${params.id}:`, error)
    throw new Error('Failed to load atom')
  }
}
