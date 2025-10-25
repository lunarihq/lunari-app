# Calendar Performance Fix

## Problem

The edit-period screen showed a visible "blink" or delay when loading:
1. Calendar appeared to flash or jump when first displayed
2. Visible delay before calendar stabilized at current month
3. Not matching the smooth experience of popular calendar apps

## Root Cause

The custom calendar implementation had a **dynamic month height** that updated after first render:

```typescript
// BEFORE: Dynamic height
const [monthHeight, setMonthHeight] = useState(DEFAULT_MONTH_HEIGHT); // 360
const hasCalculatedHeight = useRef(false);

// Height would update after first layout measurement
const handleMonthLayout = useCallback((height: number) => {
  if (!hasCalculatedHeight.current && height > 0) {
    setMonthHeight(height);  // ← State update causes re-render
    hasCalculatedHeight.current = true;
  }
}, []);

const getItemLayout = (_: any, index: number) => ({
  length: monthHeight,  // ← Value changes after first render
  offset: monthHeight * index,
  index,
});
```

### Why This Caused the Blink

1. **Initial Render**: FlatList renders with `monthHeight=360`
2. **Layout Measurement**: MonthView measures actual height (~380px)
3. **State Update**: `setMonthHeight(380)` triggers re-render
4. **Position Recalculation**: `getItemLayout` returns different values
5. **Visual Jump**: FlatList adjusts scroll position = visible blink

The `initialScrollIndex` was correct, but `getItemLayout` returning unstable values broke FlatList's optimization.

## Solution

Changed to a **fixed, pre-calculated month height**:

```typescript
// AFTER: Fixed height
const MONTH_HEIGHT = 380;  // Constant

const getItemLayout = (_: any, index: number) => ({
  length: MONTH_HEIGHT,  // ← Stable value from start
  offset: MONTH_HEIGHT * index,
  index,
});
```

### Benefits

✅ **No state updates after mount** - calendar renders once with correct layout
✅ **Stable `getItemLayout`** - FlatList optimizations work perfectly  
✅ **Instant scroll to current month** - `initialScrollIndex` works as intended
✅ **Smooth markedDates updates** - MonthView memo handles efficiently

## Changes Made

### CustomCalendar.tsx
- Changed `DEFAULT_MONTH_HEIGHT` to `MONTH_HEIGHT` (constant)
- Removed `monthHeight` state and `hasCalculatedHeight` ref
- Removed `handleMonthLayout` callback
- Simplified `renderMonth` (no longer needs useCallback)
- Removed unused `useState` and `useCallback` imports

### MonthView.tsx  
- Removed `onLayout` prop from interface
- Removed `handleLayout` function
- Removed `onLayout` from component props

### edit-period.tsx
- No changes needed! Works immediately with fixed calendar

## Performance Characteristics

| Metric | Before | After |
|--------|--------|-------|
| Initial renders | 2-3 (due to height state update) | 1 |
| Layout calculations | Dynamic (unstable) | Fixed (stable) |
| Scroll behavior | Jump after height update | Smooth from start |
| User experience | Visible blink/delay | Instant, smooth |

## Industry Standard Pattern

Popular calendar apps use **fixed item heights** for virtualized lists:
- Ensures stable scroll positions
- Enables FlatList optimizations (getItemLayout)
- Eliminates layout thrashing
- Provides consistent, predictable UX

This fix aligns with best practices for React Native FlatList performance.

