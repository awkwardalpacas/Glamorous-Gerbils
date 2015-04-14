/* db.js */

var mysql = require('mysql');

var connection = mysql.createConnection({
/* TODO : change for deployment! */  
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : ''
});

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
      cb(rows);
    }else{
      console.log('Error while performing Query.');
    }  
  });
};

var dbQueryParams = function(querystring, params, cb){
  connection.query(querystring, params, function(err, rows, fields) {
    if (!err){
      cb(rows);
    }else{
      console.log('Error while performing Query.',err);
    }  
  });
};

exports.init = function(cb){
  // create database 
  var createDB = 'CREATE DATABASE IF NOT EXISTS nomnow;';
  dbQuery(createDB,function(err,rows){
    cb(err,rows);
  });
  // use nomNow;
  dbQuery('USE nomnow;',function(err,rows){
    cb(err,rows);
  });
  var createTblRestaurants = 'CREATE TABLE IF NOT EXISTS restaurants (google_id varchar(255) NOT NULL,name varchar(255) NOT NULL,longitude double precision NOT NULL,latitude double precision NOT NULL,PRIMARY KEY(google_id));';
  dbQuery(createTblRestaurants,function(err,rows){
    cb(err,rows);
  });
  var createTblReports = 'CREATE TABLE IF NOT EXISTS reports (id int NOT NULL auto_increment,google_id varchar(255) NOT NULL,wait_time int NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(id),FOREIGN KEY(google_id) REFERENCES restaurants(google_id));';
  dbQuery(createTblReports,function(err,rows){
    cb(err,rows);
  });
};

var getAvgWait = function(obj){
  for(k in obj){
    return obj[k];
  }
}

exports.getLatestAvgWaitAtLocation = function(locationID){
  avgWaitQuery = 'SELECT ROUND(AVG(reports.wait_time)/5,0)*5 FROM reports WHERE google_id=?;';
  // dbQueryParams(avgWaitQuery,[locationID],function(err,rows){
  //   getAvgWait(rows);
  // });
  var query = connection.query(avgWaitQuery,[locationID],function(error,results,fields){
    if(error){
      console.log(error);
    }else if(results){
      return function(){
        getAvgWait(results[0]); 
      }
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
  var getAllQuery = 'SELECT * FROM restaurants;';
  dbQuery(getAllQuery,function(err,rows){
    cb(err,rows);
  })
}

exports.isRestaurantInDB = function(locationID,checkInDB){
  var existsQuery = 'SELECT EXISTS(SELECT * FROM restaurants WHERE google_id=?);';
  dbQueryParams(existsQuery,locationID,function(err,rows){
    checkInDB(err,rows);
  });
}

exports.addReport = function(locationID,waitTime,name,lon,lat,cb){
  var reportQuery = 'INSERT INTO reports (google_id, wait_time) VALUES (?,?);';
  var params = [locationID,waitTime];
  if(exports.isRestaurantInDB(locationID,cb)){
    // NO OP    
  }else{
    exports.addRestaurant(name,locationID,lon,lat,cb);    
  }
  dbQueryParams(reportQuery,params,cb);
}

exports.addRestaurant = function(name,g_id,lon,lat,cb){
  // ignore duplicates or error
  var addQuery = 'INSERT IGNORE INTO restaurants (name,google_id,longitude,latitude) VALUES (?,?,?,?);';
  var params = [name,g_id,lon,lat];
  dbQueryParams(addQuery,params,function(err,rows){
    cb(err, rows);
  });
}

exports.addSeedRestaurants = function(cb){
  exports.addRestaurant("Perry's Steakhouse & Grille","ChIJz7o2jgm1RIYRi_5Y7JfjH0A",-97.74351200000001,30.269557,cb);
  exports.addRestaurant("Roaring Fork","ChIJ1XlZ4Qm1RIYR4rpevy6Ybs4",-97.74213199999997,30.269059,cb);
  exports.addRestaurant("Subway","ChIJ-yElAAq1RIYRiJYnsvPyhUY",-97.741557,30.270183,cb);
  exports.addRestaurant("Chipotle Mexican Grill","ChIJf9x0-Qm1RIYRR9RPGWhe9Tg",-97.74174600000003,30.27,cb);
  exports.addRestaurant("Cozzoli's Pizza","ChIJl_CT7Qm1RIYRmiQYoWVnXp8",-97.742658,30.269329,cb);
  exports.addRestaurant("Athenian Bar & Grill","ChIJ0YsSvwm1RIYRN6TKC9_caXo",-97.74303099999997,30.268397,cb);
  exports.addRestaurant("Ruth's Chris Steak House","ChIJWQDHxwm1RIYRJmu_M83GQlI",-97.743493,30.268038,cb);
  exports.addRestaurant("Quattro Gatti Ristorante e Pizzeria","ChIJBZ8SDAq1RIYRr_FM1PoH68A",-97.74195099999997,30.271327,cb);
  exports.addRestaurant("Jimmy John's","ChIJoQKzBAq1RIYR9vDjI9c6QZs",-97.742526,30.27072,cb);  
}

exports.addSeedReports = function(cb){
  //addReport = function(locationID,waitTime,name,lon,lat)
  // Jimmy John's
  exports.addReport("ChIJoQKzBAq1RIYR9vDjI9c6QZs",30,"Jimmy John's",-97.742526,30.27072,cb);
  exports.addReport("ChIJoQKzBAq1RIYR9vDjI9c6QZs",45,"Jimmy John's",-97.742526,30.27072,cb);
  exports.addReport("ChIJoQKzBAq1RIYR9vDjI9c6QZs",20,"Jimmy John's",-97.742526,30.27072,cb);
  exports.addReport("ChIJoQKzBAq1RIYR9vDjI9c6QZs",35,"Jimmy John's",-97.742526,30.27072,cb);
  exports.addReport("ChIJoQKzBAq1RIYR9vDjI9c6QZs",15,"Jimmy John's",-97.742526,30.27072,cb);
  exports.addReport("ChIJoQKzBAq1RIYR9vDjI9c6QZs",30,"Jimmy John's",-97.742526,30.27072,cb);
  // Subway
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",15,"Subway",-97.741557,30.270183,cb);
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",10,"Subway",-97.741557,30.270183,cb);
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",10,"Subway",-97.741557,30.270183,cb);
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",5,"Subway",-97.741557,30.270183,cb);
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",3,"Subway",-97.741557,30.270183,cb);
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",7,"Subway",-97.741557,30.270183,cb);
  exports.addReport("ChIJ-yElAAq1RIYRiJYnsvPyhUY",2,"Subway",-97.741557,30.270183,cb);
  // Austin Club
  exports.addReport("ChIJ-b18sKC1RIYRiDl8W83nAW0",10,"Austin Club",-97.74091900000002,30.270743,cb);

}

exports.init(function(err,rows){
  console.log('init : err - rows',err,rows);
});
exports.addSeedRestaurants(function(err,rows){
  console.log('addSeedRestaurants : err - rows',err,rows);
});
exports.addSeedReports(function(err,rows){
  console.log('addSeedReports : err - rows',err,rows);
});


console.log('exports.getLatestAvgWaitAtLocation("ChIJ-yElAAq1RIYRiJYnsvPyhUY") = ',exports.getLatestAvgWaitAtLocation("ChIJ-yElAAq1RIYRiJYnsvPyhUY"));

connection.end();