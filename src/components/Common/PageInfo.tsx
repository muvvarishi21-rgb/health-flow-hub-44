import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface PageInfoProps {
  title: string;
  description: string;
  example?: string;
}

const PageInfo: React.FC<PageInfoProps> = ({ title, description, example }) => {
  return (
    <Card className="mb-6 border-info/20 bg-info/5">
      <CardContent className="pt-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-info mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{description}</p>
            {example && (
              <p className="text-xs text-muted-foreground italic">
                Example: {example}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageInfo;