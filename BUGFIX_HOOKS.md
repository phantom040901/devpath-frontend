# React Hooks Bug Fix

## Issue
```
React has detected a change in the order of Hooks called by CareerReports.
This will lead to bugs and errors if not fixed.
```

## Root Cause
We were calling `useState` inside a `.map()` loop, which violates the **Rules of Hooks**:
- ❌ Hooks must be called at the top level
- ❌ Hooks cannot be called inside loops, conditions, or nested functions

### Problematic Code:
```jsx
{detailedExplanations.map((explanation, idx) => {
  // ❌ WRONG: useState inside map loop
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(idx === 0);

  return <div>...</div>;
})}
```

## Solution
Use a single state object at the component level to track all expanded cards:

### Fixed Code:
```jsx
// ✅ At component level (top-level hook)
const [expandedCards, setExpandedCards] = useState({ 0: true }); // First card expanded

// ✅ Inside map, just read from state
{detailedExplanations.map((explanation, idx) => {
  const isDetailsOpen = expandedCards[idx] || false;

  const toggleDetails = () => {
    setExpandedCards(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return <div>...</div>;
})}
```

## Changes Made

### 1. Added State at Component Level
```jsx
const [expandedCards, setExpandedCards] = useState({ 0: true });
```
- Object with card indices as keys
- Values are boolean (true = expanded, false/undefined = collapsed)
- Card 0 starts as `true` (first match expanded by default)

### 2. Updated Map Logic
```jsx
const isDetailsOpen = expandedCards[idx] || false;
```
- Read from state object
- Fallback to `false` if not set

### 3. Created Toggle Function
```jsx
const toggleDetails = () => {
  setExpandedCards(prev => ({
    ...prev,
    [idx]: !prev[idx]
  }));
};
```
- Spreads previous state
- Toggles specific card index
- Works for any number of cards

## Result
✅ No more Hooks error
✅ Each card's state tracked independently
✅ First card expanded by default
✅ Smooth collapse/expand animations work correctly

## Files Modified
- `Finished/src/pages/CareerReports.jsx`
  - Line 638: Added `expandedCards` state
  - Lines 1359-1366: Read state and create toggle function
  - Line 1417: Use `toggleDetails` function

## Testing
1. Navigate to `/student/reports`
2. ✅ First match should be expanded
3. ✅ Click "See Why This Matches You" on other cards
4. ✅ Details expand smoothly
5. ✅ No console errors
