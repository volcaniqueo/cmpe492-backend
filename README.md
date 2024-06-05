# ERC-6150 Contract
This was my senior project for the course CMPE 492 (Project) at Bogazici University.

## To Run the Code

### Run and Test Backend in a Local Node 

First install truffle and ganache client with:

```brew install node``` **(if you have already installed node, skip this)** 

```npm install truffle -g```

```npm install ganache --global```

Now you have installed all the necessary environment to test the project on local node.

Now, open a terminal window and run the ganache client with:

```ganache``` **(If you want the customize the number of accounts use -a flag)**

Then open another terminal window and move into the backend directory:

```cd cmpe492-backend```

To compile the contract run:

```truffle compile```

To deploy the contract run:

```truffle migrate```

Now, open the truffle console with:

```truffle console```

You can now test the code. If you want to test with the provided script (test.js) run:

**IMPORTANT NOTE: Since the newly deployed contract has a new address, you must change the _contractAddress_ variable in the test.js file**

```truffle exec test.js``` 
