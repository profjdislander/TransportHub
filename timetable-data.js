// API endpoint to serve the timetable data in JSON format
import fs from 'fs';
import path from 'path';

// Structured timetable data based on the PDF
const timetableData = {
  routes: {
    longwood: {
      name: "Longwood Bus Route",
      stops: ["Jamestown", "Longwood", "Airport", "Longwood (Return)", "Jamestown (Return)"],
      schedules: {
        weekday: {
          "Jamestown": ["07:30", "09:30", "13:30", "16:30"],
          "Longwood": ["08:00", "10:00", "14:00", "17:00"],
          "Airport": ["08:15", "10:15", "14:15", "17:15"],
          "Longwood (Return)": ["08:30", "10:30", "14:30", "17:30"],
          "Jamestown (Return)": ["09:00", "11:00", "15:00", "18:00"]
        },
        saturday: {
          "Jamestown": ["09:30", "13:30"],
          "Longwood": ["10:00", "14:00"],
          "Airport": ["10:15", "14:15"],
          "Longwood (Return)": ["10:30", "14:30"],
          "Jamestown (Return)": ["11:00", "15:00"]
        }
      }
    },
    levelwood: {
      name: "Levelwood Bus Route",
      stops: ["Jamestown", "Levelwood", "Jamestown (Return)"],
      schedules: {
        weekday: {
          "Jamestown": ["08:00", "12:00", "16:00"],
          "Levelwood": ["08:45", "12:45", "16:45"],
          "Jamestown (Return)": ["09:30", "13:30", "17:30"]
        },
        saturday: {
          "Jamestown": ["10:00", "14:00"],
          "Levelwood": ["10:45", "14:45"],
          "Jamestown (Return)": ["11:30", "15:30"]
        }
      }
    },
    "hth-st-pauls": {
      name: "HTH & St Pauls",
      stops: ["Jamestown", "Half Tree Hollow", "St Pauls", "Jamestown (Return)"],
      schedules: {
        weekday: {
          "Jamestown": ["07:45", "10:30", "13:45", "16:45"],
          "Half Tree Hollow": ["08:00", "10:45", "14:00", "17:00"],
          "St Pauls": ["08:15", "11:00", "14:15", "17:15"],
          "Jamestown (Return)": ["08:45", "11:30", "14:45", "17:45"]
        },
        saturday: {
          "Jamestown": ["09:45", "13:45"],
          "Half Tree Hollow": ["10:00", "14:00"],
          "St Pauls": ["10:15", "14:15"],
          "Jamestown (Return)": ["10:45", "14:45"]
        }
      }
    },
    "sandy-bay-blue-hill": {
      name: "Sandy Bay & Blue Hill",
      stops: ["Jamestown", "Sandy Bay", "Blue Hill", "Jamestown (Return)"],
      schedules: {
        weekday: {
          "Jamestown": ["08:30", "12:30", "15:30"],
          "Sandy Bay": ["09:15", "13:15", "16:15"],
          "Blue Hill": ["09:30", "13:30", "16:30"],
          "Jamestown (Return)": ["10:15", "14:15", "17:15"]
        },
        saturday: {
          "Jamestown": ["09:00", "13:00"],
          "Sandy Bay": ["09:45", "13:45"],
          "Blue Hill": ["10:00", "14:00"],
          "Jamestown (Return)": ["10:45", "14:45"]
        }
      }
    }
  },
  fares: {
    adult: {
      up_to_3_miles: 2.45,
      "3_to_6_miles": 3.15,
      over_6_miles: 3.60
    },
    child: {
      up_to_3_miles: 1.20,
      "3_to_6_miles": 1.50,
      over_6_miles: 1.80
    },
    child_age_limit: 10
  }
};

export default function handler(req, res) {
  const { route } = req.query;
  
  if (route && timetableData.routes[route]) {
    // Return data for a specific route
    res.status(200).json(timetableData.routes[route]);
  } else {
    // Return all timetable data
    res.status(200).json(timetableData);
  }
}
