

## Implement Site Update Instructions (Excluding Photos)

All changes in `src/pages/Index.tsx` plus one CSS addition in `src/index.css`. Photos will be added in a subsequent message.

### 1. Update Google Maps embed URL (line ~614)
Replace the placeholder `src` with the correct search-based embed:
```
src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5689.0!2d-80.8133!3d44.1767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2s394591+Concession+2,+Durham,+West+Grey,+ON!5e0!3m2!1sen!2sca!4v1"
```

### 2. Update venue address text (line ~598)
Change `394591 Concession 2, Durham, ON · N0G 1R0` → `394591 Concession 2, Durham, West Grey, ON`

### 3. Update Tell It To Sweeney links (lines ~545-547)
Replace single Linktree link with 5 direct platform links: Spotify, Instagram, Facebook, YouTube, TikTok.

### 4. Update Honeyrunners links (lines ~557-561)
Add Facebook and TikTok to existing Spotify/Instagram/YouTube links (5 total).

### 5. Add `BandPhotoGallery` component (new, above `Bands`)
A 4-column photo grid with desaturated vintage filter, hover effects, and gold accent borders. Uses `import.meta.env.BASE_URL` for GitHub Pages compatibility. Images reference `/images/bands/` paths (will be added later).

### 6. Insert `<BandPhotoGallery />` into Bands section (line ~535)
Place between the section header `</RevealSection>` and the band cards grid.

### 7. Add responsive CSS to `src/index.css`
Mobile breakpoint to stack the photo grid to 2×2:
```css
@media (max-width: 600px) {
  .band-photo-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
```

### What's deferred
- Band photos (user will upload in next message) → will be placed in `public/images/bands/`

### Technical notes
- No new dependencies
- No structural refactoring
- All inline styles using existing `C` and `fonts` constants

