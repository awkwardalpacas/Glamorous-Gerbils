# NomNow
*Skip lines, not lunch*

[View the deployed app](http://nomnow.herokuapp.com)

Built by [Phil Dornfeld](https://github.com/phillydorn), [Pat Dalberg](https://github.com/pat-dalberg),[Vishal Atmakuri](https://github.com/vishalatmakuri), and [Ben Johnson](https://github.com/bjmfactory)


# Table of contents
1. Concept
2. Stack
3. Ideas for Extension

# 1. Concept
NomNow is a web application for crowdsourcing wait times at restaurants. When at a restaurant, anyone can submit a wait time, and all the reported wait times are pooled and used to create a map which shows the average reported wait time for each restaurant.

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

## Client: Angular


# 3. Ideas for Extension


