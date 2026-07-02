# Mini E-Commerce App

A responsive mini e-commerce application built using **Vue 3**, **Vuex 4**, **Vue Router**, **Vite**, and **SCSS**. The application fetches product data from the Fake Store API and provides a modern shopping experience with persistent cart functionality.

---

## Live Demo

**Live URL:** https://nua-project-orcin.vercel.app/

## GitHub Repository

**Repository:** https://github.com/Sudip969/Nua-Project

---

## Tech Stack

* Vue 3 (Composition API)
* Vuex 4
* Vue Router
* Vite
* SCSS
* Fake Store API
* localStorage

---

## Features

* Responsive product listing page
* Product detail page
* Product image gallery with thumbnails
* Variant selection (Color & Size)
* Quantity picker
* Add to Cart functionality
* Cart drawer
* Cart item count badge
* Update and remove cart items
* Subtotal and grand total calculation
* Cart persistence using localStorage
* Deep-linkable product variants through URL parameters

---

## Project Structure

```text
src/
├── assets/styles
├── components/
├── router/
├── store/
├── views/
└── App.vue
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Sudip969/Nua-Project.git
```

Navigate to the project:

```bash
cd Nua-Project
```

Install dependencies:

```bash
npm install
```

---

## Run the Application

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## API

This project uses the **Fake Store API**.

https://fakestoreapi.com

---

## Design Decisions

Project architecture decisions and implementation trade-offs are documented in **DECISIONS.md** in the repository root.

---

## Known Trade-offs

* The Fake Store API does not provide product variants, so color and size options are simulated.
* Cart data is stored in localStorage to persist across page refreshes.
* No backend is used.

---

## Author

**Sudipta Jena**
