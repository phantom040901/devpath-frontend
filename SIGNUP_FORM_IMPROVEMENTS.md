# Signup Form Improvements

## Changes Made

### 1. Enhanced Course Selection

**Added more course options:**
- BS Computer Science
- BS Information Technology
- BS Information Systems
- BS Computer Engineering
- BS Software Engineering
- **Other** (with text input for custom course name)

**Dynamic "Other" Course Field:**
- When user selects "Other", a text input field appears
- User can specify their exact course name
- Required field when "Other" is selected

### 2. Enrollment Status Field

**New field: "Are you currently enrolled?"**
- Yes, I am currently enrolled
- No, I am not currently enrolled

This helps the system understand the student's current academic status.

### 3. Conditional Year Level Options

**Smart year level filtering based on enrollment status:**

**If ENROLLED (currently studying):**
- 1st Year
- 2nd Year
- 3rd Year
- 4th Year

**If NOT ENROLLED:**
- 1st Year
- 2nd Year only

**Rationale:** Students who are not currently enrolled are assumed to be in earlier stages (1st or 2nd year) or have not yet reached upper years. This prevents confusion and ensures data accuracy.

### 4. User Experience Improvements

**Progressive Form:**
- Year level field is disabled until enrollment status is selected
- Placeholder text changes based on selection state
- Clear visual feedback for required fields

**Data Validation:**
- Course field is required
- If "Other" is selected, otherCourse field becomes required
- Enrollment status is required before year level can be selected
- Year level options dynamically update based on enrollment status

## Updated Data Structure

### New Fields in User Profile:

```javascript
{
  // Existing fields
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",

  // Updated course field
  course: "BS Computer Science", // or custom value from otherCourse

  // New field
  isEnrolled: true, // boolean - true if currently enrolled, false otherwise

  // Existing yearLevel field
  yearLevel: "3rd Year"
}
```

## Files Modified

1. **[SignUpModal.jsx](src/components/sections/Modal/SignUpModal.jsx)**
   - Added `otherCourse` and `isEnrolled` to state
   - Enhanced course dropdown with more options
   - Added conditional "Other" course text input
   - Added enrollment status dropdown
   - Made year level options conditional based on enrollment status
   - Updated signup function to save new fields

## Visual Flow

```
User starts signup form
    ↓
Enters name, email, password
    ↓
Selects Course
    ├─ If "Other" → Enter custom course name
    └─ If predefined → Continue
    ↓
Selects Enrollment Status
    ├─ "Yes, enrolled" → Year Level: 1st, 2nd, 3rd, 4th
    └─ "No, not enrolled" → Year Level: 1st, 2nd only
    ↓
Accepts terms & submits
```

## Benefits

1. **Better Data Quality**
   - More accurate course information
   - Clearer enrollment status
   - Appropriate year level options

2. **Improved UX**
   - Flexibility with "Other" course option
   - Prevents invalid year level selections
   - Clear progression through form

3. **Future-Proof**
   - Easy to add more courses
   - Enrollment status can be used for targeted features
   - Year level logic is reusable

## Testing Checklist

- [ ] Select each predefined course option
- [ ] Select "Other" and enter custom course name
- [ ] Try submitting without filling "Other" course field
- [ ] Select "Yes, enrolled" and verify all 4 year levels appear
- [ ] Select "No, not enrolled" and verify only 1st and 2nd year appear
- [ ] Try selecting year level before enrollment status
- [ ] Complete full signup flow with each variation
- [ ] Verify data is correctly saved to Firestore

## Future Enhancements (Optional)

1. **Course Categories:**
   - Group courses by category (Computing, Engineering, etc.)

2. **Smart Defaults:**
   - Pre-select common options based on university

3. **Validation:**
   - Suggest courses as user types in "Other" field
   - Warn if unusual year level for enrollment status

4. **Analytics:**
   - Track which courses are most common
   - Identify users entering "Other" to add new course options

---

**Created:** November 4, 2025
**Version:** 1.0
**Status:** ✅ Implemented & Running
