# Specification

## Summary
**Goal:** Revert the Admin Dashboard, AdminSidebar, AdminProductsPage, and global CSS/Tailwind configuration back to their state before the most recent (Version 2) deployment.

**Planned changes:**
- Restore `AdminDashboardPage.tsx` to its pre-Version-2 implementation, including original rounded summary cards, layout, colors, icons, and low-stock alerts section.
- Restore `AdminSidebar.tsx` to its pre-Version-2 implementation, including original navigation links (Dashboard, Products, Sales, Enquiries, Logout), icons, and mobile behavior.
- Restore `AdminProductsPage.tsx` to its pre-Version-2 implementation, including original product list layout, status badges, and action buttons.
- Restore `frontend/src/index.css` and `frontend/tailwind.config.js` to their pre-Version-2 state, including original Ayurvedic color tokens, typography, and theme variables.

**User-visible outcome:** The admin panel looks and behaves exactly as it did before the Version 2 deployment, with no new UI elements, color overrides, or layout changes remaining.
