# Specification

## Summary
**Goal:** Build the Sanukhabar multi-category news portal with a public browsing experience and an authenticated admin area for managing articles and categories.

**Planned changes:**
- Create a responsive public frontend with a newspaper-inspired theme (off-white, charcoal text, muted red accents; serif headlines, sans-serif UI) and a header branded “Sanukhabar”.
- Add category navigation and category pages that filter article lists by category.
- Implement article lists (latest, by category) with search by title, sorting (Latest/Oldest), pagination, and clear empty states.
- Add article detail pages showing full content plus metadata (title, category, publish date, author if present, cover image if present) and an “Article not found” state.
- Implement a single Motoko backend actor with stable storage and CRUD APIs for articles and categories (list latest/by category with pagination; get by id; create/update/delete).
- Add Internet Identity authentication and an admin UI with protected routes; enforce backend authorization so only admins can create/update/delete.
- Include generated static brand assets under `frontend/public/assets/generated` and render them in the header (logo) and home page (hero/banner).

**User-visible outcome:** Visitors can browse and search Sanukhabar news by category and read full articles on any device, while authenticated admins can sign in with Internet Identity to publish and manage articles and categories.
