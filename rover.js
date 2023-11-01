const Command = require('./command.js');
const Message = require("./message");

class Rover {
   constructor(position, mode, generatorWatts) {
      this.position = position;
      this.mode = 'NORMAL';
      this.generatorWatts = 110;
   }

   receiveMessage(message) {
      response = {
         message: message.name,
         results: []
      }
      for (let i = 0; i < message.commands.length; i++) {
         if (message.commands[i].commandType === 'STATUS_CHECK') {
            response.results.push({completed: true, roverStatus: {mode: this.mode, generatorWatts: this.generatorWatts, position: this.position}})
         }
         if (message.commands[i].commandType === 'MODE_CHANGE') {
            this.mode = message.commands[i].value
            response.results.push({completed: true})
         } 
         if (message.commands[i].commandType === 'MOVE') {
            if (this.mode === 'NORMAL') {
               this.position = message.commands[i].value;
               response.results.push({completed:true})
            } 
            if (this.mode === 'LOW_POWER') {
               response.results.push({completed: false})
            }
         }
}
   return response
}
}
let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
let message = new Message('Test message with two commands', commands);
let rover = new Rover(98382);    // Passes 98382 as the rover's position.
var response = rover.receiveMessage(message);

console.log(response);

module.exports = Rover;