import React, { useState, useEffect } from 'react'
import Card from './Card'
import { final_project_backend } from '../../../../declarations/final_project_backend'
import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as vote_idl, canisterId as vote_id } from '../../../../declarations/final_project_backend'
const ProposalCard = ({ proposal }) => {
    const [loading, setLoading] = useState(true)
    const [voting, setVoting] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [count, setCount] = useState()
    const [myCanister, setMyCanister] = useState()

    useEffect(() => {
        if (proposal) {
            setLoading(false);
        }
    }, [proposal])

    // Styles
    const customCard = "p-4 backdrop-blur grid text-[#FFFCFF] items-center h-auto bg-transparent"
    const descStyle = "text-[40px] font-roboto "
    const cardContainer = "grid grid-flow-rows ml-4 text-[20px] gap-y-4 font-roboto text-white"
    const approveStyle = " text-green font-bold relative"
    const passStyle = "text-yellow font-bold relative"
    const rejectStyle = "text-red font-bold relative"

    // Calculate total votes and percentages
    const totalVotes = proposal ? (proposal.approve + proposal.reject + proposal.pass) : 0;
    const approvePercent = proposal ? (proposal.approve / totalVotes * 100) : 0;
    const rejectPercent = proposal ? (proposal.reject / totalVotes * 100) : 0;
    const passPercent = proposal ? (proposal.pass / totalVotes * 100) : 0;

    // Vote bar styles
    const voteBarStyle = { display: 'flex', height: '20px', backgroundColor: 'white' };
    const getBarStyle = (color, percent) => {
        return {
            backgroundColor: color,
            width: `${percent}%`
        };
    };

    // Use the function to generate style objects
    const approveBarStyle = getBarStyle('green', approvePercent);
    const rejectBarStyle = getBarStyle('red', rejectPercent);
    const passBarStyle = getBarStyle('yellow', passPercent);

    useEffect(() => {
        const getProposalCount = async () => {
            const count = await final_project_backend.get_current_proposal_count()
            setCount(count)
        }
        handleLogin()
        getProposalCount()
    }, [])

    const handleVote = async (voteId) => {
        if (!myCanister) {
            console.error("Not logged in");
            return;
        }

        setVoting(true)
        await myCanister.vote(count - 1, voteId)
        setVoting(false)
    }






    const handleLogin = () => {
        const randomPrincipal = Principal.anonymous()
        const agent = new HttpAgent({ Principal: randomPrincipal });
        const vote = Actor.createActor(vote_idl, { agent, canisterId: vote_id });
        setMyCanister(vote)
        // window.location.reload()
    }
    console.log(count)


    return (
        <Card cardStyle={customCard}>
            {loading ? <span>Loading..</span> :
                (<div className={cardContainer}>
                    <span className={descStyle}>{proposal.description}</span>
                    <span >Approve: <span className={approveStyle}>{proposal.approve} <span onClick={() => handleVote(1)} className="text-white cursor-pointer hover:text-green absolute left-[3.5rem]">{voting ? "Voting..." : "Vote"}</span></span></span>
                    <span >Reject: <span className={rejectStyle}>{proposal.reject} <span onClick={() => handleVote(2)} className="text-white cursor-pointer hover:text-red absolute left-[5rem]">{voting ? "Voting..." : "Vote"}</span></span></span>
                    <span>Pass: <span className={passStyle}>{proposal.pass} <span onClick={() => handleVote(3)} className="text-white cursor-pointer hover:text-yellow absolute left-[6rem]">{voting ? "Voting..." : "Vote"}</span></span></span>

                    <div style={voteBarStyle}>
                        <div style={approveBarStyle}></div>
                        <div style={passBarStyle}></div>
                        <div style={rejectBarStyle}></div>
                    </div>
                </div>
                )}
        </Card>
    )
}

export default ProposalCard
