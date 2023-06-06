import React, { useState, useEffect } from 'react'
import Card from './Card'
import { final_project_backend } from '../../../../declarations/final_project_backend'
const ProposalCard = ({ proposal }) => {
    const [loading, setLoading] = useState(true)

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
    const voteBarStyle = "flex h-[20px] bg-white";
    const getBarStyle = (color, percent) => `bg-${color} w-[${percent}%]`;
    const approveBarStyle = getBarStyle('green', approvePercent);
    const rejectBarStyle = getBarStyle('red', rejectPercent);
    const passBarStyle = getBarStyle('yellow', passPercent);

    console.log(proposal)
    const handleVote = () => {
        const vote = final_project_backend.vote(5, 2)
    }
    return (
        <Card cardStyle={customCard}>
            {loading ? <span>Loading..</span> :
                (<div className={cardContainer}>
                    <span className={descStyle}>{proposal.description}</span>
                    <span >Approve: <span className={approveStyle}>{proposal.approve} <span onClick={handleVote()} className="text-white cursor-pointer hover:text-green absolute left-[3.5rem]">Vote</span></span></span>
                    <span >Reject: <span className={rejectStyle}>{proposal.reject} <span className="text-white cursor-pointer hover:text-red absolute left-[5rem]">Vote</span></span></span>
                    <span>Pass: <span className={passStyle}>{proposal.pass} <span className="text-white cursor-pointer hover:text-yellow absolute left-[6rem]">Vote</span></span></span>

                    <div className={voteBarStyle}>
                        <div className={approveBarStyle}></div>
                        <div className={passBarStyle}></div>
                        <div className={rejectBarStyle}></div>
                    </div>
                </div>
                )}

        </Card>
    )
}

export default ProposalCard
