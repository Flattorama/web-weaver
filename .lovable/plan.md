

## Update Waiver Language and Checkbox Flow

Two file replacements with user-provided code:

### Step 1: Replace `src/components/WaiverContent.tsx`
- Remove all checkbox props (section1Checked, onSection1Change, section2Checked, onSection2Change, showCheckboxes)
- Replace with a simpler component (no props) containing comprehensive legal text
- New sections: Definition of Releasees, expanded Acknowledgement of Risk, Release of Liability & Waiver of Claims, Indemnity, Medical Responsibility, Media Release, General Provisions, Data Privacy & Consent, Schedule A: Property Rules
- Maintains existing inline styling patterns (headingStyle, bodyStyle, same colors)

### Step 2: Replace `src/components/WaiverDialog.tsx`
- Remove `section1Checked` and `section2Checked` state variables
- Remove props passed to `<WaiverContent>` (now takes no props)
- Update the agreement checkbox label to comprehensive legal acknowledgement text
- Keep all other functionality intact (form fields, scroll tracking, checkout submission)

Both files are full replacements with user-provided code. No other files need changes.

