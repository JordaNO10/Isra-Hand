# 🤝 IsraHand – Donation Management Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)]  
[![GitHub stars](https://img.shields.io/github/stars/JordaNO10/isra-hand.svg)]  
[![GitHub forks](https://img.shields.io/github/forks/JordaNO10/isra-hand.svg)]


IsraHand is a full-stack donation management system designed to streamline the process of connecting donors with requestors.  
Built with React, Node.js, and MySQL, it offers a user-friendly interface and robust backend to manage donations efficiently.

---

## 🌍 Why This Project?

Israel is home to a diverse population, rich in cultures but also marked by stark social and economic gaps.  
Over the years, Israeli citizens have faced ongoing challenges — from financial hardship and rising living costs to global crises like the COVID-19 pandemic and the impacts of multiple wars.

According to the 2023 Poverty Report by the National Insurance Institute, around **21% of Israelis live below the poverty line**.

The ongoing **"Iron Swords War"** has further intensified these difficulties, displacing thousands of residents and severely impacting the Israeli economy.  
Families have been forced into temporary housing—hotels, rented apartments—and the sharp increase in housing and basic living expenses has left many struggling to make ends meet.

In light of this, I created **IsraHand** — a platform that enables people to **donate items** to those in need and facilitates **direct interaction** between donors and recipients.  
The goal is to **bridge the gap**, promote mutual support, and make a tangible difference in the lives of people facing financial hardship in Israel.

> *Insert mission photo here*

---

## 🧩 Features

- 🧑‍🤝‍🧑 **User Roles**: Donor, Requestor, Admin  
- 🔐 **Authentication**: Secure login with role-based access using cookies  
- 🎁 **Donations**: Create, edit, and delete donations (donors only)  
- 📬 **Requests**: Submit donation requests (requestors only)  
- ⏳ **Lock Mechanism**: 5-minute lock on viewed donations to prevent conflicts  
- 🗺️ **Map Integration**: View donations on a map based on address  
- 📊 **Admin Dashboard**: Manage users, roles, and donations  
- 🌐 **Responsive UI**: Clean design with floating headers  

> *Insert feature screenshot here*

---

## 📋 Requirements

- **Node.js** v14+  
- **npm** v6+  
- **MySQL** v5.7+  
- **phpMyAdmin** (optional)  

> *Insert requirements screenshot here*

---

## 🚀 Installation, Setup & Usage

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/israhand.git
cd israhand
```

---

### 2. Frontend Setup

```bash
cd fe
npm install
npm start
```

---

### 3. Backend Setup

```bash
cd ../be
npm install
node index.js
```

---

### ▶️ Usage

```bash
# After both servers are running:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
```

> *Insert usage screenshot here*
