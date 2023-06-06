import React from 'react'
import { final_project_backend } from '../../../declarations/final_project_backend'
import { useState, useEffect } from "react"
const FourCardsSection = ({ proposalList }) => {
    const [proposals, setProposals] = useState()
    // Styles 
    const customCard = "h-[40vw] flew-w bg-white border-2 border-white rounded-xl w-[40vw] md:w-[30rem] md:h-[30rem]"
    const rowStyle = "grid grid-flow-col gap-[10vw]"


    // const getProposals = async () => {
    //     const getCurrentProposals = await final_project_backend.get_current_proposal_list()
    //     setProposals(getCurrentProposals)
    // }

    // useEffect(() => {
    //     getProposals()
    // }, [])

    return (
        <div className="mt-4 md:mt-10 p-4">
            <div className="grid gap-y-[10vw] place-items-center">
                <div className={rowStyle}>
                    Proposal List
                </div>
            </div>
        </div>
    )
}

export default FourCardsSection
