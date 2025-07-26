import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export const VocabularyCardSkeleton = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-5" />
          </div>
        </div>
        
        <div className="mb-2">
          <Skeleton className="h-4 w-32 mb-1" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>
        
        <Skeleton className="h-4 w-48 mb-2" />
        
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
};

export const VocabularyListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <VocabularyCardSkeleton key={index} />
      ))}
    </div>
  );
};