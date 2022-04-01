exports.expectToThrow = async (promise) => {
   try {
      await promise;
   } catch (error) {
      return error;
   }
   assert.fail('Expected throw not received');
};

