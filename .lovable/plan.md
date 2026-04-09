

## Apply 18 Content Changes from CSV Change Log

All changes are in `src/pages/Index.tsx`. Here's what will be updated:

### Hero Section (Changes 1–2)
- **Swap band billing order** (line ~332): "Tell It To Sweeney" first, then "The Honeyrunners"
- **Replace lodging subcopy** (line ~347): Change "Limited cabin space available" to "Limited trailer space, very limited Airbnb room space."

### The Evening Section (Changes 3–6)
- **Headline** (line ~398): "A Town Frozen in Time." → "An Event Frozen in Time."
- **Body copy** (line ~419): Update third paragraph to mention stargazing space, trailer space for a fee, and very limited Airbnb space
- **Amenities card — Cabins** (line ~440): Replace "Limited Cabins" card with bed-space messaging: very limited bed spaces, text 647-300-2442, identify event and yourself
- **Amenities card — Food** (line ~441): Change "Light Food Served" / "Nourishment provided..." to "Light Passed Hors d'oeuvres."

### Bands Section (Change 7)
- **Swap band cards** (lines ~537–562): Move Tell It To Sweeney card first (left), Honeyrunners second (right)

### Venue Section (Change 8)
- **Remove owners' names** (line ~587–589): Rewrite opening sentence to start with "This rustic..." removing "Jacques and Jo-Anne Leroux"

### Tickets Section (Changes 9–11)
- **Accommodation copy** (line ~644): Replace the description paragraph with full accommodation details: bed spaces first-come first-served, shared; 10 guests in Airbnb, 4 trailers sleeping up to 8; $100/person; at discretion of property owner
- **General Admission price** (line ~663): Change `$XX` to `$75`
- **Cabin Experience card** (line ~693–699): Change label to "Bed Space", update copy to "Bed and restroom access (shared)", price to `$100`

### FAQ Section (Changes 12–18)
- **Dress up** (line ~824): → "Yes. Be your sparkly self in 20's gear."
- **Parking** (line ~825): → "Limited parking is available."
- **Camping** (line ~826): → "Stargazing is allowed in the meadow area behind the Barn."
- **Refund** (line ~827): → "No refunds for this artist-supporting event."
- **Accessible** (line ~828): → "Much of the land is fairly flat and the house is fully wheelchair accessible. Please note that the surrounding fields are not wheelchair accessible."
- **Waiver** (line ~829): → 'Still Life Retreat is a "Use at Own Risk" property — no lifeguards.'
- **Start/end time** (line ~830): → "Feel free to join the property on Saturday after 6:00 pm and enjoy the sun and small beach area until Sunday at 6:00 pm."

### Technical Notes
- All 18 changes are text/content swaps and element reordering within `src/pages/Index.tsx`
- No new files, dependencies, or structural changes needed

