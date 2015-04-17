/* db.js */

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : process.env.DB_URL,
  user     : process.env.DB_USER,
  password : process.env.DB_PWD,
  database : process.env.DB
});

var avgWait;

connection.connect(function(err){
if(!err) {
    // NO OP
} else {
    console.error('Error connecting database');
}
});

var dbQuery = function(querystring, cb){
  connection.query(querystring, function(err, rows, fields) {
    if (!err){
      cb(err, rows);
    }else{
      console.error('dbQuery : Error while performing Query.');
    }
  });
};

var dbQueryParams = function(querystring, params, cb){
  connection.query(querystring, params, function(err, rows, fields) {
    if (!err){
      cb(err, rows);
    }else{
      console.error('dbQueryParams : Error while performing Query.');
    }
  });
};

exports.init = function(){
  var createDB = 'CREATE DATABASE IF NOT EXISTS nomnow;';
  dbQuery(createDB,function(err,rows){
    if (err){
      console.error(err)
    }
  });
  dbQuery('USE nomnow;',function(err,rows){
    if (err){
      console.error(err)
    }
  });
  var createTblRestaurants = 'CREATE TABLE IF NOT EXISTS restaurants (google_id varchar(255) NOT NULL,name varchar(255) NOT NULL,longitude double precision NOT NULL,latitude double precision NOT NULL,PRIMARY KEY(google_id));';
  dbQuery(createTblRestaurants,function(err,rows){
    if (err){
      console.error(err)
    }
  });
  var createTblReports = 'CREATE TABLE IF NOT EXISTS reports (id int NOT NULL auto_increment,google_id varchar(255) NOT NULL,wait_time int NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(id),FOREIGN KEY(google_id) REFERENCES restaurants(google_id));';
  dbQuery(createTblReports,function(err,rows){
    if (err){
      console.error(err)
    }
  });
};

var getAvgWait = function(obj){
  for(k in obj){
    return obj[k];
  }
};

exports.getLatestAvgWaitAtLocation = function(locationID, cb){
  avgWaitQuery = 'SELECT ROUND(AVG(reports.wait_time)/5,0)*5 FROM reports WHERE google_id=?;';
  var query = connection.query(avgWaitQuery,[locationID],function(error,results,fields){
    if(error){
      console.error('ERROR : getLatestAvgWaitAtLocation');
    }else if(results){
        avgWait = getAvgWait(results[0]);
        cb(avgWait, locationID);
    }
  });
};

exports.getAvgWaitsLatestReportAllLocs = function(cb){
  var complicatedQuery = 'SELECT restaurants.google_id, restaurants.name, ROUND(AVG(reports.wait_time)/5,0)*5 AS avg_wait, (SELECT reports.created_at FROM reports ORDER BY reports.created_at DESC LIMIT 1) AS most_recent FROM restaurants INNER JOIN reports ON restaurants.google_id = reports.google_id GROUP BY restaurants.google_id;';
  connection.query(complicatedQuery,function(error,results,fields){
    if(error){
      console.log('ERROR : getAvgWaitsLatestReportAllLocs');
    }else if(results){
      cb(results);
    }
  });
};


var checkInDB = function(err,rows){
  if(rows[0]){
    return true;
  }else{
    return false;
  }
};

exports.getAllRestaurants = function(cb){
  var getAllQuery = 'SELECT restaurants.google_id, restaurants.name, reports.wait_time, reports.created_at FROM restaurants INNER JOIN reports ON restaurants.google_id = reports.google_id;';
  dbQuery(getAllQuery,function(err,results){
    if (!err) {
      cb(results)
    }
  });
};

exports.isRestaurantInDB = function(locationID){
  var existsQuery = 'SELECT EXISTS(SELECT * FROM restaurants WHERE google_id=?);';
  dbQueryParams(existsQuery,locationID,function(err,rows){
    if(err){
      console.error('ERROR : isRestaurantInDB');
    }else{
      for(var k in rows[0]){
        return rows[0][k];
      }
    }
  });
};

exports.addReport = function(locationID,waitTime,name,lon,lat){
  var reportQuery = 'INSERT INTO reports (google_id, wait_time) VALUES (?,?);';
  var params = [locationID,waitTime];
  if(exports.isRestaurantInDB(locationID)){
    // NO OP
  }else{
    exports.addRestaurant(name,locationID,lon,lat);
  }
  dbQueryParams(reportQuery,params, function (err, rows){
    if (err) {
      console.error('ERROR : addReport');
    }
  });
};

exports.addRestaurant = function(name,g_id,lon,lat){
  // ignore duplicates or error
  var addQuery = 'INSERT IGNORE INTO restaurants (name,google_id,longitude,latitude) VALUES (?,?,?,?);';
  var params = [name,g_id,lon,lat];
  dbQueryParams(addQuery,params,function(err,rows){
    if (err) {
      console.error('ERROR : addRestaurant');
    }
  });
};

exports.getLatestReportTimestampById = function(g_id,cb){
  var getLatestQuery = 'SELECT created_at FROM reports WHERE google_id=? AND created_at = (SELECT MAX(created_at) FROM reports) LIMIT 1';
  var params = g_id;
  dbQueryParams(getLatestQuery,params,function(err,rows){
    if(!err){
      cb(rows);
    }
  });
};

exports.init();

// TODO: figure out where to end the connection
// connection.end();
