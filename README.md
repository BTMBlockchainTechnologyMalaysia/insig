<p align="center">
    <img width="30%" src="insigv1trans.png">
</p>

Welcome to insiġ :sunrise_over_mountains:

*When consumers purchase a Toyota, they are not simply purchasing a car, truck or van. They are placing their trust in our company. - Akio Toyoda*

## Introduction

Supply Chain has always ranked up high as one of those use cases that should be disrupted by blockchain technology. The main reasons for that are supply chains are large, distributed networks of participants that don’t trust each other and where fraud is rife. There isn’t an industry player that can really claim to know with certainty the lifecycle of their products, cradle-to-cradle. It is really difficult to harmonize the data from all components of a supply chain, and the chances of catching someone providing false information are low.

In [TechHQ](https://www.techhq.io/) we have been involved in designing a number of Supply Chain solutions, and in this series of articles I will show a simple [implementation of a blockchain based supply chain database](https://github.com/HQ20/SupplyChain) where data can be trusted to be complete and correct.

To know more, please, read the [wiki](https://github.com/HQ20/insig/wiki).

## Installation

This repository holds the smart contracts (blockchain), a server (to control some cache related to blackchain data) and the client (client) for insiġ. They are considered two different packages and controlled using [lerna](https://github.com/lerna/lerna). First you have to install the dependencies. To do so, in each folder run

```bash
npm install	
```

If you want to run tests and coverage, you have two options. In each folder run the two following commands

``` bash
npm run test
npm run coverage
```

 or, on project's root folder, install the dependencies (using `npm install`) and then run the two above commands from the project's root folder, and it will run tests/coverage for both folders.

## Usage

In regards to make this run, the best options is by using [ganache](https://truffleframework.com/ganache). It allows you to save and load environments. So, create a new environment for insiġ and configure it to use the port *8545*.

Then, from *blockchain* folder run `npx truffle console --network development` and in this new environment, run only `migrate`. This should deploy the contracts to your ganache networks.

If success, go to *server* folder, run a redis server, run `npm run link-contracts` and then `npm run start`. To now more about how to run a redis server, read the [server README](server/README.md).

If success, go to *client* folder, run `npm run link-contracts` and then `npm run start`.

Don't forget to import one account from the ganache environment to your metamask in order to use it.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[Apache-2.0](LICENSE.md)