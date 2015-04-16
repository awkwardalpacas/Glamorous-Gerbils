/* db.js */

var mysql = require('mysql');

var connection = mysql.createConnection({
/* TODO : change for deployment! */
  host     : process.env.DB_URL,
  user     : process.env.DB_USER,
  password : process.env.DB_PWD,
  database : ''
});
var avgWait;

connection.connect(function(err){
if(!err) {
    console.log('Database is connected ... \n\n');
} else {
    console.log('Error connecting database ... \n\n');
}
});

var dbQuery = function(querystring, cb){
  connection.query(querystring, function(err, rows, fields) {
    if (!err){
      cb(err, rows);
    }else{
      console.log('dbQuery : Error while performing Query.',err);
    }
  });
};

var dbQueryParams = function(querystring, params, cb){
  connection.query(querystring, params, function(err, rows, fields) {
    if (!err){
      cb(err, rows);
    }else{
      console.log('dbQueryParams : Error while performing Query.',err);
    }
  });
};

// NO OP callback to pass to functions where we are not very interested in the results
var cbNoOp = function(err,rows){
  // NO OP
}



exports.init = function(){
  // create database
  var createDB = 'CREATE DATABASE IF NOT EXISTS nomnow;';
  dbQuery(createDB,function(err,rows){
    if (err){
      console.log(err)
    }
  });
  // use nomNow;
  dbQuery('USE nomnow;',function(err,rows){
    if (err){
      console.log(err)
    }
  });
  var createTblRestaurants = 'CREATE TABLE IF NOT EXISTS restaurants (google_id varchar(255) NOT NULL,name varchar(255) NOT NULL,longitude double precision NOT NULL,latitude double precision NOT NULL,PRIMARY KEY(google_id));';
  dbQuery(createTblRestaurants,function(err,rows){
    if (err){
      console.log(err)
    }
  });
  dbQuery('DROP TABLE reports;', function (err, results) {
    if (err) {
      console.log(err)
    }
  })
  var createTblReports = 'CREATE TABLE IF NOT EXISTS reports (id int NOT NULL auto_increment,google_id varchar(255) NOT NULL,wait_time int NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(id),FOREIGN KEY(google_id) REFERENCES restaurants(google_id));';
  dbQuery(createTblReports,function(err,rows){
    if (err){
      console.log(err)
    }
  });
};

var getAvgWait = function(obj){
  for(k in obj){
    return obj[k];
  }
}

exports.getLatestAvgWaitAtLocation = function(locationID, cb){
  avgWaitQuery = 'SELECT ROUND(AVG(reports.wait_time)/5,0)*5 FROM reports WHERE google_id=?;';
  var query = connection.query(avgWaitQuery,[locationID],function(error,results,fields){
    if(error){
      console.log(error);
    }else if(results){
        avgWait = getAvgWait(results[0]);
        cb(avgWait, locationID);
    }
  });
}

exports.getAvgWaitsLatestReportAllLocs = function(cb){
  var complicatedQuery = 'SELECT restaurants.google_id, restaurants.name, ROUND(AVG(reports.wait_time)/5,0)*5 AS avg_wait, (SELECT reports.created_at FROM reports ORDER BY reports.created_at DESC LIMIT 1) AS most_recent FROM restaurants INNER JOIN reports ON restaurants.google_id = reports.google_id GROUP BY restaurants.google_id;';
  connection.query(complicatedQuery,function(error,results,fields){
    if(error){
      console.log('ERROR : ',error);
    }else if(results){
      cb(results);
    }
  });
}


var checkInDB = function(err,rows){
  if(rows[0]){
    return true;
  }else{
    return false;
  }
}

exports.getAllRestaurants = function(cb){
  var getAllQuery = 'SELECT restaurants.google_id, restaurants.name, reports.wait_time, reports.created_at FROM restaurants INNER JOIN reports ON restaurants.google_id = reports.google_id;';
  dbQuery(getAllQuery,function(err,results){
    if (!err) {
      cb(results)
    }
  });
}
//client needs google_id,wait,timestamp
exports.isRestaurantInDB = function(locationID){
  var existsQuery = 'SELECT EXISTS(SELECT * FROM restaurants WHERE google_id=?);';
  dbQueryParams(existsQuery,locationID,function(err,rows){
    if(err){
      console.log('ERROR : ', err);
    }else{
      //console.log('isRestaurantInDB : rows[0]',rows[0]);
      for(var k in rows[0]){
        return rows[0][k];
      }
    }
  });
}

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
      console.log('Adding report error');
    }
  });
}

exports.addRestaurant = function(name,g_id,lon,lat){
  // ignore duplicates or error
  var addQuery = 'INSERT IGNORE INTO restaurants (name,google_id,longitude,latitude) VALUES (?,?,?,?);';
  var params = [name,g_id,lon,lat];
  dbQueryParams(addQuery,params,function(err,rows){
    if (err) {
      console.log('Add Restaurant error')
    }
  });
}

exports.getLatestReportTimestampById = function(g_id,cb){
  var getLatestQuery = 'SELECT created_at FROM reports WHERE google_id=? AND created_at = (SELECT MAX(created_at) FROM reports) LIMIT 1';
  var params = g_id;
  dbQueryParams(getLatestQuery,params,function(err,rows){
    if(!err){
      cb(rows);
    }
  });
}

exports.addSeedReports = function(){
  //addReport = function(locationID,waitTime,name,lon,lat)
  // Jimmy John's
  exports.addReport("ChIJoQKzBAq1RIYR9vDjI9c6QZs",30,"Jimmy John's",-97.742526,30.27072);
  exports.addReport("ChIJoQKzBAq1RIYR9vDjI9c6QZs",45,"Jimmy John's",-97.742526,30.27072);
  exports.addReport("ChIJoQKzBAq1RIYR9vDjI9c6QZs",20,"Jimmy John's",-97.742526,30.27072);
  exports.addReport("ChIJoQKzBAq1RIYR9vDjI9c6QZs",35,"Jimmy John's",-97.742526,30.27072);
  exports.addReport("ChIJoQKzBAq1RIYR9vDjI9c6QZs",15,"Jimmy John's",-97.742526,30.27072);
  exports.addReport("ChIJoQKzBAq1RIYR9vDjI9c6QZs",30,"Jimmy John's",-97.742526,30.27072);
  // Subway
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",15,"Subway",-97.741557,30.270183);
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",10,"Subway",-97.741557,30.270183);
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",10,"Subway",-97.741557,30.270183);
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",5,"Subway",-97.741557,30.270183);
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",3,"Subway",-97.741557,30.270183);
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",7,"Subway",-97.741557,30.270183);
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",2,"Subway",-97.741557,30.270183);
  // Austin Club
  exports.addReport("ChIJ-b18sKC1RIYRiDl8W83nAW0",10,"Austin Club",-97.74091900000002,30.270743);

}

exports.init();
exports.addSeedReports();


// exports.getLatestAvgWaitAtLocation("ChIJ-yElAAq1RIYRiJYnsvPyhUY", function (results, locationID) {
//   //console.log('Average wait for ID ' + locationID + ' is ', results, ' minutes.')
// });

// exports.getLatestReportTimestampById("ChIJ-yElAAq1RIYRiJYnsvPyhUY",function(err,rows){
//   if(err){
//       console.log('ERROR : ', err);
//     }else{
//       for(var k in rows[0]){
//         console.log('latest timestamp for "ChIJ-yElAAq1RIYRiJYnsvPyhUY" = ',rows[0][k]);
//       }
//     }
// });

exports.getAvgWaitsLatestReportAllLocs(function(rows){
  for(var i = 0;i < rows.length;i++){
    console.log('getAvgWaitsLatestReportAllLocs : rows[i] = ',rows[i].google_id,rows[i].name,rows[i].avg_wait,rows[i].most_recent);
  }
});

// TODO: figure out where to end the connection
// connection.end();
