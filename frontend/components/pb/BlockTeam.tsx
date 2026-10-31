'use client'

import {useStore} from '@/lib/store'
import {cn} from '@/lib/utils'
import type {PbBlockTeam} from '@/sanity.types'
import {Get} from '@sanity/codegen'
import {FocusTrap} from 'focus-trap-react'
import {toPlainText} from 'next-sanity'
import {useEffect, useState} from 'react'
import {CustomPortableText} from '../shared/CustomPortableText'
import ImageBasic from '../shared/ImageBasic'
import RichTextWrap from '../shared/RichTextWrap'
import SiteGrid from '../shared/SiteGrid'
import SiteWidth from '../shared/SiteWidth'

type TeamMember = Get<PbBlockTeam, 'teamMembers', number>

export default function BlockTeam({block}: {block: PbBlockTeam}) {
  const {teamMembers, columnsTablet = 2, columnsDesktop = 2, columnsDesktopXL = 2} = block

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

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

        const bioText = toPlainText(bio as any)
        const bioTruncated = bioText.length > 250 ? bioText.slice(0, 250) + '...' : bioText

        if (!name && !bio) return null

        return (
          <div className="@container" key={member._key}>
            <div className="flex @max-team:items-center bg-bg-subtle corner @team:py-gut-33 h-full relative @max-team:hover:bg-olive transition-all ease-gleasing duration-400">
              {image && (
                <div className="w-1/4 @team:w-1/3 min-w-100 @team:pl-gut-33">
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
                <div className="flex flex-wrap items-baseline gap-x-gut-33">
                  {name && <div className="ts-p-lg">{name}</div>}
                  {role && <div className="ts-p-xs">{role}</div>}
                </div>
                {bio && (
                  <div>
                    <p className="ts-p-xs line-clamp-2 @team:hidden">{bioTruncated}</p>
                    <RichTextWrap className="ts-p-xs @max-team:hidden">
                      <CustomPortableText value={bio as any} />
                    </RichTextWrap>
                    <button
                      className="@team:hidden absolute inset-0"
                      onClick={() => setSelectedMember(member)}
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
        <TeamMemberOverlay member={selectedMember} setSelectedMember={setSelectedMember} />
      )}
    </div>
  )
}

function TeamMemberOverlay({
  member,
  setSelectedMember,
}: {
  member: Get<PbBlockTeam, 'teamMembers', number>
  setSelectedMember: (member: TeamMember | null) => void
}) {
  const {image, name, role, bio} = member
  const setPauseLenis = useStore((state) => state.setPauseLenis)

  const close = () => {
    setSelectedMember(null)
    setPauseLenis(false)
  }

  useEffect(() => {
    setPauseLenis(true)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedMember(null)
        setPauseLenis(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      setPauseLenis(false)
    }
  }, [setPauseLenis, setSelectedMember])

  return (
    <FocusTrap>
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label={name || 'Team member'}
      >
        <button
          type="button"
          className="absolute inset-0 bg-sage-900/90 -z-1 cursor-auto"
          onClick={close}
          aria-label="Close"
        ></button>
        <SiteWidth>
          <SiteGrid>
            <div className="col-span-12 lg:col-span-10 lg:col-start-2 3xl:col-span-8 3xl:col-start-3 corner">
              <div
                className="flex gap-gut-75 p-gut-75 lg:gap-gut lg:p-gut pb-0 bg-bg-subtle  max-h-[85vh] overflow-y-auto"
                data-lenis-prevent
              >
                {image && (
                  <div className="w-1/4 max-md:hidden">
                    <ImageBasic
                      image={image}
                      alt={name || ''}
                      sizes="auto, 20vw"
                      maxDimension={250}
                      ratio={1}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-gut-50">
                  <div className="flex flex-wrap items-center md:items-baseline gap-x-gut-33">
                    <div className="ts-h4 w-[2em] corner md:hidden mr-gut-25">
                      {image && (
                        <ImageBasic
                          image={image}
                          alt={name || ''}
                          sizes="auto, 50px"
                          maxDimension={50}
                          ratio={1}
                        />
                      )}
                    </div>
                    {name && <div className="ts-h4">{name}</div>}
                    {role && <div className="ts-h6 text-sage-800">{role}</div>}
                  </div>
                  {bio && (
                    <div className="pb-gut-75 lg:pb-gut">
                      <RichTextWrap className="ts-p-sm">
                        <CustomPortableText value={bio as any} />
                      </RichTextWrap>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SiteGrid>
        </SiteWidth>
      </div>
    </FocusTrap>
  )
}
