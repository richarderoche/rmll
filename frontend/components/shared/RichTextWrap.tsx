import {cn} from '@/lib/utils'

export default function RichTextWrap({
  children,
  className = 'ts-p-md',
  ...rest
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'prose prose-siteColor prose-p:my-[.8em] prose-p:first:mt-0 prose-p:last:mb-0  prose-headings:mt-[.8em] prose-headings:first:mt-0 prose-li:my-0',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
