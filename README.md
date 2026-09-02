# Otağ Cafe Restaurant Management System

Otağ Cafe Restaurant Management System is a full-stack web-based restaurant management application developed to manage daily restaurant operations through a centralized system.

The project consists of a Spring Boot backend, a React/Vite frontend, and a MySQL database. The backend provides REST API endpoints for the management modules, while the frontend communicates with these APIs and provides both an administrative management interface and a customer-facing restaurant website.

## System Architecture

The application follows a layered full-stack architecture:

    React / Vite Frontend
            |
            | HTTP / REST API
            v
    Spring Boot Backend
            |
            | Spring Data JPA
            v
         MySQL Database

The frontend is responsible for the user interface, user interaction, form management, navigation, and displaying data received from the backend.

The Spring Boot backend contains the business logic, REST controllers, services, data transfer objects, security configuration, and database communication.

MySQL is used as the persistent data storage layer.

## Backend

The backend is developed with Java and Spring Boot.

Main backend technologies:

- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT Authentication
- REST API
- MySQL
- Maven
- OpenAPI / Swagger

The backend is organized into different layers and modules.

### Controllers

REST controllers provide API endpoints for the frontend and manage HTTP requests and responses.

Examples include:

- ProductController
- OrderController
- OrderItemController
- ReservationController
- PaymentController
- StockController
- RecipeItemController
- NotificationController
- FinanceController
- KdsController
- UserController
- CategoryController

### Services

The service layer contains the main business logic of the application.

Examples include:

- ProductService
- OrderService
- OrderItemService
- ReservationService
- PaymentService
- StockService
- RecipeItemService
- NotificationService
- FinanceService
- KdsService

This layer is responsible for operations such as creating orders, updating order statuses, managing stock movements, processing reservations, handling payments, and coordinating restaurant operations.

### DTO Layer

Data Transfer Objects are used to control the data exchanged between the frontend and backend.

Examples include:

- ProductDTO
- ProductCreateDTO
- OrderDTO
- OrderCreateDTO
- OrderItemDTO
- OrderItemCreateDTO
- ReservationCreateDTO
- ReservationResponseDTO
- PaymentDTO
- RecipeItemDTO
- KdsOrderDTO

This structure prevents the frontend from directly depending on the internal database entity structure.

## Authentication and Security

Spring Security and JWT are used to protect the management system.

Users authenticate through the backend and receive authentication information that is used when accessing protected API endpoints.

Public customer-facing operations, such as retrieving menu information and submitting restaurant reservations, can be accessed through the endpoints specifically configured for the customer website.

Sensitive configuration values such as the database password are provided through environment variables instead of being stored directly in the source code.

## Restaurant Management Modules

### Product and Category Management

The product management module allows restaurant products and categories to be created, updated, retrieved, and deleted.

Products contain information such as name, price, category, image, and preparation station.

Products can be assigned to different restaurant stations such as:

- Kitchen
- Bar
- Nargile

The customer website retrieves product information from the backend instead of using hard-coded product data.

### Order Management

The order module manages restaurant orders and their order items.

An order can contain multiple products, and each product is represented by an OrderItem.

The backend manages order creation, item status changes, and order-related business rules.

Order items can move through different preparation states and are connected to the Kitchen Display System.

### Kitchen Display System (KDS)

The KDS module provides station-based order management for restaurant staff.

Orders are separated according to their preparation station:

- Kitchen
- Bar
- Nargile

The KDS allows staff to see active order items and update their preparation status.

The backend is responsible for the status transition and stock-related business logic instead of allowing the frontend to directly manipulate inventory.

Stock deduction is designed to occur when the product is actually processed/used, with protection against deducting the same stock multiple times for the same order item.

### Stock Management

The stock module manages restaurant inventory and stock quantities.

The system supports:

- Stock creation
- Stock quantity increases
- Stock quantity decreases
- Minimum stock information
- Stock units
- Stock tracking

Stock operations are connected to order processing so that inventory can be updated according to restaurant operations.

### Recipe Management

The recipe module connects products with the stock items required to prepare them.

A recipe can contain multiple stock items with specific quantities and units.

For example, a product can require a certain amount of an ingredient measured in kilograms or a number of units.

This structure allows product usage to be connected to the underlying ingredient inventory.

### Payment and Finance

The payment and finance modules manage restaurant financial operations.

The system supports payment-related information, payment methods, payment allocation, and financial records.

Expenses and financial information are also managed through dedicated backend services and API endpoints.

### Table Management

Restaurant tables are managed through the table management module.

The system stores table information and allows table status and related order operations to be managed through the backend.

### Reservation Management

The reservation module allows reservations to be created and managed.

The customer-facing website provides a reservation form where customers can enter:

- Name
- Phone number
- Reservation date
- Reservation time
- Number of guests
- Optional note

The reservation form sends the information to the Spring Boot backend using an HTTP POST request.

The backend processes the reservation and stores it in the database. Restaurant staff can then manage the reservation through the management system.

### Notification System

The notification module provides information about important restaurant operations.

Notifications can be generated by backend operations such as order creation and can be displayed in the management interface.

## OCR System

An OCR (Optical Character Recognition) system was also integrated into the project.

The OCR functionality is used to process text from images and convert recognized information into data that can be used by the application.

The backend contains dedicated OCR-related components, including:

- OcrService
- OcrController
- ExpenseParser
- ExpenseCategoryDetector

The OCR flow can be summarized as:

    Image / Document
            |
            v
       OCR Processing
            |
            v
      Recognized Text
            |
            v
       Text Parsing
            |
            v
     Structured Information
            |
            v
      Application Data

This structure allows information obtained from documents or images to be processed before being used by the application's expense and finance-related functionality.

The ExpenseParser is responsible for interpreting recognized text, while the ExpenseCategoryDetector helps determine the appropriate expense category from the extracted information.

## Popular Products

The backend provides a dedicated endpoint for popular products.

The system calculates popular products using real order data instead of displaying a fixed or randomly selected list.

The customer website can request a limited number of popular products, for example:

    GET /products/popular?limit=4

This allows the "Featured Products" section of the customer website to display products based on actual sales data.

## Customer-Facing Website

The project also contains a separate customer-facing web interface developed with React and Vite.

Customer website features include:

- Home page
- Restaurant introduction
- Menu browsing
- Product search
- Popular products
- Reservation form
- Contact information
- Navigation between customer pages

The customer website is connected to the same Spring Boot backend used by the management system.

### Customer Website Data Flow

For product information:

    Customer Web UI
          |
          v
    React Custom Hook
          |
          v
    GET /products
          |
          v
    Spring Boot API
          |
          v
    MySQL
          |
          v
    Product Data
          |
          v
    React Components
          |
          v
    Product Cards

For reservations:

    Customer
       |
       v
    Reservation Form
       |
       v
    React State
       |
       v
    HTTP POST /reservations
       |
       v
    Spring Boot
       |
       v
    MySQL

## Frontend

The frontend is developed using React and Vite.

Main frontend technologies:

- React
- Vite
- JavaScript
- React Router
- CSS

The frontend uses reusable components to keep the interface modular.

Examples include:

- SiteNavbar
- HeroSection
- QuickActions
- QuickActionCard
- SiteSearch
- SitePageHeader
- SiteLayout

React state management is used for interactive operations such as search input, form data, loading states, error states, and reservation submission.

React Router is used for navigation between pages.

## Customer Web UI and API Integration

The customer-facing interface does not rely on static product data for the main menu.

Custom React hooks are used to communicate with the backend API.

For example:

    useSiteProducts()
            |
            v
    GET /products
            |
            v
    Product Data
            |
            v
    React State

A separate hook is used for popular products:

    useSitePopularProducts(4)
            |
            v
    GET /products/popular?limit=4
            |
            v
    Popular Products
            |
            v
    Home Page

This structure separates API communication from the visual components and makes the frontend easier to maintain.

## Project Structure

    Otag-Cafe-Restaurant-Management-System/
    │
    ├── src/
    │   ├── main/
    │   │   ├── java/
    │   │   │   └── ...
    │   │   └── resources/
    │   │
    │   └── test/
    │
    ├── frontend/
    │   └── src/
    │       ├── site/
    │       │   ├── components/
    │       │   ├── pages/
    │       │   └── data/
    │       │
    │       └── pages/
    │
    ├── pom.xml
    ├── mvnw
    ├── mvnw.cmd
    └── README.md

## API Documentation

The backend REST APIs can be tested and inspected using OpenAPI / Swagger during development.

The API structure allows the React frontend and other authorized clients to communicate with the restaurant management backend through HTTP requests.

## Development Goals

The main goal of the project is to provide a centralized restaurant management platform that connects daily restaurant operations with a modern web interface.

The system combines:

- Restaurant management
- Order processing
- Kitchen Display System
- Stock tracking
- Recipe management
- Payment and finance operations
- Reservation management
- Notifications
- OCR-assisted data processing
- Customer-facing web interface

into a single full-stack application.
