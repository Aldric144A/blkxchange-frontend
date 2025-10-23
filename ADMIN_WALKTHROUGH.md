# BlkXchange™ Admin Dashboard - Complete Walkthrough Guide

## 🔐 Initial Setup

### Accessing the Admin Dashboard

1. **Navigate to Admin Dashboard**
   - URL: `https://blkxchangemarketplace-kytxrr7p.devinapps.com/admin/vendors`
   - Or click "Admin" in the main navigation menu

2. **Enter Admin Password**
   - When you first visit any admin page, you'll see a prompt: "🔐 Enter Admin Password"
   - **Default Password:** `changeme`
   - This password is stored in your browser's localStorage for convenience
   - To reset: Clear your browser's localStorage or use a new incognito window

3. **Troubleshooting Authentication Issues**
   - If you see "401 Unauthorized" errors or "0 applications" when there should be data:
     - Open browser console (F12)
     - Run: `localStorage.setItem('admin_secret', 'changeme'); location.reload();`
   - If the password prompt doesn't appear:
     - Your browser may be blocking prompts
     - Manually set the password using the console command above

---

## 📋 Section 1: Managing Vendors & Products

### A. Adding a Vendor Manually

**URL:** `/admin/vendors`

**Step-by-Step Process:**

1. **Navigate to Vendors Dashboard**
   - Click "Vendors" in the admin navigation
   - You'll see a dashboard showing:
     - Total Applications count
     - Approved/Pending/Rejected counts
     - Table of all vendor applications

2. **Click "Add Vendor" Button**
   - Located in the top-right corner (green button with Plus icon)
   - A modal will open with the vendor creation form

3. **Fill in Required Fields** (marked with red asterisk *)

   **Business Information:**
   - **Business Name*** (e.g., "EquiLife Wellness Network, Inc.")
   - **Owner Name*** (e.g., "Aldric")
   - **Email*** (e.g., "aldricmarshall3@gmail.com")
   - **Phone*** (e.g., "5615024921")

   **Category Selection:**
   - **Category*** - Select from dropdown:
     - Apparel & Accessories
     - Art & Collectibles
     - Automotive & Transportation
     - Beauty & Wellness
     - Books & Stationery
     - Food & Beverage
     - Health & Pharmacy
     - Home & Living
     - Manufacturing & Trades
     - Technology & Gadgets

   **Description:**
   - **Description*** - Describe the business (e.g., "A clothing company specializing in DEI apparel")

   **Optional Fields:**
   - **Website URL** (e.g., "https://DEIapparel.store")
   - **Logo URL** (e.g., "https://deiapparel.store/cdn/shop/files/DEI.png")

   **Location:**
   - **Address*** (e.g., "2708 N. Australian West Palm Beach, FL 33407")
   - **ZIP Code*** (e.g., "33407")

   **Status:**
   - **Status** - Select from dropdown:
     - ✅ **Approved** (vendor can immediately start selling)
     - ⏳ **Pending** (requires manual approval)
     - ❌ **Rejected** (vendor application denied)

4. **Submit the Form**
   - Click "Create Vendor" button (gold button at bottom)
   - If successful, you'll see: "✅ Vendor created successfully!"
   - The modal will close and the vendor list will refresh

5. **Verify the Vendor**
   - The new vendor should appear in the table
   - Check the status badge (green for Approved)
   - Click "View Details" to see full vendor information

**Example Vendor Entry:**
```
Business Name: EquiLife Wellness Network, Inc.
Owner Name: Aldric
Email: aldricmarshall3@gmail.com
Phone: 5615024921
Category: Apparel & Accessories
Description: A clothing company specializing in DEI apparel and wellness products
Website: https://DEIapparel.store
Logo URL: https://deiapparel.store/cdn/shop/files/DEI.png?v=1739666872&width=140
Address: 2708 N. Australian West Palm Beach, FL 33407
ZIP Code: 33407
Status: Approved
```

---

### B. Adding Products to a Vendor

**URL:** `/admin/products`

**Step-by-Step Process:**

1. **Navigate to Products Dashboard**
   - Click "Products" in the admin navigation
   - You'll see all products from all vendors

2. **Click "Add Product" Button**
   - Located in the top-right corner
   - A modal will open with the product creation form

3. **Fill in Required Fields**

   **Product Information:**
   - **Vendor ID*** - The UUID of the vendor (copy from vendor details)
     - To find: Go to Vendors page → Click "View Details" → Copy the ID
   - **Product Name*** (e.g., "DEI T-Shirt - Black")
   - **Description*** (e.g., "Premium cotton t-shirt with DEI logo")
   - **Price*** (e.g., "29.99")
   - **Quantity*** (e.g., "100")

   **Category:**
   - **Category*** - Must match one of the vendor categories:
     - apparel_accessories
     - art_collectibles
     - automotive_transportation
     - beauty_wellness
     - books_stationery
     - food_beverage
     - health_pharmacy
     - home_living
     - manufacturing_trades
     - technology_gadgets

   **Images:**
   - **Image URLs** - Comma-separated list of image URLs
     - Example: "https://example.com/image1.jpg,https://example.com/image2.jpg"

   **Status:**
   - **Status** - Select from dropdown:
     - ✅ **Approved** (product visible on marketplace)
     - ⏳ **Pending** (requires manual approval)
     - ❌ **Rejected** (product not visible)

4. **Submit the Form**
   - Click "Create Product" button
   - If successful, you'll see: "✅ Product created successfully!"

5. **Verify the Product**
   - The product should appear in the products table
   - Visit the marketplace page to see it live: `/marketplace`

**Example Product Entry:**
```
Vendor ID: [Copy from vendor details page]
Product Name: DEI T-Shirt - Black
Description: Premium 100% cotton t-shirt featuring the DEI logo. Available in sizes S-XXL.
Price: 29.99
Quantity: 100
Category: apparel_accessories
Image URLs: https://deiapparel.store/cdn/shop/files/tshirt-black.jpg
Status: Approved
```

---

### C. Bulk Import Vendors

**URL:** `/admin/vendors`

**Step-by-Step Process:**

1. **Click "📥 Bulk Import" Button**
   - Located next to the "Add Vendor" button
   - A multi-step wizard modal will open

2. **Step 1: Upload CSV File**
   - Click "Download CSV Template" to get the correct format
   - Fill in your CSV file with vendor data
   - Click "Choose File" and select your CSV
   - Click "Next" to proceed

3. **Step 2: Validate Data**
   - The system will validate all rows
   - Required fields: business_name, owner_name, email, phone, address, category, description, status
   - Any errors will be displayed
   - Click "Next" if validation passes

4. **Step 3: Preview Data**
   - Review the data in a table format
   - Check for any issues
   - Click "Import" to proceed

5. **Step 4: Import Complete**
   - You'll see a summary:
     - ✅ Successfully added: X records
     - ⚠️ Skipped (duplicates): X records
     - ❌ Failed: X records
   - Any errors will be listed
   - An email confirmation will be sent to admin@blkxchange.com

**CSV Template Format:**
```csv
business_name,owner_name,email,phone,address,website,category,description,status,logo_url
"Business Name","Owner Name","email@example.com","555-1234","123 Main St","https://example.com","apparel_accessories","Description here","approved","https://example.com/logo.png"
```

---

## 💼 Section 2: Managing Professionals

### A. Adding a Professional Manually

**URL:** `/admin/professionals`

**Step-by-Step Process:**

1. **Navigate to Professionals Dashboard**
   - Click "Professionals" in the admin navigation
   - You'll see all pending professional submissions

2. **Click "Add Professional" Button**
   - Located in the top-right corner
   - A modal will open with the professional creation form

3. **Fill in Required Fields**

   **Personal Information:**
   - **Name*** (e.g., "Dr. Sarah Johnson")
   - **Email*** (e.g., "sarah.johnson@example.com")
   - **Phone*** (e.g., "555-9876")

   **Professional Details:**
   - **Category*** - Select from dropdown:
     - Coaching & Consulting
     - Education & Tutoring
     - Event & Hospitality
     - Finance & Insurance
     - Health & Medical
     - Legal & Advocacy
     - Media & Marketing
     - Nonprofits & Community
     - Real Estate & Wealth
     - Technology & Innovation
     - Trades & Home
     - Transportation & Logistics
     - Arts & Culture
     - Black Media
     - Faith & Resilience
     - HBCUs & Education
     - Travel & Heritage
     - Other

   - **Business Name** (e.g., "Johnson Wellness Coaching")
   - **Tagline** (e.g., "Empowering Lives Through Holistic Wellness")
   - **Bio*** (e.g., "Certified life coach with 10+ years of experience...")
   - **Credentials** (e.g., "Certified Life Coach (CLC), MBA")

   **Location:**
   - **ZIP Code*** (e.g., "33407")

   **Optional Fields:**
   - **Image URL** (e.g., "https://example.com/profile.jpg")

4. **Submit the Form**
   - Click "Create Professional" button
   - If successful, you'll see: "✅ Professional created successfully!"

5. **Verify the Professional**
   - The professional should appear in the professionals list
   - Visit the professionals page to see them live: `/professionals`
   - They will appear on the map based on their ZIP code

**Example Professional Entry:**
```
Name: Dr. Sarah Johnson
Email: sarah.johnson@wellness.com
Phone: 5615551234
Category: Coaching & Consulting
Business Name: Johnson Wellness Coaching
Tagline: Empowering Lives Through Holistic Wellness
Bio: Certified life coach with over 10 years of experience helping individuals achieve their personal and professional goals. Specializing in career transitions, work-life balance, and personal development.
Credentials: Certified Life Coach (CLC), MBA, ICF Member
ZIP Code: 33407
Image URL: https://example.com/sarah-johnson.jpg
```

---

### B. Bulk Import Professionals

**URL:** `/admin/professionals`

**Process:** Same as bulk import vendors, but with professional-specific fields.

**CSV Template Format:**
```csv
name,email,phone,category,business_name,tagline,bio,credentials,zip,image_url
"Dr. Name","email@example.com","555-1234","coaching_consulting","Business Name","Tagline","Bio text","Credentials","33407","https://example.com/image.jpg"
```

---

## 📢 Section 3: Managing Advertisements

### A. Adding an Ad Manually

**URL:** `/admin/ads`

**Step-by-Step Process:**

1. **Navigate to Ads Dashboard**
   - Click "Ads" in the admin navigation
   - You'll see all ad creatives and their status

2. **Click "Add Ad" Button**
   - Located in the top-right corner
   - A modal will open with the ad creation form

3. **Fill in Required Fields**

   **Advertiser Information:**
   - **Advertiser Name*** (e.g., "DEI Apparel")
   - **Tagline** (e.g., "Diversity. Equity. Inclusion.")

   **Ad Creative:**
   - **Asset URL*** - URL to the ad image/banner
     - Example: "https://deiapparel.store/cdn/shop/files/banner-ad.jpg"
     - Recommended sizes:
       - Sidebar: 300x250px or 300x600px
       - Banner: 728x90px or 970x250px

   **Ad Type:**
   - **Ad Type*** - Select from dropdown:
     - 🖼️ **Image** (static image ad)
     - 🎬 **Video** (video ad)
     - 🎠 **Carousel** (multiple images)

   **Placement:**
   - **Pages*** - Select where the ad should appear:
     - 🏠 **Landing** (homepage)
     - 🛍️ **Marketplace** (products page)
     - 💼 **Professionals** (services page)
     - 📰 **Articles** (blog/news page)
     - Multiple selections allowed

   **Campaign Details:**
   - **Target URL*** - Where users go when they click the ad
     - Example: "https://DEIapparel.store"
   - **Start Date** (optional) - When the ad should start showing
   - **End Date** (optional) - When the ad should stop showing

   **Status:**
   - **Status** - Select from dropdown:
     - ✅ **Live** (ad is active and showing)
     - ⏸️ **Paused** (ad is temporarily disabled)
     - 📝 **Draft** (ad is not yet published)

4. **Submit the Form**
   - Click "Create Ad" button
   - If successful, you'll see: "✅ Ad created successfully!"

5. **Verify the Ad**
   - The ad should appear in the ads table
   - Visit the page(s) where you set it to appear
   - Check the sidebar or banner area to see it live

**Example Ad Entry:**
```
Advertiser Name: DEI Apparel
Tagline: Diversity. Equity. Inclusion.
Asset URL: https://deiapparel.store/cdn/shop/files/sidebar-ad-300x250.jpg
Ad Type: Image
Pages: Marketplace, Professionals
Target URL: https://DEIapparel.store
Start Date: 2025-10-23
End Date: 2025-11-23
Status: Live
```

---

### B. Bulk Import Ads

**URL:** `/admin/ads`

**Process:** Same as bulk import vendors, but with ad-specific fields.

---

## 🔍 Verification & Testing

### Verifying Vendors

1. **Admin Dashboard Check:**
   - Go to `/admin/vendors`
   - Verify the vendor appears in the table
   - Check the status badge (green = approved)
   - Click "View Details" to see full information

2. **Live Site Check:**
   - Go to `/marketplace`
   - The vendor's products should be visible (if they have products)
   - Filter by the vendor's category to find their products

### Verifying Products

1. **Admin Dashboard Check:**
   - Go to `/admin/products`
   - Verify the product appears in the table
   - Check the status (approved products are visible)

2. **Live Site Check:**
   - Go to `/marketplace`
   - Filter by category
   - The product should appear in the grid
   - Click on the product to see details

### Verifying Professionals

1. **Admin Dashboard Check:**
   - Go to `/admin/professionals`
   - Verify the professional appears in the table

2. **Live Site Check:**
   - Go to `/professionals`
   - The professional should appear on the map (based on ZIP code)
   - They should also appear in the list below the map
   - Filter by category to find them

### Verifying Ads

1. **Admin Dashboard Check:**
   - Go to `/admin/ads`
   - Verify the ad appears in the table
   - Check the status (live ads are active)

2. **Live Site Check:**
   - Visit the page(s) where the ad should appear
   - Check the sidebar or banner area
   - The ad should be visible and clickable
   - Clicking should redirect to the target URL

---

## 🐛 Troubleshooting Common Issues

### Issue 1: "Failed to create vendor/product/professional/ad"

**Cause:** Admin password is not set or is incorrect.

**Solution:**
1. Open browser console (F12)
2. Run: `localStorage.getItem('admin_secret')`
3. If it returns `null` or empty string:
   - Run: `localStorage.setItem('admin_secret', 'changeme'); location.reload();`
4. Try creating the entry again

### Issue 2: "401 Unauthorized" errors

**Cause:** Admin password is incorrect or expired.

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Reload the page
3. Enter the correct admin password when prompted
4. Default password: `changeme`

### Issue 3: Data not appearing on live site

**Cause:** Status is not set to "Approved" or "Live".

**Solution:**
1. Go to the admin dashboard for that data type
2. Find the entry in the table
3. Check the status badge
4. If it's "Pending" or "Draft", edit it and change status to "Approved" or "Live"

### Issue 4: Bulk import fails with validation errors

**Cause:** CSV format is incorrect or required fields are missing.

**Solution:**
1. Download the CSV template from the bulk import modal
2. Compare your CSV with the template
3. Ensure all required fields are filled
4. Check that category values match exactly (use underscores, not spaces)
5. Verify email addresses are valid
6. Try importing again

### Issue 5: Professional not appearing on map

**Cause:** ZIP code is invalid or geocoding failed.

**Solution:**
1. Verify the ZIP code is a valid US ZIP code
2. The system uses OpenStreetMap Nominatim for geocoding
3. If the ZIP code is valid but still not showing, try a nearby ZIP code
4. Check the browser console for geocoding errors

---

## 📧 Email Notifications

After every bulk import, an email confirmation is sent to `admin@blkxchange.com` with:
- ✅ Number of records successfully added
- ⚠️ Number of duplicates skipped
- ❌ Number of errors
- Detailed error messages (if any)
- Link to the admin dashboard

**Current Mode:** Console logging (MVP)
- Emails are logged to the backend console
- To enable real emails: Set `USE_ETHEREAL=True` in backend environment

---

## 🔗 Quick Links

- **Admin Vendors:** `/admin/vendors`
- **Admin Products:** `/admin/products`
- **Admin Professionals:** `/admin/professionals`
- **Admin Ads:** `/admin/ads`
- **Live Marketplace:** `/marketplace`
- **Live Professionals:** `/professionals`
- **Live Homepage:** `/`

---

## 📝 Notes

- All manually created entries are automatically approved (unless you change the status)
- Bulk imports can set status per row in the CSV
- Admin password is stored in browser localStorage for convenience
- The default admin password is `changeme` (should be changed in production)
- All timestamps are in UTC
- Images must be publicly accessible URLs (no file uploads yet)

---

## 🚀 Next Steps

1. **Change Admin Password:**
   - Update `ADMIN_SECRET_KEY` environment variable in backend
   - Default: `changeme`

2. **Enable Real Email Notifications:**
   - Set `USE_ETHEREAL=True` for testing
   - Configure SendGrid for production

3. **Add More Vendors:**
   - Use the "Add Vendor" button or bulk import
   - Ensure all required fields are filled

4. **Add Products:**
   - Each vendor needs at least one product
   - Products must be approved to appear on marketplace

5. **Monitor Analytics:**
   - Check the impact dashboard: `/impact`
   - View donation metrics and community stats

---

**Last Updated:** October 23, 2025
**Version:** 1.0
**Author:** Devin AI Assistant
