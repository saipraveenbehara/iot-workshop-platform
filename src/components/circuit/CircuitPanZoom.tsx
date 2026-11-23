import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Move,
  Maximize2 
} from 'lucide-react';

export interface CircuitPanZoomProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
  initialPan?: { x: number; y: number };
  controlsPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  showControls?: boolean;
  showHint?: boolean;
  heightClass?: string;
  overlayChildren?: React.ReactNode;
  onReset?: () => void;
}

export const CircuitPanZoom: React.FC<CircuitPanZoomProps> = ({
  children,
  className = '',
  contentClassName = '',
  minScale = 0.5,
  maxScale = 3.5,
  initialScale = 1.0,
  initialPan = { x: 0, y: 0 },
  controlsPosition = 'top-right',
  showControls = true,
  showHint = true,
  heightClass = 'min-h-[340px]',
  overlayChildren,
  onReset,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialScale);
  const [pan, setPan] = useState(initialPan);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // References for tracking drag and touch gesture states without re-renders
  const dragRef = useRef({
    isDown: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    originPanX: 0,
    originPanY: 0,
    hasMoved: false,
  });

  const touchRef = useRef<{
    initialDist: number;
    initialScale: number;
    midX: number;
    midY: number;
    isPinching: boolean;
  }>({
    initialDist: 0,
    initialScale: 1,
    midX: 0,
    midY: 0,
    isPinching: false,
  });

  // Zoom to a specific scale anchored at a specific viewport point (defaulting to container center)
  const zoomTo = useCallback((newScaleTarget: number, anchorX?: number, anchorY?: number) => {
    const container = containerRef.current;
    if (!container) return;

    const clampedScale = Math.min(Math.max(newScaleTarget, minScale), maxScale);
    const rect = container.getBoundingClientRect();
    const mx = anchorX ?? rect.width / 2;
    const my = anchorY ?? rect.height / 2;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    setScale((prevScale) => {
      if (prevScale === clampedScale) return prevScale;
      setPan((prevPan) => {
        // Formula for transformOrigin: 'center center'
        const nextPanX = mx - cx - (clampedScale / prevScale) * (mx - cx - prevPan.x);
        const nextPanY = my - cy - (clampedScale / prevScale) * (my - cy - prevPan.y);
        return { x: nextPanX, y: nextPanY };
      });
      return clampedScale;
    });
    setHasInteracted(true);
  }, [minScale, maxScale]);

  const zoomIn = () => {
    zoomTo(scale * 1.25);
  };

  const zoomOut = () => {
    zoomTo(scale * 0.8);
  };

  const resetView = () => {
    setScale(initialScale);
    setPan(initialPan);
    if (onReset) onReset();
  };

  // Wheel zoom (anchored directly under cursor)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent browser page scroll when zooming inside circuit area
      e.preventDefault();
      setHasInteracted(true);

      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Smooth zoom factor based on deltaY
      const delta = -e.deltaY;
      const factor = delta > 0 ? 1.12 : 0.89;

      setScale((prevScale) => {
        const nextScale = Math.min(Math.max(prevScale * factor, minScale), maxScale);
        if (nextScale === prevScale) return prevScale;

        setPan((prevPan) => {
          const nextPanX = mx - cx - (nextScale / prevScale) * (mx - cx - prevPan.x);
          const nextPanY = my - cy - (nextScale / prevScale) * (my - cy - prevPan.y);
          return { x: nextPanX, y: nextPanY };
        });

        return nextScale;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [minScale, maxScale]);

  // Touch gesture handler (pinch-to-zoom + single finger pan)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const rect = container.getBoundingClientRect();
        touchRef.current = {
          initialDist: dist,
          initialScale: scale,
          midX: (t1.clientX + t2.clientX) / 2 - rect.left,
          midY: (t1.clientY + t2.clientY) / 2 - rect.top,
          isPinching: true,
        };
        setHasInteracted(true);
      } else if (e.touches.length === 1) {
        touchRef.current.isPinching = false;
        const t = e.touches[0];
        dragRef.current = {
          isDown: true,
          pointerId: -1,
          startX: t.clientX,
          startY: t.clientY,
          originPanX: pan.x,
          originPanY: pan.y,
          hasMoved: false,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      if (touchRef.current.isPinching && e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const factor = dist / touchRef.current.initialDist;
        const nextScale = Math.min(Math.max(touchRef.current.initialScale * factor, minScale), maxScale);

        const mx = touchRef.current.midX;
        const my = touchRef.current.midY;

        setScale((prevScale) => {
          if (prevScale === nextScale) return prevScale;
          setPan((prevPan) => {
            const nextPanX = mx - cx - (nextScale / prevScale) * (mx - cx - prevPan.x);
            const nextPanY = my - cy - (nextScale / prevScale) * (my - cy - prevPan.y);
            return { x: nextPanX, y: nextPanY };
          });
          return nextScale;
        });
      } else if (!touchRef.current.isPinching && e.touches.length === 1 && dragRef.current.isDown) {
        const t = e.touches[0];
        const dx = t.clientX - dragRef.current.startX;
        const dy = t.clientY - dragRef.current.startY;
        if (Math.hypot(dx, dy) > 4) {
          dragRef.current.hasMoved = true;
          setIsDragging(true);
          setPan({
            x: dragRef.current.originPanX + dx,
            y: dragRef.current.originPanY + dy,
          });
        }
      }
    };

    const handleTouchEnd = () => {
      touchRef.current.isPinching = false;
      dragRef.current.isDown = false;
      setIsDragging(false);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [scale, pan, minScale, maxScale]);

  // Pointer drag events for desktop mouse / pen
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Left-click only for dragging
    if (e.button !== 0) return;
    
    // Ignore if clicking on interactive control buttons
    const target = e.target as HTMLElement;
    if (target.closest('[data-pan-zoom-control]')) {
      return;
    }

    dragRef.current = {
      isDown: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originPanX: pan.x,
      originPanY: pan.y,
      hasMoved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDown) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (!dragRef.current.hasMoved && Math.hypot(dx, dy) > 4) {
      dragRef.current.hasMoved = true;
      setIsDragging(true);
      setHasInteracted(true);
      // Capture pointer now that we are actively dragging
      try {
        containerRef.current?.setPointerCapture(dragRef.current.pointerId);
      } catch {
        // Safe ignore
      }
    }

    if (dragRef.current.hasMoved) {
      const container = containerRef.current;
      const boundX = container ? container.clientWidth * 1.5 : 800;
      const boundY = container ? container.clientHeight * 1.5 : 600;

      const nextX = Math.min(Math.max(dragRef.current.originPanX + dx, -boundX), boundX);
      const nextY = Math.min(Math.max(dragRef.current.originPanY + dy, -boundY), boundY);

      setPan({
        x: nextX,
        y: nextY,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.isDown) {
      if (dragRef.current.hasMoved) {
        try {
          containerRef.current?.releasePointerCapture(dragRef.current.pointerId);
        } catch {
          // Safe ignore
        }
      }
      dragRef.current.isDown = false;
      setIsDragging(false);
    }
  };

  // If a drag operation was completed, suppress accidental child click triggers
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current.hasMoved) {
      e.stopPropagation();
      dragRef.current.hasMoved = false;
    }
  };

  // Double click toggles between 1.8x zoom at click point and reset
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-pan-zoom-control]')) return;

    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (scale > 1.25) {
      resetView();
    } else {
      zoomTo(1.8, mx, my);
    }
  };

  // Keyboard navigation (+ / - to zoom, 0 to reset, arrow keys to pan)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      zoomIn();
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      zoomOut();
    } else if (e.key === '0') {
      e.preventDefault();
      resetView();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPan((p) => ({ ...p, x: p.x + 30 }));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPan((p) => ({ ...p, x: p.x - 30 }));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setPan((p) => ({ ...p, y: p.y + 30 }));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setPan((p) => ({ ...p, y: p.y - 30 }));
    }
  };

  // Position styles for control bar
  const getControlPositionStyle = () => {
    switch (controlsPosition) {
      case 'top-left':
        return 'top-3 left-3';
      case 'bottom-left':
        return 'bottom-3 left-3';
      case 'bottom-right':
        return 'bottom-3 right-3';
      case 'top-right':
      default:
        return 'top-3 right-3';
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClickCapture={handleClickCapture}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      className={`relative w-full overflow-hidden rounded-2xl bg-[#F8F9FA] border border-[#EBE6DC] shadow-inner select-none outline-none focus:ring-1 focus:ring-[#2A9D8F]/40 ${heightClass} ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Background Dot Grid for Depth and Alignment */}
      <div 
        className="absolute inset-0 opacity-45 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #CBD5E1 1.2px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Floating Overlays (e.g. Hole Info badges, breadboard status) */}
      {overlayChildren && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {overlayChildren}
        </div>
      )}

      {/* Floating Pan & Zoom Control Bar */}
      {showControls && (
        <div
          data-pan-zoom-control="true"
          className={`absolute ${getControlPositionStyle()} z-30 flex items-center gap-1 p-1 bg-white/95 backdrop-blur-sm border border-[#EBE6DC] rounded-xl shadow-sm`}
        >
          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={zoomOut}
            title="Zoom Out (-)"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F0EEE6] active:bg-[#E5E0D5] text-[#24313A] transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Percentage (Click to reset) */}
          <button
            type="button"
            onClick={resetView}
            title="Reset to 100%"
            className="px-2 h-7 flex items-center justify-center rounded-lg hover:bg-[#E6F4F2] text-[#21867A] text-[11px] font-mono font-bold transition-colors cursor-pointer"
          >
            {Math.round(scale * 100)}%
          </button>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={zoomIn}
            title="Zoom In (+)"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F0EEE6] active:bg-[#E5E0D5] text-[#24313A] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Divider */}
          <div className="w-[1px] h-4 bg-[#EBE6DC] mx-0.5" />

          {/* Reset / Center Button */}
          <button
            type="button"
            onClick={resetView}
            title="Reset View (0)"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F0EEE6] active:bg-[#E5E0D5] text-[#576875] hover:text-[#24313A] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Instructional Helper Hint */}
      {showHint && (
        <div 
          className={`absolute bottom-3 left-3 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-[#EBE6DC] text-[10px] font-mono font-bold text-[#576875] shadow-xs transition-opacity duration-500 ${
            hasInteracted ? 'opacity-0' : 'opacity-100 animate-fade-in'
          }`}
        >
          <Move className="w-3 h-3 text-[#2A9D8F]" />
          <span>Drag to pan • Scroll to zoom</span>
        </div>
      )}

      {/* Transformable Canvas Content */}
      <div
        className={`w-full h-full flex items-center justify-center origin-center transition-transform ${
          isDragging ? 'duration-0' : 'duration-150 ease-out'
        } ${contentClassName}`}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
};
