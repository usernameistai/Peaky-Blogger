# 🥾 PeakyBlogger
> **Status:** `ACTIVE_EXPEDITION` | **Lead Developer:** `T'ai`

![Node](https://img.shields.io/badge/Engine-Node.js_20.16-339933?logo=nodedotjs)
![Database](https://img.shields.io/badge/Storage-MongoDB-47A248?logo=mongodb)
![Maps](https://img.shields.io/badge/Intel-Mapbox-000000?logo=mapbox)
![Security](https://img.shields.io/badge/Security-Passport.js-34E27A?logo=passport)

A full-stack tactical logging platform engineered for documenting Peak District traversals. Includes integrated mapping intel, secure authentication, and cloud-based image extraction.

---

## ⛰️ Mission Objectives
- **Geospatial Tracking:** Integrated **Mapbox SDK** for pinpointing trail locations and refueling points.
- **Visual Archives:** Automated image processing via **Cloudinary** and **Multer**.
- **Secure Access:** Hardened user authentication using **Passport.js** and **Local Mongoose** strategies.
- **Comm Link:** Automated notification system powered by **Nodemailer** and **Google APIs**.

---

## 🛠️ Technical Logistics
- **Frontend:** EJS & EJS-Mate (for layout modularity).
- **Backend:** Express.js with **Helmet** and **Mongo-Sanitize** for operational security.
- **Persistence:** Mongoose ODM with **Connect-Mongo** for session storage.
- **Validation:** **Joi** schema validation for data integrity.

---

## 🚀 Deployment (The Basecamp Setup)
To initialize the mission locally:

1. **Equip Dependencies:**
   ```bash
   npm install

2. **Configure Intel (.env):**
  Requires the following coordinates:
  *CLOUDINARY_CLOUD_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET

  *MAPBOX_TOKEN

  *DB_URL (MongoDB Atlas)

3. **Ignite the Engine:**
  ```bash
  npm start


🛡️ Operational Security (Hardening)

This project implements Helmet.js for CSP headers and Sanitize-HTML to prevent XSS during expedition logging.