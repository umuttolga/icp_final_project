import React, { useState, useEffect, useRef } from 'react'
import NavBar from './NavBar'
import HeroSection from './HeroSection'
import RoundProfileSection from './RoundProfileSection'
import FourCardsSection from './FourCardsSection'
import { final_project_backend } from '../../../declarations/final_project_backend'
import bgImg2 from "../../assets/bgimg.jpg"
import ProposalListItems from './Utilities/ProposalListItems'
import bgImg from "../../assets/700.jpg"
// import Instructions from './Instructions'



const MainPage = () => {
    const [currentProposal, setCurrentProposal] = useState()
    // const [showProposal, setShowProposal] = useState()
    // const [addProposal, setAddProposal] = useState(false)
    const [proposalList, setProposalList] = useState([])
    const [proposalCount, setProposalCount] = useState(0)


    // ***Backend Calls***
    const getCurrentProposal = async (count) => {
        const getCurrentProposal = await final_project_backend.get_proposal(Number(count))
        setCurrentProposal(getCurrentProposal)
    }

    // Get Show Proposal
    // const getShowProposal = (proposal) => {
    //     setShowProposal(proposal)
    // }
    // const getAddProposal = (proposal) => {
    //     setAddProposal(proposal)
    // }


    // Get Current Proposal Count Function
    useEffect(async () => {
        const proposalCount = await final_project_backend.get_proposal_count()
        setProposalCount(proposalCount)


    }, [])

    // Get Current Proposal Function
    useEffect(() => {
        proposalCount && getCurrentProposal(proposalCount)

    }, [proposalCount]);


    // Get Proposal List Function
    useEffect(() => {
        const fetchProposals = async () => {
            let proposals = [];
            for (let i = 1; i <= proposalCount; i++) {
                const proposal = await final_project_backend.get_proposal(i);
                proposals.push(proposal);
            }
            setProposalList(proposals);
        }

        if (proposalCount > 0) {
            fetchProposals();
        }
    }, [proposalCount]);

    // Styles
    const container = "bg-[#000]  h-full   w-screen"
    const inputSectionStyle = `${currentProposal ? "" : "mt-[10%]"}`
    // const bgImgStyle = "absolute rotate-180 object-fill h- w-full bg-repeat"
    const proposalListStyle = "items-end grid place-items-center grid-flow-row xl:grid-cols-2 gap-y-12 "
    console.log(proposalList)
    return (
        <div className={container}>
            <div style={{ backgroundImage: `url(${bgImg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <NavBar />
                {currentProposal && <HeroSection proposalCount={proposalCount} currentProposal={currentProposal} />}
                <div className={inputSectionStyle}>
                    <RoundProfileSection proposalList={proposalList} currentProposal={currentProposal} proposalCount={proposalCount} />
                </div>
                <div className={proposalListStyle}>

                    {proposalList.slice(0, -1).reverse().map((proposal, index) => (
                        <ProposalListItems proposalListLength={proposalList.length} key={index} proposal={proposal} index={index + 1} />
                    ))}

                </div>
            </div>
        </div >
    )
}

export default MainPage
