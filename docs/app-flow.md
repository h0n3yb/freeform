# Pottery Tracking App - Functionality Documentation

## 1. Authentication System

### 1.1 Login Screen
- Email/password authentication
- Password reset functionality
- User type selection (Student/Instructor)
- Remember me option
- Input validation with error messages

## 2. Student Interface

### 2.1 Dashboard
- Grid view of all pieces
- Status counters (# of pieces in each stage)
- Sort by date, status, or name
- Search functionality
- Add new piece button (prominent placement)

### 2.2 New Piece Documentation
1. Photo Capture
   - Access device camera
   - Photo preview
   - Retake option
   - Basic editing (rotate, crop)
   
2. Piece Details Form
   - Required fields:
     - Piece name (text input)
     - Date (auto-populated)
     - Class type (radio buttons)
   - Conditional fields:
     - One-time class: Glaze selection dropdown
     - Glazing class: Date picker for future class

### 2.3 Piece Status View
- List/grid toggle view
- Each piece card shows:
  - Thumbnail image
  - Piece name
  - Current status
  - Location (if assigned)
  - Days in current status
- Status badges with distinct colors:
  - Greenware (green)
  - Bisqued (yellow)
  - Glazed (blue)
  - Completed (purple)

## 3. Instructor Interface

### 3.1 Dashboard
- Overview statistics
- Pieces requiring attention
- Recent status changes
- Quick access to batch updates
- Search and filter options

### 3.2 Piece Management
1. Individual Updates
   - Status change dropdown
   - Location assignment
   - Notes field
   - Final photo upload
   
2. Batch Operations
   - Multi-select functionality
   - Bulk status updates
   - Batch location assignment
   - Mass notification triggering

### 3.3 Location Management
- Visual shelf map
- Drag-and-drop piece assignment
- Shelf capacity indicators
- Quick search by shelf

## 4. Notification System

### 4.1 Email Notifications
- Automated triggers:
  - Status changes
  - Completion ready for pickup
  - Location changes
- Email templates:
```
Subject: Your [Piece Name] is Ready!
Body: 
Hello [Student Name],

Your piece [Piece Name] is now complete and ready for pickup.

Details:
- Location: [Shelf Number]
- Completion Date: [Date]
- Final Photo: [Attached]

Please pick up your piece within the next 7 days.

Best regards,
[Studio Name]
```

### 4.2 In-App Notifications
- Status change alerts
- Location update notices
- Pickup reminders
- Read/unread status

## 5. Offline Functionality
- Local storage for:
  - Recent pieces
  - Pending uploads
  - Draft documentation
- Background sync when online
- Offline indicators
- Queue management for pending actions

## 6. Data Management

### 6.1 Photo Storage
- Compression before upload
- Thumbnail generation
- Progressive loading
- Backup system

### 6.2 Status History
- Timestamp for each status change
- Track modifier (instructor name)
- Location history
- Time in each status

## 7. Error Handling
- Network connectivity issues
- Failed uploads
- Invalid input handling
- Crash recovery
- Error reporting system