var db = require('../server/db.js');

describe("db.js functions defined",function(){
  it('has an init function',function(){
    expect(db.init).toBeDefined();
  });
  it('has a getLatestAvgWaitAtLocation function',function(){
    expect(db.getLatestAvgWaitAtLocation).toBeDefined();
  });
  it('has a getAvgWaitsLatestReportAllLocs function',function(){
    expect(db.getAvgWaitsLatestReportAllLocs).toBeDefined();
  });
  it('has a getAllRestaurants function',function(){
    expect(db.getAllRestaurants).toBeDefined();
  });
  it('has an isRestaurantInDB function',function(){
    expect(db.isRestaurantInDB).toBeDefined();
  });
  it('has an addReport function',function(){
    expect(db.addReport).toBeDefined();
  });
  it('has an addRestaurant function',function(){
    expect(db.addRestaurant).toBeDefined();
  });
  it('has a getLatestReportTimestampById function',function(){
    expect(db.getLatestReportTimestampById).toBeDefined();
  });
});
