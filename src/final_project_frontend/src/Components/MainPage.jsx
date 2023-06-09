import React, { useState, useEffect, useRef } from 'react'
import NavBar from './NavBar'
import HeroSection from './HeroSection'
import RoundProfileSection from './RoundProfileSection'
import FourCardsSection from './FourCardsSection'
import { final_project_backend } from '../../../declarations/final_project_backend'
import bgImg from "../../assets/bgimg.jpg"
import Instructions from './Instructions'



const DUMMY_PROFILES = [{
    pp: "Img1",
    text: "Text1"
},
{
    pp: "Img2",
    text: "Text2"
}, {
    pp: "Img3",
    text: "Text3"
}]
const MainPage = () => {
    const [currentProposal, setCurrentProposal] = useState()
    const [showProposal, setShowProposal] = useState()
    const [addProposal, setAddProposal] = useState(false)
    const [proposalList, setProposalList] = useState([])

    // Backend Calls

    const getCurrentProposal = async () => {
        const getCurrentProposal = await final_project_backend.get_current_proposal()
        setCurrentProposal(getCurrentProposal)
    }

    // Get Show Proposal
    const getShowProposal = (proposal) => {
        setShowProposal(proposal)
    }
    const getAddProposal = (proposal) => {
        setAddProposal(proposal)
    }

    useEffect(() => {
        getCurrentProposal()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowProposal(true);
        }, 4000); // 5000 milliseconds = 5 seconds

        // cleanup function
        return () => clearTimeout(timer);
    }, [addProposal]);

    // useEffect(() => {
    //     getProposals()
    // }, [])
    const container = "bg-transparent  h-full   w-screen"
    const navBarText = "text-white"
    const divider = "border-b-4 mx-2 border-[#ffff]  blur-[1px]"
    return (
        <div className={container}>
            <div className="h-full absolute -z-50 w-screen bg-black"></div>
            <NavBar getShowProposal={getShowProposal} />
            {showProposal ? <div className="mx-[12%]">
                <HeroSection currentProposal={currentProposal} />
                <div className={divider}></div>
                <div className="">
                    <RoundProfileSection showProposal={setShowProposal} addProposal={getAddProposal} />

                </div>
                {/* <div className={divider}></div> */}
                <div className="gird place-items-center">

                    <FourCardsSection />
                </div>
            </div> : (
                <div className="grid place-items-center mt-20">
                    <Instructions />
                </div>
            )}
            <div className="bg-black">
                <img className="absolute top-[80%] object-contain  -z-40" src={bgImg} alt="bg img" />
            </div>
        </div>
    )
}

export default MainPage
