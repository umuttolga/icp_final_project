import React, { useState, useEffect } from 'react'
import Card from './Card'
import { final_project_backend } from '../../../../declarations/final_project_backend'

const ProposalListItems = ({ proposal, index }) => {
    const [loading, setLoading] = useState(true)
    const [voting, setVoting] = useState(false)
    // const proposal = proposalTotal.proposal
    useEffect(() => {
        if (proposal) {
            setLoading(false);
        }
    }, [proposal])
    // Styles
    const customCard =
        "p-4 backdrop-blur grid text-[#FFFCFF] items-center h-auto bg-transparent";
    const descStyle = "text-[40px] font-roboto ";
    const cardContainer =
        "grid ml-4 text-[20px] gap-y-4 font-roboto text-white";
    const approveStyle = " text-[#8cb369] font-bold relative";
    const passStyle = "text-[#ffbd00] font-bold relative";
    const rejectStyle = "text-[#ff0054] font-bold relative";


    // Calculate total votes and percentages
    const totalVotes = proposal
        ? proposal.approve + proposal.reject + proposal.pass
        : 0;
    const approvePercent = proposal ? (proposal.approve / totalVotes) * 100 : 0;
    const rejectPercent = proposal ? (proposal.reject / totalVotes) * 100 : 0;
    const passPercent = proposal ? (proposal.pass / totalVotes) * 100 : 0;

    // Vote bar styles
    const voteBarStyle = {
        display: "flex",
        height: "20px",
        backgroundColor: "white",
    };
    const getBarStyle = (color, percent) => {
        return {
            backgroundColor: color,
            width: `${percent}%`,
        };
    };
    const approveBarStyle = getBarStyle("#8cb369", Math.ceil(approvePercent));
    const rejectBarStyle = getBarStyle("#ff0054", Math.ceil(rejectPercent));
    const passBarStyle = getBarStyle("#ffbd00", Math.ceil(passPercent));



    const handleVote = async (vote) => {
        setVoting(true)
        const sendVote = await final_project_backend.vote(index, vote)
        console.error(sendVote)
        window.location.reload()
        setVoting(false)
    }
    return (
        <div>
            <Card cardStyle={customCard}>
                {loading ? <span>Loading..</span> :
                    (<div className={cardContainer}>
                        <span className={descStyle}>{proposal.description}</span>
                        <span>
                            Approve:{" "}
                            <span className={approveStyle}>
                                {proposal.approve}{" "}
                                <span
                                    onClick={async () => await handleVote(1)}
                                    className="text-white cursor-pointer hover:text-[#8cb369] absolute left-[3.5rem]"
                                >
                                    {voting ? "Voting..." : "Vote"}
                                </span>
                            </span>
                        </span>
                        <span>
                            Reject:{" "}
                            <span className={rejectStyle}>
                                {proposal.reject}{" "}
                                <span
                                    onClick={async () => await handleVote(2)}
                                    className="text-white cursor-pointer hover:text-[#ff0054] absolute left-[5rem]"
                                >
                                    {voting ? "Voting..." : "Vote"}
                                </span>
                            </span>
                        </span>
                        <span>
                            Pass:{" "}
                            <span className={passStyle}>
                                {proposal.pass}{" "}
                                <span
                                    onClick={async () => await handleVote(3)}
                                    className="text-white cursor-pointer hover:text-[#ffbd00] absolute left-[6rem]"
                                >
                                    {voting ? "Voting..." : "Vote"}
                                </span>
                            </span>
                        </span>

                        <div style={voteBarStyle}>
                            <div style={approveBarStyle}></div>
                            <div style={passBarStyle}></div>
                            <div style={rejectBarStyle}></div>
                        </div>
                    </div>
                    )}

            </Card>
        </div>
    )
}

export default ProposalListItems
