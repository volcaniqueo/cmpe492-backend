const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const d3 = require('d3');
const { JSDOM } = require('jsdom');
const svg2img = require('svg2img');

module.exports = async function(callback) {
    var contractABI = [
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "ERC721IncorrectOwner",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "ERC721InsufficientApproval",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "approver",
            "type": "address"
          }
        ],
        "name": "ERC721InvalidApprover",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          }
        ],
        "name": "ERC721InvalidOperator",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "ERC721InvalidOwner",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          }
        ],
        "name": "ERC721InvalidReceiver",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "ERC721InvalidSender",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "ERC721NonexistentToken",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "approved",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "approved",
            "type": "bool"
          }
        ],
        "name": "ApprovalForAll",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "minter",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "parentId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "Minted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "childrenOf",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "childrenIds",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "getApproved",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          }
        ],
        "name": "isApprovedForAll",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "isLeaf",
        "outputs": [
          {
            "internalType": "bool",
            "name": "leaf",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "isRoot",
        "outputs": [
          {
            "internalType": "bool",
            "name": "root",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "ownerOf",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "parentOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "parentId",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "approved",
            "type": "bool"
          }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes4",
            "name": "interfaceId",
            "type": "bytes4"
          }
        ],
        "name": "supportsInterface",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "tokenURI",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "parentId",
            "type": "uint256"
          }
        ],
        "name": "safeMintHierarchical",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "parentId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "numberOfTokens",
            "type": "uint256"
          }
        ],
        "name": "safeBatchMintHierarchical",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "safeBurn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256[]",
            "name": "tokenIds",
            "type": "uint256[]"
          }
        ],
        "name": "safeBatchBurn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    var contractAddress = '0x24FB8497455CDA39d6fe4a7506a6f784F42717D0';
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Unlock all accounts in the blockchain
    const accounts = await web3.eth.getAccounts();
    for(let i = 0; i < accounts.length; i++){
      await web3.eth.personal.unlockAccount(accounts[i]);
    }

    // Tests of mint function with different shapes

    async function simulate_straight_tree() {
      currentParentId = 0;
      let tokens = [];
      for(let i = 1; i < accounts.length; i++){
          const txHash = await contract.methods.safeMintHierarchical(accounts[i], currentParentId).send({from: accounts[0], gas: 500000});
          currentParentId++;
          tokens.push(txHash.events.Transfer.returnValues.tokenId);
      }
    }

    async function simulate_balanced_tree() {
      let currentParentIds = [0]; // Start with the root parent id
      let tokens = [];
  
      for (let depth = 0; depth < accounts.length; depth++) {
          let newParentIds = [];
  
          for (let parentId of currentParentIds) {
              // Mint two children for each parent
              for (let j = 0; j < 2; j++) {
                  const txHash = await contract.methods.safeMintHierarchical(accounts[depth], parentId).send({ from: accounts[0], gas: 500000 });
                  const tokenId = txHash.events.Transfer.returnValues.tokenId;
                  tokens.push(tokenId);
                  newParentIds.push(tokenId);
              }
          }
  
          currentParentIds = newParentIds; // Update the current parents for the next level
      }
  
      return tokens; //Return the tokens array if needed for further processing
    }

    let tree = {};

    //console.log(tokens);
    try {
    tokens = await simulate_balanced_tree();
    } catch (error) {
      console.error("Error minting tokens:", error);
    }

    // Using parentOf, childrenOf, isLeaf, isRoot extract the complete tree structure when only one token is given

    async function findRoot(tokenId) {
      let currentToken = tokenId;
      while (true) {
        const isRootToken = await contract.methods.isRoot(currentToken).call();
        if (isRootToken) {
            return currentToken;
        }
        currentToken = await contract.methods.parentOf(currentToken).call();
      }
    }

    async function buildTree(tokenId) {
      const parentOfToken = await contract.methods.parentOf(tokenId).call();
      const childrenOfToken = await contract.methods.childrenOf(tokenId).call();
      const isLeafToken = await contract.methods.isLeaf(tokenId).call();
      const isRootToken = await contract.methods.isRoot(tokenId).call();

      let node = {
          tokenId: tokenId,
          parent: parentOfToken,
          children: childrenOfToken,
          isLeaf: isLeafToken,
          isRoot: isRootToken,
          childNodes: []
      };

      for (let i = 0; i < childrenOfToken.length; i++) {
          const childNode = await buildTree(childrenOfToken[i]);
          node.childNodes.push(childNode);
      }

      return node;
    }

    async function drawTree(tree) {
      const width = 7680;
      const height = 4320;
      const canvas = createCanvas(width, height);
      const context = canvas.getContext('2d');

      const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
      const body = d3.select(dom.window.document.querySelector('body'));
      
      const svg = body.append('svg')
          .attr('xmlns', 'http://www.w3.org/2000/svg')
          .attr('width', width)
          .attr('height', height);

      const data = d3.hierarchy(tree, d => d.childNodes);
      const treeLayout = d3.tree().size([width - 160, height - 160]);
      const root = treeLayout(data);

      svg.selectAll('line')
          .data(root.links())
          .enter()
          .append('line')
          .attr('x1', d => d.source.x + 80)
          .attr('y1', d => d.source.y + 80)
          .attr('x2', d => d.target.x + 80)
          .attr('y2', d => d.target.y + 80)
          .attr('stroke', 'black');

      svg.selectAll('circle')
          .data(root.descendants())
          .enter()
          .append('circle')
          .attr('cx', d => d.x + 80)
          .attr('cy', d => d.y + 80)
          .attr('r', 5)
          .attr('fill', 'steelblue');

      svg.selectAll('text')
          .data(root.descendants())
          .enter()
          .append('text')
          .attr('x', d => d.x + 85)
          .attr('y', d => d.y + 85)
          .text(d => d.data.tokenId);

      const svgString = body.select('svg').node().outerHTML;

      if (svgString) {
          await new Promise((resolve, reject) => {
              svg2img(svgString, { format: 'jpg', width, height }, (error, buffer) => {
                  if (error) {
                      reject(error);
                  } else {
                      fs.writeFileSync('./tree.jpg', buffer);
                      console.log('Tree image saved as tree.jpg');
                      resolve();
                  }
              });
          });
      } else {
          console.error('SVG string is undefined or empty.');
      }
    }


    try {
      const givenTokenId = tokens[2]; // Consider the third token as the given token for example
      const rootNode = await findRoot(givenTokenId);
      tree = await buildTree(rootNode);

      console.log("Tree structure:");
      //console.log(JSON.stringify(tree, null, 2));

      try {
      drawTree(tree);
      } catch (error) {
        console.error("Error drawing tree:", error);
      }

    } catch (error) {
      console.error("Error extracting tree structure:", error);
    }




    
}