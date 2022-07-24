# partical.xyz

## Project Description

Today, almost all complex DAO tools which claim to be “web3 native” host their data on centralized servers. It is hard to build complex and scalable applications without doing so. Decentralized blockchain networks, alone, are not ideal for complex applications such as productivity tools, content management systems, knowledge management systems etc.

For DAO tools to truly decentralize themselves in a way that they dont need to hold a DAO’s data hostage, they need to use decentralized storage solutions like IPFS or Arweave and decentralized data layers like Ceramic or Tableland. However, using these tools in their current form often leads to other complexities like following.

1. How does a DAO with multiple contributors own and manage the same data?
2. How can a developer easily use data networks like Ceramic in their applications?
3. How does a developer easily find and get started with existing data instead of having to start from scratch?
4. How do applications interoperate to such a degree that an individual DAO contributor can choose which platform (or experience) she wants to use and yet be able to be in sync (or have common context) with other contributors?

These are the problems we are solving with Partical.

### **An example use case - Gitcoin Grants**

*Note: Partical is not a Gitcoin project or in any way related to Gitcoin. We just love and have huge respect for Gitcoin and what it has done for the ecosystem.*

Recently in Grants Round 14, there was a lot of traffic on Gitcoin which caused it to crash at critical times. Due to this, a lot of grant creators and funders were left confused and weren’t able to utilize the full round to get funding or fund their favorite projects respectively.

To solve for this, Gitcoin can start using Partical to easily store grants on a decentralized data layer while letting grant owners own their data and port it from one application to another. If Gitcoin goes down, there can be other platforms which serve the same data and users can use these to fund grants. The grant creator does not need to worry about writing the same grant information in multiple places as all the platforms share the same datastore. Updating grant information on one platform updates it on all other platform that uses the same source of data. Platforms can even use or experiment with new funding, anti-sybil and curation mechanisms on already existing grants leading to many new innovations.

![arch1](https://user-images.githubusercontent.com/24447702/180657118-d9dbc467-1ba9-4229-ba20-2316f4b8ed42.png)


## Technologies Used
- **IPFS**: We use IPFS to store logos and images, and we use Ceramic which is also built on top of IPFS
- **Ceramic**: All the data is stored on Ceramic, we have created easy to use hooks for access to ceramic streams, and read and update multiple streams.
- **LIT Protocol**: Lit protocol is used to encrypt the seed generated to create the DID so that only addresses part of the multi sig can decrypt it
- **Polygon**: Using gnosis multi sig contract deployed on *polygon mainnet*, gnosis polygon API service, we find DAOs deployed on polygon mainnet. We create a ceramic datastore for DAOs on *Polygon*.


## How it's Made
Currently, **Ceramic** streams can only be controlled by 1 DID. Hence ceramic is ideal for use cases where there is an individual writer to a stream. This doesn’t work for DAOs as there can be multiple contributors writing to the same stream. NFT DIDs and Safe DIDs are currently experimental.
For that reason, we have used Key DIDs. To make this usable by only members of the DAO, we encrypt the seed that generated the DID using **LIT protocol** such that only owners of the multi sig contract can decrypt it, hence only allowing them to update the stream. 

For developers, we wanted to make it very easy to query and update data on Ceramic. Developers can come to the developer dashboard and create the schema they need or *they can even combine multiple existing schemas from different applications.*

Developers just need to copy their “AppId” and add it to our react hooks and they can immediately start to fetch and update multiple streams. When developers create a new schema, it is also indexed for future application developers to be able to use it.
The streams are also indexed in a way such that applications built by developers have fast response times.

This indexer is the only centralized component of our app, otherwise all the data is open on ceramic and owned by the **DAO** and not any specific app. However, developers can also choose to build their own indexors in the future.

For DAOs we have also built a dashboard where they can come and see all the data they have generated across different applications and any member of the multi sig can update this data from this dashboard. This data will be updated for all the applications using that particular schema.
We have also provided hooks which developers can use to check if the user can update a particular stream, so the DAO members can also directly go to a particular app and update data from the app instead of having to come to the DAO dashboard.
