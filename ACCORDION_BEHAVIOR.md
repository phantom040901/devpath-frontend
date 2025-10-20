# 🎯 Accordion Behavior - One Card Open at a Time

## Enhancement
Changed the collapsible cards to work like an **accordion** - when you open one card, the previously opened card automatically closes.

---

## Why This Helps Students

### Before (Multiple Cards Open):
```
┌────────────────────────────────┐
│ #1 Software Engineer     85%  │
│ ✓ Strengths...                │
│ [🔼 Got it, close]            │
│ ├─ 💡 Why this matches...     │ ← Open
│ ├─ 🌟 Top skills...           │
│ └─ Progress bars...           │
└────────────────────────────────┘

┌────────────────────────────────┐
│ #2 Web Developer         82%  │
│ ✓ Strengths...                │
│ [🔼 Got it, close]            │
│ ├─ 💡 Why this matches...     │ ← Also open!
│ ├─ 🌟 Top skills...           │
│ └─ Progress bars...           │
└────────────────────────────────┘

┌────────────────────────────────┐
│ #3 Data Scientist        78%  │
│ ✓ Strengths...                │
│ [📖 Show me why]              │
└────────────────────────────────┘
```

**Problem:** Page gets very long, lots of scrolling!

---

### After (Accordion - One at a Time):
```
┌────────────────────────────────┐
│ #1 Software Engineer     85%  │
│ ✓ Strengths...                │
│ [📖 Show me why]              │ ← Closed
└────────────────────────────────┘

┌────────────────────────────────┐
│ #2 Web Developer         82%  │
│ ✓ Strengths...                │
│ [🔼 Got it, close]            │
│ ├─ 💡 Why this matches...     │ ← Only this one open
│ ├─ 🌟 Top skills...           │
│ └─ Progress bars...           │
└────────────────────────────────┘

┌────────────────────────────────┐
│ #3 Data Scientist        78%  │
│ ✓ Strengths...                │
│ [📖 Show me why]              │ ← Closed
└────────────────────────────────┘
```

**Benefits:**
✅ Page stays shorter
✅ Less scrolling needed
✅ Focus on one career at a time
✅ Easier to compare (close one, open another)

---

## How It Works

### The Logic:

```javascript
const toggleDetails = () => {
  setExpandedCards(prev => {
    // If this card is already open, just close it
    if (prev[idx]) {
      return { ...prev, [idx]: false };
    }

    // Otherwise, close ALL cards and open only this one
    return { [idx]: true };
  });
};
```

### Behavior:

1. **Click "📖 Show me why" on Card #1**
   - Card #1 opens
   - All other cards close

2. **Click "📖 Show me why" on Card #2**
   - Card #2 opens
   - Card #1 automatically closes

3. **Click "🔼 Got it, close" on Card #2**
   - Card #2 closes
   - All cards now closed

---

## Student Flow

### Exploring Careers:

```
Student: "Let me see why #1 matches me"
→ Clicks Card #1
→ Card #1 opens, shows details

Student: "Cool! What about #2?"
→ Clicks Card #2
→ Card #2 opens, Card #1 auto-closes ✨

Student: "Interesting! Let me check #3"
→ Clicks Card #3
→ Card #3 opens, Card #2 auto-closes ✨

Student: "I'm done, close it"
→ Clicks "Got it, close"
→ Card #3 closes
```

**Result:** Clean, focused experience!

---

## Code Changes

### Before (Multiple Cards Open):
```javascript
const toggleDetails = () => {
  setExpandedCards(prev => ({
    ...prev,              // Keep all previous states
    [idx]: !prev[idx]     // Toggle current card
  }));
};
```

**Result:** Cards stay open independently

---

### After (Accordion):
```javascript
const toggleDetails = () => {
  setExpandedCards(prev => {
    // If clicking on an open card, close it
    if (prev[idx]) {
      return { ...prev, [idx]: false };
    }

    // Otherwise, close all and open only this one
    return { [idx]: true };  // ← Only this card's state
  });
};
```

**Result:** Only one card open at a time

---

## Benefits

### For Students:
- ✅ **Less Overwhelm** - Only see details for one career
- ✅ **Better Focus** - Attention on one thing at a time
- ✅ **Easier Navigation** - Less scrolling
- ✅ **Clearer Comparison** - Switch between careers easily

### For UI/UX:
- ✅ **Shorter Page** - Consistent height
- ✅ **Mobile Friendly** - Less scrolling on small screens
- ✅ **Predictable** - Always know what's open
- ✅ **Professional** - Standard accordion pattern

---

## Testing Checklist

When testing, verify:

- [ ] Only one card open at a time
- [ ] Opening a new card closes the previous one
- [ ] Clicking "Got it, close" closes the card
- [ ] Smooth collapse/expand animations
- [ ] First card starts closed (or open by default if configured)
- [ ] No visual jumps or jerky movements

---

## Animation Details

### When Switching Cards:

```
Card #1: Open → Close (height: auto → 0, opacity: 1 → 0)
         ↓
Card #2: Close → Open (height: 0 → auto, opacity: 0 → 1)
```

**Duration:** 0.3s for height, 0.2s for opacity

**Easing:** easeInOut (smooth!)

---

## File Modified

- `Finished/src/pages/CareerReports.jsx`
  - Lines 1361-1370: Updated `toggleDetails` function
  - Logic now closes all other cards when opening a new one

---

## Default Behavior

Currently set to:
```javascript
const [expandedCards, setExpandedCards] = useState({ 0: true });
```

**First card (index 0) starts open**

To change default:
- All closed: `useState({})`
- Second card open: `useState({ 1: true })`
- None: `useState({})`

---

## Student Testing Results (Expected)

**Before:**
- Students open multiple cards
- Page gets long
- Lose track of which career they're viewing
- Scroll fatigue

**After:**
- Students focus on one career
- Page stays manageable
- Clear which career is being examined
- Easy navigation

---

**Status:** ✅ Accordion Behavior Implemented!

**Result:** One card at a time = better focus! 🎯
