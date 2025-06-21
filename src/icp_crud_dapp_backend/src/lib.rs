use candid::{CandidType, Deserialize};
use ic_cdk::storage;
use std::collections::HashMap;

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct User {
    pub id: u64,
    pub name: String,
    pub email: String,
}

type UserStore = HashMap<u64, User>;

#[ic_cdk::init]
fn init() {
    storage::stable_save((UserStore::new(), 0u64)).unwrap();
}

#[ic_cdk::update]
fn create_user(name: String, email: String) -> u64 {
    let (mut users, mut next_id): (UserStore, u64) = storage::stable_restore().unwrap();

    let id = next_id;
    let user = User { id, name, email };
    users.insert(id, user);
    next_id += 1;

    storage::stable_save((users, next_id)).unwrap();
    id
}

#[ic_cdk::query]
fn read_user(id: u64) -> Option<User> {
    let (users, _): (UserStore, u64) = storage::stable_restore().unwrap();
    users.get(&id).cloned()
}

#[ic_cdk::update]
fn update_user(id: u64, name: String, email: String) -> bool {
    let (mut users, next_id): (UserStore, u64) = storage::stable_restore().unwrap();

    if let Some(user) = users.get_mut(&id) {
        user.name = name;
        user.email = email;
        storage::stable_save((users, next_id)).unwrap();
        true
    } else {
        false
    }
}

#[ic_cdk::update]
fn delete_user(id: u64) -> bool {
    let (mut users, next_id): (UserStore, u64) = storage::stable_restore().unwrap();
    if users.remove(&id).is_some() {
        storage::stable_save((users, next_id)).unwrap();
        true
    } else {
        false
    }
}

#[ic_cdk::query]
fn list_users() -> Vec<User> {
    let (users, _): (UserStore, u64) = storage::stable_restore().unwrap();
    users.values().cloned().collect()
}

// This will be used only for DID file generation
#[cfg(test)]
candid::export_service!(); // Generates __export_service()

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::write;

    #[test]
    fn generate_did_file() {
        let did = __export_service();
        write("icp_crud_dapp_backend.did", did).expect("Failed to write .did file");
    }
}
