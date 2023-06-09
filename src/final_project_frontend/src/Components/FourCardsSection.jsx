import React from 'react'
import { final_project_backend } from '../../../declarations/final_project_backend'
import { useState, useEffect } from "react"
import ProposalListItems from './Utilities/ProposalListItems'
const DUMMY_PROPOSAL_LIST = [
    {
        description: "Proposal - 1",
        approve: 5,
        reject: 3,
        pass: 7,

    },
    {
        description: "Proposal - 2",
        approve: 5,
        reject: 2,
        pass: 1,

    },
    {
        description: "Proposal - 3",
        approve: 6,
        reject: 2,
        pass: 6,

    }, {
        description: "Proposal - 4",
        approve: 9,
        reject: 0,
        pass: 1,

    },
    {
        description: "Proposal - 5",
        approve: 5,
        reject: 3,
        pass: 7,

    }
]
const FourCardsSection = ({ proposalList }) => {
    const [proposals, setProposals] = useState()
    // Styles 
    const customCard = "h-[40vw] flew-w bg-white border-2 border-white rounded-xl w-[40vw] md:w-[30rem] md:h-[30rem]"
    const rowStyle = "grid grid-flow-col gap-[10vw]"


    const getProposals = async () => {
        const getCurrentProposals = await final_project_backend.get_proposal_list()
        setProposals(getCurrentProposals)
    }

    useEffect(() => {
        getProposals()
    }, [])
    return (
        <div className="mt-4 p-4 grid md:grid-cols-3 grid-cols-2  gap-5">
            {proposals?.reverse().map((item, index) => (
                <div key={index} className="">
                    <ProposalListItems index={proposals.length - 1 - index} proposal={item} />
                </div>
            ))}
        </div>
    )
}

export default FourCardsSection
