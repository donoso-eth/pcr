import { task } from 'hardhat/config';

task('kovan-verify', 'Prints the list of accounts').setAction(async ({}, hre) => {
  await hre.run("verify:verify", {
    address: "0xC9aA24Bb16a018Cb10323821f7cF06d9CDF121E4",
    constructorArguments: [
    ],
  });
  });
  