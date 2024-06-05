var Token=artifacts.require ('./ERC6150Token.sol');
module.exports = function(deployer) {
      const arg1 = 'Bogazici';
      const arg2 = 'BOUN';
      deployer.deploy(Token, arg1, arg2);
}