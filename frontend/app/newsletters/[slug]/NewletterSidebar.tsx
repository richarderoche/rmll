'use client'

import Button from '@/components/shared/Button'
import SelectComponent, {SelectOption} from '@/components/shared/Select'
import {useLenis} from 'lenis/react'
import {useRouter} from 'next/navigation'

export default function NewsletterSidebar({
  editions,
  slug,
  edition,
  subscribeUrl,
}: {
  editions: SelectOption[]
  slug: string
  edition: string
  subscribeUrl?: string
}) {
  const router = useRouter()
  const lenis = useLenis()

  return (
    <>
      {subscribeUrl && <Button path={subscribeUrl} text="Subscribe" style="fill" width="full" />}
      {editions && editions.length > 1 && (
        <SelectComponent
          colorClasses="bg-bg-subtle"
          options={editions}
          label="Edition"
          value={{label: edition ?? '', value: slug ?? ''}}
          onValueChange={(value) => {
            if (!value || value === slug) return

            const navigate = () => router.push(`/newsletters/${value}`)

            if (lenis) {
              lenis.scrollTo(0)
              navigate()
              return
            }

            window.scrollTo(0, 0)
            navigate()
          }}
          emptyLabel={null}
        />
      )}
    </>
  )
}
