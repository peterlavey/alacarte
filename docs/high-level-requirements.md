# High level requirements
The application will show a file based on the geolocalization of the user, if the file does not exist, it will use the cam to scan a QR code and save the link, then show the file.
The idea is to avoid scanning QR codes every time and show the file based on the geolocalization.
The application should be able to:
- Read a file stored on the server based on the coordinates provided.
- These coordinates are the geolocalization of the user.
- Find a way to store this information.
- A near point the coordinates should be stored like one record, with the coordinates as key, for example. {x:1 y:2} will return {file: "file.txt"}, if the difference between the coordinates is less than 10 meters should return the same.

## Implement bff layer
- Provide a REST API using geolocalization
- Store inputs and algorithm execution results using coordinates like keys
- Provide API endpoints for retrieving stored results
- Ensure data integrity
- Support efficient querying and filtering of stored results

## Implement a web UI
- Text inputs for to post JSON
- Visualize input and results on the canvas
- Provide a list of executions to retrieve and visualize stored results
