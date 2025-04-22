import { cn } from "@/lib/utils";
import { useDrag, useDrop } from "react-dnd";
import { Slide } from "@/lib/types";
import { useRef } from "react";
import { useSlideStore } from "@/store/useSlideStore";
import { ScaledPreview } from "./slide-preview";

type Props = {
  slide: Slide;
  index: number;
  moveSlide: (dragIndex: number, hoverIndex: number) => void;
}

export const DraggableSlidePreview = ({ slide, index, moveSlide }: Props) => {
  const { currentSlide, setCurrentSlide } = useSlideStore();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "SLIDE",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "SLIDE",
    hover: function(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveSlide(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cn(
        "relative cursor-pointer group w-[95%] mx-auto",
        index === currentSlide ? "before:bg-blue-500" : "before:bg-transparent",
        isDragging ? "opacity-50" : "opacity-100"
      )}
      onClick={() => {
        setCurrentSlide(index);
        // Find the main slide element and scroll it into view
        const mainSlide = document.querySelector(`[data-slide-index="${index}"]`);
        if (mainSlide) {
          mainSlide.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }}
    >
      <div className="mb-4 relative">
        <ScaledPreview
          slide={slide}
          isActive={index === currentSlide}
          index={index}
        />
      </div>
    </div>
  );
};
