'use client'

import {cn} from '@/lib/utils'
import type {PbBlockTeam} from '@/sanity.types'
import {toPlainText} from 'next-sanity'
import {useState} from 'react'
import {CustomPortableText} from '../shared/CustomPortableText'
import ImageBasic from '../shared/ImageBasic'
import RichTextWrap from '../shared/RichTextWrap'
import TeamMemberOverlay from './TeamMemberOverlay'

export default function BlockTeam({block}: {block: PbBlockTeam}) {
  const {teamMembers, columnsTablet = 2, columnsDesktop = 2, columnsDesktopXL = 2} = block

  const [selectedMemberKey, setSelectedMemberKey] = useState<string | null>(null)
  const selectedMember = teamMembers?.find((member) => member._key === selectedMemberKey) ?? null

  if (!teamMembers) return null

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-gut max-md:max-w-463',
        columnsTablet === 2 && 'md:max-lg:grid-cols-2',
        columnsDesktop === 2 && 'lg:max-team:grid-cols-2',
        columnsDesktop === 3 && 'lg:max-team:grid-cols-3',
        columnsDesktopXL === 2 && 'team:grid-cols-2',
        columnsDesktopXL === 3 && 'team:grid-cols-3',
        columnsDesktopXL === 4 && 'team:grid-cols-4',
      )}
    >
      {teamMembers.map((member) => {
        const {image, name, role, bio} = member

        const bioText = bio ? toPlainText(bio) : ''
        const bioTruncated = bioText.length > 250 ? bioText.slice(0, 250) + '...' : bioText

        if (!name && !bio) return null

        return (
          <div className="@container" key={member._key}>
            <div className="flex @max-team:items-center bg-bg-subtle corner @team:py-gut-33 h-full relative @max-team:hover:bg-olive transition-all ease-gleasing duration-400">
              {image && (
                <div className="w-1/4 @team:w-1/3 min-w-110 @team:pl-gut-33">
                  <ImageBasic
                    image={image}
                    alt={name || ''}
                    sizes="auto, 20vw"
                    maxDimension={250}
                    ratio={1}
                  />
                </div>
              )}
              <div className="flex flex-col gap-3 @team:gap-gut-25 px-gut-50 3xl:px-gut-33 @max-team:py-8">
                <div className="flex flex-wrap items-baseline gap-x-gut-25">
                  {name && <div className="ts-p-lg">{name}</div>}
                  {role && <div className="ts-p-xs">{role}</div>}
                </div>
                {bio && (
                  <div>
                    <p className="ts-p-xs line-clamp-2 @team:hidden">{bioTruncated}</p>
                    <RichTextWrap className="ts-p-xs @max-team:hidden">
                      <CustomPortableText value={bio} />
                    </RichTextWrap>
                    <button
                      className="@team:hidden absolute inset-0"
                      onClick={() => setSelectedMemberKey(member._key)}
                    >
                      <span className="sr-only">View more</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
      {selectedMember && (
        <TeamMemberOverlay member={selectedMember} onClose={() => setSelectedMemberKey(null)} />
      )}
    </div>
  )
}
