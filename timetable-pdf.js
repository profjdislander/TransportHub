// API endpoint to serve the timetable PDF
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const pdfPath = path.resolve('./public/timetables.pdf');
  
  // Set the appropriate headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=st-helena-bus-timetables.pdf');
  
  // Create a readable stream and pipe it to the response
  const fileStream = fs.createReadStream(pdfPath);
  fileStream.pipe(res);
}
