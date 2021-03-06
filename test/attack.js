const { ethers } = require("hardhat")
const { BigNumber } = require("ethers")
const { expect, assert } = require("chai")

describe("Attacking a contract", async () => {
    it("should be able to execute a delegate call attack", async () => {
        // Deploy Helper contract
        const HelperContract = await ethers.getContractFactory("Helper")
        const helperContract = await HelperContract.deploy()
        await helperContract.deployed()
        console.log(`Helper Contract address: ${helperContract.address}`)
        
        // Deploy the Good contract
        const GoodContract = await ethers.getContractFactory("Good")
        const goodContract = await GoodContract.deploy(helperContract.address)
        await goodContract.deployed()
        console.log(`GoodContract address: ${goodContract.address}`)

        // Deploy the attack Contract
        const AttackContract = await ethers.getContractFactory("Attack")
        const attackContract = await AttackContract.deploy(goodContract.address)
        await attackContract.deployed()
        console.log(`Attack Contract address: ${attackContract.address}`)

        // Let's attack now and overwrite the owner address in Good Contract
        let tx = await attackContract.attack()
        await tx.wait()

        let newGoodContractOwner = await goodContract.owner()
        console.log(newGoodContractOwner)

        assert.equal(newGoodContractOwner, attackContract.address)

    })
})