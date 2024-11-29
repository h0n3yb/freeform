# Database Documentation

## Overview
This project uses Prisma ORM with PostgreSQL. The database is designed to manage a pottery studio's pieces, students, and instructors.

## Setup

### 1. Prerequisites
- PostgreSQL installed and running
- Node.js and npm installed

### 2. Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
```

Example for local development:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pottery_studio"
```

### 3. Initialize Database
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

## Database Structure

### Models

#### User
- Represents students and instructors
- Fields:
  - `id`: Unique identifier (CUID)
  - `email`: Unique email address
  - `name`: Optional user name
  - `role`: STUDENT/INSTRUCTOR/ADMIN
  - `pieces`: Relation to Piece model
  - `notifications`: Relation to Notification model
  - `createdAt`/`updatedAt`: Timestamps

#### Piece
- Represents pottery pieces
- Fields:
  - `id`: Unique identifier (CUID)
  - `name`: Piece name
  - `description`: Optional description
  - `status`: Current status (GREENWARE/BISQUED/GLAZED/COMPLETED/PICKED_UP)
  - `classType`: Type of class (ONE_TIME/GLAZING)
  - `glaze`: Optional glaze details
  - `shelfLocation`: Optional storage location
  - `images`: Relation to Image model
  - `student`: Relation to User model
  - `notifications`: Relation to Notification model
  - `notes`: Optional notes
  - `createdAt`/`updatedAt`: Timestamps

#### Image
- Stores piece images
- Fields:
  - `id`: Unique identifier (CUID)
  - `url`: Image URL
  - `piece`: Relation to Piece model
  - `type`: PROGRESS/FINAL
  - `createdAt`: Timestamp

#### Notification
- Handles system notifications
- Fields:
  - `id`: Unique identifier (CUID)
  - `user`: Relation to User model
  - `piece`: Relation to Piece model
  - `type`: PIECE_COMPLETED/READY_FOR_PICKUP/STATUS_CHANGED
  - `read`: Boolean flag
  - `createdAt`: Timestamp

## Usage Examples

### Creating a New User
```typescript
const newUser = await prisma.user.create({
  data: {
    email: "student@example.com",
    name: "John Doe",
    role: "STUDENT"
  }
});
```

### Creating a New Piece
```typescript
const newPiece = await prisma.piece.create({
  data: {
    name: "Blue Vase",
    description: "A tall vase with blue glaze",
    status: "GREENWARE",
    classType: "ONE_TIME",
    studentId: "existing-user-id",
  }
});
```

### Updating Piece Status
```typescript
const updatedPiece = await prisma.piece.update({
  where: { id: "piece-id" },
  data: { 
    status: "BISQUED",
    shelfLocation: "A1" 
  }
});
```

### Querying Pieces with Relations
```typescript
const pieces = await prisma.piece.findMany({
  include: {
    student: true,
    images: true
  },
  where: {
    status: "COMPLETED"
  }
});
```

## Best Practices

1. **Transactions**
   - Use transactions when updating multiple records
   - Example:
     ```typescript
     const result = await prisma.$transaction(async (tx) => {
       const updatedPiece = await tx.piece.update({...});
       const notification = await tx.notification.create({...});
       return { piece: updatedPiece, notification };
     });
     ```

2. **Error Handling**
   - Always wrap database operations in try-catch blocks
   - Handle unique constraint violations
   - Example:
     ```typescript
     try {
       const user = await prisma.user.create({...});
     } catch (error) {
       if (error.code === 'P2002') {
         // Handle unique constraint violation
       }
       throw error;
     }
     ```

3. **Indexes**
   - Use indexes for frequently queried fields
   - Current indexes:
     - User: email, role
     - Piece: studentId, status, shelfLocation, classType
     - Image: pieceId
     - Notification: userId, pieceId, read, type

## Maintenance

### Schema Updates
1. Modify `prisma/schema.prisma`
2. Run `npx prisma generate` to update client
3. Run `npx prisma db push` to update database

### Database Backups
```bash
# Export database
pg_dump pottery_studio > backup.sql

# Import database
psql pottery_studio < backup.sql
```

### Monitoring
- Use Prisma Studio for development: `npx prisma studio`
- Monitor query performance using Prisma's logging:
  ```typescript
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  ``` 