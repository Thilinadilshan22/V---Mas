const fs = require('fs');

const filePath = 'd:\\Software\\Academic\\Git Projects\\V--Mas\\V---Mas\\VMAS_Postman_Collection.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const serviceFolder = {
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
};

let found = false;
if (!data.item) data.item = [];

for (let i = 0; i < data.item.length; i++) {
  if (data.item[i].name === "4. Service Management") {
    data.item[i] = serviceFolder;
    found = true;
    break;
  }
}

if (!found) {
  data.item.push(serviceFolder);
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Collection updated.');
