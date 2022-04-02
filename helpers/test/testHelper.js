exports.expectToThrow = async (promise, msg) => {
   let err;
   let msgExist;
   try { 
      await promise;
      console.log("does not throw");
   } 
   catch (error) {
      err = error;
      msgExist = err ? err.message.indexOf(msg) > -1 : false;
   }
   if (!msgExist && err) console.error(`Recieved error but not the one looked for. Error: ${err.message}`);
   assert(msgExist, `${msg} is present in error message`);
   if (msgExist) return err;
};

exports.assertTransferEmitted = (log, arg1Expected, arg2Expected, arg3Expected) => {
   assert.equal(log.event, 'Transfer', 'event is Transfer');
   assert.equal(log.args._from, arg1Expected, 'sender is correct');
   assert.equal(log.args._to, arg2Expected, 'receiver is correct');
   assert.equal(log.args._value, arg3Expected, 'transfered amount is correct');
};

