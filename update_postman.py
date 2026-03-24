import json
import os

file_path = r"d:\Software\Academic\Git Projects\V--Mas\V---Mas\VMAS_Postman_Collection.json"

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Build the Service Management folder
service_folder = {
    "name": "4. Service Management",
    "description": "Endpoints to manage and retrieve vehicle service records and analytics.",
    "item": [
        {
            "name": "Get All Services",
            "request": {
                "auth": {
                    "type": "bearer",
                    "bearer": [{"key": "token", "value": "{{adminToken}}", "type": "string"}]
                },
                "method": "GET",
                "url": {
                    "raw": "{{baseUrl}}/api/services",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "services"]
                }
            }
        },
        {
            "name": "Create Service Record",
            "request": {
                "auth": {
                    "type": "bearer",
                    "bearer": [{"key": "token", "value": "{{adminToken}}", "type": "string"}]
                },
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"vehicleId\": 1,\n  \"serviceType\": \"OIL_CHANGE\",\n  \"serviceDate\": \"2023-10-01\",\n  \"currentMileageKm\": 15000,\n  \"serviceCost\": 5000.00,\n  \"technicianWorkshop\": \"AutoCare Center\",\n  \"nextServiceDue\": \"2024-04-01\",\n  \"description\": \"Routine oil and filter change\"\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/api/services",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "services"]
                }
            }
        },
        {
            "name": "Get Service Stats",
            "request": {
                "auth": {
                    "type": "bearer",
                    "bearer": [{"key": "token", "value": "{{adminToken}}", "type": "string"}]
                },
                "method": "GET",
                "url": {
                    "raw": "{{baseUrl}}/api/services/stats",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "services", "stats"]
                }
            }
        },
        {
            "name": "Get Upcoming Services",
            "request": {
                "auth": {
                    "type": "bearer",
                    "bearer": [{"key": "token", "value": "{{adminToken}}", "type": "string"}]
                },
                "method": "GET",
                "url": {
                    "raw": "{{baseUrl}}/api/services/upcoming",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "services", "upcoming"]
                }
            }
        },
        {
            "name": "Get Recent Services",
            "request": {
                "auth": {
                    "type": "bearer",
                    "bearer": [{"key": "token", "value": "{{adminToken}}", "type": "string"}]
                },
                "method": "GET",
                "url": {
                    "raw": "{{baseUrl}}/api/services/recent",
                    "host": ["{{baseUrl}}"],
                    "path": ["api", "services", "recent"]
                }
            }
        }
    ]
}

# Check if "4. Service Management" already exists, if so update it, else append
found = False
for index, item in enumerate(data.get('item', [])):
    if item.get('name') == "4. Service Management":
        data['item'][index] = service_folder
        found = True
        break

if not found:
    data.setdefault('item', []).append(service_folder)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated Postman collection successfully.")
