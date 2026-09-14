'use client'
import NavLinks from '@/components/shared/NavLinks'
import SocialIcon from '@/components/shared/SocialIcon'
import {cn, imgSizesFormat} from '@/lib/utils'
import '@/public/rmll-logo-badge.svg'
import type {SettingsQueryResult} from '@/sanity.types'
import {PortableTextBlock} from 'next-sanity'
import Image from 'next/image'
import {useState} from 'react'
import {BlockButton} from './pb/BlockButtons'
import Button from './shared/Button'
import CurrentYear from './shared/CurrentYear'
import {CustomPortableText} from './shared/CustomPortableText'
import Divider from './shared/Divider'
import ImageBasic from './shared/ImageBasic'
import RichTextWrap from './shared/RichTextWrap'
import SiteGrid from './shared/SiteGrid'
import SiteWidth from './shared/SiteWidth'

type FooterProps = {
  settings: SettingsQueryResult | null
}

export default function Footer({settings}: FooterProps) {
  const [showPopup, setShowPopup] = useState(false)

  if (!settings) {
    return null
  }

  const {footerNav, footerCTAs, socialIcons, footerPopup} = settings
  const hasCTAs = footerCTAs && footerCTAs.length > 0
  const hasSocialIcons = socialIcons && socialIcons.length > 0
  const hasFooterNav = footerNav && footerNav.length > 0
  const popupTransitionClasses = 'transition-transform ease-gleasing duration-500'

  return (
    <footer className="bottom-0 mt-section">
      <SiteWidth className="overflow-hidden">
        <Divider />
        <SiteGrid className="pt-gut-150">
          <div className="max-lg:hidden col-span-2">
            <CopyrightAndLogo />
          </div>
          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <div className="-mr-gut">
              <div
                className={cn(
                  'flex w-full flex-row',
                  popupTransitionClasses,
                  showPopup
                    ? '-translate-x-full lg:translate-x-0'
                    : 'translate-x-0 lg:translate-x-1/2',
                )}
              >
                <div className="w-full shrink-0 lg:w-1/2 pr-gut pb-gut-150 flex flex-col gap-gut">
                  {hasCTAs &&
                    footerCTAs.map((cta, key) => {
                      return (
                        <div key={key}>
                          {cta.heading && <FooterHeading heading={cta.heading} />}
                          {cta.link && <BlockButton btn={cta.link} />}
                        </div>
                      )
                    })}
                  {hasSocialIcons && (
                    <div>
                      <FooterHeading heading="Follow us" />
                      <div className="flex gap-gut-33 mt-gut-33">
                        {socialIcons.map((link, key) => {
                          return (
                            <a
                              key={key}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="size-gut flex items-center justify-center bg-bg-subtle text-sage-800 corner hover:scale-105 transition-all"
                              aria-label={link.icon}
                            >
                              <SocialIcon className="size-3/4" name={link.icon} />
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {hasFooterNav && (
                    <nav role="navigation">
                      <NavLinks
                        navItems={footerNav}
                        ulClasses="flex flex-wrap gap-em ts-p-xs"
                        linkClasses="inline-link"
                      />
                    </nav>
                  )}

                  <div className="lg:hidden">
                    <CopyrightAndLogo />
                  </div>
                </div>
                <div className="w-full shrink-0 lg:w-1/2 pr-gut">
                  {footerPopup?.content && (
                    <RichTextWrap className="ts-p-xs pb-gut">
                      <CustomPortableText value={footerPopup.content as PortableTextBlock[]} />
                    </RichTextWrap>
                  )}
                  <div className="relative h-0 w-full pb-[25%]" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-gut">
              <div className="col-span-2 lg:col-span-1 lg:col-start-2">
                <div className="relative z-1">
                  <div
                    className={cn(
                      'absolute h-0 w-full pb-[25%] bg-red-500 -z-1',
                      popupTransitionClasses,
                      showPopup ? '-translate-y-full' : '',
                    )}
                  >
                    {footerPopup?.image && (
                      <ImageBasic
                        image={footerPopup.image}
                        className="absolute inset-0 object-cover"
                        ratio={4}
                        maxDimension={500}
                        sizes={imgSizesFormat(88, 90, 30)}
                      />
                    )}
                  </div>
                  <Button
                    text={footerPopup?.title || 'Popup'}
                    onClick={() => setShowPopup(!showPopup)}
                    width="full"
                  />
                </div>
              </div>
            </div>
          </div>
        </SiteGrid>
      </SiteWidth>
    </footer>
  )
}

export function FooterHeading({heading}: {heading: string}) {
  return <p className="ts-p-xs text-balance max-w-max-ch">{heading}</p>
}

export function CopyrightAndLogo() {
  return (
    <div className="flex lg:flex-col gap-gut justify-between max-lg:items-end h-full pb-gut">
      <div className="flex flex-col ts-p-xs w-fit max-w-full">
        <div className="flex items-center gap-[.3em] justify-between">
          <span className="uppercase tracking-3 font-bold">RMLL</span>
          <span>&copy;</span>
        </div>
        <div>
          2013–
          <CurrentYear />
        </div>
      </div>
      <div className="max-lg:w-1/3">
        <Image
          src="/rmll-logo-badge.svg"
          alt="Rocky Mountain Land Library Logo"
          width={409}
          height={411}
          loading="lazy"
        />
      </div>
    </div>
  )
}
