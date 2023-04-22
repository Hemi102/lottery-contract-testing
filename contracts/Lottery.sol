pragma solidity ^0.8.9;

contract Lottery {
    address public manager;
    address[] public players;
    constructor(){
        manager = msg.sender;
    }
    function enter() public payable {
        require(msg.value > 10000000000000000);
        players.push(msg.sender);
    }
    function random () private view returns(uint) {
        bytes memory combined = abi.encodePacked(block.difficulty, block.timestamp, players.length);
    bytes32 hash = keccak256(combined);
    return uint256(hash);
    }
    function pickWinner () public restricted{
        uint index = random() % players.length;
        address payable player = payable(players[index]);
        player.transfer(address(this).balance);
        players= new address[](0);
    }
    modifier restricted () {
        require(msg.sender == manager);
        _;
    }
    function getPlayers () public view returns (address[] memory){
        return players;
    }
}