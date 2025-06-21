# ICP-based_CRUD_DApp
A basic ICP based DApp that performs Crud operations on user data


This is a CRUD-based Decentralized Application (DApp) built on the Internet Computer (ICP).
It performs Create, Read, Update, and Delete operations on user data stored on-chain.

🧩 Tech Stack
Backend: Rust + ic-cdk
Frontend: React.js
Interface Definition: Candid (.did file)
Communication Tooling: DFX SDK
Styling: SCSS (via index.scss)


#Backend Logic (Rust)
User data is stored in a HashMap<u64, User> structure using ic_cdk::storage.
Each user has a unique ID assigned automatically.
Exposed backend functions:
1. create_user(name, email) → id
2. read_user(id) → Option<User>
3. update_user(id, name, email) → bool
4. delete_user(id) → bool
5. list_users() → Vec<User>
6. DID file is generated using candid::export_service!() in a test block.


🚀 Commands Used
1. dfx new <project> – Create a new DFX project.
2. dfx start – Start the local Internet Computer replica.
3. dfx build – Compile backend canisters (Rust to WASM).
4. dfx deploy – Deploy canisters to the local network.
5. cargo test – Run Rust tests (including export_service!() for DID).
6. npm install – Install frontend dependencies.
7. npm run start – Start the React frontend locally.

   
