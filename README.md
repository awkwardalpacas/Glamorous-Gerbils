# NomNow 2.0
*Skip lines, not lunch*

Version 2.0 offers the following updates, bug fixes, and features:

- Map can be re-centered based on Search Box = search for address or establishment name
- Restaurants provided in the "Report Wait Times" feature are the five closest to the center of the map
- 12,000 test data reports over 20 restaurants generated for demonstration purposes
- NomNow2.0 integrates with Tropo API.  This calls a restaurant, records a response, transcribes the response, parses the wait time integer, and stores the information as a new report in the database.
- User can view a popup graph of historical wait times for any given hour for an individual restaurant. An algorithm parses when past wait times were reported and averages the reported times for each hour. Highcharts was used to generate the graph based on these results.


Contributors
------------

Adam Guerra [Adam's Github profile] (https://github.com/adamlg)

Karen Lewis [Karen's Github profile](https://github.com/karmakettle)

Josh Benson [Josh's Github profile](https://github.com/joshuabenson)

Stephanie Foskitt [Stephanie's Github profile](https://github.com/SFoskitt)


NomNow 1.0 information:
----------------------

[View the deployed app](http://nomnow.herokuapp.com)

Built by [Phil Dornfeld](https://github.com/phillydorn), [Pat Dalberg](https://github.com/pat-dalberg), [Vishal Atmakuri](https://github.com/vishalatmakuri), and [Ben Johnson](https://github.com/bjmfactory)


# Table of contents
1. Concept
2. Stack
3. Ideas for Extension

# 1. Concept
NomNow2.0 is a web application for crowdsourcing wait times at restaurants. When at a restaurant, anyone can submit a wait time, and all the reported wait times are pooled and used to create a map which shows the average reported wait time for each restaurant.

# 2. Stack

## Database: mySQL
Our schema has two tables: restaurants and reports. They look like this:

### restaurants
| google_id (primary) | name | website | longitude | latitude |
| :---: | :---: | :---: | :---: | :---: |
| ChIJz7o2jgm1RIYRi_5Y7JfjH0A | Perry's Steakhouse & Grille | http://perryssteakhouse.com | -97.74351200000001 | 30.269557 |

### reports
| id (primary) | google_id (foreign) | wait_time | created_at |
| :---: | :---: | :---: | :---: |
| 1 | ChIJz7o2jgm1RIYRi_5Y7JfjH0A | 15 | 2015-04-20 10:10:35 |

## Server: Node with Express
The server is comprised of two files.

### app.js
This is where the express server is created. It serves up static files at '/' and accepts GET and POST requests at '/wait'.

### db.js
This is where the functions that have the SQL queries live (we are not using an ORM). These functions are called from app.js.

## Client: Angular + Bootstrap

Angular is taking care of the routes. When someone tries to report a wait, the client asks them for their location, and then it uses that to find restaurants where they may be.

### Modal
We used the `angular-bootstrap` library to create the modal.

### Googele Maps API + Google Places
We used the Google Maps API to generate the map and the markers, and we used the Google Places libary to get the info about the places.

# 3. Ideas for Improvement/Extension

## Delete Old Data
Write a cron job that prunes stale data. The data will be relevant only for an hour or two.

## Reactive Updating
Make the client auto-refresh when someone else submits data.

## Integrate with other APIs
Ideas: OpenTable, Yelp, FourSquare

## Filter Data by Location
Right now by default we serve up every report in the database when we create a map. Use the GPS of the client asking and dynamically serve up a map of only that city.

## Integrate with Oculus Rift
Not for the faint of heart.

