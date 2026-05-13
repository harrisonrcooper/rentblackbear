// Drag-to-reorder primitive built on @dnd-kit.
//
// Why dnd-kit: HTML5 drag-and-drop is broken on touch devices, and
// touch-first is the baseline for this app. dnd-kit's PointerSensor
// handles mouse + touch + pen uniformly, has built-in keyboard a11y
// (up/down arrow + space), respects prefers-reduced-motion, and adds
// only ~30KB after tree-shaking.
//
// Activation distance of 6px on PointerSensor matters: it prevents
// drag from hijacking taps on the inline inputs / step buttons that
// already live inside every row. Users have to actually drag, not
// just tap, to start a reorder.

"use client";

import { useMemo } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { COLORS } from "../lib/tokens";
import { Icon, ICON } from "../lib/icons";

// Six-dot grip icon path — Lucide-style.
const GRIP_PATHS = ["M9 6h.01", "M9 12h.01", "M9 18h.01", "M15 6h.01", "M15 12h.01", "M15 18h.01"];

// `items` = array of objects each carrying a stable `id`.
// `onReorder(nextItems)` is called with the array in its new order.
// `renderItem(item, dragHandleProps)` renders one row; spread
// dragHandleProps onto whichever element should grab the drag.
export function SortableList({ items, onReorder, renderItem, getId, disabled, strategy = "vertical" }) {
  const idOf = getId || ((i) => i.id);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const itemIds = useMemo(() => items.map(idOf), [items, idOf]);
  const sortStrategy = strategy === "rect" ? rectSortingStrategy : verticalListSortingStrategy;

  if (disabled) {
    return <>{items.map((it) => renderItem(it, null))}</>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(e) => {
        const { active, over } = e;
        if (!over || active.id === over.id) return;
        const from = itemIds.indexOf(active.id);
        const to = itemIds.indexOf(over.id);
        if (from < 0 || to < 0) return;
        onReorder(arrayMove(items, from, to));
      }}
    >
      <SortableContext items={itemIds} strategy={sortStrategy}>
        {items.map((it) => (
          <SortableRow key={idOf(it)} id={idOf(it)}>
            {(handleProps, isDragging) => renderItem(it, handleProps, isDragging)}
          </SortableRow>
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    listeners,
    attributes,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
    zIndex: isDragging ? 5 : 1,
  };

  const handleProps = {
    ref: setActivatorNodeRef,
    ...listeners,
    ...attributes,
    "aria-label": "Drag to reorder",
    tabIndex: 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children(handleProps, isDragging)}
    </div>
  );
}

// Standalone grip icon component — drop wherever you want the drag
// handle to live. Spread the handle props from renderItem onto it.
export function DragHandle({ handleProps, style }) {
  if (!handleProps) return null;
  return (
    <button
      type="button"
      {...handleProps}
      title="Drag to reorder"
      style={{
        width: 22,
        height: 28,
        padding: 0,
        border: "none",
        background: "transparent",
        color: COLORS.textFaint,
        cursor: "grab",
        display: "grid",
        placeItems: "center",
        touchAction: "none",
        flexShrink: 0,
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.text; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.textFaint; }}
    >
      <Icon d={GRIP_PATHS} size={14} />
    </button>
  );
}
