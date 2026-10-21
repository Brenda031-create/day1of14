# Project Planning
## Bags Selling Application

---

### Problem Statement
With an increased number of orders, the Bags selling business requires an application to receive orders, track orders, calculate revenue, keep track of profit and losses, view recommendations, and make sales more efficient.

---

### Goals & Success Metrics
| Metric | Target |
|---|---|
| Page load time | ≤ 3 seconds |
| Order processing time | ≤ 1 minute from placement to confirmation |
| System uptime | ≥ 99.5% monthly |
| Customer satisfaction score | ≥ 4/5 stars (via in-app reviews) |
| Reduction in manual order errors | ≥ 80% compared to before the system |
| Daily orders handled | Support up to 500 orders/day at launch |

---

### Target Users
- Customers
- Delivery Person
- Business Accountant
- Admin
- Sales Person

---

### User Roles & Permissions Matrix
| Feature | Customer | Sales Person | Delivery Person | Accountant | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Browse bags / view catalog | ✅ | ✅ | | | ✅ |
| Add to cart & checkout | ✅ | | | | |
| Place order by phone (logged by sales) | | ✅ | | | |
| Track own orders | ✅ | | | | |
| Leave & view reviews | ✅ | | | | ✅ |
| View all orders | | ✅ | ✅ | ✅ | ✅ |
| Update order status | | ✅ | ✅ | | ✅ |
| Manage stock (add/update/remove) | | ✅ | | | ✅ |
| View stock levels & alerts | | ✅ | | ✅ | ✅ |
| View sales reports & revenue | | | | ✅ | ✅ |
| Track profits & losses | | | | ✅ | ✅ |
| View system logs & all operations | | | | | ✅ |
| Manage user accounts | | | | | ✅ |
| Configure system settings | | | | | ✅ |

---

### Core Features (by Role)

**Customer**
- View available bags (with images, prices, categories)
- Add to cart and check out
- Pay securely through the system
- Track order status in real time
- View and leave product reviews

**Sales Person**
- Log phone orders on behalf of customers
- Update and manage stock levels
- Track and update order statuses

**Delivery Person**
- View assigned orders
- Update delivery status (Dispatched → Delivered)
- Access customer delivery address

**Business Accountant**
- View sales reports and revenue summaries
- Track profits, losses, and business progress
- Export financial reports

**Admin**
- Access all of the above
- View system logs and all operations
- Manage user accounts and roles
- Configure application settings

---

### Order Lifecycle / Status Flow
```
[Placed] → [Confirmed] → [Packed] → [Dispatched] → [Delivered] → [Completed]
                                                          ↘
                                                     [Returned] / [Cancelled]
```

| Status | Triggered By | Description |
|---|---|---|
| Placed | Customer / Sales Person | Order submitted |
| Confirmed | Sales Person / Admin | Order verified and accepted |
| Packed | Sales Person | Items packed and ready |
| Dispatched | Delivery Person | Order is on the way |
| Delivered | Delivery Person | Order received by customer |
| Completed | System (auto, after delivery) | Transaction closed |
| Cancelled | Customer / Admin | Order cancelled before dispatch |
| Returned | Admin | Item returned after delivery |

---

### Data Models / Entities

**Bag**
```
id, name, description, price, category, stock_qty, images[], is_active, created_at, updated_at
```

**Order**
```
id, customer_id, items[{ bag_id, qty, unit_price }], status, subtotal, delivery_fee,
total, delivery_address, notes, placed_at, updated_at
```

**User**
```
id, full_name, email, phone, password_hash, role (customer|sales|delivery|accountant|admin),
is_active, created_at, last_login
```

**Payment**
```
id, order_id, method (card|mobile_money|cash_on_delivery), gateway_ref, amount,
status (pending|success|failed|refunded), paid_at
```

**Review**
```
id, bag_id, customer_id, rating (1–5), comment, created_at
```

**Stock Log**
```
id, bag_id, changed_by (user_id), change_type (restock|sale|adjustment), qty_change,
new_qty, note, timestamp
```

---

### Non-Functional Requirements
| Requirement | Detail |
|---|---|
| Performance | Max 3-second page load; ≤ 1s API response for common queries |
| Live tracking | Real-time order status updates (WebSockets or polling) |
| Payment | Customers can pay directly through the system at checkout |
| Error fallback | Clear, user-friendly messages for all failed operations |
| Help & guidance | In-app tooltips and a help/FAQ section |
| Modern UI | Responsive, mobile-first design with great UX |
| Scalability | Support up to 500 concurrent users and 500 orders/day at launch |
| Availability | 99.5% uptime SLA; graceful degradation during downtime |
| Accessibility | Usable on both smartphones and computers |

---

### Tech Stack & Architecture

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React.js | Component-based, fast, widely supported |
| Styling | Tailwind CSS | Rapid UI development, responsive by default |
| Backend | Node.js + Express | Lightweight, JavaScript end-to-end |
| Database | PostgreSQL | Relational data suits orders, users, and payments |
| Authentication | JWT (JSON Web Tokens) | Stateless, secure, role-based |
| Real-time updates | Socket.io | Live order tracking notifications |
| Payment gateway | Stripe / M-Pesa | Card payments + mobile money |
| File storage | Cloudinary | Bag image uploads and CDN delivery |
| Hosting | Render (backend) + Vercel (frontend) | Free tier available, easy deployment |
| Email / SMS | SendGrid (email) + Twilio (SMS) | Order confirmations and alerts |

---

### Third-Party Integrations
| Integration | Purpose |
|---|---|
| Stripe / M-Pesa | Payment processing |
| Twilio SMS | Order status notifications to customers |
| SendGrid | Email confirmations and receipts |
| Google Maps API | Delivery address validation and route display |
| Cloudinary | Bag image storage and CDN delivery |
| Google Analytics | User behaviour and sales funnel tracking |

---

### Notifications Strategy
| Event | Customer | Sales Person | Delivery Person | Admin |
|---|---|---|---|---|
| Order placed | Email + SMS | In-app alert | | In-app alert |
| Order confirmed | Email + SMS | | | |
| Order dispatched | Email + SMS | | | |
| Order delivered | Email | | | |
| Payment failed | Email + SMS | In-app alert | | |
| Low stock alert | | In-app alert | | In-app alert |
| Account locked | Email | | | In-app alert |

---

### Payment Details
- **Supported methods:** Credit/Debit card (via Stripe), Mobile Money (M-Pesa), Cash on Delivery
- **Flow:** Customer checks out → Payment initiated → Gateway confirms → Order status updates to "Confirmed"
- **Failed payments:** Customer is notified and can retry; order stays in "Pending Payment" state
- **Refunds:** Handled by Admin through the dashboard; processed back to original payment method
- **Security:** All transactions go through the payment gateway — card details are never stored on our servers (PCI-DSS compliant via Stripe)

---

### Security Plan
| Concern | Implementation |
|---|---|
| Authentication | JWT with refresh tokens; sessions expire after 24 hours |
| Password policy | Minimum 8 characters; hashed with bcrypt (salt rounds: 12) |
| Access control | Role-based access control (RBAC) enforced on every API route |
| Payment verification | System verifies gateway confirmation before marking order paid |
| Data in transit | HTTPS/TLS enforced on all endpoints |
| Data at rest | Sensitive fields encrypted in database |
| Input validation | All user inputs sanitized server-side (prevent SQL injection, XSS) |
| Audit logs | Every sensitive action (login, order change, stock update) is logged with user ID and timestamp |
| Rate limiting | API rate-limited to prevent brute-force attacks |
| 2FA (Phase 2) | Optional two-factor authentication for Admin and Accountant roles |
| GDPR / Privacy | Customer data can be deleted on request; no data sold to third parties |

---

### Assumptions
- The business has a registered business account
- The business uses smartphones or computers and has internet access
- Customers can call to make orders instead of using the system, and the sales person will log the order
- All delivery persons have a smartphone to update delivery status
- Internet connectivity is generally reliable in the operating area

---

### Risk Register
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Low digital literacy among customers | High | Medium | Phone order option; in-app guidance and tooltips |
| System downtime delays orders | Medium | High | Email/SMS fallback; aim for 99.5% uptime SLA |
| Payment failure or fraud | Medium | High | Stripe fraud protection; retry logic; notify customer |
| Data breach / account takeover | Low | Very High | HTTPS, bcrypt, JWT, rate limiting, audit logs, 2FA (Phase 2) |
| Stock running out during high demand | Medium | High | Low-stock alerts; reorder threshold notifications |
| Delivery address errors | Medium | Medium | Google Maps address validation at checkout |
| Scope creep slowing delivery | Medium | Medium | Strict out-of-scope list; change request process |
| Poor adoption by staff | Low | High | Training session before go-live; simple UI design |

---

### Out-of-Scope Features
- 3D bag viewing
- Discount negotiations
- Live chatting with the seller
- Supplier/vendor management portal
- Multi-currency support (Phase 1)
- Mobile native app (Phase 1 — web only)

---

### Timeline & Milestones

| Phase | Scope | Duration |
|---|---|---|
| **Phase 0 — Setup** | Project setup, repo, CI/CD, database schema, auth system | Week 1 |
| **Phase 1 — MVP** | Product catalog, cart, checkout, payments, basic order tracking | Weeks 2–4 |
| **Phase 2 — Operations** | Stock management, order status updates, delivery flow, admin dashboard | Weeks 5–7 |
| **Phase 3 — Finance** | Sales reports, profit/loss tracking, export | Week 8 |
| **Phase 4 — Polish** | Reviews, notifications, help section, UI polish, performance tuning | Weeks 9–10 |
| **Phase 5 — Launch** | UAT, bug fixes, staff training, go-live | Weeks 11–12 |
| **Phase 6 (Future)** | 2FA, mobile app, multi-currency, advanced analytics | Post-launch |
