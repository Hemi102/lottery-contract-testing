const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, evm } = require("../compile");

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ gas: "1000000", from: accounts[0] });
});

describe("Lottery Contract", () => {
  it("deploy a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allow one account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });
    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });
  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({ from: accounts[0], value: 0 });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });
  it("only manager can pickwinner call", async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });
  it("send money to the winner and resets the player array", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("2", "ether") });
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;
    console.log("differnce is ", difference);
    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
});
