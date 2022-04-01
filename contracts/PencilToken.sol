pragma solidity ^0.8.13;

contract PencilToken {
    uint256 public totalSupply;
    string public name = "Pencil";
    string public symbol = "PNC";

    mapping(address => uint256) public balanceOf;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    constructor(uint256 _initialSupply) {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}