import React, { useState, useEffect } from 'react'
import NavBar from './NavBar'
import HeroSection from './HeroSection'
import RoundProfileSection from './RoundProfileSection'
import FourCardsSection from './FourCardsSection'
import { final_project_backend } from '../../../declarations/final_project_backend'
import bgImg from "../../assets/bgimg.jpg"



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
    const [proposalList, setProposalList] = useState([])

    // Backend Calls

    const getCurrentProposal = async () => {
        const getCurrentProposal = await final_project_backend.get_current_proposal()
        setCurrentProposal(getCurrentProposal)
    }


    useEffect(() => {
        getCurrentProposal()
    }, [])
    // useEffect(() => {
    //     getProposals()
    // }, [])
    const container = "bg-transparent  h-full   w-screen"
    const navBarText = "text-white"
    const divider = "border-b-2 mx-2"
    return (
        <div className={container}>
            <div className="h-full absolute -z-50 w-screen bg-black"></div>
            <NavBar />
            <HeroSection currentProposal={currentProposal} />
            <div className={divider}></div>
            <div className="">
                <RoundProfileSection />

            </div>
            {/* <div className={divider}></div> */}
            <div className="bg-black">
                <img className="absolute top-[80%] object-contain  -z-40" src={bgImg} alt="bg img" />
            </div>
            <FourCardsSection />
        </div>
    )
}

export default MainPage
