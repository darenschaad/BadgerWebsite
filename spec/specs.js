describe("pingPong", function(){
  it("will count up to a certain number", function(){
    expect(pingPong("2")).to.eql([1,2]);
  });
  it("will insert ping for numbers divisible by 3", function(){
    expect(pingPong("4")).to.eql([1,2,"ping",4]);
  });
  it("will insert pong for numbers divisible by 5", function(){
    expect(pingPong("6")).to.eql([1,2,"ping",4,"pong","ping"]);
  });
  it("will insert 'pingpong' for numbers divisible by 15", function(){
    expect(pingPong("15")).to.eql([1,2,"ping",4,"pong","ping",7,8,"ping","pong",11,"ping",13,14,"ping-pong"]);
  });
});
