

## Add Stripe Payment Links to Ticket Buttons

Two simple `href` updates and removal of the placeholder text in `src/pages/Index.tsx`.

### Changes

1. **Line 736**: Change `href="#"` → `href="https://buy.stripe.com/test_14A5kx0dr5OjdcJ5Gg73G00"` and add `target="_blank" rel="noopener noreferrer"` (GA ticket)

2. **Line 769**: Change `href="#"` → `href="https://buy.stripe.com/test_14A28le4h1y3dcJ0lW73G01"` and add `target="_blank" rel="noopener noreferrer"` (Bed Space ticket)

3. **Lines 783–789**: Remove the placeholder `RevealSection` that says "Ticket Tailor widget or Stripe Payment Link will be embedded here."

