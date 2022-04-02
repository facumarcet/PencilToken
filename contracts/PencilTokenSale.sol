pragma solidity ^0.8.13;

import "./PencilToken.sol";

contract PencilTokenSale {
  address admin;
  PencilToken public tokenContract;
  uint256 public tokenPrice;

  constructor(PencilToken _tokenContract, uint256 _tokenPrice) {
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }
}
