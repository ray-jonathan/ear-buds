const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();

// const [Model] = require('../models/[model]');

// describe('[Model] model', () => {
//     it('should be able to [do something]', async () => {
//         // Write the code you wish existed
//         const [result] = await [Model].[ormFunctionName]();
//         expect([result]).to.be.instanceOf([dataType]);
//     });
// });