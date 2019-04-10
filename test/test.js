const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();

const Artists = require('../models/artists');

describe('Artists model', () => {
    it('should be able to [do something]', async () => {
        // Write the code you wish existed
        const arrayOfArtists = await Artists.getArtists(3);
        console.log("Array? ",arrayOfArtists);
        expect(arrayOfArtists).to.be.instanceOf(Artists);
    });
});