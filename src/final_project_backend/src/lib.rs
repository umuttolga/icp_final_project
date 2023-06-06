use std::cell::RefCell;

use ic_cdk::export::serde::{Deserialize, Serialize};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query, update};

thread_local! {
    static STATE: RefCell<State> = RefCell::default();
}

#[pre_upgrade]
fn pre_upgrade() {
    STATE.with(|_state| {
        ic_cdk::storage::stable_save((
            &_state.borrow().proposal_list,
            &_state.borrow().counter,
            &_state.borrow().owner,
        ))
        .unwrap();
    });
}

// #[post_upgrade]
// fn post_upgrade() {
//     let (proposal_list, counter, owner): (Vec<Proposal>, u32, candid::Principal) =
//         ic_cdk::storage::stable_restore().unwrap();
//     let state = State {
//         proposal_list,
//         counter,
//         owner,
//     };

//     STATE.with(|_state| {
//         *_state.borrow_mut() = state;
//     });
// }

#[derive(candid::CandidType, Clone, Serialize, Deserialize)]
struct State {
    proposal_list: Vec<Proposal>,
    counter: u32,
    owner: candid::Principal,
}

impl Default for State {
    fn default() -> Self {
        Self {
            proposal_list: vec![],
            counter: 0,
            owner: candid::Principal::anonymous(),
        }
    }
}

#[init]
fn init() {
    let owner = ic_cdk::caller();
    let init_state = State {
        proposal_list: vec![],
        counter: 0,
        owner,
    };
    STATE.with(|_state| {
        *_state.borrow_mut() = init_state;
    });
}

#[derive(candid::CandidType, Clone, Serialize, Deserialize)]
struct Proposal {
    description: String,
    approve: u32,
    reject: u32,
    pass: u32,
    is_active: bool,
    voted: Vec<candid::Principal>,
}

impl Default for Proposal {
    fn default() -> Self {
        Proposal {
            description: "Empty".to_string(),
            approve: 0,
            reject: 0,
            pass: 0,
            is_active: true,
            voted: vec![],
        }
    }
}

//Update functions

#[update]
fn set_owner(new_owner: candid::Principal) {
    STATE.with(|_state| {
        impl_set_owner(&mut _state.borrow_mut(), new_owner);
    });
}

fn impl_set_owner(state: &mut State, new_owner: candid::Principal) {
    state.owner = new_owner;
}

#[update]
fn create_proposal(_description: Option<String>) {
    STATE.with(|_state| {
        impl_create_proposal(&mut _state.borrow_mut(), _description, ic_cdk::caller());
    });
}

fn impl_create_proposal(
    state: &mut State,
    _description: Option<String>,
    caller: candid::Principal,
) {
    state.counter += 1u32;

    let mut proposal = Proposal::default();
    proposal.voted.push(caller);
    if let Some(value) = _description.clone() {
        proposal.description = value;
    }
    state.proposal_list.push(proposal.clone());
}

#[update]
fn edit_proposal_description(new_description: String) {
    STATE.with(|_state| {
        impl_edit_proposal_description(&mut _state.borrow_mut(), new_description);
    });
}

fn impl_edit_proposal_description(state: &mut State, new_description: String) {
    state.proposal_list[state.counter as usize - 1].description = new_description;
}

#[update]
fn end_proposal(index: u32) -> Result<String, String> {
    STATE.with(|_state| impl_end_proposal(&mut _state.borrow_mut(), index, ic_cdk::caller()))
}

fn impl_end_proposal(
    state: &mut State,
    index: u32,
    caller: candid::Principal,
) -> Result<String, String> {
    let owner = state.proposal_list[index as usize].voted[0];
    if owner != caller {
        Err("The function caller is not the owner of the proposal".to_string())
    } else {
        state.proposal_list[index as usize].is_active = false;
        Ok(format!("Proposal {} has been deactivated", index + 1))
    }
}

#[update]
fn vote(proposal_id: u32, choice: u32) -> Result<String, String> {
    STATE.with(|_state| {
        impl_vote(
            &mut _state.borrow_mut(),
            proposal_id as usize,
            choice,
            ic_cdk::caller(),
        )
    })
}

fn impl_vote(
    state: &mut State,
    proposal_id: usize,
    choice: u32,
    caller: candid::Principal,
) -> Result<String, String> {
    if state.proposal_list[proposal_id].voted.contains(&caller) {
        Err(format!(
            "Principal {} has already for proposal with id {}",
            caller, proposal_id
        ))
    } else if state.proposal_list[proposal_id].is_active == false {
        Err("The selected proposal is not active".to_string())
    } else {
        state.proposal_list[proposal_id].voted.push(caller);
        match choice {
            1u32 => state.proposal_list[proposal_id].approve += 1,
            2u32 => state.proposal_list[proposal_id].reject += 1,
            3u32 => state.proposal_list[proposal_id].pass += 1,
            _ => return Err("The given choice is not valid".to_string()),
        }
        Ok("You have successfully voted.".to_string())
    }
}

//Query functions

#[query]
fn get_current_proposal() -> Proposal {
    STATE.with(|_state| {
        let state = &mut _state.borrow();
        if state.counter == 0 {
            Proposal::default()
        } else {
            state.proposal_list[state.counter as usize - 1].clone()
        }
    })
}

#[query]
fn get_proposal_list() -> Vec<Proposal> {
    STATE.with(|_state| {
        let state = &mut _state.borrow();
        state.proposal_list.clone()
    })
}

#[query]
fn get_proposal(index: u32) -> Proposal {
    STATE.with(|_state| {
        let state = &mut _state.borrow();
        state.proposal_list[index as usize].clone()
    })
}

#[query]
fn get_current_proposal_count() -> u32 {
    STATE.with(|_state| {
        let state = &mut _state.borrow_mut();
        state.counter
    })
}

#[query]
fn get_owner() -> candid::Principal {
    STATE.with(|_state| {
        let state = &mut _state.borrow_mut();
        state.owner
    })
}

#[cfg(test)]
mod test {
    use super::*;
    use ic_cdk::export::Principal;

    #[test]
    fn test_create_proposal() {
        let mut state = State::default();
        let description = Some("Test proposal".to_string());
        let caller = Principal::anonymous();

        impl_create_proposal(&mut state, description, caller);

        assert_eq!(state.counter, 1);
        assert_eq!(state.proposal_list.len(), 1);
        assert_eq!(state.proposal_list[0].description, "Test proposal");
        assert_eq!(state.proposal_list[0].voted, vec![caller]);
    }

    #[test]
    fn test_set_owner() {
        let mut state = State::default();
        let new_owner =
            Principal::from_text("r7zce-vk6wy-7usqv-yamxx-y24ip-65vs6-krkdo-hyaaf-zlzd2-mh5mg-6qe")
                .unwrap();
        impl_set_owner(&mut state, new_owner);
        assert_eq!(state.owner, new_owner);
    }

    #[test]
    fn test_edit_proposal_description() {
        let mut state = State::default();
        let caller =
            Principal::from_text("r7zce-vk6wy-7usqv-yamxx-y24ip-65vs6-krkdo-hyaaf-zlzd2-mh5mg-6qe")
                .unwrap();
        impl_create_proposal(
            &mut state,
            Some("Old Description".to_string()),
            caller.clone(),
        );
        impl_edit_proposal_description(&mut state, "New Description".to_string());
        assert_eq!(
            state.proposal_list[state.counter as usize - 1].description,
            "New Description".to_string()
        );
    }

    #[test]
    fn test_end_proposal() {
        let mut state = State::default();
        let caller =
            Principal::from_text("r7zce-vk6wy-7usqv-yamxx-y24ip-65vs6-krkdo-hyaaf-zlzd2-mh5mg-6qe")
                .unwrap();
        impl_create_proposal(&mut state, Some("Description".to_string()), caller.clone());
        assert!(impl_end_proposal(&mut state, 0, caller).is_ok());
        assert_eq!(
            state.proposal_list[state.counter as usize - 1].is_active,
            false
        );
    }

    #[test]
    fn test_vote() {
        let mut state = State::default();
        let caller =
            Principal::from_text("r7zce-vk6wy-7usqv-yamxx-y24ip-65vs6-krkdo-hyaaf-zlzd2-mh5mg-6qe")
                .unwrap();
        impl_create_proposal(&mut state, Some("Description".to_string()), caller.clone());
        let result = impl_vote(&mut state, 0, 1, caller.clone());
        assert!(result.is_err()); // Should be an error since the caller has already voted
        let new_voter =
            Principal::from_text("kmli3-6veyk-bctsy-pguli-zp7fj-b2zun-wec3v-spnaf-vbjsf-svapk-5qe")
                .unwrap();
        let result = impl_vote(&mut state, 0, 1, new_voter);
        assert!(result.is_ok()); // Should be OK since the new voter hasn't voted yet
        assert_eq!(state.proposal_list[state.counter as usize - 1].approve, 1);
    }
}
