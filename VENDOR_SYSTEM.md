# BlkXchange™ Vendor Onboarding & Product Management System

## Overview

This document describes the complete Vendor Onboarding and Product Management System for BlkXchange™, a comprehensive workflow that allows vendors to apply, get approved, and manage their physical products on the marketplace.

## System Architecture

### Database Tables

#### 1. `vendor_applications`
Stores vendor application submissions before approval.

**Fields:**
- `id` (UUID): Primary key
- `business_name` (Text): Vendor business name
- `contact_name` (Text): Contact person name
- `email` (Text): Vendor email
- `phone` (Text): Contact phone number
- `address` (Text): Business address
- `website` (Text, Optional): Website or social media links
- `category` (Enum): Product category (apparel, beauty, jewelry, food, art, books, home, wellness, tech, other)
- `description` (Text): Product description
- `price_range` (Enum): Typical price range (<$25, $25-$50, $50-$100, >$100)
- `fulfillment_method` (Enum): shipping or local delivery
- `image_urls` (JSON Array): Sample product images
- `status` (Enum): pending, approved, rejected
- `agreement_accepted` (Boolean): Must be true
- `created_at` (Timestamp): Application submission date
- `updated_at` (Timestamp): Last update date

#### 2. `vendor_accounts`
Stores vendor login credentials after approval.

**Fields:**
- `id` (UUID): Primary key
- `vendor_id` (UUID): Links to vendors.id
- `email` (Text): Login email
- `password_hash` (Text): Hashed password
- `role` (Enum): "vendor"
- `created_at` (Timestamp): Account creation date

#### 3. `products_enhanced`
Stores vendor product listings with approval workflow.

**Fields:**
- `id` (UUID): Primary key
- `vendor_id` (UUID): Linked vendor
- `name` (Text): Product name
- `category` (Enum): Product category
- `description` (Text): Product description
- `price` (Numeric): Product price
- `quantity` (Integer): Available quantity
- `image_urls` (JSON Array): Product images
- `status` (Enum): pending, approved, rejected
- `rating` (Float): Average rating (0.0)
- `reviews_count` (Integer): Number of reviews (0)
- `created_at` (Timestamp): Product submission date
- `updated_at` (Timestamp): Last update date

## User Workflows

### 1. Vendor Application Flow

**Step 1: Vendor Submits Application**
- Vendor navigates to `/vendor-apply` page
- Fills out comprehensive application form:
  - Business information (name, contact, email, phone, address, website)
  - Product information (category, description, price range, fulfillment method)
  - Sample product images (optional)
  - Reviews vendor agreement summary with link to full agreement
  - Accepts vendor agreement via required checkbox (must be checked to submit)
- Submits application
- Application status defaults to "pending"
- `agreement_accepted` field set to `true` in database
- Confirmation email sent to vendor (via Ethereal/console) with agreement acknowledgment
- Notification email sent to admin (via Ethereal/console)

**Step 2: Admin Reviews Application**
- Admin navigates to `/admin/vendors` dashboard
- Views list of all applications with status filters
- Clicks "View" to see full application details:
  - Contact information
  - Product information
  - Sample images
  - Agreement acceptance status
- Admin can:
  - **Approve**: Changes status to "approved", creates vendor account
  - **Reject**: Changes status to "rejected", sends rejection email with reason

**Step 3: Vendor Account Creation (After Approval)**
- Upon approval, system automatically:
  - Creates entry in `vendors` table
  - Sends approval email with password setup link
  - Password setup link contains secure token (expires in 24 hours)
- Vendor clicks link and sets password
- Vendor can now log in to `/vendor-dashboard`

### 2. Product Management Flow

**Step 1: Vendor Adds Product**
- Vendor logs into `/vendor-dashboard`
- Navigates to "Add Product" tab
- Fills out product form:
  - Product name
  - Category
  - Description
  - Price
  - Quantity available
  - Product images (required)
- Submits product
- Product status defaults to "pending"
- Product appears in "My Products" tab with "Pending Review" badge

**Step 2: Admin Reviews Product**
- Admin navigates to `/admin/products` dashboard
- Views list of all product submissions
- Clicks "View" to see full product details:
  - Product information
  - Images
  - Vendor information
  - Pricing and quantity
- Admin can:
  - **Approve**: Changes status to "approved", product appears in marketplace
  - **Reject**: Changes status to "rejected", sends rejection email with reason

**Step 3: Product Goes Live**
- Approved products automatically appear in main marketplace
- Products are searchable and purchasable by customers
- Vendor can see "Approved" badge in their dashboard

### 3. Vendor Dashboard Features

**My Products Tab:**
- Table view of all vendor products
- Shows product name, category, price, quantity, status, and creation date
- Status badges: Pending Review (yellow), Approved (green), Rejected (red)
- Product thumbnails displayed

**Add Product Tab:**
- Form to submit new products
- Real-time image upload with thumbnail preview
- Remove image functionality
- Submit button disabled until images are uploaded
- Alert notification about admin review process

**Profile Settings Tab:**
- Placeholder for future features:
  - Update business information
  - Change contact details
  - Update password
  - View sales analytics

## Admin Workflows

### Admin Vendor Dashboard (`/admin/vendors`)

**Features:**
- Statistics cards showing:
  - Total applications
  - Pending review count
  - Approved count
- Sortable table with columns:
  - Business name
  - Contact information
  - Category
  - Status
  - Submission date
  - Actions (View button)
- Detail view modal showing:
  - Full application information
  - Contact details with icons
  - Product information
  - Sample images gallery
  - Approve/Reject action buttons (for pending applications)

**Admin Actions:**
- **Approve Application:**
  - Confirms action with dialog
  - Updates status to "approved"
  - Creates vendor account
  - Sends approval email
  - Refreshes application list
- **Reject Application:**
  - Prompts for rejection reason
  - Updates status to "rejected"
  - Sends rejection email with reason
  - Refreshes application list

### Admin Product Dashboard (`/admin/products`)

**Features:**
- Statistics cards showing:
  - Total products
  - Pending review count
  - Approved count
- Sortable table with columns:
  - Product name with thumbnail
  - Category
  - Price
  - Quantity
  - Status
  - Submission date
  - Actions (View button)
- Detail view modal showing:
  - Full product information
  - Product images gallery
  - Vendor ID
  - Pricing and quantity details
  - Approve/Reject action buttons (for pending products)

**Admin Actions:**
- **Approve Product:**
  - Confirms action with dialog
  - Updates status to "approved"
  - Product appears in marketplace
  - Sends approval email to vendor
  - Refreshes product list
- **Reject Product:**
  - Prompts for rejection reason
  - Updates status to "rejected"
  - Sends rejection email with reason
  - Refreshes product list

## API Endpoints

### Vendor Application Endpoints

```
POST   /api/vendor-applications          Create new vendor application
GET    /api/vendor-applications          Get all applications (admin only)
GET    /api/vendor-applications/{id}     Get specific application
PUT    /api/vendor-applications/{id}/status  Update application status
```

### Vendor Account Endpoints

```
POST   /api/vendor-accounts              Create vendor account
POST   /api/vendor-accounts/login        Vendor login
```

### Enhanced Product Endpoints

```
POST   /api/products-enhanced            Create new product
GET    /api/products-enhanced            Get all products (with filters)
GET    /api/products-enhanced/{id}       Get specific product
PUT    /api/products-enhanced/{id}       Update product
PUT    /api/products-enhanced/{id}/status  Update product status
```

### Admin Endpoints

```
POST   /api/admin/approve-vendor/{id}    Approve vendor application
POST   /api/admin/reject-vendor/{id}     Reject vendor application
POST   /api/admin/approve-product/{id}   Approve product
POST   /api/admin/reject-product/{id}    Reject product
```

## Vendor Agreement System

### Agreement Page (`/vendor-agreement`)

The Vendor Agreement page displays the complete terms and conditions that all vendors must accept before selling on BlkXchange™.

**Features:**
- Full legal agreement with 12 sections covering all vendor responsibilities
- Professional layout with BlkXchange™ branding (gold and black color scheme)
- Downloadable text version at `/docs/vendor-agreement.txt`
- Effective date display (January 1, 2025)
- Tagline: "Empowering Ownership. Elevating Community."

**Agreement Sections:**
1. Introduction
2. Commission Rate (15% total: 85% vendor, 12% operations, 3% community impact)
3. Payout Terms (Net-14, $25 minimum threshold)
4. Vendor Responsibilities
5. Prohibited Items
6. Intellectual Property & Marketing
7. Product Approval Process
8. Termination & Dispute Policy
9. Tax Acknowledgment
10. Limitation of Liability
11. Changes to Agreement
12. Contact Information

### Agreement Integration in Application Form

**Vendor Apply Form (`/vendor-apply`):**

The vendor application form includes a dedicated "Vendor Agreement" section with:

1. **Agreement Summary Card:**
   - Highlights key points of the agreement
   - Explains commission structure, responsibilities, and payout terms
   - Includes "Read Full Agreement →" link that opens `/vendor-agreement` in new tab

2. **Required Checkbox:**
   - Prominently displayed with gold border
   - Text: "☐ I have read and agree to the BlkXchange™ Vendor Agreement and certify that my products are authentic and compliant."
   - Must be checked before form submission
   - Submit button disabled until checkbox is checked

3. **Database Storage:**
   - `agreement_accepted` field stored as `boolean` in `vendor_applications` table
   - Only `true` values accepted (enforced by frontend and backend validation)
   - Timestamp recorded in `created_at` field

### Email Confirmation

When a vendor submits their application, the confirmation email includes:

**Email Content:**
```
Thank you for applying to become a BlkXchange™ Vendor.

Your vendor application has been received and is being reviewed by our team.
Your agreement acceptance has been recorded.
You will be notified once your application has been reviewed.
```

This acknowledgment appears in:
- Console log emails (MVP mode)
- Ethereal test emails (testing mode)
- Production emails (SendGrid integration)

### PDF Generation

**Current Implementation:**
- Text version available at `/public/docs/vendor-agreement.txt`
- Download button on agreement page links to text file
- Contains complete agreement content in plain text format

**Future Enhancement:**
- Implement proper PDF generation using libraries like:
  - `jsPDF` (client-side)
  - `pdfkit` (server-side)
  - `puppeteer` (HTML to PDF)
- Generate branded PDF with BlkXchange™ styling
- Include digital signature capability
- Version control for agreement updates

## Email Notifications

### Email Templates

**1. Vendor Application Submitted**
- **To:** Vendor applicant
- **Subject:** "Application Received - BlkXchange™"
- **Content:** Confirmation of submission, review timeline (2-3 business days)

**2. Vendor Application Approved**
- **To:** Vendor applicant
- **Subject:** "Welcome to BlkXchange™ - Application Approved"
- **Content:** Approval notification, password setup link, next steps

**3. Vendor Application Rejected**
- **To:** Vendor applicant
- **Subject:** "BlkXchange™ Application Update"
- **Content:** Polite rejection notice, reason (if provided), reapplication instructions

**4. Product Approved**
- **To:** Vendor
- **Subject:** "Product Approved - Now Live on BlkXchange™"
- **Content:** Congratulations, product link, sales tips

**5. Product Rejected**
- **To:** Vendor
- **Subject:** "Product Review Update - BlkXchange™"
- **Content:** Rejection notice, reason, edit and resubmit instructions

### Email Configuration

**Current Setup (MVP):**
- `USE_ETHEREAL = False` in `app/email.py`
- Emails logged to console for testing
- Preview URLs not generated

**Production Setup:**
- Set `USE_ETHEREAL = True` for Ethereal testing
- Configure SendGrid for production emails
- Update email templates with production branding

## Frontend Pages

### Public Pages

1. **`/vendor-apply`** - Vendor Application Form
   - Comprehensive application form
   - File upload for sample images
   - Vendor agreement acceptance
   - Success confirmation page

2. **`/vendor-agreement`** - Vendor Agreement
   - Static page with full terms and conditions
   - Commission rate (15%: 85% vendor, 12% operations, 3% community impact)
   - Payout terms (Net-14, $25 minimum)
   - Prohibited items list
   - Vendor responsibilities
   - Intellectual property & marketing rights
   - Product approval process
   - Termination & dispute policy
   - Tax acknowledgment
   - Limitation of liability
   - Download PDF button (links to `/docs/vendor-agreement.txt`)
   - Effective date: January 1, 2025
   - Tagline: "Empowering Ownership. Elevating Community."

### Vendor Pages

3. **`/vendor-dashboard`** - Vendor Dashboard
   - Tabbed interface (My Products, Add Product, Profile Settings)
   - Product management
   - Real-time status updates

### Admin Pages

4. **`/admin/vendors`** - Admin Vendor Dashboard
   - Application review interface
   - Approve/reject functionality
   - Statistics and filtering

5. **`/admin/products`** - Admin Product Dashboard
   - Product review interface
   - Approve/reject functionality
   - Statistics and filtering

## Security & Authentication

### Admin Authentication

**Current Implementation:**
- Admin routes protected by `require_admin` dependency
- Requires `X-Admin-Secret` header with correct value
- Admin secret stored in environment variable `ADMIN_SECRET_KEY`
- Default value: "changeme" (should be changed in production)

**Usage:**
```bash
curl -H "X-Admin-Secret: your-secret-key" \
  http://localhost:8000/api/vendor-applications
```

### Vendor Authentication

**Password Setup Flow:**
1. Admin approves vendor application
2. System generates secure token (UUID)
3. Token stored with vendor_id, email, and expiry (24 hours)
4. Email sent with password setup link containing token
5. Vendor clicks link, enters password
6. Token consumed (one-time use)
7. Password hashed and stored in vendor_accounts table

**Login Flow:**
1. Vendor enters email and password
2. System verifies credentials (SHA-256 hash comparison)
3. Returns vendor_id and email on success
4. Frontend stores session data

## Environment Variables

### Backend (.env)

```
ADMIN_SECRET_KEY=your-secure-admin-password
USE_ETHEREAL=False
FRONTEND_URL=https://blkxchangemarketplace-kytxrr7p.devinapps.com
```

### Frontend (.env)

```
VITE_API_URL=https://app-tcqwzext.fly.dev
```

## Testing the System

### End-to-End Test Flow

**1. Submit Vendor Application:**
```bash
curl -X POST http://localhost:8000/api/vendor-applications \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "Test Boutique",
    "contact_name": "Jane Doe",
    "email": "jane@testboutique.com",
    "phone": "555-1234",
    "address": "123 Main St, Atlanta, GA 30303",
    "website": "https://testboutique.com",
    "category": "apparel",
    "description": "High-quality handmade clothing",
    "price_range": "$25-$50",
    "fulfillment_method": "shipping",
    "image_urls": [],
    "agreement_accepted": true
  }'
```

**2. Admin Reviews Application:**
- Navigate to `/admin/vendors`
- Add `X-Admin-Secret` header (for API calls)
- View application details
- Click "Approve" or "Reject"

**3. Vendor Logs In:**
- Navigate to `/vendor-dashboard`
- Enter credentials (after password setup)
- Access dashboard

**4. Vendor Adds Product:**
- Click "Add Product" tab
- Fill out product form
- Upload images
- Submit for review

**5. Admin Approves Product:**
- Navigate to `/admin/products`
- View product details
- Click "Approve"
- Product appears in marketplace

## Future Enhancements

### Phase 2 Features

1. **Vendor Analytics:**
   - Sales dashboard
   - Revenue tracking
   - Product performance metrics
   - Customer insights

2. **Advanced Product Management:**
   - Bulk product upload (CSV)
   - Product variants (sizes, colors)
   - Inventory management
   - Low stock alerts

3. **Enhanced Admin Tools:**
   - Bulk approval/rejection
   - Advanced filtering and search
   - Vendor performance metrics
   - Automated approval rules

4. **Communication System:**
   - In-app messaging between vendors and admin
   - Customer support tickets
   - Vendor announcements

5. **Payment Integration:**
   - Stripe Connect for vendor payouts
   - Automated commission calculation
   - Payout scheduling (Net-14)
   - Transaction history

6. **Marketing Tools:**
   - Promotional campaigns
   - Discount codes
   - Featured product placements
   - Email marketing integration

## Troubleshooting

### Common Issues

**1. Admin Dashboard Returns 401 Unauthorized:**
- Ensure `X-Admin-Secret` header is set correctly
- Check `ADMIN_SECRET_KEY` environment variable
- Verify header name is exactly `X-Admin-Secret`

**2. Products Not Appearing in Marketplace:**
- Check product status is "approved"
- Verify product has images
- Ensure quantity > 0

**3. Email Notifications Not Working:**
- Check `USE_ETHEREAL` setting in `app/email.py`
- Review backend console logs for email output
- Verify Ethereal account creation (if enabled)

**4. Frontend Not Connecting to Backend:**
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend
- Ensure backend is running and accessible

## Deployment

### Backend Deployment (Fly.io)

```bash
cd /home/ubuntu/blkxchange/blkxchange-backend
# Deploy using Devin deploy command
deploy backend dir=/home/ubuntu/blkxchange/blkxchange-backend
```

**Deployed URL:** https://app-tcqwzext.fly.dev

### Frontend Deployment (Devin Apps)

```bash
cd /home/ubuntu/blkxchange/blkxchange-frontend
npm run build
# Deploy using Devin deploy command
deploy frontend dir=/home/ubuntu/blkxchange/blkxchange-frontend/dist
```

**Deployed URL:** https://blkxchangemarketplace-kytxrr7p.devinapps.com

## Support

For questions or issues with the vendor system, contact:
- **Email:** support@blkxchange.com
- **Documentation:** This file (VENDOR_SYSTEM.md)
- **API Docs:** https://app-tcqwzext.fly.dev/docs

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Author:** Devin AI
