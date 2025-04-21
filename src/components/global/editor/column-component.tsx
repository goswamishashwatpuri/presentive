"use client"

import React, { useState, useEffect } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { MasterRecursiveComponent } from "@/app/(protected)/presentation/[presentationId]/_components/editor/master-recursive-component";
import { v4 as uuidv4 } from 'uuid';
import { ContentItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ColumnProps {
  content: ContentItem[];
  className?: string;
  isPreview?: boolean;
  slideId: string;
  onContentChange: (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void;
  isEditable?: boolean;
}

export const ColumnComponent = ({
  content,
  className,
  slideId,
  onContentChange,
  isPreview = false,
  isEditable = true,
}: ColumnProps) => {
  const [columns, setColumns] = useState<ContentItem[]>([]);

  const createDefaultColumns = (count: number): ContentItem[] => {
    return Array(count).fill(null).map(() => ({
      id: uuidv4(),
      type: "paragraph" as const,
      name: "Paragraph",
      content: "",
      placeholder: "Start typing...",
    })) as ContentItem[];
  };

  useEffect(() => {
    if (content.length === 0) {
      setColumns(createDefaultColumns(2));
    } else {
      setColumns(content);
    }
  }, [content]);

  return (
    <div className="relative w-full h-full">
      <ResizablePanelGroup
        direction="horizontal"
        className={cn("h-full w-full flex ", !isEditable && "!border-0", className)}
      >
        {columns.map((item, index) => (
          <React.Fragment key={item.id}>
            <ResizablePanel minSize={20} defaultSize={100 / columns.length}>
              <div className={cn("h-full w-full", item.className)}>
                <MasterRecursiveComponent
                  content={item}
                  isPreview={isPreview}
                  onContentChange={onContentChange}
                  slideId={slideId}
                  isEditable={isEditable}
                />
              </div>
            </ResizablePanel>
            {index < columns.length - 1 && isEditable && <ResizableHandle withHandle={!isPreview} />}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>

    </div>
  );
};

