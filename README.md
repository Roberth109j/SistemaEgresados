
```
Sistema
├─ .editorconfig
├─ .prettierignore
├─ .prettierrc
├─ app
│  ├─ Http
│  │  ├─ Controllers
│  │  │  ├─ Auth
│  │  │  │  ├─ AuthenticatedSessionController.php
│  │  │  │  ├─ ConfirmablePasswordController.php
│  │  │  │  ├─ EmailVerificationNotificationController.php
│  │  │  │  ├─ EmailVerificationPromptController.php
│  │  │  │  ├─ NewPasswordController.php
│  │  │  │  ├─ PasswordResetLinkController.php
│  │  │  │  ├─ RegisteredUserController.php
│  │  │  │  └─ VerifyEmailController.php
│  │  │  ├─ Controller.php
│  │  │  ├─ Settings
│  │  │  │  ├─ PasswordController.php
│  │  │  │  └─ ProfileController.php
│  │  │  └─ UsersController.php
│  │  ├─ Middleware
│  │  │  ├─ HandleAppearance.php
│  │  │  └─ HandleInertiaRequests.php
│  │  └─ Requests
│  │     ├─ Auth
│  │     │  └─ LoginRequest.php
│  │     └─ Settings
│  │        └─ ProfileUpdateRequest.php
│  ├─ Models
│  │  └─ User.php
│  └─ Providers
│     └─ AppServiceProvider.php
├─ artisan
├─ bootstrap
│  ├─ app.php
│  ├─ cache
│  │  ├─ packages.php
│  │  └─ services.php
│  └─ providers.php
├─ components.json
├─ composer.json
├─ composer.lock
├─ config
│  ├─ app.php
│  ├─ auth.php
│  ├─ cache.php
│  ├─ database.php
│  ├─ filesystems.php
│  ├─ inertia.php
│  ├─ logging.php
│  ├─ mail.php
│  ├─ permission.php
│  ├─ queue.php
│  ├─ services.php
│  └─ session.php
├─ database
│  ├─ factories
│  │  └─ UserFactory.php
│  ├─ migrations
│  │  ├─ 0001_01_01_000000_create_users_table.php
│  │  ├─ 0001_01_01_000001_create_cache_table.php
│  │  ├─ 0001_01_01_000002_create_jobs_table.php
│  │  └─ 2025_03_22_124528_create_permission_tables.php
│  └─ seeders
│     ├─ DatabaseSeeder.php
│     └─ UserSeeder.php
├─ eslint.config.js
├─ package-lock.json
├─ package.json
├─ phpunit.xml
├─ public
│  ├─ .htaccess
│  ├─ favicon.ico
│  ├─ index.php
│  ├─ logo.svg
│  └─ robots.txt
├─ resources
│  ├─ css
│  │  └─ app.css
│  ├─ js
│  │  ├─ app.tsx
│  │  ├─ components
│  │  │  ├─ app-content.tsx
│  │  │  ├─ app-header.tsx
│  │  │  ├─ app-logo-icon.tsx
│  │  │  ├─ app-logo.tsx
│  │  │  ├─ app-shell.tsx
│  │  │  ├─ app-sidebar-header.tsx
│  │  │  ├─ app-sidebar.tsx
│  │  │  ├─ appearance-dropdown.tsx
│  │  │  ├─ appearance-tabs.tsx
│  │  │  ├─ breadcrumbs.tsx
│  │  │  ├─ delete-user.tsx
│  │  │  ├─ heading-small.tsx
│  │  │  ├─ heading.tsx
│  │  │  ├─ icon.tsx
│  │  │  ├─ input-error.tsx
│  │  │  ├─ nav-footer.tsx
│  │  │  ├─ nav-main.tsx
│  │  │  ├─ nav-user.tsx
│  │  │  ├─ TableUsers.tsx
│  │  │  ├─ text-link.tsx
│  │  │  ├─ ui
│  │  │  │  ├─ alert.tsx
│  │  │  │  ├─ avatar.tsx
│  │  │  │  ├─ badge.tsx
│  │  │  │  ├─ breadcrumb.tsx
│  │  │  │  ├─ button.tsx
│  │  │  │  ├─ card.tsx
│  │  │  │  ├─ checkbox.tsx
│  │  │  │  ├─ collapsible.tsx
│  │  │  │  ├─ dialog.tsx
│  │  │  │  ├─ dropdown-menu.tsx
│  │  │  │  ├─ icon.tsx
│  │  │  │  ├─ input.tsx
│  │  │  │  ├─ label.tsx
│  │  │  │  ├─ navigation-menu.tsx
│  │  │  │  ├─ placeholder-pattern.tsx
│  │  │  │  ├─ select.tsx
│  │  │  │  ├─ separator.tsx
│  │  │  │  ├─ sheet.tsx
│  │  │  │  ├─ sidebar.tsx
│  │  │  │  ├─ skeleton.tsx
│  │  │  │  ├─ toggle-group.tsx
│  │  │  │  ├─ toggle.tsx
│  │  │  │  └─ tooltip.tsx
│  │  │  ├─ user-info.tsx
│  │  │  ├─ user-menu-content.tsx
│  │  │  └─ UserFormModal.tsx
│  │  ├─ hooks
│  │  │  ├─ use-appearance.tsx
│  │  │  ├─ use-initials.tsx
│  │  │  ├─ use-mobile-navigation.ts
│  │  │  └─ use-mobile.tsx
│  │  ├─ layouts
│  │  │  ├─ app
│  │  │  │  ├─ app-header-layout.tsx
│  │  │  │  └─ app-sidebar-layout.tsx
│  │  │  ├─ app-layout.tsx
│  │  │  ├─ auth
│  │  │  │  ├─ auth-card-layout.tsx
│  │  │  │  ├─ auth-simple-layout.tsx
│  │  │  │  └─ auth-split-layout.tsx
│  │  │  ├─ auth-layout.tsx
│  │  │  └─ settings
│  │  │     └─ layout.tsx
│  │  ├─ lib
│  │  │  └─ utils.ts
│  │  ├─ pages
│  │  │  ├─ auth
│  │  │  │  ├─ confirm-password.tsx
│  │  │  │  ├─ forgot-password.tsx
│  │  │  │  ├─ login.tsx
│  │  │  │  ├─ register.tsx
│  │  │  │  ├─ reset-password.tsx
│  │  │  │  └─ verify-email.tsx
│  │  │  ├─ dashboard.tsx
│  │  │  ├─ settings
│  │  │  │  ├─ appearance.tsx
│  │  │  │  ├─ password.tsx
│  │  │  │  └─ profile.tsx
│  │  │  ├─ users.tsx
│  │  │  └─ welcome.tsx
│  │  ├─ ssr.tsx
│  │  └─ types
│  │     ├─ global.d.ts
│  │     ├─ index.d.ts
│  │     └─ vite-env.d.ts
│  └─ views
│     └─ app.blade.php
├─ routes
│  ├─ auth.php
│  ├─ console.php
│  ├─ settings.php
│  └─ web.php
├─ storage
│  ├─ app
│  │  ├─ private
│  │  └─ public
│  ├─ framework
│  │  ├─ cache
│  │  │  └─ data
│  │  ├─ sessions
│  │  ├─ testing
│  │  └─ views
│  │     ├─ 0305b254bc373afbc9eda48d4314f7de.php
│  │     ├─ 09c0068e3a4f06527abbd52e08756d0a.php
│  │     ├─ 17c7cc25c245ccbd77765053f6cbf83d.php
│  │     ├─ 2acb683c4e75f42f611b79243b5decbb.php
│  │     ├─ 428527251f2d3261da0ec8db89d747a7.php
│  │     ├─ 60160adb153375dd44df91f2e8207f30.php
│  │     ├─ 7a8d986e0919c883da67ef52c8044157.php
│  │     ├─ 8a93fa831fb49f9889c3e9247380513f.php
│  │     ├─ a0a6ff41e88f81713a72d64fc39066b0.php
│  │     ├─ a320a6db46b3f84d4c3f098100cbf922.php
│  │     ├─ aa9f745bc7eba2212d45464f3949d1aa.php
│  │     ├─ c832aad99f03f78a41bcebc3b5122324.php
│  │     ├─ ca5ec23d5a266570c80118b6eb7edd0c.php
│  │     ├─ db70a06c150076c2377dd24e73877a7d.php
│  │     ├─ e969b69185bc448d46d9ba56f2063c22.php
│  │     ├─ ea442e759d2e10d81be787dad092dca9.php
│  │     ├─ f3e1a7b36688b7b9b6350452b5e42058.php
│  │     └─ f6c4cf3a4c19427eb9028f15f748f4c0.php
│  └─ logs
│     └─ laravel.log
├─ tests
│  ├─ Feature
│  │  ├─ Auth
│  │  │  ├─ AuthenticationTest.php
│  │  │  ├─ EmailVerificationTest.php
│  │  │  ├─ PasswordConfirmationTest.php
│  │  │  ├─ PasswordResetTest.php
│  │  │  └─ RegistrationTest.php
│  │  ├─ DashboardTest.php
│  │  ├─ ExampleTest.php
│  │  └─ Settings
│  │     ├─ PasswordUpdateTest.php
│  │     └─ ProfileUpdateTest.php
│  ├─ Pest.php
│  ├─ TestCase.php
│  └─ Unit
│     └─ ExampleTest.php
├─ tsconfig.json
└─ vite.config.ts

```