describe("pingPong", function(){
  it("will count up to a certain number", function(){
    expect(pingPong("2")).to.eql([1,2]);
  });
  it("will insert ping for numbers divisible by 3", function(){
    expect(pingPong("4")).to.eql([1,2,"ping",4]);
  });
});
