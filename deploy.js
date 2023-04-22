const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./compile");

const provider = new HDWalletProvider(
  "sample decorate runway spend equip curve dry health vacuum warfare debris mother",
  "https://sepolia.infura.io/v3/03b27c46b0fe43d09692d03982093521"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = web3.eth.getAccounts();
  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ gas: "1000000", from: accounts[0] });
  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};

deploy();
