# Booking Workflow
## 1. Customer Makes Booking

````
Customer selects car → Chooses dates → System calculates cost → Creates booking (status: pending)
````

## 2. Staff Approval & Payment
````
Staff approves booking → Customer pays deposit + rental → Status: confirmed
````

## 3. Pickup Process
````
Staff marks car collected → Status: active → Customer picks up vehicle
````

## 4. Return & Refund
````
Customer returns car → Staff inspects → Sets damage level → System calculates refund:
- No damage: 100% refund
- Minor damage: 50% refund  
- Major damage: 0% refund
→ Admin can override decisions
````