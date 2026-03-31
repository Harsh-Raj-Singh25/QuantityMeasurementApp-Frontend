# Quantity Measurement App - Enterprise Frontend (Angular)

This branch contains **Version 2.0** of the Quantity Measurement Frontend, completely refactored into a modern, enterprise-grade Single Page Application (SPA) using **Angular 17**. 

It is designed to interface securely with the Spring Boot backend using Google OAuth2 and JSON Web Tokens (JWT).

## 🚀 Enterprise Features

* **Angular 17 Standalone Architecture:** Built without `NgModules` for a lighter, faster, and more modern codebase.
* **Robust Security:** * **HTTP Interceptors:** Automatically catches all outgoing API requests and silently injects the JWT `Bearer` token.
  * **Route Guards (`CanActivate`):** Protects the dashboard from unauthorized access, bouncing unauthenticated users back to the login screen.
* **OAuth2 Integration:** Seamless Google Login flow that captures the JWT redirected from the Spring Boot backend.
* **Reactive UI:** Uses Angular's data-binding (`ngModel`) to dynamically update available units and inputs based on user selection.
* **Type Safety:** Fully typed interfaces (`QuantityDTO`, `QuantityMeasurementDTO`) using TypeScript to prevent runtime data errors.

## 🛠️ Tech Stack

* **Framework:** Angular 17.x
* **Language:** TypeScript
* **Styling:** CSS3 & HTML5
* **State & Networking:** RxJS, Angular `HttpClient`

## 📂 Architecture Overview

```text
src/app/
├── components/
│   ├── auth/            # Handles the Google Login UI and token capture
│   └── dashboard/       # Main interactive measurement UI
├── guards/
│   └── auth-guard.ts    # Route protector
├── interceptors/
│   └── auth-interceptor.ts # JWT HTTP Injector
├── models/
│   └── quantity.model.ts # TypeScript data interfaces
├── services/
│   ├── auth.ts          # LocalStorage and Login management
│   └── quantity.ts      # Backend API communication
└── app.config.ts        # App-wide routing and provider configuration