# partical.xyz

## Project Description

Currently almost all DAO tools which claim to be “web3 native” host their data on centralized servers. The only web3 feature about them is crypto payment. They own the data the DAOs generate on their app and they are responsible for it.

For DAO tools to decentralize themselves they would need to use a decentralized db like IPFS, ceramic or Arweave. But these tools in their current form are not really made for the use case of storing app data. We want to provide an easy to use interface for developers so that there is little to no efforts in setting up their decentralized db.

So for developers we are building Javascript SDK and React hooks to easily create and fetch data from decentralized db. Using our React hooks any developer should easily be able to fetch data from existing apps and be able to create their own frontend with minimal configuration.

For DAOs we are creating a ceramic datastore from a gnosis multi sig. So basically anyone who is owner of the multi sig can update the data generated by the DAO.

## Problem it solves
- Multiple apps can be built on the same data, which allows for users to choose between the frontend he likes the most. also if any app goes down due to some reason they always have the option to go to other apps.
- DAOs can now own their data and they have the freedom to decide which app should be granted use to their data.
- Providing developers easy to use SDK to read/write data on ceramic. Thus allowing them to build truly web3 native tools.
- And another thing to note is DAOs, if they are a legal entity, already own their data legally under GDPR and other data ownership laws around the world no matter which platform it's on. This is better because now they don't have to depend on legal justifications just cryptography

An example use case:

Recently in the Gitcoin Grants round 14, there was a lot of traffic coming on gitcoin which caused it to crash at critical time when the time was about to end. Grant creators were left frustrated as there was no way to donate to them till the site is down.

To solve this gitcoin can start hosting data on a decentralize databased. If gitcoin goes down there can be other frontends which serve the same data and users can use those other apps to donate. The Grant creator does not need to worry about writing the same grant in multiple places as all the apps share the same datastore, changing grant info on 1 app will automatically update others.

## Technologies Used
- **Ceramic**: All the data is store on ceramic
- **LIT Protocol**: Lit protocol is used to encrypt the seed generated to create the DID
- **Gnosis**: Using gnosis polygon service to fectch multi sigs on polygon mainnet

## How it's Made
Currently ceramic streams can only be controlled by 1 did. Hence ceramic is ideal for social media use cases where we need just an individual controlling their data. But what happens in case of DAOs, where not one person is responsible for the data. For that we used the concept of Key DIDs to create a DID for a DAO and to make this usable by only members of the DAO we encrypt the seed that generated the DID using LIT protocol such that only owners of the multi sig contract can decrypt it, hence only allowing them to update the stream.

So this was for the DAO side, now for developers we needed to make it very easy for them to query and update data on Ceramic.

First, Developers can come to our developer dashboard and create the schema they need or they can even combine multiple existing schemas. They would then need to copy this "AppId" and give it our react hook and then they can fetch create update easily.

To make the experience better for developers and users we index the streams created on our internal table. This leads to much faster response times.

This indexer is the only centralized aspect of our app, otherwise all the data is open on ceramic and owned by the DAO and not any app.

For DAOs we have also built this dashboard where they can come and see what all data they have generated and any member of the multi sig can update this data from this dashboard. This data will be updated for all the apps using that particular schema.
