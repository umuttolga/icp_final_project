use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{BoundedStorable, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::{borrow::Cow, cell::RefCell};

type Memory = VirtualMemory<DefaultMemoryImpl>;

const MAX_VALUE_SIZE: u32 = 100;

#[derive(CandidType, Deserialize)]
struct Proposal {
    description: String,
    approve: u32,
    reject: u32,
    pass: u32,
    is_active: bool,
    voted: Vec<candid::Principal>,
    owner: candid::Principal,
}

#[derive(CandidType, Deserialize)]
struct CreateProposal {
    description: String,
    is_active: bool,
}

impl Storable for Proposal {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for Proposal {
    const MAX_SIZE: u32 = MAX_VALUE_SIZE;
    const IS_FIXED_SIZE: bool = false;
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static PROPOSAL_MAP: RefCell<StableBTreeMap<u64, Proposal, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );
}

#[ic_cdk_macros::query]
fn get_proposal(key: u64) -> Option<Proposal> {
    PROPOSAL_MAP.with(|p| p.borrow().get(&key))
}

#[ic_cdk_macros::query]
fn get_proposal_count() -> u64 {
    PROPOSAL_MAP.with(|p| p.borrow().len())
}

#[ic_cdk_macros::update]
fn create_proposal(key: u64, proposal: CreateProposal) -> Option<Proposal> {
    let value = Proposal {
        description: proposal.description,
        approve: 0u32,
        reject: 0u32,
        pass: 0u32,
        is_active: proposal.is_active,
        voted: vec![],
        owner: ic_cdk::caller(),
    };
    PROPOSAL_MAP.with(|p| p.borrow_mut().insert(key, value))
}

#[ic_cdk_macros::update]
fn edit_proposal(key: u64, proposal: CreateProposal) -> Result<String, String> {
    PROPOSAL_MAP.with(|p| {
        let old_proposal = p.borrow().get(&key).unwrap();
        if ic_cdk::caller() != old_proposal.owner {
            return Err("Only the owner can edit the proposal".to_string());
        }
        let value = Proposal {
            description: proposal.description,
            approve: old_proposal.approve,
            reject: old_proposal.reject,
            pass: old_proposal.pass,
            is_active: proposal.is_active,
            voted: old_proposal.voted,
            owner: ic_cdk::caller(),
        };
        let res = p.borrow_mut().insert(key, value);

        match res {
            Some(_) => {
                return Ok("Successfully updated the proposal".to_string());
            }
            None => Err("Could not update the proposal".to_string()),
        }
    })
}

#[ic_cdk_macros::update]
fn end_proposal(key: u64) -> Result<String, String> {
    PROPOSAL_MAP.with(|p| {
        let mut proposal = p.borrow_mut().get(&key).unwrap();
        if ic_cdk::caller() != proposal.owner {
            return Err("Only the owner can end the proposal".to_string());
        }
        proposal.is_active = false;
        let res = p.borrow_mut().insert(key, proposal);
        match res {
            Some(_) => {
                return Ok("Successfully ended the proposal".to_string());
            }
            None => {
                return Err("Encountered an error while trying to end the proposal".to_string());
            }
        }
    })
}

#[ic_cdk_macros::update]
fn vote(key: u64, choice: u32) -> Result<String, String> {
    PROPOSAL_MAP.with(|p| {
        let mut proposal = p.borrow_mut().get(&key).unwrap();
        let caller = ic_cdk::caller();
        if proposal.voted.contains(&caller) {
            return Err(format!(
                "the function caller with address {} has already voted",
                { caller }
            ));
        } else if proposal.is_active == false {
            return Err("This proposal has ended.".to_string());
        }
        match choice {
            1u32 => proposal.approve += 1,
            2u32 => proposal.reject += 1,
            3u32 => proposal.pass += 1,
            _ => return Err("The given choice is not valid".to_string()),
        }
        proposal.voted.push(caller);
        let res = p.borrow_mut().insert(key, proposal);
        match res {
            Some(_) => {
                return Ok("Successfully voted".to_string());
            }
            None => {
                return Err("Encountered an error while trying to vote".to_string());
            }
        }
    })
}