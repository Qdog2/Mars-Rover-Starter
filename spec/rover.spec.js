const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  // 7 tests here!
  it("constructor sets position and default values for mode and generatorWatts", function() {
    let rover = new Rover(98382);
    expect(rover.position).toBe(98382)
    expect(rover.mode).toBe('NORMAL')
    expect(rover.generatorWatts).toBe(110)
  });
  
  it("response returned by receiveMessage contains the name of the message", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message("string", commands);
    let rover = new Rover(98382);
    let receiveMessage = rover.receiveMessage(message).message;
    expect(receiveMessage).toBe(message.name);
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let rover = new Rover(98382)
    let message = new Message("string", commands);
    let results = rover.receiveMessage(message).results;
    expect(results.length).toEqual(2);
  });

  it("responds correctly to the status check command", function() {
    let commands = [new Command('STATUS_CHECK')];
    let rover = new Rover(98382);
    let message = new Message("string", commands);
    let response = rover.receiveMessage(message);
    expect(response.results).toEqual([{completed: true, roverStatus:{generatorWatts: 110, mode: 'NORMAL', position: 98382}}])
  });

  it("responds correctly to the mode change command", function() {
    let commands = [new Command('MODE_CHANGE')];
    let rover = new Rover(98382);
    let message = new Message("string", commands);
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toEqual(true);
  })

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 98382)];
    let rover = new Rover(98382);
    let message = new Message("string", commands);
    let response = rover.receiveMessage(message);
    expect(rover.mode).toEqual('LOW_POWER')
    expect(response.results[1].completed).toEqual(false)
  })

  it("responds with the position for the move command", function() {
    let commands = [new Command('MOVE', 'NORMAL')];
    let rover = new Rover(98382);
    let message = new Message("string", commands);
    let response = rover.receiveMessage(message);
    expect(rover.mode).toEqual('NORMAL')
    expect(response.results[0].completed).toEqual(true);
})
})
