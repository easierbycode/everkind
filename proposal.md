# EverKind Keepsakes — MVP Proposal & Scope

**Prepared for:** <Client / Funeral Home Group>  
**Prepared by:** <Your Name / Company>  
**Date:** <MM/DD/2025>  
**Version:** 1.0

---

## Summary
Design and launch a compassionate ecommerce experience for personalized memorial dog tags and keepsakes. Families can upload a photo, preview in 3D, add back text (e.g., the Lord’s Prayer), pay securely, and track their order through to delivery. This is the **MVP** scope—polished, focused, and ready to pilot with 1–3 partner locations.

---

## Deliverables (MVP)
1. **Branded storefront (static pages)**  
   - Home (hero, feature strip, gallery, how‑it‑works)  
   - Product detail (dog‑tag focus) with 3D preview placeholder and copy  
   - Order tracking page (enter order # + email)  
   - FAQ + Contact  
   - Partner teaser section (CTA to inquire)  

2. **3D Preview (web)**  
   - **Three.js viewer**: dog‑tag body with **front photo** and **back engraved text**  
   - Rotate/zoom; front/back toggle; downloadable PNG proof  
   - Accessibility: keyboard rotate, ARIA live status messages  

3. **Checkout & Orders**  
   - **Stripe Checkout** (card/Apple/Google Pay)  
   - Webhook to mark payment **Paid**  
   - Minimal order model (order id, contact, material/finish, assets, status timeline)  
   - **Statuses:** Created → Auto‑Preview → Awaiting Approval → In Production → Shipped → Delivered  
   - Email notifications: order received, preview ready, in production, shipped  

4. **Admin‑lite**  
   - Private endpoint or small admin view to update order status and upload the final proof  

5. **Deployment**  
   - Static site hosted on **GitHub Pages** (frontend)  
   - Backend (Stripe + orders + webhook) deployed to client‑owned host (Render/Railway/Fly/Vercel/Heroku)  
   - DNS + SSL guidance

---

## Out of Scope (MVP)
- Multi‑location partner portal, co‑branding per funeral home  
- SMS messaging; shipping label purchase/rates  
- Tax automation (Avalara/TaxJar), multi‑currency  
- Role‑based permissions, SSO, SLAs  
- Complex analytics dashboards  

> These can be added later as paid enhancements.

---

## Timeline
**3–4 weeks** from kickoff, assuming timely feedback.
- Week 1: Finalize copy/visuals, stand up static pages, connect Stripe in test  
- Week 2: Implement/refine 3D preview, order model, notifications  
- Week 3: Admin‑lite, QA, accessibility pass, content loading  
- Week 4: Deploy, handoff, pilot support  

---

## Investment
- **Fixed build fee:** **$9,500**  
- **Care plan:** **$149/mo** (hosting oversight, SSL, backups, monitoring, dependency updates, 2 hours/month of content/support)  

**Payment terms:** 50% at kickoff • 30% at review‑ready • 20% at handoff/deploy  
**Change orders:** Work beyond this scope billed at $120/hr or quoted fixed per feature.

---

## Technical Notes
- **Frontend:** Static site (Pages), Three.js preview, responsive, WCAG 2.2 AA best‑effort  
- **Backend:** Node/Express (or equivalent) with Stripe SDK, order store (Postgres/SQLite/R2/S3 for assets) on client account  
- **Email:** Transactional provider (Resend/SendGrid/Mailgun) on client account; SPF/DKIM setup guidance  
- **Security & privacy:** HTTPS everywhere; images retained only for production and support; optional deletion after delivery; basic access protection for admin‑lite  

---

## Client Responsibilities
- Provide logo, preferred brand name (e.g., **EverKind Keepsakes**), and domain  
- Approve copy and featured photos (3–6 pieces)  
- Create/assign accounts: Stripe, email provider, hosting  

---

## Acceptance Criteria (MVP)
- A visitor can customize a dog tag (front photo + back text), preview in 3D, download a proof, complete payment via Stripe, receive emails, and check order status online.  
- Admin‑lite allows manual status updates and uploading a final proof image.  
- Site loads on mobile and desktop; basic accessibility verified (keyboard nav, contrast checks).  

---

## Warranty & Support
- **30‑day bug‑fix warranty** from launch (defects against scope).  
- Ongoing maintenance via Care plan; additional requests via change order.  

---

## Optional Add‑Ons (not included)
- SMS notifications (+$1,200 setup)  
- Face‑aware auto‑crop (+$900)  
- Shipping rates/labels integration (+$1,800)  
- Partner portal (multi‑location, co‑branding) (+$8,500+)  

---

## Sign‑Off
**Client**__________________________________  
Name / Title / Date

**Provider**_______________________________  
Name / Title / Date

