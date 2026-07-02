# NUA Store Architectural Decisions

**Deployed Site**: [https://nua-project-orcin.vercel.app/](https://nua-project-orcin.vercel.app/)

This document outlines key technical decisions and compromises made during the design and implementation of the mini e-commerce web application.

## Architectural Choice: Vuex Store Structure (Monolithic vs. Split Files)

When setting up Vuex 4 for state management, I faced a choice between a monolithic `store.js` containing all state, mutations, actions, and getters, versus splitting the store into modular files: `store.js`, `action.js`, `mutation.js`, and `getters.js`. 

- **Option A (Monolithic)**: Keeping everything in one file reduces file system navigation and makes it easy to trace simple data flows.
- **Option B (Split Files)**: Separating actions, mutations, getters, and state creation into dedicated files.

I chose **Option B (Split Files)**. I initially considered keeping everything in one file since it works well for small projects. However, as I added features like `product fetching`, `cart management`, and `subtotal calculations`, the store started growing and became harder to navigate.I chose to split the store into separate files because it keeps related logic organized. Actions handle API calls, mutations update the state (and save the cart to localStorage), and getters return derived values like the total item count and subtotal. Although this approach creates a few more files, it makes the code easier to read, maintain, and extend as the project grows.

## Option Considered: State-based Variant Selection vs. URL Deep-linking

For managing the selected product variant (colorways and sizes) on the detail page, I debated keeping the active selection purely inside Vuex state versus syncing the active selection with URL query parameters (e.g., `/product/1?color=White&size=M`).

I chose **URL Deep-linking**. Managing variants in the URL makes the page deep-linkable and shareable. Users can copy the link and send it to others, and the recipient will see the exact color and size combination pre-selected. Syncing these variants via Vue Router query parameters also keeps the local component state lightweight and avoids unnecessary global store contamination.

## Future Cleanups and Improvements

Given more time, I would implement the following improvements:
1. **Toast Notification System**: Replace standard browser `alert()` popups for async cart failures with a custom, non-blocking toast notification system to improve the user experience.
2. **Vuex Modules**: Organize the store using namespaced modules (`cart` and `products`) rather than global selectors, preventing root namespace clutter.
3. **Comprehensive Testing**: Add unit test suites for Vuex mutations and component integration tests.

## Use of AI
Note: I want to be transparent about my submission. The only place I used AI was for some CSS related to the product card and grid layout, mainly to explore a few layout ideas. I reviewed and adjusted the code to fit my project.

Everything else—including the application structure, Vue components, Vuex state management, routing, business logic, localStorage persistence, and overall implementation—was written by me.
