import { Skeleton } from '../ui/skeleton';

export default function LoadingContent() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Skeleton className="h-42 max-w-3/2rounded-xl" />
            <Skeleton className="h-42 max-w-3/2 rounded-xl" />
            <Skeleton className="h-42 max-w-3/2 rounded-xl" />
            <Skeleton className="h-42 max-w-3/2 rounded-xl" />
          </div>
          <div className="px-4 lg:px-6">
            <Skeleton className="h-100 w-auto rounded-xl" />
          </div>
          <div className="px-4 lg:px-6">
            <Skeleton className="h-100 w-auto rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

