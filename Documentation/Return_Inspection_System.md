# Return Inspection System - Damage Assessment & Charging

## Overview
The Return Inspection System allows staff to inspect returned vehicles, assess damage levels, and automatically calculate charges from the customer's security deposit based on damage severity.

## Deposit & Damage System

### Security Deposit Structure
- **Deposit Amount**: 30% of rental amount
- **Purpose**: Cover potential damage charges
- **Refund Policy**: 
  - Full refund if no damage (Level 0)
  - Partial deduction based on damage level (1-10)
  - Remaining deposit refunded to customer

### Damage Level Scale (1-10)
- **Level 0**: No damage - Full deposit refund
- **Level 1**: 10% of rental amount charged from deposit
- **Level 2**: 20% of rental amount charged from deposit
- **Level 3**: 30% of rental amount charged from deposit
- **Level 4**: 40% of rental amount charged from deposit
- **Level 5**: 50% of rental amount charged from deposit
- **Level 6**: 60% of rental amount charged from deposit
- **Level 7**: 70% of rental amount charged from deposit
- **Level 8**: 80% of rental amount charged from deposit
- **Level 9**: 90% of rental amount charged from deposit
- **Level 10**: 100% of rental amount (total loss)

### Damage Types (Multi-Select Options)
1. **Scratches** - Minor surface scratches on body/paint
2. **Dents** - Small to medium dents on panels
3. **Interior Damage** - Stains, tears, or damage to seats/interior
4. **Mechanical Issues** - Engine, transmission, or mechanical problems
5. **Missing Items** - Missing accessories, spare tire, tools, etc.

## Database Schema Updates

### Bookings Table Changes
```sql
-- Update damage_level to accept numeric values 0-10
ALTER TABLE bookings 
ALTER COLUMN damage_level TYPE INTEGER,
ADD CONSTRAINT damage_level_range CHECK (damage_level >= 0 AND damage_level <= 10 OR damage_level IS NULL);

-- return_notes stores comma-separated damage types
-- Example: "Scratches,Dents,Interior Damage"
```

## Inspection Process Flow

### 1. Active Bookings Display
- Fetch active bookings with car and customer details
- Display in DataTable format with consistent styling
- Show return date and overdue status

### 2. Start Inspection
- Open inspection modal with booking details
- Pre-populate form with default values
- Display car information and customer details

### 3. Damage Assessment Form
```
┌─────────────────────────────────────────┐
│ Return Inspection Form                  │
├─────────────────────────────────────────┤
│ Fuel Level: [Dropdown]                  │
│ Overall Condition: [Dropdown]           │
│ Damage Level: [1-10 Scale]              │
│ Damage Types: [Multi-select Checkboxes] │
│ Additional Notes: [Textarea]            │
│ Calculated Charge: £XXX (auto-calc)     │
└─────────────────────────────────────────┘
```

### 4. Automatic Charge Calculation
- **Base Charge** = (Damage Level / 10) × Total Booking Amount
- **Example**: Level 3 damage on £1000 booking = £300 charge
- Real-time calculation as user selects damage level

### 5. Complete Return Process
- Update booking status to 'completed'
- Store damage_level (1-10)
- Store return_notes (comma-separated damage types)
- Create additional charge record
- Send notification to customer (future enhancement)

## API Endpoints

### Get Active Bookings with Details
```
GET /api/bookings?status=active&include=car,customer
```

### Complete Return Inspection
```
PATCH /api/bookings/{id}/complete-return
Body: {
  damage_level: 3,
  return_notes: "Scratches,Dents",
  additional_notes: "Minor scratches on rear bumper...",
  fuel_level: "half",
  condition: "fair"
}
```

## Frontend Components

### 1. ReturnInspection.js (Main Page)
- Use DataTable component for consistency
- Fetch active bookings with car/customer data
- Handle inspection modal state

### 2. InspectionModal Component
- Damage level slider/dropdown (1-10)
- Damage type checkboxes
- Real-time charge calculation
- Form validation

### 3. Data Structure
```javascript
const inspectionData = {
  fuel_level: 'full',
  condition: 'good',
  damage_level: 1,
  damage_types: ['Scratches', 'Dents'],
  additional_notes: '',
  calculated_charge: 100.00
};
```

## Revenue Impact

### Admin Reports Integration
- **Total Revenue**: Confirmed + Active + Cancellation fees + Damage charges
- **Monthly Revenue**: Same components filtered by current month
- **Damage Revenue**: Calculated from completed bookings with damage levels
- **Revenue Sources**:
  - Rental amounts (confirmed/active bookings)
  - Cancellation fees (20% of cancelled bookings)
  - Damage charges (deducted from customer deposits)

### Deposit & Balance System
- **Customer Payment**: Rental amount + Security deposit (30%)
- **Damage Processing**: Charges deducted from deposit
- **Balance Updates**: Automatic customer balance adjustments
- **Refund Processing**: Remaining deposit returned to customer

## Implementation Status

### ✅ Completed Features

1. **Database Schema Updates**
   - ✅ Modified damage_level column to INTEGER (0-10)
   - ✅ Updated constraints and validation
   - ✅ Added proper column comments

2. **Backend API Implementation**
   - ✅ Enhanced booking endpoints with car/customer data
   - ✅ Added damage charge calculation logic
   - ✅ Updated revenue calculations (total + monthly)
   - ✅ Integrated balance service for deposit processing
   - ✅ Created complete-return inspection endpoint

3. **Frontend Implementation**
   - ✅ Refactored ReturnInspection to use DataTable
   - ✅ Created modern damage assessment modal
   - ✅ Implemented real-time charge calculation
   - ✅ Added customer inspection notes viewer
   - ✅ Updated booking forms to show deposit breakdown

4. **Revenue Integration**
   - ✅ Admin reports include damage charges
   - ✅ Monthly revenue calculations updated
   - ✅ Customer balance system integrated
   - ✅ Transparent pricing in booking flow

## Business Rules

### Damage Level Guidelines
- **Level 0**: No damage - Full deposit refund
- **Levels 1-3**: Minor cosmetic damage (10-30% charge)
- **Levels 4-6**: Moderate damage requiring repair (40-60% charge)
- **Levels 7-9**: Major damage, significant repair costs (70-90% charge)
- **Level 10**: Total loss, full rental amount charged (100% charge)

### Financial Processing
- **Booking Payment**: Customer pays rental + deposit upfront
- **Damage Assessment**: Staff evaluates and assigns damage level
- **Charge Calculation**: Automatic calculation based on damage level
- **Deposit Deduction**: Damage charge deducted from security deposit
- **Balance Update**: Customer balance adjusted with remaining deposit

### Customer Experience
- **Transparent Pricing**: Clear breakdown of rental vs deposit
- **Inspection Report**: Detailed damage assessment with photos
- **Financial Summary**: Clear explanation of charges and refunds
- **Balance Tracking**: Real-time balance updates in customer dashboard

## Future Enhancements

1. **Photo Upload**: Attach damage photos to inspection
2. **Customer Notifications**: Email damage report to customer
3. **Dispute System**: Allow customers to contest damage charges
4. **Repair Tracking**: Track actual repair costs vs. charges
5. **Insurance Integration**: Connect with insurance providers