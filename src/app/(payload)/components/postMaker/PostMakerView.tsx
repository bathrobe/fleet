'use client'

import React, { useState, useEffect } from 'react'
import { useUnpostedAtoms } from './hooks/useUnpostedAtoms'
import { generatePost } from './actions/generatePost'
// Corrected path to payload-types.ts
import type { Atom } from '../../../../../src/payload-types'
import type { SynthesizedAtom, GeneratedPost } from './types' // Removed TweetContent import
import { usePostToTwitter } from './hooks/usePostToTwitter'

// --- Define Types Locally ---
// Define TweetContent locally since it wasn't exported
interface TweetContent {
  text: string
  isSourceTweet?: boolean
}

// Interface for validation state
interface TweetValidation {
  count: number
  isOverLimit: boolean
}

// Define character limit constant
const TWITTER_CHAR_LIMIT = 280

// --- UI Sub-Components (Defined within PostMakerView) ---

// #region AtomListView Component
interface AtomListViewProps {
  atoms: SynthesizedAtom[]
  loading: boolean
  error: string | null
  selectedAtom: SynthesizedAtom | null
  onAtomSelect: (atom: SynthesizedAtom) => void
}

const AtomListView: React.FC<AtomListViewProps> = ({
  atoms,
  loading,
  error,
  selectedAtom,
  onAtomSelect,
}) => {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 h-full flex flex-col">
      <div className="bg-gray-800 p-3 border-b border-gray-700 flex-shrink-0">
        <h2 className="font-medium text-gray-200">Unposted Atoms</h2>
      </div>
      <div className="p-4 flex-grow overflow-y-auto">
        {loading ? (
          <div className="py-4 text-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        ) : error ? (
          <div className="py-4 text-center text-red-400">{error}</div>
        ) : atoms.length === 0 ? (
          <div className="py-4 text-center text-gray-400">No unposted atoms</div>
        ) : (
          <div className="divide-y divide-gray-700">
            {atoms.map((atom) => (
              <div
                key={atom.id}
                className={`py-3 px-2 cursor-pointer hover:bg-gray-800 transition-colors ${
                  selectedAtom?.id === atom.id ? 'bg-blue-900 border-l-4 border-blue-500 pl-2' : ''
                }`}
                onClick={() => onAtomSelect(atom)}
              >
                <h3 className="font-medium truncate text-white">{atom.title}</h3>
                <p className="text-sm text-gray-400 truncate">{atom.mainContent}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
// #endregion

// #region AtomDetailsView Component
interface AtomDetailsViewProps {
  selectedAtom: SynthesizedAtom | null
  isGenerating: boolean
  onGeneratePost: () => void
}

// Helper for Parent Atom display within AtomDetailsView
const ParentAtomDisplay: React.FC<{ parent: number | Atom | string }> = ({ parent }) => {
  // Safely determine title and content based on whether parent is populated object or ID
  const parentTitle =
    typeof parent === 'object' && parent && 'title' in parent
      ? (parent as Atom).title || `Atom ${String((parent as Atom).id)}`
      : `Atom ${String(parent)}`
  const parentContent =
    typeof parent === 'object' && parent && 'mainContent' in parent
      ? (parent as Atom).mainContent
      : ''

  return (
    <div className="text-sm bg-gray-800 p-2 rounded border border-gray-700">
      <div className="font-medium text-blue-400">{parentTitle}</div>
      {parentContent && <p className="mt-1 text-xs text-gray-400 line-clamp-2">{parentContent}</p>}
    </div>
  )
}

const AtomDetailsView: React.FC<AtomDetailsViewProps> = ({
  selectedAtom,
  isGenerating,
  onGeneratePost,
}) => {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 h-full flex flex-col">
      <div className="bg-gray-800 p-3 border-b border-gray-700 flex-shrink-0">
        <h2 className="font-medium text-gray-200">Atom Details</h2>
      </div>
      <div className="p-4 flex-grow overflow-y-auto">
        {selectedAtom ? (
          <div className="space-y-4">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-white">{selectedAtom.title}</h3>
              <p className="mt-1 text-gray-300">{selectedAtom.mainContent}</p>
            </div>
            {/* Supporting Info */}
            {selectedAtom.supportingInfo && selectedAtom.supportingInfo.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-300">Supporting Info</h4>
                <ul className="mt-1 list-disc pl-5 space-y-1">
                  {selectedAtom.supportingInfo.map((info, index) => (
                    <li key={index} className="text-sm text-gray-400">
                      {info.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Theory Fiction */}
            {selectedAtom.theoryFiction && (
              <div>
                <h4 className="font-medium text-gray-300">Theory Fiction</h4>
                <div className="mt-1 italic text-sm text-gray-300 bg-gray-800 p-3 rounded border-l-2 border-green-600">
                  {selectedAtom.theoryFiction}
                </div>
              </div>
            )}
            {/* Parent Atoms */}
            {selectedAtom.parentAtoms && selectedAtom.parentAtoms.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-300">
                  Parent Atoms ({selectedAtom.parentAtoms.length})
                </h4>
                <div className="mt-1 space-y-2">
                  {selectedAtom.parentAtoms?.map((parent, index) => (
                    <ParentAtomDisplay key={index} parent={parent} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400">Select an atom to view details</p>
        )}
      </div>
      {/* Generate Button Area */}
      {selectedAtom && (
        <div className="p-4 border-t border-gray-700 bg-gray-800 flex-shrink-0 flex justify-end">
          <button
            onClick={onGeneratePost}
            disabled={isGenerating}
            className={`px-4 py-2 rounded-md text-white transition ${isGenerating ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
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
      )}
    </div>
  )
}
// #endregion

// #region TweetPreviewView Component
interface TweetPreviewViewProps {
  post: GeneratedPost | null
  tweetValidations: TweetValidation[]
  isPosting: boolean
  validationError: string | null
  postError: string | null
  isPostValid: boolean
  onPostToSocials: () => void
}

const TweetPreviewView: React.FC<TweetPreviewViewProps> = ({
  post,
  tweetValidations,
  isPosting,
  validationError,
  postError,
  isPostValid,
  onPostToSocials,
}) => {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 h-full flex flex-col">
      <div className="bg-gray-800 p-3 border-b border-gray-700 flex-shrink-0">
        <h2 className="font-medium text-gray-200">Tweet Preview</h2>
      </div>
      <div className="p-4 flex-grow overflow-y-auto">
        {post ? (
          <div className="space-y-6">
            {/* Tweet Cards */}
            {post.content.map((tweet, index) => {
              const validation = tweetValidations[index] || { count: 0, isOverLimit: false }
              const countColor = validation.isOverLimit ? 'text-red-400' : 'text-gray-500'
              return (
                <div
                  key={index}
                  className={`border rounded-xl p-4 bg-gray-800 ${validation.isOverLimit ? 'border-red-600' : 'border-gray-700'}`}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-blue-400 font-bold">
                      V
                    </div>
                    <div className="ml-3">
                      <div className="font-bold text-white">Valentine Agent</div>
                      <div className="text-gray-400 text-sm">@valentinei</div>
                    </div>
                  </div>
                  <div className="mb-3 whitespace-pre-wrap text-gray-200">{tweet.text}</div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-700">
                    <div className="text-gray-500">
                      {tweet.isSourceTweet ? 'Source' : `Tweet ${index + 1}`}
                    </div>
                    <div className={countColor}>
                      {validation.count}/{TWITTER_CHAR_LIMIT}
                    </div>
                  </div>
                </div>
              )
            })}
            {/* Generation Details */}
            {post.usage && (
              <div className="mt-4 p-3 border border-gray-700 rounded bg-gray-800">
                <h3 className="text-sm font-medium text-gray-300 mb-1">Gen Details</h3>
                <div className="text-xs text-gray-400">
                  <p>Model: {post.model || '-'}</p>
                  <p>
                    Tokens: {post.usage.totalTokens} (P:{post.usage.promptTokens}, C:
                    {post.usage.completionTokens})
                  </p>
                  {post.error && <p className="text-yellow-400 mt-1">Note: {post.error}</p>}
                </div>
              </div>
            )}
            {/* Errors */}
            {validationError && (
              <div className="mt-4 p-3 border border-red-600 bg-red-900/30 rounded text-red-400 text-sm">
                {validationError}
              </div>
            )}
            {!isPostValid && !validationError && (
              <div className="mt-4 p-3 border border-red-600 bg-red-900/30 rounded text-red-400 text-sm">
                Cannot post: Tweet length exceeds limit.
              </div>
            )}
            {postError && <div className="text-red-400 text-sm mt-2">Post Error: {postError}</div>}
          </div>
        ) : (
          <p className="text-gray-400">Generate a post for preview</p>
        )}
      </div>
      {/* Post Button Area */}
      {post && (
        <div className="p-4 border-t border-gray-700 bg-gray-800 flex-shrink-0 flex justify-center">
          <button
            onClick={onPostToSocials}
            disabled={isPosting || !isPostValid}
            className={`px-6 py-2 rounded-md text-white font-medium transition ${isPosting || !isPostValid ? 'bg-gray-700 cursor-not-allowed opacity-50' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isPosting ? (
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
                Posting...
              </span>
            ) : (
              'Post to Twitter'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
// #endregion

// --- Main Container Component ---
const PostMakerView = () => {
  // State
  const { atoms, loading: atomsLoading, error: atomsError } = useUnpostedAtoms()
  const [selectedAtom, setSelectedAtom] = useState<SynthesizedAtom | null>(null)
  const [post, setPost] = useState<GeneratedPost | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const { handlePost, isPosting, error: postError } = usePostToTwitter()
  const [tweetValidations, setTweetValidations] = useState<TweetValidation[]>([])
  const [isPostValid, setIsPostValid] = useState(true)

  // Effect for validity
  useEffect(() => {
    const overallValidity = tweetValidations.every((v) => !v.isOverLimit)
    setIsPostValid(overallValidity)
    // Maybe clear general error if length error is now the issue
    // if (!overallValidity && validationError) setValidationError(null)
  }, [tweetValidations])

  // Handlers
  const handleAtomSelect = (atom: SynthesizedAtom) => {
    setSelectedAtom(atom)
    setPost(null)
    setValidationError(null)
    setTweetValidations([])
    setIsPostValid(true)
  }

  const validatePostContent = (content: TweetContent[]): TweetValidation[] => {
    return content.map((tweet) => {
      const count = tweet.text.length
      const isOverLimit = count > TWITTER_CHAR_LIMIT
      if (isOverLimit) console.warn(`Validation: Tweet > ${TWITTER_CHAR_LIMIT} chars.`)
      return { count, isOverLimit }
    })
  }

  const handleGeneratePost = async () => {
    if (!selectedAtom) return
    setIsGenerating(true)
    setValidationError(null)
    setTweetValidations([])
    setIsPostValid(true)
    setPost(null)
    try {
      const generatedPost = await generatePost(selectedAtom)
      if (generatedPost?.content) {
        setTweetValidations(validatePostContent(generatedPost.content))
      }
      setPost(generatedPost)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown generation error'
      setValidationError(`Generation failed: ${message}`)
      setTweetValidations([])
      setIsPostValid(false)
      setPost(null)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePostToSocials = async () => {
    if (!post || !isPostValid) {
      setValidationError(!post ? 'No post generated.' : `Cannot post: Tweet exceeds limit.`)
      return
    }
    setValidationError(null)
    try {
      const postResult = await handlePost(post)
      // @ts-ignore
      if (postResult?.success) {
        // @ts-ignore
        alert(`Posted! IDs: ${postResult.tweetIds?.join(', ') || 'N/A'}`)
        setSelectedAtom(null)
        setPost(null)
        setTweetValidations([])
        setIsPostValid(true)
      } else {
        const errorMessage = postError || 'Post failed. Check logs.'
        setValidationError(`Posting Error: ${errorMessage}`)
        alert(`Posting failed: ${errorMessage}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown post error.'
      setValidationError(`Posting Error: ${message}`)
      alert(`Error posting: ${message}`)
    }
  }

  // Render Container with Sub-Components
  return (
    <div className="p-6 h-[calc(100vh-theme(space.24))] flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-white flex-shrink-0">Posts Queue</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow min-h-0">
        <AtomListView
          atoms={atoms}
          loading={atomsLoading}
          error={atomsError}
          selectedAtom={selectedAtom}
          onAtomSelect={handleAtomSelect}
        />
        <AtomDetailsView
          selectedAtom={selectedAtom}
          isGenerating={isGenerating}
          onGeneratePost={handleGeneratePost}
        />
        <TweetPreviewView
          post={post}
          tweetValidations={tweetValidations}
          isPosting={isPosting}
          validationError={validationError}
          postError={postError}
          isPostValid={isPostValid}
          onPostToSocials={handlePostToSocials}
        />
      </div>
    </div>
  )
}

export default PostMakerView
