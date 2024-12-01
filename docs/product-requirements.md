# Pottery Work Documentation System - MVP PRD
**Product Requirements Document**
Last Updated: November 28, 2024

## 1. Product Overview

### 1.1 Purpose
A mobile-first application that tracks student pottery pieces through the creation, firing, and completion process, enabling clear communication between students and instructors about the status of work.

### 1.2 Target Users
- Students/Customers (primary)
- Instructors (primary)
- Studio Managers (secondary)

## 2. MVP Core Features

### 2.1 Authentication
- Basic email/password login
- Two user roles:
  - Student/Customer
  - Instructor

### 2.2 Piece Documentation
#### Student Features
- Photo capture of piece
- Required fields:
  - Piece name
  - Class type selection (One-time vs. Glazing class)
  - For one-time class: Glaze color selection from predefined list
  - For glazing class: Future class date selection
- Status tracking view for all pieces
- Email notifications for piece completion

#### Instructor Features
- Batch status updates for multiple pieces
- Location assignment (shelf tracking)
- Completion documentation with final photo
- Ability to trigger pickup notification

### 2.3 Status Workflow
1. Greenware (initial status)
2. Bisqued
3. Glazed
4. Completed

## 3. User Stories

### 3.1 Student Stories
- As a student, I can photograph and document my new piece
- As a student, I can name my piece and specify class type
- As a student, I can select my glaze preferences or future class date
- As a student, I can view the current status of all my pieces
- As a student, I can receive email notifications when my piece is ready for pickup

### 3.2 Instructor Stories
- As an instructor, I can view all pieces in the studio
- As an instructor, I can update the status of multiple pieces at once
- As an instructor, I can assign shelf locations to pieces
- As an instructor, I can mark pieces as complete with final photos
- As an instructor, I can trigger pickup notifications

## 4. Technical Requirements

### 4.1 Mobile Requirements
- Progressive Web App (PWA) for initial MVP
- Camera access for photo documentation
- Email integration for notifications
- Local storage for offline capability

### 4.2 Backend Requirements
- User authentication system
- Image storage and compression
- Email notification system
- Real-time status updates

## 5. MVP Limitations
- No native mobile apps (PWA only)
- Limited to essential status tracking workflow
- Basic email notifications only
- No integration with external systems
- No payment processing
- No chat/messaging features

## 6. Success Metrics
- Time saved in piece management vs. manual tracking
- Reduction in lost/misplaced pieces
- Student satisfaction with status transparency
- Email notification success rate
- Photo upload success rate

## 7. MVP Timeline
- Week 1-2: User Authentication & Basic UI
- Week 3-4: Photo Upload & Piece Documentation
- Week 5-6: Status Workflow & Location Tracking
- Week 7-8: Email Notifications & Testing
- Week 9-10: Bug Fixes & MVP Launch

## 8. Future Considerations (Post-MVP)
- Native mobile applications
- Integration with studio management software
- Advanced analytics and reporting
- In-app messaging between students and instructors
- Inventory tracking for glazes and materials
- Payment processing integration
- Class scheduling integration