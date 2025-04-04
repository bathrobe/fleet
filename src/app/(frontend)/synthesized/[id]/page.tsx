import { fetchSynthesizedAtom } from '@/app/(frontend)/actions/atoms'
import { SynthesizedAtomDetail } from '../../components/synthesized/SynthesizedAtomDetail'
import { SynthesizedAtomRelatedSidebar } from '../../components/common/RelatedItemsSidebar'
import { notFound } from 'next/navigation'

export default async function SynthesizedAtomDetailPage({ params }: { params: { id: string } }) {
  try {
    const atom = await fetchSynthesizedAtom(params.id)

    if (!atom) {
      notFound()
    }

    return (
      <div className="flex h-full overflow-hidden">
        <div className="flex-1 overflow-auto">
          <SynthesizedAtomDetail atom={atom} />
        </div>
        <SynthesizedAtomRelatedSidebar synthesizedAtom={atom} />
      </div>
    )
  } catch (error) {
    console.error(`Error loading synthesized atom ${params.id}:`, error)
    throw new Error('Failed to load synthesized atom')
  }
}
