function RIGHT(X) { return X + 1 };
function LEFT(X) { return X - 1 };

class MerkleTree {
    constructor(leaves, concat) {
        this.leaves = leaves;
        this.concat = concat;
    }

    getRoot() {
        var leaves = this.leaves;
        while (leaves.length > 1) {
            var newLeaves = [];
            // Combine all couples
            while(leaves.length > 1) {
                newLeaves.push(this.concat(leaves[0], leaves[1]));
                leaves.shift();
                leaves.shift();
            }
            // If odd tree take the last elem to the upper level tree
            if (leaves.length == 1) {
                newLeaves.push(leaves[leaves.length - 1]);
            }
            leaves = newLeaves;
        }
        return leaves[0];
    }

    getNewLeaves(leaves) {
        var newLeaves = [];
        // Combine all couples
        while(leaves.length > 1) {
            newLeaves.push(this.concat(leaves[0], leaves[1]));
            leaves.shift();
            leaves.shift();
        }
        // If odd tree take the last elem to the upper level tree
        if (leaves.length == 1) {
            newLeaves.push(leaves[leaves.length - 1]);
        }
        return newLeaves;
    }

    getProof(index) {
        // global
        var leaves = Array.from(this.leaves);
        var proof = []

        while (leaves.length > 1) {
            // Pair donc à gauche
            const isDataLeft = (index % 2) == 0;
            // Index de l'autre branche
            const indexSibling = isDataLeft ? RIGHT(index) : LEFT(index);
            
            const newProof = { data: leaves[indexSibling], left: !isDataLeft };
            proof.push(newProof);
            index = Math.trunc(index / 2);

            leaves = this.getNewLeaves(leaves);
        }
        return proof;
    }
}

const {assert} = require("chai");
const {hashProof, sha256, concatHash, concatLetters} = require('./testUtils');

function main() {
    const leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const root = 'eb100814abc896ab18bcf6c37b6550eeadeae0c312532286a4cf4be132ace526';
    const hashTree = new MerkleTree(leaves.map(sha256), concatHash);
    const lettersTree = new MerkleTree(leaves, concatLetters);

    const i = 0;
    const proof = hashTree.getProof(i);
    const hashedProof = hashProof(leaves[i], proof).toString('hex');
    if(hashedProof !== root) {
        const lettersProof = lettersTree.getProof(i);
        console.log(
        "The resulting hash of your proof is wrong. \n" +
        `We were expecting: ${root} \n` +
        `We recieved: ${hashedProof} \n` +
        `In ${leaves.join('')} Merkle tree, the proof of ${leaves[i]} you gave us is: \n` +
        `${JSON.stringify(lettersProof, null, 2)}`
        );
    }
    console.log(hashedProof);
    console.log(root);
}

// eb100814abc896ab18bcf6c37b6550eeadeae0c312532286a4cf4be132ace526

main();

module.exports = MerkleTree;