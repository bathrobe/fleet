'use client'

import { useState } from 'react'
import { useUnpostedAtoms } from './hooks/useUnpostedAtoms'
import { generatePost } from './actions/generatePost'
import type { SynthesizedAtom, GeneratedPost } from './types'

const PostMakerView = () => {
  const { atoms, loading, error } = useUnpostedAtoms()
  const [selectedAtom, setSelectedAtom] = useState<SynthesizedAtom | null>(null)
  const [post, setPost] = useState<GeneratedPost | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAtomSelect = (atom: SynthesizedAtom) => {
    setSelectedAtom(atom)
    setPost(null) // Clear previous post
  }

  const handleGeneratePost = async () => {
    if (!selectedAtom) return

    try {
      setIsGenerating(true)

      // Call the real LLM-powered generation
      console.log('Generating post for atom:', selectedAtom)
      const generatedPost = await generatePost(selectedAtom)
      setPost(generatedPost)
    } catch (error) {
      console.error('Error generating post:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Posts Queue</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Left column: List of unposted atoms */}
        <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
          <div className="bg-gray-800 p-3 border-b border-gray-700">
            <h2 className="font-medium text-gray-200">Unposted Atoms</h2>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="py-4 text-center">
                <div className="animate-pulse text-gray-400">Loading unposted atoms...</div>
              </div>
            ) : error ? (
              <div className="py-4 text-center text-red-400">{error}</div>
            ) : atoms.length === 0 ? (
              <div className="py-4 text-center text-gray-400">No unposted atoms found</div>
            ) : (
              <div className="divide-y divide-gray-700">
                {atoms.map((atom) => (
                  <div
                    key={atom.id}
                    className={`py-3 px-2 cursor-pointer hover:bg-gray-800 transition-colors ${
                      selectedAtom?.id === atom.id
                        ? 'bg-blue-900 border-l-4 border-blue-500 pl-2'
                        : ''
                    }`}
                    onClick={() => handleAtomSelect(atom)}
                  >
                    <h3 className="font-medium truncate text-white">{atom.title}</h3>
                    <p className="text-sm text-gray-400 truncate">{atom.mainContent}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle column: Selected atom details */}
        <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
          <div className="bg-gray-800 p-3 border-b border-gray-700">
            <h2 className="font-medium text-gray-200">Atom Details</h2>
          </div>
          <div className="p-4">
            {selectedAtom ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedAtom.title}</h3>
                  <p className="mt-1 text-gray-300">{selectedAtom.mainContent}</p>
                </div>

                {selectedAtom.supportingInfo && selectedAtom.supportingInfo.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-300">Supporting Information</h4>
                    <ul className="mt-1 list-disc pl-5 space-y-1">
                      {selectedAtom.supportingInfo.map((info, index) => (
                        <li key={index} className="text-sm text-gray-400">
                          {info.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedAtom.theoryFiction && (
                  <div>
                    <h4 className="font-medium text-gray-300">Theory Fiction</h4>
                    <div className="mt-1 italic text-sm text-gray-300 bg-gray-800 p-3 rounded border-l-2 border-green-600">
                      {selectedAtom.theoryFiction}
                    </div>
                  </div>
                )}

                {selectedAtom.parentAtoms && selectedAtom.parentAtoms.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-300">
                      Parent Atoms ({selectedAtom.parentAtoms.length})
                    </h4>
                    <div className="mt-1 space-y-2">
                      {selectedAtom.parentAtoms.map((parent, index) => {
                        // Handle both object and ID reference cases
                        const parentTitle =
                          typeof parent === 'object' && parent
                            ? parent.title || `Atom ${String(parent.id)}`
                            : `Atom ${String(parent)}`

                        const parentContent =
                          typeof parent === 'object' && parent?.mainContent
                            ? parent.mainContent
                            : ''

                        return (
                          <div
                            key={index}
                            className="text-sm bg-gray-800 p-2 rounded border border-gray-700"
                          >
                            <div className="font-medium text-blue-400">{parentTitle}</div>
                            {parentContent && (
                              <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                                {parentContent}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-end space-x-3">
                  <button
                    onClick={handleGeneratePost}
                    disabled={isGenerating}
                    className={`px-4 py-2 rounded-md text-white transition ${
                      isGenerating
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isGenerating ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      'Generate Post'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Select an atom to view details</p>
            )}
          </div>
        </div>

        {/* Right column: Tweet preview */}
        <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
          <div className="bg-gray-800 p-3 border-b border-gray-700">
            <h2 className="font-medium text-gray-200">Tweet Preview</h2>
          </div>
          <div className="p-4">
            {post ? (
              <div className="space-y-6">
                {post.content.map((tweet, index) => (
                  <div key={index} className="border border-gray-700 rounded-xl p-4 bg-gray-800">
                    {/* Tweet header */}
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-blue-400 font-bold">
                        V
                      </div>
                      <div className="ml-3">
                        <div className="font-bold text-white">Valentine Agent</div>
                        <div className="text-gray-400 text-sm">@valentinei</div>
                      </div>
                    </div>

                    {/* Tweet content */}
                    <div className="mb-3 whitespace-pre-wrap text-gray-200">{tweet.text}</div>

                    {/* Tweet footer */}
                    <div className="flex items-center justify-between text-gray-500 text-sm pt-2 border-t border-gray-700">
                      <div>{tweet.isSourceTweet ? 'Source tweet' : 'Main tweet'}</div>
                      <div>{new Date().toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}

                {/* Show generation details if available */}
                {post.usage && (
                  <div className="mt-4 p-3 border border-gray-700 rounded bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-300 mb-1">Generation Details</h3>
                    <div className="text-xs text-gray-400">
                      <p>Model: {post.model || 'Unknown'}</p>
                      <p>
                        Tokens: {post.usage.totalTokens} ({post.usage.promptTokens} prompt,{' '}
                        {post.usage.completionTokens} completion)
                      </p>
                      {post.error && <p className="text-yellow-400 mt-1">Note: {post.error}</p>}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 text-center mt-4">
                  This is a preview. The post will be published to Twitter and Bluesky when
                  implemented.
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Generate a post to see preview</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostMakerView
